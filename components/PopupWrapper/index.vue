<template>
  <view
    v-if="visible"
    class="popup-mask"
    @click="handleMaskClick"
  >
    <view
      class="popup-content"
      :class="[`popup-${options.position || 'bottom'}`]"
      :style="popupStyle"
      @click.stop
    >
      <component
        :is="options.component"
        @close-popup="close"
        v-bind="options.props"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from "vue"

const props = defineProps({
  options: { type: Object, required: true },
  onClosed: { type: Function, required: true },
})

const visible = ref(false)

const styleOptions = {
  height: "80%",
  width: "100%",
  borderRadius: "18px 18px 0 0",
  padding: "20px",
}

const popupStyle = computed(() => {
  if (props.options.style) {
    return Object.assign({}, styleOptions, props.options.style)
  }
  return styleOptions
})

function close() {
  visible.value = false
  props.onClosed?.()
}

function handleMaskClick() {
  if (props.options.closeOnOverlay !== false) {
    close()
  }
}

const handleOpened = () => {
  props.options.onOpened?.()
}

const handleClosed = () => {
  props.onClosed?.()
}

// 暴露方法供外部调用
defineExpose({ 
  close, 
  open: () => {
    visible.value = true
    handleOpened()
  },
  visible 
})
</script>

<style scoped>
.popup-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.popup-content {
  background: #fff;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
}

.popup-bottom {
  border-radius: 18px 18px 0 0;
}

.popup-center {
  align-self: center;
  border-radius: 18px;
  max-width: 90%;
}

.popup-top {
  align-self: flex-start;
  border-radius: 0 0 18px 18px;
}
</style>
