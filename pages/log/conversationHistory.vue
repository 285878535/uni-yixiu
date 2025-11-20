<template>
  <view class="dialog-history-container">
    <view class="historyTitle">
      <view class="imgfan" @click="handleGoBack">
        <text class="back-text">‹</text>
      </view>
      <text class="title">对话历史</text>
    </view>

    <scroll-view class="dialog-list" scroll-y>
      <view 
        v-for="(item, index) in dialogItems" 
        :key="index" 
        class="dialog-item"
      >
        <view class="radio-label"></view>
        <view class="dialog-content">
          {{ item.content }}
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { navigateBack } from '@/utils/router'
import RequestLoading from "@/utils/RequestLoading"
import { getRelatedLog } from "@/api/log"
import { useUserStore } from "@/store/modules/user"

const userStore = useUserStore()

// 定义对话历史数据
const dialogItems = ref([])

// 定义返回处理函数
const handleGoBack = () => {
  navigateBack()
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const data = currentPage.options?.data
  let parsedData = null
  if (data) {
    parsedData = JSON.parse(data)
    console.log("接收的数据:", parsedData)
  }
  onLoad(parsedData)
})

const onLoad = async (parsedData) => {
  try {
    const response = await RequestLoading(getRelatedLog, {
      logId: parsedData,
      userId: userStore.userInfo?.userId,
    })
    console.log("完整响应数据：", response)
    dialogItems.value = response.data || []
    if (dialogItems.value.length === 0) {
      uni.showToast({
        title: "暂无数据",
        icon: "none"
      })
    }
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
.dialog-history-container {
  width: 100%;
  padding: 10px;
}

.historyTitle {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  
  .imgfan {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .back-text {
      font-size: 30px;
      color: #333;
    }
  }
  
  .title {
    flex: 1;
    text-align: center;
    font-weight: 700;
    font-size: 18px;
  }
}

.dialog-list {
  max-height: calc(100vh - 100px);
}

.dialog-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}

.radio-label {
  display: inline-block;
  width: 35px;
  height: 35px;
  border: 1px solid #999;
  border-radius: 50%;
  margin-right: 10px;
  margin-top: 5px;
  flex-shrink: 0;
}

.dialog-content {
  flex: 1;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 6px;
}
</style>
