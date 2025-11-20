<script setup>
import { useDark, useToggle } from "@vueuse/core"
import { setLocale, locale } from "@/locales"
import { useRoute } from "vue-router"
import More from "./More.vue"
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const isDark = useDark()
const toggleDark = useToggle(isDark)
const toggleLocale = () => {
  setLocale(locale.value == "en" ? "zh-cn" : "en")
}
const showMore = ref(false)
const onMore = () => {
  showMore.value = true
}
// 判断是否为对话页面
const isChatPage = computed(() => route.name === "chat")
const onBack = () => {
  router.back()
}
</script>

<template>
  <van-nav-bar fixed placeholder>
    <template #title>
      <span @click="router.push('/')">一修师傅</span>
    </template>
    <template #left>
      <van-icon 
        v-if="isChatPage" 
        size="30" 
        name="arrow-left" 
        @click="onBack"
      />
      <van-icon 
        v-else 
        size="30" 
        name="wap-nav" 
        @click="onMore"
      />
    </template>
    <!-- <template #right>
                        <span>{{userStore.user.name}}</span>
                        <svg-icon @click="toggleLocale()" class="text-[18px] m-1" name="i18n" />
                        <svg-icon @click="toggleDark()" class="text-[18px]" :name="isDark ? 'light' : 'dark'" />
                      </template> -->
  </van-nav-bar>
  <More v-model:showMore="showMore" />
</template>

<style lang="scss" scoped></style>
