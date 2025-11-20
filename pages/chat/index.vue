<template>
  <view class="chat-container">
    <scroll-view 
      class="message-content" 
      scroll-y
      :scroll-top="scrollTop"
      :scroll-with-animation="true"
      ref="messageContentRef"
      @scrolltolower="onScrollToLower"
    >
      <view
        v-for="message in messages"
        :key="message.id"
        :id="`message-${message.id}`"
      >
        <MessageBubble
          :message="message"
        />
      </view>
    </scroll-view>
    <view class="btn-container">
      <text class="btn-end" @click="onHandleEnd">结束</text>
    </view>
    <view class="input-field">
      <button class="voice-btn" type="default" plain>
        <text>🎤</text>
      </button>
      <input
        type="text"
        placeholder="请输入消息..."
        v-model="searchData.searchMsg"
        class="chat-input"
        @confirm="onSendMessage"
      />
      <button
        class="send-btn"
        type="primary"
        @click="onSendMessage"
        :disabled="isLoading"
      >
        ⬆
      </button>
    </view>

    <view v-if="showBottom" class="bottom-popup" @click="showBottom = false">
      <view class="popup-content" @click.stop>
        <Toolbar 
          v-model:htmlValue="form.richText" 
          @publish="handleRichTextSubmit" 
        />
      </view>
    </view>

    <view v-if="titleShow" class="dialog-mask" @click="titleShow = false">
      <view class="dialog-content" @click.stop>
        <view class="bookmark-title">日志命名</view>
        <input 
          type="text" 
          v-model="form.title" 
          class="bookmark-input" 
          placeholder="请输入日志名称"
        />
        <button
          @click="onConfirmNamingLog"
          class="bookmark-btn"
        >
          确认
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue"
import MessageBubble from "./MessageBubble.vue"
import { sendMsg, getCreteChatLog, getAiSummary } from "@/api/chat"
import { getNow } from "@/utils/index"
import { useCarStore } from "@/store/modules/car"
import { useUserStore } from "@/store/modules/user"
import { navigateTo } from '@/utils/router'
import { useLogStore } from "@/store/modules/log"
import RequestLoading from "@/utils/RequestLoading"
import Toolbar from "@/components/Toolbar/index.vue"

const logStore = useLogStore()
const showBottom = ref(false)
const userStore = useUserStore()
const carStore = useCarStore()
const form = ref({
  richText: "",
  title: "",
})
// 聊天消息数据
const messages = ref([
  {
    id: 1,
    type: "robot",
    content: "您好！我是一修师傅，有什么可以帮您的吗？",
    time: getNow(),
    timestamp: new Date().toISOString(),
    select_car_model: true,
  },
])

const chatDeepSeekDTO = ref([])
const searchData = ref({
  searchMsg: "",
})
const isLoading = ref(false)
const messageContentRef = ref(null)
const scrollTop = ref(0)

const onScrollToLower = () => {
  // 滚动到底部时的处理
}

const setScrollTop = () => {
  nextTick(() => {
    // uni-app 中需要设置 scroll-top，使用时间戳触发滚动
    scrollTop.value = Date.now()
  })
}

// 添加消息的方法
const setMessages = async (msg, mode = "default", ...args) => {
  isLoading.value = true
  const userMessage = {
    id: messages.value.length + 1,
    type: "user",
    content: msg,
    time: getNow(),
    timestamp: new Date().toISOString(),
  }
  const robotMessage = {
    id: messages.value.length + 2,
    type: "robot",
    content: "",
    time: "",
  }
  messages.value.push(userMessage)
  messages.value.push(robotMessage)
  setScrollTop()
  await onRequestMessage(msg, mode, ...args)
}

const onRequestMessage = async (msg, mode = "default", ...args) => {
  chatDeepSeekDTO.value.push({ role: "user", content: msg })
  try {
    let params
    if (mode === "fault") {
      params = {
        chatDeepSeekDTO: chatDeepSeekDTO.value,
        sourceId: args[0],
        source: "COMMON_FAULTS",
      }
    } else if (mode === "search") {
      params = { chatDeepSeekDTO: chatDeepSeekDTO.value, sourceId: "资料检索" }
    } else {
      params = {
        sourceId: carStore.codes.manual_id,
        chatDeepSeekDTO: chatDeepSeekDTO.value,
      }
    }
    const { data = {}, code, detail = "" } = await sendMsg(params)
    if (code !== 200) throw new Error(detail)
    const lastIdx = messages.value.length - 1
    messages.value[lastIdx] = { ...messages.value[lastIdx], ...data }
    chatDeepSeekDTO.value.push({ role: "assistant", content: data.content })
    messages.value[lastIdx].time = getNow()
    messages.value[lastIdx].timestamp = new Date().toISOString()
    setScrollTop()
  } catch (error) {
    const lastIdx = messages.value.length - 1
    messages.value[lastIdx].content = error.message
    uni.showToast({
      title: error.message,
      icon: "none"
    })
  } finally {
    isLoading.value = false
  }
}

const onSendMessage = () => {
  if (!searchData.value.searchMsg.trim()) {
    uni.showToast({
      title: "请输入消息内容",
      icon: "none"
    })
    return
  }
  const submitMsg = searchData.value.searchMsg
  setMessages(submitMsg)
  searchData.value.searchMsg = ""
}

const submitData = ref(null)
const handleRichTextSubmit = (value) => {
  submitData.value = value
  titleShow.value = true
}

onMounted(async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const mode = currentPage.options?.mode || null
  if (mode) {
    const data = JSON.parse(currentPage.options.data || "null")
    switch (mode) {
      case "default":
        await setMessages(
          `我想查看${data.brandName}${data.carName}${data.style}${data.type}`,
          mode
        )
        break
      case "fault":
        await setMessages(`我想了解${data.name}常见故障`, mode, data.logId)
        break
      case "search":
        await setMessages(`我想了解${data.keyword}的${data.category}`, mode)
        break
      case "vin":
        await setMessages(`我想修车，车架号为${data.vinCode}。`, mode)
        break
    }
  }
})

/**
 * 将后端返回的 summaryContent 数据格式化为 HTML
 */
const formatSummaryToHtml = (data) => {
  if (!data) return ""

  let html = ""
  if (data.type) {
    html += `<p>类型: #${data.type}</p>`
  }
  if (data.field) {
    html += `<p>领域: #${data.field}</p>`
  }
  if (data.brand) {
    html += `<p>品牌: #${data.brand}</p>`
  }
  if (data.model) {
    html += `<p>车型: #${data.model}</p>`
  }

  if (data.modelYear) {
    html += `<p>年款: #${data.modelYear}</p>`
  }

  if (data.faultPhenomenon && data.faultPhenomenon.length > 0) {
    html += `<p><b>故障现象</b></p>`
    if (data.field) {
      html += `<p>#${data.field} <span>▼</span></p>`
    }
    data.faultPhenomenon.forEach((item) => {
      html += `<p>${item}</p>`
    })
  }

  if (data.faultAnalysis && data.faultAnalysis.length > 0) {
    html += `<p><b>故障分析</b></p>`
    html += "<ul>"
    data.faultAnalysis.forEach((item) => {
      html += `<li>${item}</li>`
    })
    html += "</ul>"
  }

  if (data.faultRepair && data.faultRepair.length > 0) {
    html += `<p><b>故障修复</b></p>`
    html += "<ul>"
    data.faultRepair.forEach((item) => {
      html += `<li>${item}</li>`
    })
    html += "</ul>"
  }

  return html
}

const onHandleEnd = async () => {
  const params = {
    userId: userStore.userInfo?.userId,
    brand: logStore.logData.carBrand,
    modelYear: logStore.logData.vehicleModelYear,
    model: logStore.logData.vehicleModelYear,
    questionAnswerLst: chatDeepSeekDTO.value,
  }

  const response = await RequestLoading(getAiSummary, params)
  if (response.code === 200) {
    const summaryContent = response.data
    form.value.richText = formatSummaryToHtml(summaryContent)
    showBottom.value = true
  } else {
    uni.showToast({
      title: response.detail || '获取总结失败',
      icon: "none"
    })
  }
}

const titleShow = ref(false)
const onConfirmNamingLog = async () => {
  if (form.value.title.trim() === "") {
    uni.showToast({
      title: "请输入日志名称",
      icon: "none"
    })
    return
  }
  const res = messages.value.map((item) => {
    return {
      content: item.content,
      createTime: item.timestamp,
      type: item.type == "robot" ? 1 : 0,
    }
  })

  const htmlContent = submitData.value?.html || ""
  const plainText = htmlContent.replace(/<[^>]*>/g, "").trim()

  const title = plainText.substring(0, 50) || "AI助手对话记录"
  const summaryContent = plainText || "AI助手对话总结"
  const images =
    submitData.value?.images && submitData.value.images.length > 0
      ? submitData.value.images.join(",")
      : ""

  const params = {
    userId: userStore.userInfo?.userId,
    title: form.value.title,
    summaryContent: summaryContent,
    images: images,
    contentList: res,
  }
  
  const { carBrand, carSeries, vehicleModelYear } = logStore.logData || {}
  if (carBrand) params.carBrand = carBrand
  if (carSeries) params.carSeries = carSeries
  if (vehicleModelYear) params.vehicleModelYear = vehicleModelYear
  
  try {
    const response = await getCreteChatLog(params)
    titleShow.value = false
    navigateTo('log', {
      fromCreateLog: true,
    })
  } catch (error) {
    uni.showToast({
      title: error.message || '保存失败',
      icon: "none"
    })
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped lang="scss">
.chat-container {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  --input-field-height: 60px;
  --header-height: 50px;
  --btn-height: 50px;

  .message-content {
    flex: 1;
    padding: 10px 0;
    height: calc(100vh - var(--input-field-height) - var(--btn-height));
  }

  .btn-container {
    position: fixed;
    bottom: calc(var(--input-field-height) + 10px);
    width: calc(100% - 20px);
    display: flex;
    justify-content: flex-end;
    padding: 0 10px;
    box-sizing: border-box;

    .btn-end {
      padding: 0px 24px;
      background: #d9d9d9;
      border-radius: 4px;
      line-height: 30px;
    }
  }

  .input-field {
    position: fixed;
    bottom: 0;
    width: 100%;
    padding: 8px;
    display: flex;
    gap: 10px;
    border-top: 1px solid #eee;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    height: var(--input-field-height);
    background: #fff;

    .voice-btn {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #fff;
      border: 2px solid #000;
    }

    .chat-input {
      flex: 1;
      height: 100%;
      border: 1px solid #000;
      border-radius: 20px;
      padding: 0 15px;
      background: #EAEAEA;
    }

    .send-btn {
      border-radius: 50%;
      background: #fff;
      border: 2px solid #000;
      width: 40px;
      height: 40px;
      font-size: 26px;
    }
  }
}

.bottom-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-end;
  z-index: 1000;
}

.popup-content {
  background: #fff;
  width: 100%;
  max-height: 80vh;
  border-radius: 20px 20px 0 0;
}

.dialog-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.dialog-content {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
}

.bookmark-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  text-align: center;
}

.bookmark-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 15px;
  font-size: 16px;
  box-sizing: border-box;
}

.bookmark-btn {
  width: 100%;
  padding: 10px;
  background: #f46205;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
}
</style>
