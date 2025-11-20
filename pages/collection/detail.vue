<template>
  <view class="collection-detail-page">
    <view class="detail-header">
      <text class="back-icon" @click="handleGoBack">‹</text>
      <text class="header-title">一修师傅</text>
      <text></text>
    </view>
    <view class="detail-container" v-if="detailData">
      <view class="detail-title" v-if="detailData.title">{{ detailData.title }}</view>
      <rich-text 
        class="detail-content" 
        :nodes="formatContent(detailData.content)"
      ></rich-text>
    </view>
    <view v-else class="loading-container">
      <text>加载中...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { navigateBack } from '@/utils/router'
import { getCollectionDetailApi } from "@/api/collection"
import RequestLoading from "@/utils/RequestLoading"

const detailData = ref(null)

const handleGoBack = () => {
  navigateBack()
}

// 格式化内容，将换行符转换为HTML
const formatContent = (content) => {
  if (!content) return ''
  // 将 \r\n 和 \n 转换为 <br>
  return content
    .replace(/\r\n/g, '<br>')
    .replace(/\n/g, '<br>')
    .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
}

const onLoad = async () => {
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const targetId = currentPage.options?.targetId
  
  if (!targetId) {
    console.error('缺少 targetId 参数')
    uni.showToast({
      title: '缺少必要参数',
      icon: 'none'
    })
    return
  }
  
  try {
    const { data } = await RequestLoading(getCollectionDetailApi, {
      targetId: targetId,
    })
    detailData.value = data || null
    if (detailData.value) {
      detailData.value.title = detailData.value.title || "这是标题测试事实上"
    }
  } catch (error) {
    console.error("接口请求失败：", error)
    uni.showToast({
      title: '加载失败',
      icon: 'none'
    })
  }
}

onMounted(() => {
  onLoad()
})
</script>

<style lang="scss" scoped>
.collection-detail-page {
  min-height: 100vh;
  background: #f5f5f5;
  padding: 10px;
  
  .detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    margin-bottom: 10px;
    
    .back-icon {
      font-size: 30px;
      color: #333;
    }
    
    .header-title {
      font-size: 18px;
      font-weight: 600;
    }
  }
  
  .detail-container {
    background: #fff;
    border-radius: 10px;
    padding: 20px;
    margin-top: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    
    .detail-title {
      font-size: 20px;
      font-weight: 700;
      color: #333;
      margin-bottom: 15px;
      line-height: 1.5;
    }
    
    .detail-content {
      font-size: 15px;
      color: #666;
      line-height: 1.8;
      word-break: break-all;
    }
  }
  
  .loading-container {
    text-align: center;
    padding: 50px;
    color: #999;
  }
}
</style>
