/**
 * uni-app 请求封装
 */
import { getApiUrl } from '@/utils/api'
import { getToken } from '@/utils/auth'

/**
 * 请求方法
 */
export default function request(options) {
  return new Promise((resolve, reject) => {
    // 显示加载提示
    if (options.loading !== false) {
      uni.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
    }

    // 获取 token
    const token = getToken()
    
    // 构建请求头
    const header = {
      'Content-Type': options.contentType || 'application/json',
      ...options.header
    }
    
    if (token) {
      header['Authorization'] = `Bearer ${token}`
    }

    // 发起请求
    uni.request({
      url: options.url || getApiUrl(options.path || ''),
      method: options.method || 'GET',
      data: options.data || {},
      header: header,
      timeout: options.timeout || 10000,
      success: (res) => {
        // 隐藏加载提示
        if (options.loading !== false) {
          uni.hideLoading()
        }

        // 处理响应
        if (res.statusCode === 200) {
          // 根据实际后端返回结构处理
          // 假设后端返回格式为 { code: 200, data: {}, message: '' } 或直接返回数据
          // 如果返回结构包含 code，则检查 code
          if (res.data.code !== undefined) {
            if (res.data.code === 200 || res.data.success) {
              resolve(res.data.data || res.data)
            } else {
              // 业务错误
              const errorMsg = res.data.message || res.data.msg || '请求失败'
              uni.showToast({
                title: errorMsg,
                icon: 'none',
                duration: 2000
              })
              reject(new Error(errorMsg))
            }
          } else {
            // 直接返回数据（没有 code 字段）
            resolve(res.data)
          }
        } else if (res.statusCode === 401) {
          // 未授权，跳转到登录页
          uni.reLaunch({
            url: '/pages/login/index'
          })
          reject(new Error('未授权，请重新登录'))
        } else {
          // HTTP 错误
          uni.showToast({
            title: `请求失败：${res.statusCode}`,
            icon: 'none'
          })
          reject(new Error(`HTTP Error: ${res.statusCode}`))
        }
      },
      fail: (err) => {
        // 隐藏加载提示
        if (options.loading !== false) {
          uni.hideLoading()
        }

        // 网络错误
        uni.showToast({
          title: '网络错误，请检查网络连接',
          icon: 'none',
          duration: 2000
        })
        reject(err)
      }
    })
  })
}
