import App from './App.vue'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'

// 引入全局样式
import './assets/styles/index.scss'

// 引入 UnoCSS（如果使用）
// import "virtual:uno.css"

// 引入 SVG 图标（如果使用）
// import "virtual:svg-icons-register"

// VConsole（开发环境）
import { initVConsole } from '@/utils/vconsole'

// i18n 国际化
import i18n from './locales'

// Pinia 状态管理
import { createPinia } from 'pinia'
const pinia = createPinia()

// Quill 编辑器（仅 H5 平台）
// #ifdef H5
import Quill from "quill"
import "quill/dist/quill.snow.css"
// 全局注册 Quill
if (typeof window !== 'undefined') {
  window.Quill = Quill
}
// #endif

// 全局组件
import CustomSearch from "@/components/CustomSearch/index.vue"
import TextSelectionMenu from "@/components/TextSelectionMenu/index.vue"

export function createApp() {
  const app = createSSRApp(App)

  // 使用 Pinia
  app.use(pinia)

  // 使用 i18n
  app.use(i18n)

  // 注册全局组件
  app.component("CustomSearch", CustomSearch)
  app.component("TextSelectionMenu", TextSelectionMenu)

  // 初始化 VConsole（开发环境）
  initVConsole()

  return {
    app
  }
}
// #endif
