<template>
  <div class="phone-login">
    <div class="yixiu-title">
      <p>How May I help</p>
      <p>You Today</p>
    </div>
    <div class="logo"></div>
    <!-- <p class="title">一修师傅，你的修车助手</p>
    <p class="subtitle">未注册手机验证登陆后自动登录</p> -->

    <div class="captcha">
      <div class="phone-area">
        <div class="area" @click="onHandleAreaCode">+{{ area }}</div>
        <div class="separation"></div>
        <input v-model="localPhone" type="text" placeholder="请输入手机号" />
      </div>

      <van-button
        type="default"
        :class="{ 'btn-disabled': !localAgree || !localPhone }"
        @click="onSend"
        >发送验证码</van-button
      >
    </div>

    <div class="agreement">
      <input id="agree" type="checkbox" v-model="localAgree" />
      <label for="agree">已阅读并同意</label>
      <span @click="showAgreementPopup = true">《用户协议》</span>
      <span @click="showAgreementPopup = true">《数据隐私安全声明》</span>
    </div>
    <!-- 用户协议弹窗 -->
    <van-popup
      v-model:show="showAgreementPopup"
      round
      position="bottom"
      :style="{ width: '100%', height: '95%' }"
    >
      <div class="agreement-header">
        <span>用户协议</span>
        <van-icon
          name="cross"
          @click="showAgreementPopup = false"
          class="close-icon"
        />
      </div>
      <div class="agreement-content">
        <!-- 这里放置用户协议的具体内容，可从接口获取或直接写静态内容 -->
        <p>欢迎使用本产品，以下是用户协议的具体内容...</p>
        <p>1. 服务条款...</p>
        <p>2. 隐私政策...</p>
        <!-- 可根据实际协议内容补充更多段落 -->
      </div>
      <div class="agreement-footer">
        <van-button type="primary" block @click="agreeAndContinue"
          >同意并继续</van-button
        >
      </div>
    </van-popup>
  </div>
</template>

<script setup>
import { computed, toRefs } from "vue"
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

const localAgree = computed({
  get: () => props.agree,
  set: (v) => emit("update:agree", v),
})

const onSend = () => emit("send")

const onHandleAreaCode = () => {
  emit("openAreaCodeSelect")
}
defineOptions({ name: "PhoneInput" })

const showAgreementPopup = ref(false)

const agreeAndContinue = () => {
  showAgreementPopup.value = false
  // 这里可以添加“同意并继续”后的逻辑，比如跳转页面、提交操作等
}
</script>

<style lang="scss" scoped>
.van-button--default {
  // width: 280px;
  border-radius: 40px;
  margin-left: -30px;
  background: #000 !important;
  color: #fff;
  width: 160px;
}

.phone-login {
  display: flex;
  flex-direction: column;
  padding-top: 130px;
  align-items: center;
  height: 100%;
}

.logo {
  width: 304px;
  height: 435px;
  background: url("/src/assets/images/login1.png");
  background-size: cover;
}

.title {
  font-size: 18px;
  margin-top: 50px;
  // margin-bottom: 20px;
}

.subtitle {
  font-size: 12px;
  margin-bottom: 45px;
}

.phone-area {
  display: flex;
  width: 210px;
  border: 1px solid #000;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 20px;
  align-items: center;
  background: #ff7e20;
  z-index: 99;

  .area {
    padding: 10px 12px;
    background: transparent;
    // border-right: 1px solid #ddd;
  }

  .separation {
    width: 1px;
    background: #000;
    height: 70%;
  }

  input {
    border: none;
    outline: none;
    flex: 1;
    padding: 10px;
    font-size: 14px;
  }
}

.agreement {
  font-size: 12px;
  color: #666;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin-top: 12px;
}

.agreement input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 1px solid #ccc;
  display: inline-block;
  position: relative;
}

.agreement input[type="checkbox"]:checked {
  background: #f46205;
  border-color: #f46205;
}

.agreement input[type="checkbox"]:checked::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 6px;
  height: 6px;
  background: #fff;
  border-radius: 50%;
}

.agreement span {
  color: #000;
  // color: #f46205;
  // margin-left: 2px
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

.btn-disabled {
  opacity: 0.6;
}

.agreement-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.close-icon {
  font-size: 20px;
}

.agreement-content {
  flex: 1;
  padding: 15px;
  overflow-y: auto;
}

.agreement-footer {
  padding: 10px;
}
.yixiu-title {
  text-align: center;
  font-weight: 900;
  font-size: 24px;
}
.captcha {
  display: flex;
}
.btn-disabled {
  opacity: 1;
}
</style>
