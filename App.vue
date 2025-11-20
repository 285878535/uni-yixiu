<script>
import { getToken } from '@/utils/auth'
import { whiteList, pageDefaultTitle } from '@/utils/settings'
import * as NProgress from '@/utils/progress'
import { getPageTitle } from '@/utils/router'

export default {
	onLaunch: function() {
		console.log('App Launch')
		// 设置路由拦截器
		this.setupRouterInterceptor()
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	},
	methods: {
		setupRouterInterceptor() {
			const self = this
			
			// 拦截页面跳转
			uni.addInterceptor('navigateTo', {
				invoke(args) {
					// 开始加载
					NProgress.start()
					
					// 检查是否需要登录
					const needLogin = self.checkNeedLogin(args.url)
					if (needLogin) {
						// 需要登录但未登录，跳转到登录页
						uni.reLaunch({
							url: '/pages/login/index'
						})
						return false
					}
					
					// 设置页面标题
					self.setPageTitle(args.url)
					
					return true
				},
				success() {
					// 跳转成功
					NProgress.done()
				},
				fail() {
					// 跳转失败
					NProgress.done()
				}
			})
			
			// 拦截重定向
			uni.addInterceptor('redirectTo', {
				invoke(args) {
					NProgress.start()
					const needLogin = self.checkNeedLogin(args.url)
					if (needLogin) {
						uni.reLaunch({
							url: '/pages/login/index'
						})
						return false
					}
					self.setPageTitle(args.url)
					return true
				},
				success() {
					NProgress.done()
				},
				fail() {
					NProgress.done()
				}
			})
			
			// 拦截切换 Tab
			uni.addInterceptor('switchTab', {
				invoke(args) {
					NProgress.start()
					const needLogin = self.checkNeedLogin(args.url)
					if (needLogin) {
						uni.reLaunch({
							url: '/pages/login/index'
						})
						return false
					}
					return true
				},
				success() {
					NProgress.done()
				},
				fail() {
					NProgress.done()
				}
			})
			
			// 拦截重新启动
			uni.addInterceptor('reLaunch', {
				invoke(args) {
					NProgress.start()
					const needLogin = self.checkNeedLogin(args.url)
					if (needLogin) {
						args.url = '/pages/login/index'
					}
					self.setPageTitle(args.url)
					return true
				},
				success() {
					NProgress.done()
				},
				fail() {
					NProgress.done()
				}
			})
		},
		
		/**
		 * 检查是否需要登录
		 */
		checkNeedLogin(url) {
			// 移除查询参数
			const path = url.split('?')[0]
			
			// 如果在白名单中，不需要登录
			if (whiteList.includes(path)) {
				return false
			}
			
			// 如果已登录，不需要再次登录
			if (getToken()) {
				// 如果已登录但访问登录页，重定向到首页
				if (path === '/pages/login/index') {
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/archives/index'
						})
					}, 100)
					return false
				}
				return false
			}
			
			// 未登录且不在白名单中，需要登录
			return true
		},
		
		/**
		 * 设置页面标题
		 */
		setPageTitle(url) {
			const title = getPageTitle(url)
			
			// 设置导航栏标题
			uni.setNavigationBarTitle({
				title: title
			})
		}
	}
}
</script>

<style lang="scss">
/* 每个页面公共css */
/* 全局样式已在 main.js 中引入 */
</style>
