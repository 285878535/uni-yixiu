/**
 * uni-app 请求封装
 * 使用 uni.request 替代 axios
 */
import { getToken, removeToken } from "./auth"
import { reLaunch } from "./router"
import { useUserStore } from "@/store/modules/user"

// 获取完整 API URL
function getFullUrl(url) {
  const baseURL = import.meta.env.VITE_BASE_API || '/kx_war'
  const server = import.meta.env.VITE_SERVER || ''
  
  // 如果 url 已经是完整 URL，直接返回
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // 如果是 H5 平台，使用 baseURL
  // #ifdef H5
  return baseURL + url
  // #endif
  
  // 非 H5 平台，使用完整服务器地址
  // #ifndef H5
  return server + baseURL + url
  // #endif
}

/**
 * uni-app 请求封装
 */
export default function request(options) {
  return new Promise((resolve, reject) => {
    const {
      url,
      method = 'GET',
      data = {},
      params = {},
      headers = {},
      loading = false,
      timeout = 50000
    } = options

    // 合并 URL 参数
    let fullUrl = getFullUrl(url)
    if (method.toUpperCase() === 'GET' && Object.keys(params).length > 0) {
      const query = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')
      fullUrl += (fullUrl.includes('?') ? '&' : '?') + query
    }

    // 获取 token
    const token = getToken()
    
    // 设置请求头
    const requestHeaders = {
      'Content-Type': 'application/json;charset=utf-8',
      ...headers
    }
    
    // 添加 token
    if (token) {
      requestHeaders['Authorization'] = token || 'Bearer app-rEIvTTyhwhX8FBEiJy8AboRO'
    }
    
    // FormData 处理（H5 平台）
    // #ifdef H5
    if (data instanceof FormData) {
      delete requestHeaders['Content-Type']
    }
    // #endif

    // 显示加载提示
    if (loading) {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })
    }

    // 发起请求
    uni.request({
      url: fullUrl,
      method: method.toUpperCase(),
      data: method.toUpperCase() === 'GET' ? {} : data,
      header: requestHeaders,
      timeout,
      success: (res) => {
        if (loading) {
          uni.hideLoading()
        }

        // HTTP 状态码检查
        if (res.statusCode !== 200) {
          let message = '请求失败'
          if (res.statusCode === 401) {
            message = '未授权，请重新登录'
            handle401()
          } else if (res.statusCode === 404) {
            message = '接口不存在'
          } else if (res.statusCode >= 500) {
            message = '服务器错误'
          }
          
          uni.showToast({
            title: message,
            icon: 'none'
          })
          reject(new Error(message))
          return
        }

        // 业务状态码检查
        const { code, msg, data: responseData } = res.data || {}
        const businessCode = code || res.statusCode

        if (businessCode === 401) {
          handle401()
          reject(new Error(msg || '未授权，请重新登录'))
          return
        }

        if (businessCode !== 200) {
          uni.showToast({
            title: msg || '请求失败',
            icon: 'none'
          })
          reject(res.data)
          return
        }

        resolve(res.data)
      },
      fail: (err) => {
        if (loading) {
          uni.hideLoading()
        }

        let message = '网络请求失败'
        if (err.errMsg) {
          if (err.errMsg.includes('timeout')) {
            message = '请求超时'
          } else if (err.errMsg.includes('fail')) {
            message = '网络连接失败'
          }
        }

        uni.showToast({
          title: message,
          icon: 'none'
        })

        reject(err)
      }
    })
  })
}

/**
 * 处理 401 未授权
 */
function handle401() {
  const userStore = useUserStore()
  userStore.logout()
  removeToken()
  
  // 跳转到登录页
  reLaunch('/pages/login/index')
}
