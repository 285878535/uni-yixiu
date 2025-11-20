<template>
  <view class="phone-login">
    <view class="logo"></view>
    <text class="title">一修师傅，你的修车助手</text>
    <text class="subtitle">未注册手机验证登陆后自动登录</text>
    <view class="phone_input">
      <view class="area" @click="onHandleAreaCode">+{{ area }}</view>
      <input type="number" v-model="localPhone" placeholder="请输入手机号" />
    </view>
    <view
      class="send_btn"
      :class="{ 'btn-active': isPhoneValid }"
      @click="onSend"
    >
      发送验证码
    </view>
    <view class="agreement" ref="agreementRef">
      <checkbox-group @change="onAgreeChange">
        <label>
          <checkbox :checked="localAgree" value="agree" />
          <text>已阅读并同意</text>
        </label>
      </checkbox-group>
      <text class="agreement-link" @click="onHandleShowAgreement(0)">《用户协议》</text>
      <text class="agreement-link" @click="onHandleShowAgreement(1)">《数据隐私安全声明》</text>
    </view>
    
    <!-- 用户协议弹窗 - 使用 uni.showModal 或自定义弹窗 -->
    <!-- 如果需要更复杂的弹窗，可以使用 uni-popup 组件（需要安装 uni-ui） -->
    <!-- 这里使用简单的 modal 实现 -->
  </view>
</template>

<script setup>
import { computed, ref, toRefs } from "vue"
import PopupService from "@/utils/PopupService"

const props = defineProps({
  modelValue: { type: String, default: "" },
  agree: { type: Boolean, default: false },
  area: { type: String, default: "86" },
})

const emit = defineEmits([
  "update:modelValue",
  "update:agree",
  "send",
  "openAreaCodeSelect",
])

const { modelValue } = toRefs(props)
const localPhone = computed({
  get: () => modelValue.value,
  set: (v) => emit("update:modelValue", v),
})

const localAgree = ref(props.agree)
const agreementRef = ref(null)
const agreementTitle = ref('用户协议')

const onAgreeChange = (e) => {
  const checked = e.detail.value.includes('agree')
  localAgree.value = checked
  emit("update:agree", checked)
}

const onSend = () => emit("send")

const onHandleAreaCode = () => {
  emit("openAreaCodeSelect")
}

// 判断手机号是否完整（11位数字，以1开头）
const isPhoneValid = computed(() => {
  const pattern = /^1[3456789]\d{9}$/
  return pattern.test(localPhone.value)
})

const agreeAndContinue = () => {
  // 这里可以添加"同意并继续"后的逻辑，比如跳转页面、提交操作等
}

const onHandleShowAgreement = (type) => {
  // type 0: 用户协议, 1: 数据隐私安全声明
  const title = type === 0 ? '用户协议' : '数据隐私安全声明'
  const content = type === 0 
    ? '欢迎使用本产品，以下是用户协议的具体内容...\n1. 服务条款...\n2. 隐私政策...'
    : '这里是数据隐私安全声明的具体内容...'
  
  // 使用 uni.showModal 显示协议
  uni.showModal({
    title: title,
    content: content,
    showCancel: false,
    confirmText: '我知道了',
    success: () => {
      // 用户确认后可以执行的操作
    }
  })
  
  // 也可以使用 PopupService
  // PopupService.open({
  //   component: type === 0 ? "Protocol" : "Conditions",
  //   style: { padding: "10px 10px", height: "80%" },
  // })
}

defineOptions({ name: "PhoneInput" })
</script>

<style lang="scss" scoped>
.phone_input {
  display: flex;
  width: 310px;
  border: 1px solid #000;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  align-items: center;
  min-height: 50px;
  height: 50px;
  z-index: 99;
  margin-top: 20px;
  
  .area {
    padding: 10px 12px;
    background: transparent;
    border-right: 1px solid #000;
    flex-shrink: 0;
    height: 100%;
    display: flex;
    align-items: center;
  }

  input {
    border: none;
    outline: none;
    flex: 1;
    padding: 10px;
    font-size: 14px;
    height: 100%;
    min-height: 30px;
    box-sizing: border-box;
  }
}

.phone-login {
  display: flex;
  flex-direction: column;
  padding-top: 130px;
  align-items: center;
  height: 100%;
  background-color: #f8f7fc;
  padding-bottom: env(safe-area-inset-bottom);
  min-height: 100vh;
}

.logo {
  width: 300px;
  height: 300px;
  background: url("/static/login2.png");
  background-size: cover;
}

.title {
  font-size: 18px;
}

.subtitle {
  font-size: 12px;
  margin-bottom: 25px;
}

.send_btn {
  width: 310px;
  border-radius: 40px;
  background: #a2a2a2 !important;
  color: #fff;
  padding: 10px 10px;
  text-align: center;
  margin-bottom: 20px;
  transition: background-color 0.3s ease;
}

.send_btn.btn-active {
  background: #f46205 !important;
}

.agreement {
  font-size: 12px;
  color: #000;
  display: flex;
  align-items: center;
  gap: 2px;
  margin-top: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.agreement-link {
  color: #f46205;
}

@keyframes shakeX {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(-8px);
  }
  40% {
    transform: translateX(8px);
  }
  60% {
    transform: translateX(-6px);
  }
  80% {
    transform: translateX(6px);
  }
  100% {
    transform: translateX(0);
  }
}

.agreement.shake {
  animation: shakeX 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97);
}

</style>
