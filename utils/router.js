/**
 * uni-app 路由工具函数
 */
import { pageDefaultTitle } from './settings'

// 路由映射表
export const routeMap = {
  '/pages/archives/index': '/pages/archives/index',
  '/pages/collection/index': '/pages/collection/index',
  '/pages/maintenance/index': '/pages/maintenance/index',
  '/pages/circle/index': '/pages/circle/index',
  '/pages/log/index': '/pages/log/index',
  '/pages/chat/index': '/pages/chat/index',
  '/pages/userEdit/index': '/pages/userEdit/index',
  '/pages/login/index': '/pages/login/index',
}

// 页面标题映射表
export const titleMap = {
  '/pages/archives/index': '档案馆',
  '/pages/collection/index': '看收藏',
  '/pages/maintenance/index': '修车',
  '/pages/circle/index': '修车圈',
  '/pages/log/index': '记日志',
  '/pages/chat/index': '聊天',
  '/pages/userEdit/index': '个人中心',
  '/pages/login/index': '登录',
}

/**
 * 获取页面标题
 */
export function getPageTitle(url) {
  if (!url) return pageDefaultTitle
  
  // 移除查询参数
  const path = url.split('?')[0]
  
  // 从映射表中获取标题
  return titleMap[path] || pageDefaultTitle
}

/**
 * 导航到指定页面
 */
export function navigateTo(url, params = {}) {
  let fullUrl = url
  if (Object.keys(params).length > 0) {
    const query = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
    fullUrl = `${url}?${query}`
  }
  
  return new Promise((resolve, reject) => {
    uni.navigateTo({
      url: fullUrl,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 重定向到指定页面
 */
export function redirectTo(url, params = {}) {
  let fullUrl = url
  if (Object.keys(params).length > 0) {
    const query = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
    fullUrl = `${url}?${query}`
  }
  
  return new Promise((resolve, reject) => {
    uni.redirectTo({
      url: fullUrl,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 切换到 Tab 页面
 */
export function switchTab(url) {
  return new Promise((resolve, reject) => {
    uni.switchTab({
      url,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 重新启动到指定页面
 */
export function reLaunch(url, params = {}) {
  let fullUrl = url
  if (Object.keys(params).length > 0) {
    const query = Object.keys(params)
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&')
    fullUrl = `${url}?${query}`
  }
  
  return new Promise((resolve, reject) => {
    uni.reLaunch({
      url: fullUrl,
      success: resolve,
      fail: reject
    })
  })
}

/**
 * 返回上一页
 */
export function navigateBack(delta = 1) {
  return new Promise((resolve, reject) => {
    uni.navigateBack({
      delta,
      success: resolve,
      fail: reject
    })
  })
}

