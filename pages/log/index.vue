<template>
  <view class="tabbar-page">
    <CustomSearch v-model="search" @search="searchClick(search)" />
    <view
      class="log-container"
      v-for="(log, index) in logList"
      :key="log.id || index"
    >
      <view class="log-header">
        <text class="log-title">修车日志</text>
        <text class="log-date">{{ formatDate(log.createTime) }}</text>
        <button class="menu-btn" @click.stop="toggleMenu($event, index)">
          <text class="menu-icon">⋯</text>
        </button>
      </view>
      <view class="log-text">
        <text>{{ log.title || "" }}</text>
        <rich-text :nodes="log.summaryContent"></rich-text>
        <button class="expand-btn" @click="toggleExpand(log)">
          {{ log.isExpanded ? "收起" : "展开" }}
        </button>
      </view>

      <view class="image-placeholders" v-if="log.images && log.images !== ''">
        <view
          class="placeholder"
          v-for="img in log.images.split(',').filter((item) => item)"
          :key="img"
        >
          <image :src="`${baseUrl}/${img}`" mode="aspectFill" />
        </view>
      </view>

      <!-- 操作菜单弹窗 -->
      <view
        v-if="menuStates[index]?.isShow"
        class="operation-menu"
        :class="`operation-menu-${index}`"
        :style="{
          top: menuStates[index].position.top,
          left: menuStates[index].position.left,
        }"
        @click.stop
      >
        <view class="menu-item" @click="viewRelated(log.id, index)">
          查看关联对话
        </view>
        <view class="menu-item" @click="editLog(log.id, index)">编辑</view>
        <view class="menu-item" @click="shareLog(log.id, index)">
          分享[预留功能]
        </view>
        <view class="menu-item" @click="inteRview(log.id, index)">
          提审[预留功能]
        </view>
      </view>
    </view>

    <!-- 可选：当没有日志时显示空提示 -->
    <view class="empty-tip" v-if="logList.length === 0">暂无修车日志</view>

    <view v-if="showCarCount" class="car-count-popup" @click="showCarCount = false">
      <view class="popup-content" @click.stop>
        <text class="popup-text" style="color: #f46205; text-align: center">
          <text>{{ userStore.userInfo?.name }}</text>
          <text>这是一修师傅陪你修复的第</text>
          <text>{{ carCountText }}</text>
          <text>台车</text>
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue"
import { navigateTo } from '@/utils/router'
import RequestLoading from "@/utils/RequestLoading"
import { getQueryLog, getCarCount } from "@/api/log"
import { useUserStore } from "@/store/modules/user"
import { getUserInfo } from "@/api/user.js"

const userStore = useUserStore()
const carCountText = ref("")
const activeNames = ref(null)
const logList = ref([])
const showCarCount = ref(false)
const search = ref("")
const menuStates = ref([])
const baseUrl = import.meta.env.VITE_SERVER

const toggleExpand = (current) => {
  current.isExpanded = !current.isExpanded
}

// 显示指定 index 的菜单
const showMenu = (e, index) => {
  menuStates.value.forEach((state, i) => {
    state.isShow = i === index
  })
  nextTick(() => {
    adjustMenuPosition(e, index)
  })
}

const queryCarCount = async () => {
  try {
    const responseCar = await getCarCount()
    carCountText.value = responseCar.data
    showCarCount.value = true
  } catch (error) {
    console.error("接口请求失败：", error)
  }
}

// 隐藏指定 index 的菜单
const hideMenu = (index) => {
  if (menuStates.value[index]) {
    menuStates.value[index].isShow = false
  }
}

// 调整指定 index 的菜单位置
const adjustMenuPosition = (e, index) => {
  const systemInfo = uni.getSystemInfoSync()
  const screenWidth = systemInfo.windowWidth
  const screenHeight = systemInfo.windowHeight
  const menuWidth = 124
  const menuHeight = 160
  let left = e.touches ? e.touches[0].clientX : e.clientX || 0
  let top = e.touches ? e.touches[0].clientY : e.clientY || 0

  if (left + menuWidth > screenWidth) {
    left = Math.max(0, screenWidth - menuWidth - 10)
  }
  if (top + menuHeight > screenHeight) {
    top = Math.max(0, screenHeight - menuHeight - 10)
  }

  menuStates.value[index].position = {
    top: `${top}px`,
    left: `${left}px`,
  }
}

// 切换指定 index 的菜单显示状态
const toggleMenu = (e, index) => {
  const currentState = menuStates.value[index]
  if (currentState) {
    if (currentState.isShow) {
      hideMenu(index)
    } else {
      showMenu(e, index)
    }
  }
}

// 模拟"查看关联对话"点击事件
const viewRelated = (data, index) => {
  console.log(data, index, "查看关联对话")
  navigateTo('conversationHistory', {
    data: JSON.stringify(data),
  })
  hideMenu(index)
}

// 模拟"编辑"点击事件
const editLog = (data, index) => {
  console.log(data, "编辑日志")
  navigateTo('editLog', {
    data: JSON.stringify(data),
  })
  hideMenu(index)
}

// 模拟"分享"点击事件（预留）
const shareLog = (id, index) => {
  console.log("分享日志（预留）")
  hideMenu(index)
}

const inteRview = (id, index) => {
  console.log("提审（预留）")
  hideMenu(index)
}

const handleClickOutside = (e) => {
  menuStates.value.forEach((state, index) => {
    if (state.isShow) {
      hideMenu(index)
    }
  })
}

// 格式化时间为"YYYY年MM月DD日"
const formatDate = (isoString) => {
  if (!isoString) return ""
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}年${month}月${day}日`
}

const searchClick = async (search) => {
  try {
    const response = await RequestLoading(getQueryLog, { title: search })
    logList.value = response.data || []
    menuStates.value = logList.value.map(() => ({
      isShow: false,
      position: { top: "0px", left: "0px" },
    }))
  } catch (error) {
    console.error("接口请求失败：", error)
    logList.value = []
    menuStates.value = []
  }
}

const onLoad = async () => {
  try {
    const response = await RequestLoading(getQueryLog, { title: "" })
    logList.value =
      response.data.map((item) => ({ ...item, isExpanded: false })) || []
    menuStates.value = logList.value.map(() => ({
      isShow: false,
      position: { top: "0px", left: "0px" },
    }))
  } catch (error) {
    console.error("接口请求失败：", error)
    logList.value = []
    menuStates.value = []
  }
}

onMounted(() => {
  onLoad()
  // 获取页面参数
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  if (currentPage.options?.fromCreateLog) {
    queryCarCount()
    getUserInfo().then((response) => {
      if (userStore.userInfo) {
        userStore.userInfo.repairCount = response.data.repairCount
      }
    })
  }
})
</script>

<style scoped lang="scss">
.empty-tip {
  text-align: center;
  font-size: 14px;
  color: #999;
  margin-top: 150px;
}

.log-container {
  padding: 10px;
  position: relative;
}

.log-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.log-title {
  font-size: 14px;
  color: #999;
}

.log-date {
  font-size: 14px;
  color: #999;
}

.log-text {
  margin: 5px 0;
  line-height: 1.5;
}

.expand-btn {
  background-color: transparent;
  border: none;
  color: #f37021;
  padding: 5px 0;
  font-size: 14px;
  margin-top: 5px;
}

.image-placeholders {
  display: flex;
  margin-top: 10px;
  gap: 10px;
}

.placeholder {
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
  
  image {
    width: 100%;
    height: 100%;
  }
}

.menu-btn {
  background: transparent;
  border: none;
  font-size: 16px;
}

.menu-icon {
  font-size: 20px;
  color: #333;
}

.operation-menu {
  position: fixed;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
  padding: 5px 0;
  width: 124px;
}

.menu-item {
  padding: 8px 15px;
  font-size: 14px;
}

.car-count-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.popup-content {
  background: #fff;
  padding: 54px;
  border-radius: 10px;
  
  .popup-text {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
