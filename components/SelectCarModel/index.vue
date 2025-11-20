<template>
  <div>
    <div class="header">选中车型</div>
    <div class="conditions_container">
      <div
        class="conditions_item"
        :class="{ is_active: currentSteps === 'carBrand' }"
        @click="onHandleSteps('carBrand')"
      >
        {{ logStore.logData.carBrand || "品牌" }}
      </div>
      <div
        class="conditions_item"
        :class="{ is_active: currentSteps === 'carSeries' }"
        @click="onHandleSteps('carSeries')"
      >
        {{ logStore.logData.carSeries || "车系" }}
      </div>
      <div
        class="conditions_item"
        :class="{ is_active: currentSteps === 'vehicleModelYear' }"
        @click="onHandleSteps('vehicleModelYear')"
      >
        {{ logStore.logData.vehicleModelYear || "车型年款" }}
      </div>
    </div>
    <div style="padding: 0 20px">
      <CustomSearch v-model="search" @input-search="onSearch" />
    </div>

    <div class="car_list">
      <div
        class="car_item"
        :class="{ car_active: logStore.logData[currentSteps] == car.value }"
        v-for="car in filteredList"
        :key="car.id"
        @click="onHanleNode(car)"
      >
        {{ car.value }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from "vue"
import { getCarModelApi } from "@/api/chat"
import { useLogStore } from "@/store/modules/log"

const emit = defineEmits(["close-popup"])
const { codes, setCodes } = useCarStore()
const search = ref("")

const list = ref({
  carBrand: [],
  carSeries: [],
  vehicleModelYear: [],
})
const currentSteps = ref("carBrand")
const getNextStep = (curStep) => {
  let nextStep
  if (curStep === "carBrand") {
    nextStep = "carSeries"
  } else if (curStep === "carSeries") {
    nextStep = "vehicleModelYear"
  } else if (curStep === "vehicleModelYear") {
    nextStep = null
  }
  return nextStep
}
const onHandleSteps = (step) => {
  currentSteps.value = step
}
// 本地搜索过滤函数
const filteredList = computed(() => {
  const currentData = list.value[currentSteps.value] || []
  const keyword = String(search.value ?? "")
    .trim()
    .toLowerCase()

  if (!keyword) {
    return currentData
  }

  return currentData.filter((item) => {
    const value = String(item.value ?? "").toLowerCase()
    return value.includes(keyword)
  })
})

// 搜索输入事件处理
const onSearch = (val) => {
  search.value = val
}

const onLoad = async () => {
  const {
    data: { children },
  } = await getCarModelApi()
  list.value.carBrand = children
}
const logStore = useLogStore()
const onHanleNode = (car) => {
  // 按步骤分别记录车型信息
  if (currentSteps.value === "carBrand") {
    logStore.setLogs({ carBrand: car.value })
  } else if (currentSteps.value === "carSeries") {
    logStore.setLogs({ carSeries: car.value })
  } else if (currentSteps.value === "vehicleModelYear") {
    logStore.setLogs({ vehicleModelYear: car.value })
  }
  const nextSteps = getNextStep(currentSteps.value)

  if (nextSteps) {
    currentSteps.value = nextSteps
    // 更新显示列表，如果搜索框有内容则应用过滤
    list.value[nextSteps] = car.children
    // 切换步骤时清空搜索
    search.value = ""
  } else {
    setCodes(car.data)
    emit("close-popup")
  }
}

onMounted(async () => {
  await onLoad()
})
defineOptions({ name: "SelectCarModel" })
</script>

<style lang="scss" scoped>
.header {
  text-align: center;
  padding: 20px 0;
  padding-top: 0;
  font-size: 16px;
}
.conditions_container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 0 20px;
  .is_active {
    border: 1px solid #f46205;
  }
  .conditions_item {
    background: #d9d9d9;
    width: 116px;
    height: 50px;
    text-align: center;
    line-height: 50px;
  }
}
.car_list {
  margin-top: 20px;
  .car_item {
    background: #d9d9d9;
    padding: 10px 20px;
  }
  .car_active {
    border: 1px solid #f46205;
  }
}
</style>
