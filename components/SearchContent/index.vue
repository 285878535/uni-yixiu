<template>
  <CustomSearch v-model="search" @search="onLoad" />
  <div class="container">
    <Content
      v-for="item in treeData"
      :item="item"
      :key="item.index"
      :level="1"
      @onHadleClick="handleNodeClick"
    ></Content>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { getChatDirectory } from "@/api/chat"
import PopupService from "@/utils/PopupService"
import RequestLoading from "@/utils/RequestLoading"
import { useCarStore } from "@/store/modules/car"
const { codes } = useCarStore()
const setHighlight = (list) => {
  return list.map((item, index) => {
    if (item.children.length > 0) {
      item.children = setHighlight(item.children)
      return {
        ...item,
        index,
      }
    } else {
      if (item.value.includes(search.value)) {
        return {
          ...item,
          index,
          value: item.value.replace(
            search.value,
            `<span class="key-document">${search.value}</span>`
          ),
        }
      }
    }
  })
}
const treeData = ref([])
const search = ref("发动机")
const onLoad = async () => {
  const {
    data: { data: result },
  } = await RequestLoading(getChatDirectory, {
    //手册ID和电路图ID放source里边
    source_id: codes.manual_id,
    query: search.value,
  })
  treeData.value = setHighlight(result)
}
function handleNodeClick(node) {
  const id = node.id.replace("c_", "")
  if (node.children.length) return
  PopupService.open({
    component: "DocumentContent",
    props: {
      id,
    },
  })
}
onMounted(() => {
  onLoad()
})
defineOptions({
  name: "SearchContent",
})
</script>

<style scoped lang="scss">
.container {
  padding-bottom: 20px;
  height: calc(100% - var(--van-search-height));
  overflow-y: auto;
}

:deep(.key-document) {
  color: #eb9002;
  font-weight: 600;
}
</style>
