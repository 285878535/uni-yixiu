/**
 * 弹窗服务（uni-app 版本）
 */
class PopupService {
  /**
   * 打开弹窗
   * @param {Object} options - 弹窗配置
   */
  static open(options) {
    const { component, props = {}, style = {} } = options

    // 根据组件类型打开不同的弹窗
    switch (component) {
      case 'AreaCodeSelect':
        // 打开区号选择弹窗
        this.openAreaCodeSelect(props)
        break
      case 'Protocol':
      case 'Conditions':
        // 打开协议弹窗
        this.openProtocolPopup(component === 'Protocol' ? '用户协议' : '数据隐私安全声明')
        break
      default:
        console.warn(`未知的弹窗组件: ${component}`)
    }
  }

  /**
   * 打开区号选择弹窗
   */
  static openAreaCodeSelect(props) {
    // 这里可以使用 uni.showActionSheet 或自定义弹窗组件
    // 暂时使用简单的选择器
    const areaCodes = [
      { code: '86', name: '中国' },
      { code: '1', name: '美国' },
      { code: '852', name: '香港' },
      { code: '853', name: '澳门' },
      { code: '886', name: '台湾' },
    ]

    const items = areaCodes.map(item => `+${item.code} ${item.name}`)

    uni.showActionSheet({
      itemList: items,
      success: (res) => {
        const selected = areaCodes[res.tapIndex]
        if (props.onHandleCodeItem) {
          props.onHandleCodeItem(selected)
        }
      }
    })
  }

  /**
   * 打开协议弹窗
   */
  static openProtocolPopup(title) {
    // 使用 uni.showModal 显示协议内容
    // 或者可以跳转到协议页面
    uni.showModal({
      title: title,
      content: '这里是协议内容...',
      showCancel: false,
      confirmText: '我知道了'
    })
  }
}

export default PopupService

