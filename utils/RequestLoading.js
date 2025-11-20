/**
 * 请求加载工具
 * 使用 uni.showLoading 替代 vant 的 showLoadingToast
 */
export default function RequestLoading(request, ...args) {
  return new Promise(async (resolve, reject) => {
    try {
      uni.showLoading({
        title: "加载中...",
        mask: true
      })
      const res = await request(...args)
      uni.hideLoading()
      resolve(res)
    } catch (error) {
      uni.hideLoading()
      reject(error)
    }
  })
}
