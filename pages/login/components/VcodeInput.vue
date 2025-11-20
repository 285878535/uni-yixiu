<template>
  <view class="vcode-root">
    <button class="back-btn top" @click="$emit('back')">
      <text class="back-icon">‹</text>
    </button>
    <view class="vcode-area">
      <text class="desc title">请输入验证码</text>
      <text class="desc info">验证码已发送至 +{{ area }} {{ phone }}</text>
      <view class="vcode-box" :class="{ 'vcode-complete': isVcodeComplete }">
        <input
          v-for="(v, i) in values.length"
          :key="i"
          :ref="(el) => setRef(el, i)"
          maxlength="1"
          type="number"
          :value="values[i]"
          @input="onInput($event, i)"
          @keydown="onKeydown($event, i)"
          @focus="onFocus($event, i)"
          :focus="i === focusedIndex"
        />
      </view>
      <view class="actions">
        <button
          class="verify-btn"
          :class="{ 'vcode-complete': isVcodeComplete }"
          @click="$emit('verify')"
        >
          验证
        </button>
      </view>
      <view class="resend-area">
        <text v-if="countdown > 0" class="countdown-text">{{ countdown }}s后可重新获取</text>
        <button
          v-else
          class="resend-btn"
          @click="$emit('resend')"
        >
          重新获取验证码
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch, onMounted, computed, nextTick } from "vue"

const props = defineProps({
  modelValue: { type: Array, default: () => ["", "", "", "", "", ""] },
  phone: { type: String, default: "" },
  area: { type: [String, Number], default: "86" },
})

const emit = defineEmits(["update:modelValue", "verify", "back", "resend"])

const values = ref([...props.modelValue])
const inputs = ref([])
const countdown = ref(60)
const focusedIndex = ref(0)
let countdownTimer = null

watch(
  () => props.modelValue,
  (v) => {
    values.value = [...v]
  }
)

const focusFirstEmpty = () => {
  const idx = values.value.findIndex((x) => !x)
  const i = idx === -1 ? values.value.length - 1 : idx
  focusedIndex.value = i
  nextTick(() => {
    const el = inputs.value[i]
    if (el && typeof el.focus === "function") {
      el.focus()
    }
  })
}

onMounted(() => {
  // small timeout to ensure parents mounted
  setTimeout(() => focusFirstEmpty(), 100)
  // 启动倒计时
  startCountdown()
})

const onInput = (e, i) => {
  const val = e.detail.value.slice(-1).replace(/[^0-9]/g, '')
  if (val) {
    values.value[i] = val
    emit("update:modelValue", [...values.value])
    if (i < inputs.value.length - 1) {
      focusedIndex.value = i + 1
      nextTick(() => {
        const nextInput = inputs.value[i + 1]
        if (nextInput && typeof nextInput.focus === "function") {
          nextInput.focus()
        }
      })
    }
  } else {
    values.value[i] = ""
    emit("update:modelValue", [...values.value])
  }
}

const onKeydown = (e, i) => {
  // uni-app 中 keydown 事件可能不支持，使用 input 事件处理删除
  // 这里主要处理退格键
  if (e.keyCode === 8 || e.key === "Backspace") {
    if (values.value[i]) {
      values.value[i] = ""
      emit("update:modelValue", [...values.value])
    } else if (i > 0) {
      focusedIndex.value = i - 1
      nextTick(() => {
        const prevInput = inputs.value[i - 1]
        if (prevInput && typeof prevInput.focus === "function") {
          prevInput.focus()
        }
      })
      values.value[i - 1] = ""
      emit("update:modelValue", [...values.value])
    }
  }
}

const onFocus = (e, i) => {
  // always focus first empty
  const idx = values.value.findIndex((x) => !x)
  const target = idx === -1 ? values.value.length - 1 : idx
  if (i !== target) {
    focusedIndex.value = target
    nextTick(() => {
      const targetInput = inputs.value[target]
      if (targetInput && typeof targetInput.focus === "function") {
        targetInput.focus()
      }
    })
  }
}

// collect refs by index
const setRef = (el, i) => {
  if (el) {
    inputs.value[i] = el
  }
}

// 启动倒计时
const startCountdown = () => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
  countdownTimer = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--
    } else {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)
}

// 重置倒计时
const resetCountdown = () => {
  countdown.value = 60
  startCountdown()
}

// 暴露重置倒计时方法给父组件
defineExpose({
  resetCountdown
})

// 判断验证码是否完整（6位）
const isVcodeComplete = computed(() => {
  return (
    values.value.every((v) => v && v.trim() !== "") && values.value.length === 6
  )
})
</script>

<style scoped>
.vcode-root {
  position: relative;
  height: 100%;
  width: 100%;
}

.vcode-area {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}

.desc {
  color: #333;
  font-size: 16px;
}

.desc.title {
  font-weight: 600;
  font-size: 18px;
}

.desc.info {
  color: #666;
  font-size: 14px;
  margin-top: 6px;
}

.back-btn {
  border: none;
  background: transparent;
  padding: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 12px;
  top: 12px;
  z-index: 10;
}

.back-icon {
  font-size: 40px;
  color: #333;
  line-height: 1;
}

.vcode-box {
  display: flex;
  gap: 8px;
  margin: 12px 0;
}

.vcode-box input {
  width: 40px;
  height: 60px;
  text-align: center;
  font-size: 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  outline: none;
}

.vcode-box input:focus {
  border-color: #f46205;
  box-shadow: 0 0 0 2px rgba(244, 98, 5, 0.08);
}

.vcode-box.vcode-complete input {
  color: #f46205;
}

.actions {
  display: flex;
  gap: 10px;
  width: 100%;
  padding: 0 20px;
  margin-top: 20px;
}

.verify-btn {
  width: 100%;
  height: 44px;
  border-radius: 40px;
  font-size: 16px;
  transition: background-color 0.3s ease;
  background: #a2a2a2;
  border: none;
  color: #fff;
}

.verify-btn.vcode-complete {
  background-color: #f46205 !important;
  border-color: #f46205 !important;
  color: #fff !important;
}

.resend-area {
  margin-top: 20px;
  text-align: center;
}

.countdown-text {
  color: #666;
  font-size: 14px;
}

.resend-btn {
  background: transparent !important;
  border: 1px solid #f46205 !important;
  color: #f46205 !important;
  border-radius: 20px;
  padding: 8px 16px;
  font-size: 14px;
}
</style>
