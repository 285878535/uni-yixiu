/**
 * 路由工具
 * 统一管理页面跳转
 */

/**
 * 页面路径映射
 */
export const routeMap = {
	archives: '/pages/archives/index',
	collection: '/pages/collection/index',
	maintenance: '/pages/maintenance/index',
	circle: '/pages/circle/index',
	log: '/pages/log/index',
	chat: '/pages/chat/index',
	useredit: '/pages/useredit/index',
	editLog: '/pages/log/editLog',
	conversationHistory: '/pages/log/conversationHistory',
	alipay: '/pages/userEdit/alipay',
	paymentResult: '/pages/userEdit/paymentResult',
	collectionDetail: '/pages/collection/detail',
	login: '/pages/login/index',
	notFound: '/pages/404/index'
}

/**
 * 页面标题映射
 */
export const titleMap = {
	'/pages/archives/index': '档案馆',
	'/pages/collection/index': '看收藏',
	'/pages/maintenance/index': '修车',
	'/pages/circle/index': '修车圈',
	'/pages/log/index': '记日志',
	'/pages/chat/index': '提问',
	'/pages/useredit/index': '编辑信息',
	'/pages/log/editLog': '编辑日志',
	'/pages/log/conversationHistory': '对话历史',
	'/pages/userEdit/alipay': '支付',
	'/pages/userEdit/paymentResult': '支付结果',
	'/pages/collection/detail': '收藏详情',
	'/pages/login/index': '登录',
	'/pages/404/index': '访问页面不存在'
}

/**
 * 获取页面标题
 */
export function getPageTitle(path) {
	const cleanPath = path.split('?')[0]
	return titleMap[cleanPath] || '易修'
}

/**
 * 跳转到指定页面
 */
export function navigateTo(name, params = {}) {
	const url = routeMap[name]
	if (!url) {
		console.error(`路由 ${name} 不存在`)
		return
	}
	
	// 构建查询参数
	let queryString = ''
	if (Object.keys(params).length > 0) {
		queryString = '?' + Object.keys(params)
			.map(key => `${key}=${encodeURIComponent(params[key])}`)
			.join('&')
	}
	
	uni.navigateTo({
		url: url + queryString
	})
}

/**
 * 重定向到指定页面
 */
export function redirectTo(name, params = {}) {
	const url = routeMap[name]
	if (!url) {
		console.error(`路由 ${name} 不存在`)
		return
	}
	
	let queryString = ''
	if (Object.keys(params).length > 0) {
		queryString = '?' + Object.keys(params)
			.map(key => `${key}=${encodeURIComponent(params[key])}`)
			.join('&')
	}
	
	uni.redirectTo({
		url: url + queryString
	})
}

/**
 * 切换到 Tab 页面
 */
export function switchTab(name) {
	const url = routeMap[name]
	if (!url) {
		console.error(`路由 ${name} 不存在`)
		return
	}
	
	uni.switchTab({
		url: url
	})
}

/**
 * 重新启动到指定页面
 */
export function reLaunch(name, params = {}) {
	const url = routeMap[name]
	if (!url) {
		console.error(`路由 ${name} 不存在`)
		return
	}
	
	let queryString = ''
	if (Object.keys(params).length > 0) {
		queryString = '?' + Object.keys(params)
			.map(key => `${key}=${encodeURIComponent(params[key])}`)
			.join('&')
	}
	
	uni.reLaunch({
		url: url + queryString
	})
}

/**
 * 返回上一页
 */
export function navigateBack(delta = 1) {
	uni.navigateBack({
		delta: delta
	})
}

