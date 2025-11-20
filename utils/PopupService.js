import { createApp } from "vue"
import PopupWrapper from "@/components/PopupWrapper/index.vue"
const componentContainer = {}
//eager代表是否立即使用，如为false得到的则是一个函数，需要调用才会获得组件实例
const modules = import.meta.glob("/src/components/*/*.vue", { eager: true })
for (const key in modules) {
  if (Object.prototype.hasOwnProperty.call(modules, key)) {
    const element = modules[key]
    if (element.default.name) {
      componentContainer[element.default.name] = element.default
    }
  }
}

export default {
  open(options) {
    if (!options.component) {
      throw new Error(`组件${options.component}不存在`)
    }
    const container = document.createElement("div")
    document.body.appendChild(container)
    // 允许直接传入组件对象，或通过组件名查找
    if (typeof options.component === "string") {
      options.component = componentContainer[options.component]
    }
    const app = createApp(PopupWrapper, {
      options,
      onClosed: () => {
        app.unmount()
        container.remove()
        options.onClose?.()
      },
    })

    const instance = app.mount(container)
    instance.visible = true
    return {
      close: () => {
        instance.close()
      },
    }
  },
}
