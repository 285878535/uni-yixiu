/**
 * i18n 国际化配置
 */
import { createI18n } from 'vue-i18n'

// 导入语言包
import zhCN from './zh-CN'
import enUS from './en-US'

// 默认语言
const locale = uni.getLocale() || 'zh-CN'

const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
}

const i18n = createI18n({
  locale,
  fallbackLocale: 'zh-CN',
  messages,
  legacy: false, // 使用 Composition API 模式
  globalInjection: true, // 全局注入 $t
})

export default i18n

