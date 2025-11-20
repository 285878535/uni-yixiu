/**
 * API 配置
 * 统一管理 API 地址
 */

// 从环境变量获取配置
export const API_CONFIG = {
  // API 基础路径
  BASE_API: import.meta.env.VITE_BASE_API || '/kx_war',
  // 服务器地址
  SERVER: import.meta.env.VITE_SERVER || 'http://r84d6d23.natappfree.cc',
  // 是否启用 VConsole
  ENABLE_VCONSOLE: import.meta.env.VITE_ENABLE_VCONSOLE === 'true' || import.meta.env.VITE_ENABLE_VCONSOLE === true,
  // 环境模式
  MODE: import.meta.env.MODE || 'development',
}

/**
 * 获取完整的 API URL
 * @param {string} path - API 路径
 * @returns {string} 完整的 API URL
 */
export function getApiUrl(path) {
  // 如果已经是完整 URL，直接返回
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // 开发环境 H5 平台使用代理
  // #ifdef H5
  if (API_CONFIG.MODE === 'development') {
    return API_CONFIG.BASE_API + path
  }
  // #endif
  
  // 生产环境或非 H5 平台使用完整地址
  return API_CONFIG.SERVER + API_CONFIG.BASE_API + path
}

/**
 * API 端点配置
 * 在这里定义所有的 API 端点
 */
export const API_ENDPOINTS = {
  // 示例 API
  // login: '/login',
  // getUserInfo: '/user/info',
}

