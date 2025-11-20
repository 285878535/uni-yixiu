/**
 * Pinia Store 入口文件
 */
import { createPinia } from 'pinia'

const pinia = createPinia()

export { pinia }

// 导出所有 store 模块
export { useUserStore } from './modules/user'

