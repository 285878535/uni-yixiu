<template>
  <view class="login-container">
    <component
      :is="components[currentComp]"
      :modelValue="currentComp === 'PhoneInput' ? phone : vcode"
      :agree="agree"
      :area="area_code"
      :phone="phone"
      @update:modelValue="onUpdateModel"
      @update:agree="(v) => (agree = v)"
      @send="sendCode"
      @verify="onVerify"
      @back="() => (currentComp = 'PhoneInput')"
      @open-area-code-select="openAreaCodeSelect"
      @resend="onResend"
      ref="currentComponentRef"
    />
  </view>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/modules/user'
import { navigateTo, reLaunch } from '@/utils/router'
import PhoneInput from "./components/PhoneInput.vue"
import VcodeInput from "./components/VcodeInput.vue"
import {
  getVcodeApi,
  loginApi,
  getProjectCodeApi,
  getUserInfo,
} from "@/api/user.js"
import RequestLoading from "@/utils/RequestLoading"
import PopupService from "@/utils/PopupService.js"

const { t } = useI18n()
const userStore = useUserStore()

const components = { PhoneInput, VcodeInput }
const currentComp = ref("PhoneInput")
const phone = ref("")
const agree = ref(false)
const vcode = ref(["", "", "", "", "", ""])
const areaCodeList = ref([])
const area = ref("86")
const area_code = ref("86")
const currentComponentRef = ref(null)
const agreementRef = ref(null)

const onUpdateModel = (val) => {
  if (currentComp.value === "PhoneInput") {
    phone.value = val
  } else {
    vcode.value = Array.isArray(val) ? val : [...val]
  }
}

const getCode = async () => {
  try {
    const res = await getProjectCodeApi({ code: "" })
    console.log(res)
  } catch (error) {
    console.error(error)
  }
}

const openAreaCodeSelect = () => {
  PopupService.open({
    component: "AreaCodeSelect",
    style: { padding: "20px 0" },
    props: {
      onHandleCodeItem: (item) => {
        area_code.value = String(item.code).replace(/^\+/, "")
      },
    },
  })
}

const sendCode = async () => {
  if (!agree.value) {
    // uni-app 中使用动画类名触发 shake 效果
    if (agreementRef.value) {
      agreementRef.value.classList?.remove("shake")
      // 触发重排
      void agreementRef.value.offsetWidth
      agreementRef.value.classList?.add("shake")
      setTimeout(() => {
        if (agreementRef.value) {
          agreementRef.value.classList?.remove("shake")
        }
      }, 600)
    }
    return
  }
  
  const pattern = /^1[3456789]\d{9}$/
  const isPhone = pattern.test(phone.value)
  if (!isPhone) {
    uni.showToast({
      title: "请输入正确的手机号",
      icon: "none"
    })
    return
  }
  
  try {
    await RequestLoading(getVcodeApi, {
      phone: phone.value,
      areCode: area_code.value,
    })
    // switch to vcode input
    currentComp.value = "VcodeInput"
  } catch (error) {
    console.error(error)
  }
}

const onToken = async (token) => {
  try {
    const { data } = await RequestLoading(getUserInfo, { token })
    let routePath = null
    if (data?.register) {
      routePath = "/pages/useredit/index?first=true"
    } else {
      routePath = "/pages/archives/index"
    }
    
    userStore.login({
      name: data.name,
      avatar: data.picture,
      userId: data.id,
      repairCount: data.repairCount,
      day: data.day,
      isPro: data.isPro,
    })
    
    // 使用 uni-app 路由跳转
    if (data?.register) {
      uni.reLaunch({
        url: '/pages/useredit/index?first=true'
      })
    } else {
      uni.reLaunch({
        url: '/pages/archives/index'
      })
    }
  } catch (error) {
    console.error(error)
  }
}

const onVerify = async () => {
  // assemble vcode
  const code = vcode.value.join("")
  if (code.length !== 6) {
    uni.showToast({
      title: "请输入6位验证码",
      icon: "none"
    })
    return
  }
  
  try {
    const loginRes = await RequestLoading(loginApi, {
      phone: phone.value,
      vcode: code,
    })
    // 请求成功，res.data 应包含 token 按 request.js 响应结构 res.data
    const tokenStr = loginRes.token
    if (!tokenStr) {
      uni.showToast({
        title: "登录失败：未返回 token",
        icon: "none"
      })
      return
    }
    userStore.onSetToken({ token: tokenStr })
    onToken(tokenStr)
  } catch (e) {
    // 错误已在 request 拦截/RequestLoading 处理过，这里可额外处理
    console.error(e)
  }
}

const onResend = async () => {
  try {
    await RequestLoading(getVcodeApi, {
      phone: phone.value,
      areCode: area_code.value,
    })
    // 重置倒计时
    if (currentComponentRef.value && currentComponentRef.value.resetCountdown) {
      currentComponentRef.value.resetCountdown()
    }
    uni.showToast({
      title: "验证码已重新发送",
      icon: "success"
    })
  } catch (error) {
    // 错误已在 RequestLoading 中处理
    console.error(error)
  }
}

onMounted(async () => {
  // await getCode()
})

defineExpose({ PhoneInput, VcodeInput })
</script>

<style lang="scss" scoped>
.login-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
