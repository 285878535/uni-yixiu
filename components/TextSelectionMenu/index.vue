<template>
  <!-- 包裹用户内容的容器 -->
  <div ref="containerRef" class="text-selection-container">
    <slot></slot>
  </div>

  <!-- 菜单渲染到body -->
  <teleport to="body">
    <div
      v-if="visible"
      ref="menuRef"
      class="text-selection-menu"
      :style="menuStyle"
      @click.stop
    >
      <div class="menu-content">
        <div
          v-for="(item, index) in finalMenuItems"
          :key="index"
          class="menu-item"
          @click="handleMenuClick(item)"
        >
          <span v-if="item.icon" class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
        </div>
      </div>
      <div class="menu-arrow"></div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"

const props = defineProps({
  // 菜单项配置（额外的菜单项，复制功能始终存在）
  menuItems: {
    type: Array,
    default: () => [],
  },
  // 是否启用
  disabled: {
    type: Boolean,
    default: false,
  },
  // 最小选中字符数才显示菜单
  minLength: {
    type: Number,
    default: 1,
  },
  // 菜单偏移量
  offset: {
    type: Object,
    default: () => ({ x: 0, y: -10 }),
  },
})

const emit = defineEmits(["select", "menu-click"])

const visible = ref(false)
const menuRef = ref(null)
const containerRef = ref(null)
const selectedText = ref("")
const menuPosition = ref({ x: 0, y: 0 })

// 确保复制功能始终存在（将传入的菜单项与复制功能合并）
const finalMenuItems = computed(() => {
  const copyItem = { label: "复制", icon: "", action: "copy" }
  // 检查传入的菜单项中是否已经有复制功能
  const hasCopy = props.menuItems.some((item) => item.action === "copy")
  // 如果没有复制功能，则添加到开头
  return hasCopy ? props.menuItems : [copyItem, ...props.menuItems]
})

const menuStyle = computed(() => ({
  left: `${menuPosition.value.x + props.offset.x}px`,
  top: `${menuPosition.value.y + props.offset.y}px`,
}))

// 检查选中的文字是否在容器内
const isSelectionInContainer = (selection) => {
  if (!containerRef.value || !selection.rangeCount) return false

  const range = selection.getRangeAt(0)
  const container = containerRef.value

  // 检查选区的起始和结束节点是否在容器内
  return (
    container.contains(range.startContainer) &&
    container.contains(range.endContainer)
  )
}

// 处理文字选中（仅在容器内有效，选中动作结束后才显示）
const handleTextSelection = () => {
  if (props.disabled) return

  // 使用 setTimeout 确保选中操作完全结束
  setTimeout(() => {
    const selection = window.getSelection()
    const text = selection.toString().trim()

    // 检查是否在容器内选中
    if (!isSelectionInContainer(selection)) {
      hideMenu()
      return
    }

    if (text.length >= props.minLength) {
      selectedText.value = text
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // 计算菜单位置（选中文字上方居中）
      menuPosition.value = {
        x: rect.left + rect.width / 2,
        y: rect.top + window.scrollY,
      }

      visible.value = true
      emit("select", { text, range, rect })
    } else {
      hideMenu()
    }
  }, 10) // 延迟10ms确保选中动作完全结束
}

// 隐藏菜单
const hideMenu = () => {
  visible.value = false
  selectedText.value = ""
}

// 处理菜单项点击
const handleMenuClick = async (item) => {
  // 根据不同动作执行默认行为
  let success = false
  switch (item.action) {
    case "copy":
      success = await copyToClipboard(selectedText.value)
      break
    case "search":
      searchText(selectedText.value)
      success = true
      break
    default:
      // 自定义动作由父组件处理
      success = true
      break
  }

  // 触发事件，传递操作结果
  emit("menu-click", {
    action: item.action,
    text: selectedText.value,
    item,
    success,
  })

  hideMenu()
}

// 复制到剪贴板（增强版，返回成功状态）
const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // 降级方案
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      textarea.style.top = "0"
      textarea.style.left = "0"
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const success = document.execCommand("copy")
      document.body.removeChild(textarea)
      return success
    }
  } catch (err) {
    console.error("复制失败:", err)
    return false
  }
}

// 搜索文字（可以替换为实际的搜索逻辑）
const searchText = (text) => {
  console.log("搜索:", text)
  // 可以在这里跳转到搜索页面或打开搜索弹窗
}

// 点击其他地方隐藏菜单
const handleClickOutside = (e) => {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    hideMenu()
  }
}

// 禁用浏览器默认右键菜单和长按菜单（仅在容器内）
const handleContextMenu = (e) => {
  if (!containerRef.value) return

  // 只在容器内禁用右键菜单
  if (containerRef.value.contains(e.target)) {
    const selection = window.getSelection()
    if (selection.toString().trim()) {
      e.preventDefault()
    }
  }
}

onMounted(() => {
  // 将事件监听挂在容器上，减小监听范围，提升性能
  if (containerRef.value) {
    // 监听鼠标抬起和触摸结束（选中动作结束时触发）
    containerRef.value.addEventListener("mouseup", handleTextSelection)
    containerRef.value.addEventListener("touchend", handleTextSelection)
    // 禁用浏览器默认右键菜单（仅在容器内）
    containerRef.value.addEventListener("contextmenu", handleContextMenu)
  }
  // 点击其他地方隐藏菜单（仍需要全局监听）
  document.addEventListener("click", handleClickOutside)
})

onBeforeUnmount(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener("mouseup", handleTextSelection)
    containerRef.value.removeEventListener("touchend", handleTextSelection)
    containerRef.value.removeEventListener("contextmenu", handleContextMenu)
  }
  document.removeEventListener("click", handleClickOutside)
})

// 暴露方法给父组件
defineExpose({
  hideMenu,
  selectedText: () => selectedText.value,
})
</script>

<style lang="scss" scoped>
// 容器样式（不影响布局）
.text-selection-container {
  display: contents; // 使容器透明，不影响布局

  // 确保所有嵌套元素都可以选中文字
  :deep(*) {
    user-select: text !important;
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
  }
}

.text-selection-menu {
  position: absolute;
  z-index: 9999;
  transform: translate(-50%, -100%);
  animation: fadeInUp 0.2s ease-out;

  .menu-content {
    display: flex;
    align-items: center;
    gap: 2px;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    padding: 0px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 12px;
    color: #fff;
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    user-select: none;

    &:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    &:active {
      transform: scale(0.95);
    }

    .menu-icon {
      font-size: 16px;
    }

    .menu-label {
      font-weight: 500;
    }
  }

  .menu-arrow {
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(0, 0, 0, 0.85);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translate(-50%, calc(-100% + 10px));
  }
  to {
    opacity: 1;
    transform: translate(-50%, -100%);
  }
}

// 浅色主题
.text-selection-menu.light {
  .menu-content {
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .menu-item {
    color: #333;

    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
  }

  .menu-arrow {
    border-top-color: rgba(255, 255, 255, 0.95);
  }
}
</style>
