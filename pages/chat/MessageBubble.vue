<template>
  <view class="message-item">
    <!-- 机器人消息 -->
    <view v-if="message.type === 'robot'" class="message-robot">
      <image 
        src="https://picsum.photos/id/64/40/40" 
        mode="aspectFill"
        class="avatar" 
      />
      <view class="bubble bubble-robot">
        <rich-text 
          v-if="message.content"
          :nodes="message.content"
        ></rich-text>
        <CssLoader17 v-else />
        <text v-if="message.isTyping" class="typing-cursor">|</text>
      </view>
    </view>
    <!-- 用户消息 -->
    <view v-else class="message-user">
      <view class="bubble bubble-user">
        {{ message.content }}
      </view>
      <image 
        :src="userStore.userInfo?.avatar || 'https://picsum.photos/id/64/40/40'" 
        mode="aspectFill"
        class="avatar" 
      />
    </view>
    <view class="btn-container">
      <text
        class="check-car btn-default"
        v-if="message.selectCarModel"
        @click="onHandleClick('select')"
      >
        选中车型
      </text>
      <text
        class="view-manual btn-default"
        v-if="message.viewManual"
        @click="onHandleClick"
      >
        查看手册
      </text>
      <text
        class="view-circuit btn-default"
        v-if="message.viewCd"
        @click="onHandleClick"
      >
        查看电路图
      </text>
    </view>
  </view>
</template>

<script setup>
import CssLoader17 from "./CssLoader17.vue"
import { useUserStore } from "@/store/modules/user"
import PopupService from "@/utils/PopupService"

const userStore = useUserStore()

defineProps({
  message: {
    type: Object,
    required: true,
  },
})

const onHandleClick = async (type) => {
  const options = {
    component: type === "select" ? "SelectCarModel" : "SearchContent",
    prop: {},
    style:
      type === "select"
        ? { padding: "20px 0", height: "80%" }
        : { height: "80%" },
  }
  PopupService.open(options)
}
</script>

<style scoped lang="scss">
.message-robot,
.message-user {
  display: flex;
  align-items: flex-start;
}

.message-robot {
  justify-content: flex-start;
}

.message-user {
  justify-content: flex-end;
}

.btn-container {
  margin-top: 8px;
  padding-left: 60px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
}

.btn-default {
  text-align: center;
  padding: 1px 50px;
  border: 2px solid #f46205;
  color: #f46205;
  display: inline-block;
  width: auto;
  box-sizing: content-box;
  border-radius: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 10px;
  border: 1px solid #a2a2a2;
}

.bubble {
  max-width: 70%;
  padding: 14px 20px;
  border-radius: 18px;
  word-wrap: break-word;
  line-height: 1.5;
  background: #fff;
  box-shadow: 0px 0px 16px 0px rgba(162, 162, 162, 0.2);
}

.bubble-robot {
  border-bottom-left-radius: 0px;
  border-top-right-radius: 0px;
}

.bubble-user {
  border-bottom-right-radius: 0px;
  border-top-left-radius: 0px;
}

.typing-cursor {
  animation: blink 1s step-end infinite;
}

@keyframes blink {
  from,
  to {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}
</style>
