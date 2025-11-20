<template>
  <view class="china-area-select">
    <picker
      mode="multiSelector"
      :value="pickerValue"
      :range="pickerRange"
      :range-key="'text'"
      @change="onPickerChange"
      @columnchange="onColumnChange"
    >
      <view class="picker-trigger">选择省市</view>
    </picker>
  </view>
</template>

<script setup>
// 使用 uni-app 的 picker 组件替代 vant 的 area 组件
import { ref, computed } from "vue"

const props = defineProps({
  model: { type: Object, default: () => ({}) },
  prop: { type: String, default: "" },
  onChange: { type: Function },
})

const emits = defineEmits(["close-popup"])

// 简化的省市数据（实际项目中应该从服务器获取或使用完整数据）
const provinceList = ref([
  { text: '北京', value: '110000' },
  { text: '上海', value: '310000' },
  { text: '广东', value: '440000' },
  { text: '浙江', value: '330000' },
  // 可以添加更多省市数据
])

const cityList = ref([
  // 北京
  { text: '北京市', value: '110100' },
  // 上海
  { text: '上海市', value: '310100' },
  // 广东
  { text: '广州市', value: '440100' },
  { text: '深圳市', value: '440300' },
  // 浙江
  { text: '杭州市', value: '330100' },
  { text: '宁波市', value: '330200' },
])

const pickerValue = ref([0, 0])
const pickerRange = computed(() => [provinceList.value, cityList.value])

const onPickerChange = (e) => {
  const [provinceIndex, cityIndex] = e.detail.value
  const province = provinceList.value[provinceIndex]
  const city = cityList.value[cityIndex]
  
  if (province && city) {
    const names = [province.text, city.text]
    const codes = [province.value, city.value]
    const text = names.join(" ")
    
    if (typeof props.onChange === "function") {
      props.onChange({ text, codes, names })
    }
    emits("close-popup")
  }
}

const onColumnChange = (e) => {
  // 当选择省份时，可以更新城市列表
  // 这里简化处理，实际应该根据省份动态加载城市
}

defineOptions({ name: "ChinaAreaSelect" })
</script>

<style scoped>
.china-area-select {
  width: 100%;
}

.picker-trigger {
  padding: 20px;
  text-align: center;
  color: #333;
}
</style>
