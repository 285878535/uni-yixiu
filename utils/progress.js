/**
 * 页面加载进度条工具
 * 使用 uni-app 的加载 API 替代 nprogress
 */
let loadingCount = 0

/**
 * 开始加载
 */
export function start() {
  if (loadingCount === 0) {
    uni.showLoading({
      title: '加载中...',
      mask: true
    })
  }
  loadingCount++
}

/**
 * 结束加载
 */
export function done() {
  loadingCount--
  if (loadingCount <= 0) {
    uni.hideLoading()
    loadingCount = 0 // 重置，确保不会变成负数
  }
}

// 导出默认对象，兼容原有代码
export default {
  start,
  done
}
