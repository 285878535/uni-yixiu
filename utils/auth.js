/**
 * Token 管理工具
 */

const TOKEN_KEY = 'token'

/**
 * 获取 token
 */
export function getToken() {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

/**
 * 设置 token
 */
export function setToken(token) {
  return uni.setStorageSync(TOKEN_KEY, token)
}

/**
 * 移除 token
 */
export function removeToken() {
  return uni.removeStorageSync(TOKEN_KEY)
}

