<template>
  <view class="tree-node-wrapper">
    <view
      class="tree-node-title"
      :class="{
        'level-1': level === 0,
        'level-2': level === 1,
        'level-deep': level > 1,
      }"
      :style="{
        paddingLeft: getPaddingLeft(),
      }"
    >
      <text
        class="node-text"
        @click="onTextClick"
      >{{ node.plainText }}</text>

      <text
        v-if="hasChildren"
        class="arrow-right"
        @click.stop.prevent="onArrowClick"
      >
        {{ isExpanded ? '▲' : '▼' }}
      </text>
    </div>

    <!-- 只在展开时渲染子节点（v-if） -->
    <view v-if="isExpanded" class="tree-node-children">
      <TreeNode
        v-for="child in node.children"
        :key="child.id ?? child.index"
        :node="child"
        :level="level + 1"
        @node-click="$emit('node-click', $event)"
      />
    </view>
  </view>
</template>

<script setup>
import { computed, inject } from "vue"
// 移除 vant 依赖

const props = defineProps({
  node: { type: Object, required: true },
  level: { type: Number, default: 0 },
})
const emit = defineEmits(["node-click"])

const expandedSet = inject("expandedSet") // reactive Set
const toggleExpanded = inject("toggleExpanded") // function

const hasChildren = computed(
  () => Array.isArray(props.node.children) && props.node.children.length > 0
)
const isExpanded = computed(() =>
  expandedSet && props.node.id ? expandedSet.has(props.node.id) : false
)

// 计算缩进
function getPaddingLeft() {
  // 一级节点和二级节点不缩进（level=0和level=1），二级以下节点（level>1）根据层级缩进
  if (props.level <= 1) {
    return "8px"
  }
  return `${(props.level - 1) * 16 + 8}px`
}

function onTextClick() {
  emit("node-click", props.node)
}
function onArrowClick() {
  if (!props.node.id) return
  toggleExpanded(props.node.id)
}
</script>

<style scoped lang="scss">
.tree-node-wrapper {
  --tree-node-height: 50px;
  width: 100%;
  border-top: 1px solid #000;
  font-size: 16px;

  .tree-node-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: var(--tree-node-height);
    line-height: var(--tree-node-height);
    cursor: pointer;
    user-select: none;
    border-bottom: 1px solid #0001;
    background-color: #f3f3f3;
    box-sizing: border-box;

    // 一级节点样式（加粗不缩进）
    &.level-1 {
      .node-text {
        font-weight: bold;
        font-size: 18px;
      }
    }

    // 二级节点样式（不加粗不缩进）
    &.level-2 {
      .node-text {
        font-weight: normal;
      }
    }

    // 二级以下节点样式（不加粗只缩进）
    &.level-deep {
      .node-text {
        font-weight: normal;
      }
    }
  }

  .node-text {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .arrow-right {
    font-size: 16px;
    width: 50px;
    height: calc(var(--tree-node-height) - 2px);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: #fff;
  }

  .tree-node-children {
    width: 100%;
  }
}
</style>
