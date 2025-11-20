/**
 * 页面加载进度条工具
 * uni-app 中可以使用 uni.showLoading 和 uni.hideLoading 来模拟进度条
 */

let loadingTimer = null

/**
 * 开始加载
 */
export function start() {
  // 清除之前的定时器
  if (loadingTimer) {
    clearTimeout(loadingTimer)
  }
  
  // 显示加载提示
  uni.showLoading({
    title: '加载中...',
    mask: true
  })
}

/**
 * 结束加载
 */
export function done() {
  // 延迟隐藏，避免闪烁
  loadingTimer = setTimeout(() => {
    uni.hideLoading()
    loadingTimer = null
  }, 100)
}

/**
 * 立即结束加载
 */
export function doneImmediate() {
  if (loadingTimer) {
    clearTimeout(loadingTimer)
    loadingTimer = null
  }
  uni.hideLoading()
}

