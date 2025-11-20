/**
 * Token 和 Cookie 管理工具
 * 使用 uni-app 的存储 API
 */
import { tokenKey, keyPrefix } from './settings'

/**
 * 获取 Token
 */
export function getToken() {
  return uni.getStorageSync(tokenKey)
}

/**
 * 设置 Token
 */
export function setToken(token) {
  return uni.setStorageSync(tokenKey, token)
}

/**
 * 移除 Token
 */
export function removeToken() {
  return uni.removeStorageSync(tokenKey)
}

/**
 * 获取 Cookie（H5 平台使用 document.cookie，其他平台使用存储）
 */
export function getCookie(key) {
  // #ifdef H5
  if (typeof document !== 'undefined') {
    const name = `${keyPrefix}${key}=`
    const cookies = document.cookie.split(';')
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim()
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length)
      }
    }
  }
  // #endif
  
  // 非 H5 平台使用存储
  return uni.getStorageSync(`${keyPrefix}${key}`)
}

/**
 * 设置 Cookie（H5 平台使用 document.cookie，其他平台使用存储）
 */
export function setCookie(key, value, expires = 30) {
  // #ifdef H5
  if (typeof document !== 'undefined') {
    const date = new Date()
    date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000)
    document.cookie = `${keyPrefix}${key}=${value};expires=${date.toUTCString()};path=/`
    return
  }
  // #endif
  
  // 非 H5 平台使用存储
  uni.setStorageSync(`${keyPrefix}${key}`, value)
}

/**
 * 移除 Cookie
 */
export function removeCookie(key) {
  // #ifdef H5
  if (typeof document !== 'undefined') {
    document.cookie = `${keyPrefix}${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
    return
  }
  // #endif
  
  // 非 H5 平台使用存储
  uni.removeStorageSync(`${keyPrefix}${key}`)
}
