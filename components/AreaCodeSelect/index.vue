<template>
  <div class="container">
    <p class="title">选择国家 / 地区</p>
    <div style="padding: 0 20px;margin-bottom: 26px;">
      <CustomSearch :search="search" @input-search="input" />
    </div>
  
    <div class="code_container">
      <div class="code_item" v-for="area in list" :key="area.id" @click="onHandleCodeItemClick(area)">
        <div class="item_right">{{ area.name}}</div>
        <div class="item_left">{{ area.code }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  getProjectCodeApi,
} from "@/api/user.js"
import { onMounted } from "vue"
const props = defineProps({
  onHandleCodeItem: { type: Function },
})
const search = ref('')
const allList = ref([])
const list = ref([])
const getCode = async () => {
  try {
    const { data } = await getProjectCodeApi({ code: "" })
    allList.value = Array.isArray(data) ? data : []
    list.value = allList.value
  } catch (error) { }
}
const emits = defineEmits(["close-popup"])
const onHandleCodeItemClick = (codeItem) => {
  if (typeof props.onHandleCodeItem === 'function') {
    props.onHandleCodeItem(codeItem)
  }
  emits('close-popup')
}
const input = (val) => {
  const keyword = String(val ?? "").trim().toLowerCase()
  if (!keyword) {
    list.value = allList.value
    return
  }
  list.value = allList.value.filter((item) => {
    const name = String(item.name ?? "").toLowerCase()
    const code = String(item.code ?? "")
    return name.includes(keyword) || code.replace(/^\+/, "").includes(keyword.replace(/^\+/, ""))
  })
}
onMounted(async () => {
  await getCode()
})
defineOptions({ name: "AreaCodeSelect" })
</script>

<style lang="scss" scoped>
.container {
  --title-height: 10px;
  height: 100%;

  .title {
    text-align: center;
    margin-bottom: 24px;
    height: var(--title-height);
  }

  .code_container {
    height: calc(100% - var(--van-search-height) - var(--title-height));
    overflow-y: scroll;
  }

  .code_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-top: 1px solid #000;
  }

  .code_item:last-child {
    border-bottom: 1px solid #000;
  }
}
</style>