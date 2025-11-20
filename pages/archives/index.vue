<template>
  <view class="tabbar-page f9">
    <CustomSearch v-model="search" @search="handleSearch" />
    <view class="tag-container">
      <view
        v-for="(name, index) in categories"
        :key="name"
        class="tag-item"
        :class="{ active: index === activeTagIndex }"
        @click="onSelectTag(index)"
      >
        {{ name }}
      </view>
    </view>
    <view class="content-container">
      <view class="new_arrivals c_c">
        <view class="header">资料上新</view>
        <scroll-view class="arrivals_container container" scroll-x>
          <view
            class="arrivals_item"
            v-for="(info, index) in informations"
            :key="index"
            :style="{ backgroundImage: `url(${rootSrc}/${info.images})` }"
            @click="onHandleClick(info)"
          >
            <text class="arrivals_item_text">{{ info.brandName }}</text>
            <text class="arrivals_item_text">{{ info.carName }}</text>
            <text class="arrivals_item_text">{{ info.style }}</text>
            <text class="arrivals_item_text">{{ info.type }}</text>
          </view>
        </scroll-view>
        <view class="view_new_arivals">
          <text>查看近期上新</text>
        </view>
      </view>

      <view class="common_aults c_c">
        <view class="header">常见故障</view>
        <scroll-view class="aults_container container" scroll-y>
          <view
            v-for="(fault, index) in faults"
            :key="index"
            class="aults_item"
            @click="onHandleFaultClick(fault)"
          >
            <text class="fault-desc">{{ fault.troubleDesc }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { navigateTo } from '@/utils/router'
import { recentlyUpdatedApi, commonFaultsApi } from "@/api/archives"

const search = ref("")
// 仅使用文字分类
const categories = ["维修手册", "电路图", "维修案例", "故障说明"]
const activeTagIndex = ref(null)
const rootSrc = import.meta.env.VITE_SERVER
// 数据
const faults = ref([])
const informations = ref([])

const onLoad = () => {
  recentlyUpdatedApi().then((res) => {
    informations.value = res.data || []
  })
  commonFaultsApi().then((res) => {
    faults.value = res.data || []
  })
}

onMounted(() => {
  onLoad()
})

const onHandleClick = (info) => {
  navigateTo('chat', {
    mode: "default",
    data: JSON.stringify(info),
  })
}

// 处理常见故障点击事件
const onHandleFaultClick = (fault) => {
  navigateTo('chat', {
    mode: "fault",
    data: JSON.stringify({
      name: fault.troubleDesc || fault.name,
      logId: fault.logId,
    }),
  })
}

// 选择分类 Tag（四选一）
const onSelectTag = (index) => {
  activeTagIndex.value = index
}

// 点击搜索按钮
const handleSearch = (keyword) => {
  const kw = String(keyword ?? search.value ?? "").trim()
  if (!kw) {
    uni.showToast({
      title: "请输入搜索内容",
      icon: "none"
    })
    return
  }
  if (activeTagIndex.value === null) {
    uni.showToast({
      title: "请选择一个分类",
      icon: "none"
    })
    return
  }
  const category = categories[activeTagIndex.value]
  const doc = { keyword: kw, category }
  navigateTo('chat', {
    mode: "search",
    data: JSON.stringify(doc),
  })
}
</script>

<style scoped lang="scss">
.tabbar-page {
  height: 100vh;
  overflow-y: auto;
  background-color: #f9f9f9;
}

.tag-container {
  display: flex;
  flex-wrap: nowrap;
  gap: 8px;
  justify-content: space-between;
  margin-top: 6px;
  padding: 0 10px;

  .tag-item {
    padding: 6px 0;
    flex: 1;
    text-align: center;
    border-radius: 8px;
    background: #f2f2f2;
    color: #333;
    font-size: 12px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .tag-item.active {
    background: #e0e0e0;
    outline: 2px solid #ffa360;
    font-weight: 600;
  }
}

.content-container {
  padding: 10px;
  
  .c_c {
    margin-top: 30px;
    
    .header {
      font-size: 18px;
      font-weight: 500;
    }
    
    .container {
      padding: 15px 10px;
      margin-top: 10px;
      width: 100%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 10px;
    }
  }
  
  .new_arrivals {
    .arrivals_container {
      height: 200px;
      display: flex;
      gap: 10px;
      white-space: nowrap;
      
      .arrivals_item {
        height: 100%;
        width: 120px;
        display: flex;
        flex-shrink: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        align-items: center;
        flex-direction: column;
        justify-content: center;
        
        .arrivals_item_text {
          text-align: center;
          color: #fff;
          margin: 2px 0;
          padding: 2px 0;
          border-radius: 5px;
        }
      }
    }
    
    .view_new_arivals {
      margin-top: 10px;
      text-align: center;
      
      text {
        padding: 2px 80px;
        background: #ffa360;
        display: inline-block;
        color: #fff;
        border-radius: 20px;
      }
    }
  }
}

.common_aults {
  .aults_container {
    height: auto;
    display: flex;
    flex-direction: column;
    max-height: 300px;
    
    .aults_item {
      display: flex;
      align-items: flex-start;
      padding: 8px 4px;
      border-bottom: 1px solid #eee;
      
      .fault-desc {
        flex: 1;
        margin: 0;
        font-size: 14px;
        line-height: 1.5;
      }
    }
  }
}
</style>
