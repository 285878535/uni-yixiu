<template>
  <div class="document">
    <div class="document-header">
      <div class="header-title">
        <van-icon name="arrow-left" size="28" />
        <div class="title">文档详情</div>
        <van-icon name="arrow" size="28" />
      </div>
      <div class="header-handle">
        <div class="handle-item" @click="onHandleClick('label')">
          <van-icon name="label-o" size="24" />
          <p>书签</p>
        </div>
        <div class="handle-item" @click="onHandleClick('orders')">
          <van-icon name="orders-o" size="24" />
          <p>目录</p>
        </div>
        <div class="handle-item" @click="onHandleClick('search')">
          <van-icon name="search" size="24" />
          <p>搜本书</p>
        </div>
      </div>
    </div>
    <div class="document-content">
      <TextSelectionMenu
        @menu-click="onMenuClick"
        :menu-items="[{ label: '收藏', icon: '', action: 'collection' }]"
      >
        <div v-html="content"></div>
      </TextSelectionMenu>
    </div>
    <van-dialog
      @close="closeLabelDialog"
      v-model:show="showLabelAdd"
      :showConfirmButton="false"
      close-on-click-overlay
    >
      <div class="bookmark-dialog">
        <div class="bookmark-title">书签命名</div>
        <input type="text" v-model="form.label" class="bookmark-input" />
        <van-button
          @click="onConfirmAddLabel"
          class="bookmark-btn"
          type="primary"
          >添加</van-button
        >
      </div>
    </van-dialog>
  </div>
</template>

<script setup>
import { getDocumentContent } from "@/api/chat"
import { addCollection } from "@/api/collection"
import PopupService from "@/utils/PopupService"
import RequestLoading from "@/utils/RequestLoading"
const props = defineProps({
  id: {
    type: String,
    default: "",
  },
})
const content = ref("")
const showLabelAdd = ref(false)
const form = ref({
  label: "",
})
const onMenuClick = (action) => {
  console.log("选中菜单操作：", action)
}
const onConfirmAddLabel = async () => {
  if (form.value.label) {
    RequestLoading(addCollection, {
      targetId: props.id,
      name: form.value.label,
    })
      .then((res) => {
        showSuccessToast("添加成功")
        showLabelAdd.value = false
      })
      .catch((err) => {
        showFailToast(err.message)
      })
  } else {
    return showFailToast("请输入书签名称")
  }
}
const closeLabelDialog = () => {
  form.value.label = ""
}
const onLoad = async () => {
  showLoadingToast({
    message: "加载中...",
    forbidClick: true,
  })
  try {
    const res = await getDocumentContent({
      sourceId: 9084,
      id: props.id,
    })
    content.value = res.data.data
  } catch (error) {
    showFailToast(error.message)
  } finally {
    closeToast()
  }
}
const onHandleClick = (type) => {
  if (type !== "label") {
    PopupService.open({
      component: type == "orders" ? "Directory" : "SearchContent",
    })
  } else {
    showLabelAdd.value = true
  }
}
onMounted(() => {
  onLoad()
})

defineOptions({
  name: "DocumentContent",
})
</script>

<style scoped lang="scss">
.document {
  padding: 20px 0px;
  overflow-y: hidden;
  // height: 100%;
}

.document-header {
  .header-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .header-handle {
    border-radius: 20px;
    background: #eaeaea;
    height: 40px;
    width: 84%;
    margin: 26px auto 30px auto;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    .handle-item {
      display: flex;
      align-items: center;
      gap: 4px;
      position: relative;
      // padding: 10px;
    }
    // .handle-item::after {
    //   content: "";
    //   position: absolute;
    //   top: 0;
    //   left: 0;
    //   width: 100%;
    //   height: 100%;
    //   background: rgba(0, 0, 0, 0.1);
    //   opacity: 0;
    //   transition: opacity 0.2s ease;
    //   pointer-events: none;
    // }

    // .handle-item:active::after {
    //   opacity: 1;
    // }
  }
}

.document-content {
  height: calc(100% - 94px);
  overflow-y: auto;
  padding-bottom: 20px;

  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px; // 滚动条宽度
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; // 滚动条轨道背景色
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #c1c1c1; // 滚动条滑块颜色
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #a8a8a8; // 鼠标悬停时的滑块颜色
  }
}
</style>
