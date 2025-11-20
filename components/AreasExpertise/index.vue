<template>
  <div class="area_main">
    <div class="area_header">
      <p @click="emit('close-popup')">取消</p>
      <div>{{ title }}</div>
      <span @click="onHandleConfirm">确认</span>
    </div>
    <div class="area_container">
      <div
        class="area_item"
        :class="{ area_item_active: tag.isActive }"
        v-for="tag in columns"
        :key="tag.id"
        @click="onHandleTag(tag)"
      >
        {{ tag.text }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue"

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
const emit = defineEmits(["close-popup"])
defineOptions({ name: "AreasExpertise" })
const active = computed({
  get() {
    return props.model[props.prop]
  },
  set(val) {},
})
const onHandleTag = (tag) => {
  tag.isActive = !tag.isActive
  if (tag.isActive) return props.model[props.prop].push(tag.code)
  const index = props.model[props.prop].findIndex((item) => item === tag.code)
  props.model[props.prop].splice(index, 1)
}
const onHandleConfirm = () => {
  props.onChange(active.value)
  emit("close-popup")
}
onMounted(() => {
  props.columns.forEach((item) => {
    if (props.model[props.prop].includes(item.code)) {
      item.isActive = true
    }
  })
})
</script>

<style lang="scss" scoped>
.area_main {
  .area_header {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    align-items: center;

    div {
      color: #323233;
      font-size: 16px;
    }

    span {
      color: #1989fa;
    }

    p {
      color: #969799;
    }
  }

  .area_container {
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
    gap: 8px;

    .area_item {
      background: #eaeaea;
      border-radius: 10px;
      padding: 4px 8px;
      border: 1px solid transparent;
    }

    .area_item_active {
      border: 1px solid #f46205;
    }
  }
}
</style>
