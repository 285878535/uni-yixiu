/**
 * 带加载提示的请求封装
 */
import request from './request'

/**
 * 请求加载工具
 * @param {Function} apiFn - API 函数
 * @param {Object} params - 请求参数
 * @param {Object} options - 额外选项
 */
export default async function RequestLoading(apiFn, params = {}, options = {}) {
  try {
    const result = await apiFn({
      ...params,
      loading: options.loading !== false,
      loadingText: options.loadingText || '加载中...',
      ...options
    })
    return result
  } catch (error) {
    // 错误已在 request.js 中处理，这里直接抛出
    throw error
  }
}

