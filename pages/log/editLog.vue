<template>
  <view class="edit-log-page">
    <view class="header">
      <text class="back-icon" @click="handleGoBack">‹</text>
      <text class="header-title">编辑日志</text>
    </view>
    <input 
      v-model="form.title" 
      placeholder="请输入日志标题" 
      class="title-input"
    />
    <Toolbar
      v-model:htmlValue="form.richText"
      @publish="handleRichTextSubmit"
    />
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue"
import { navigateBack, navigateTo } from '@/utils/router'
import RequestLoading from "@/utils/RequestLoading"
import { getUpdateChatLog, getLog } from "@/api/log"
import { useUserStore } from "@/store/modules/user"
import Toolbar from "@/components/Toolbar/index.vue"

const userStore = useUserStore()

const form = ref({
  title: "",
  richText: "",
  images: [],
  syncToCircle: false,
})

const handleGoBack = () => {
  navigateBack()
}

const handleRichTextSubmit = async (content) => {
  try {
    const pages = getCurrentPages()
    const currentPage = pages[pages.length - 1]
    const parsedData = currentPage.options?.data ? JSON.parse(currentPage.options.data) : null
    
    const response = await RequestLoading(getUpdateChatLog, {
      id: parsedData,
      userId: userStore.userInfo?.userId || userStore.user?.userId,
      title: form.value.title,
      summaryContent: content.html || content || form.value.richText,
      images: Array.isArray(content.images) ? content.images.join(",") : "",
    })
    if (response.code === 200 || response.success) {
      if (parsedData) {
        uni.showToast({
          title: '保存成功',
          icon: 'success'
        })
        setTimeout(() => {
          handleGoBack()
        }, 1000)
      }
    }
  } catch (error) {
    console.error("接口请求失败：", error)
    uni.showToast({
      title: '保存失败',
      icon: 'none'
    })
  }
}

let parsedData = null
onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const data = currentPage.options?.data
  if (data) {
    parsedData = JSON.parse(data)
    console.log("接收的数据:", parsedData)
  }
  onLoad()
})

const onLoad = async () => {
  try {
    const response = await getLog(parsedData)
    console.log("完整响应数据：", response)
    await nextTick()
    form.value.richText = response.data.summaryContent
    form.value.title = response.data.title
    const imgs =
      typeof response.data.images === "string"
        ? response.data.images
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []
    form.value.images = imgs
    console.log("赋值后的数据：", form.value.richText)
  } catch (error) {
    console.error("接口请求失败：", error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}
</script>

<style scoped>
.edit-log-page {
  padding: 10px;
  
  .header {
    display: flex;
    align-items: center;
    padding: 10px;
    margin-bottom: 10px;
    
    .back-icon {
      font-size: 30px;
      color: #333;
      margin-right: 10px;
    }
    
    .header-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .title-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
    font-size: 16px;
  }
}
</style>
