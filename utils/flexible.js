// 自定义的 flexible 脚本，限制最大和最小字体大小
(function flexible(window, document) {
  var docEl = document.documentElement
  var dpr = window.devicePixelRatio || 1

  // 设置body字体大小
  function setBodyFontSize() {
    if (document.body) {
      document.body.style.fontSize = 12 * dpr + 'px'
    } else {
      document.addEventListener('DOMContentLoaded', setBodyFontSize)
    }
  }
  setBodyFontSize()

  // 设置rem基准值
  function setRemUnit() {
    var width = docEl.clientWidth

    // 限制最小宽度为320px，最大宽度为414px（iPhone Plus尺寸）
    if (width < 320) {
      width = 320
    }
    if (width > 414) {
      width = 414  // 不超过iPhone Plus尺寸
    }

    // 375px 为设计稿基准，375/10 = 37.5
    var rem = width / 10

    // 限制 rem 的最小和最大值
    // 最小：32px (对应320px屏幕)
    // 最大：41.4px (对应414px屏幕，iPhone Plus)
    if (rem < 32) {
      rem = 32
    }
    if (rem > 41.4) {
      rem = 41.4  // 严格限制最大值
    }

    docEl.style.fontSize = rem + 'px'
  }

  setRemUnit()

  // 窗口大小改变或旋转时重新计算
  window.addEventListener('resize', setRemUnit)
  window.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      setRemUnit()
    }
  })

  // 检测 0.5px 支持
  if (dpr >= 2) {
    var fakeBody = document.createElement('body')
    var testElement = document.createElement('div')
    testElement.style.border = '.5px solid transparent'
    fakeBody.appendChild(testElement)
    docEl.appendChild(fakeBody)
    if (testElement.offsetHeight === 1) {
      docEl.classList.add('hairlines')
    }
    docEl.removeChild(fakeBody)
  }
})(window, document)