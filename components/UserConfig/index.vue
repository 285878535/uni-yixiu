<template>
  <van-picker
    :title="title"
    :columns="columns"
    @confirm="onConfirm"
    @cancel="onCancel"
    @change="onPickerChange"
    v-model="currentValue"
  />
</template>

<script setup>
import { ref, onMounted } from "vue"
const props = defineProps({
  columns: {
    type: Array,
    default: () => [],
  },
  model: { type: Object, default: () => ({}) },
  prop: { type: String, default: "" },
  title: {
    type: String,
    default: "标题",
  },
  onChange: { type: Function },
})
const emits = defineEmits(["close-popup"])
const currentValue = ref([])

onMounted(() => {
  const initial = [props?.model?.[props.prop]]
  if (initial !== undefined && initial !== null) {
    currentValue.value = initial
  } else if (props.columns && props.columns.length) {
    currentValue.value = props.columns[0]?.value ?? props.columns[0]
  }
})

const onConfirm = (row) => {
  if (typeof props.onChange === "function") {
    props.onChange(row.selectedOptions)
  }
  emits("close-popup")
}
const onPickerChange = () => {}
const onCancel = () => emits("close-popup")
defineOptions({ name: "UserConfig" })
</script>

<style scoped></style>
