<template>
  <view class="tabbar-page">
    <CustomSearch v-model="search" @search="onLoad" />
    <scroll-view 
      class="collection-container" 
      scroll-y
      refresher-enabled
      :refresher-triggered="isLoading"
      @refresherrefresh="onLoad"
    >
      <view 
        class="collection-item" 
        v-for="item in collections" 
        :key="item.id" 
        @click="goToDetail(item)"
      >
        <view class="left-section">
          <view class="item-title">{{ item.name }}</view>
          <view class="item-summary">{{ item.summary }}</view>
          <view class="item-footer">
            <text class="source">{{ '来源名称&nbsp;' + item.sourceName }}</text>
            <text class="time">{{ formatDate(item.createdTime) }}</text>
          </view>
        </view>
        <view class="right-section" v-if="getImage(item.imageInfo)">
          <image :src="getImage(item.imageInfo)" mode="aspectFill" />
        </view>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { getNow } from "@/utils/index"
import { getCollectionListApi } from "@/api/collection"
import RequestLoading from "@/utils/RequestLoading"
import { onMounted, ref } from "vue"
import { navigateTo } from '@/utils/router'

const collections = ref([])
const search = ref("")
const sourceType = ["手册", "电路图", "其他"]
const isLoading = ref(false)

const onLoad = async () => {
  isLoading.value = true
  try {
    const { data } = await RequestLoading(getCollectionListApi, {
      name: search.value,
    })
    collections.value = data || []
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// 跳转到详情页
const goToDetail = (item) => {
  if (item.targetId) {
    navigateTo('collectionDetail', {
      targetId: item.targetId,
    })
  }
}

// 提取图片链接
const getImage = (info) => {
  if (!info) return null
  const regex = /<img[^>]+src=['"]([^'"]+)['"]+/i
  const match = info.match(regex)
  return match ? match[1] : null
}

// 格式化日期
const formatDate = (timeStr) => {
  if (!timeStr) return ''
  const datePart = timeStr.split(' ')[0]
  if (!datePart) return ''
  const [y, m, d] = datePart.split('-')
  return `${y}年${m}月${d}日`
}

onMounted(() => {
  onLoad()
})
</script>

<style lang="scss" scoped>
.collection-container {
  padding-bottom: 20px;
  height: calc(100vh - 100px);
  
  .collection-item {
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    margin-top: 15px;
    padding: 15px;
    display: flex;
    justify-content: space-between;

    .left-section {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;

      .item-title {
        font-size: 16px;
        font-weight: 700;
        color: #333;
        margin-bottom: 8px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .item-summary {
        font-size: 13px;
        color: #666;
        line-height: 1.5;
        margin-bottom: 8px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: break-all;
      }

      .item-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12px;
        color: #999;
        
        .source {
          flex-shrink: 0;
        }
        
        .time {
          margin-left: auto;
          text-align: right;
        }
      }
    }

    .right-section {
      width: 110px;
      height: 80px;
      margin-left: 10px;
      flex-shrink: 0;
      
      image {
        width: 100%;
        height: 100%;
        border-radius: 6px;
      }
    }
  }
}
</style>
