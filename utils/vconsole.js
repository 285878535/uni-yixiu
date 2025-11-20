/**
 * VConsole 调试工具
 * 仅在开发环境启用
 */

const ENABLE_VCONSOLE = import.meta.env.VITE_ENABLE_VCONSOLE === 'true' || import.meta.env.VITE_ENABLE_VCONSOLE === true

/**
 * 初始化 VConsole
 */
export function initVConsole() {
  // 仅在开发环境且启用时加载
  if (import.meta.env.MODE === 'development' && ENABLE_VCONSOLE) {
    // #ifdef H5
    // H5 平台动态加载 vconsole
    import('vconsole').then((module) => {
      const VConsole = module.default || module
      new VConsole()
      console.log('VConsole 已启用')
    }).catch((err) => {
      console.warn('VConsole 加载失败:', err)
    })
    // #endif
    
    // #ifndef H5
    // 小程序和 App 平台使用条件编译
    // 如果需要在小程序中使用，需要安装 @dcloudio/vconsole
    // #endif
  }
}

