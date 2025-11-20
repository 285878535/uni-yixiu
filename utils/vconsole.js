/**
 * VConsole 初始化工具
 * 仅在开发环境的 H5 平台启用
 */
export function initVConsole() {
  // #ifdef H5
  // 仅在开发环境启用
  if (import.meta.env.MODE === 'development' && import.meta.env.VITE_ENABLE_VCONSOLE === 'true') {
    import('vconsole').then((VConsole) => {
      if (typeof window !== 'undefined' && !window.VConsole) {
        new VConsole.default()
      }
    }).catch(() => {
      console.warn('VConsole 加载失败')
    })
  }
  // #endif
}

