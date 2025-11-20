<!-- filepath: src/components/tabbar/index.vue -->
<template>
  <van-tabbar v-model="active" :placeholder="true" :route="true" fixed>
    <van-tabbar-item
      replace
      v-for="(item, index) in tabbarData"
      :key="index"
      :to="item.to"
      :style="{ position: item.large ? 'relative' : 'none' }"
    >
      <template #icon="props">
        <img
          v-if="!item.large"
          :src="props.active ? item.activeIcon : item.icon"
          class="tabbar-icon"
        />
      </template>
      <div v-if="item.large" class="large-tabbar-item" @click="onRepair">
        <img :src="getLargeIcon(item)" class="large-icon" />
        <p class="xiuche">修车</p>
      </div>
      <p v-else>{{ item.title }}</p>
    </van-tabbar-item>
    <van-action-sheet v-model:show="showRepair" title="">
      <div class="repair-content">
        <div class="repair-item-block">
          <div
            class="repair-item"
            v-for="btn in btnList"
            :key="btn.value"
            @click="onHandle(btn.value)"
          >
            {{ btn.label }}
          </div>
        </div>
      </div>
    </van-action-sheet>
    <van-overlay :show="show">
      <TakePicture
        @closePicture="show = false"
        :show="show"
        @pictureResult="handlePictureResult"
      />
    </van-overlay>
  </van-tabbar>
  <van-dialog
    v-model:show="showDialog"
    :show-cancel-button="false"
    :show-confirm-button="false"
    close-on-click-overlay
    title="识别结果"
  >
    <div style="text-align: center; padding: 10px">
      <!-- <input type="text" v-model="editText" id="editText" /> -->
      <van-field v-model="editText" placeholder="请校对您扫描的vin码" />
      <div
        @click="handleConfirm"
        style="
          padding: 4px 30px;
          text-align: center;
          background-color: #ffa360;
          display: inline-block;
          border-radius: 20px;
          color: #fff;
          margin-top: 20px;
        "
      >
        确认
      </div>
    </div>
  </van-dialog>
</template>

<script setup>
import TakePicture from "@/components/TakePicture/index.vue"
import { sendimgOcrApi } from "@/api/ocr"
import RequestLoading from "@/utils/RequestLoading"
import starIcon from "@/assets/images/Vector1.png"
import starIconActive from "@/assets/images/Vector.png"
import archiveIcon from "@/assets/images/archive1.png"
import archiveIconActive from "@/assets/images/archive.png"
import xiucheIcon from "@/assets/images/xiuche1.png"
import xiucheIconActive from "@/assets/images/xiuche.png"
import xiuchequanIcon from "@/assets/images/xiuchequan1.png"
import xiuchequanIconActive from "@/assets/images/xiuchequan.png"
import recordLogIcon from "@/assets/images/recordLog1.png"
import recordLogIconActive from "@/assets/images/recordLog.png"
import { getVehicleModel } from "@/api/chat"
import { useLogStore } from "@/store/modules/log"
const logStore = useLogStore()
const showDialog = ref(false)
const editText = ref("")
const router = useRouter()
const show = ref(false)
const showRepair = ref(false)
const emit = defineEmits(["close-popup"])
const btnList = [
  { value: "recognize", label: "扫车架号" },
  { value: "recognize", label: "扫故障码" },
  { value: "chat", label: "直接提问" },
]
const onHandle = (name) => {
  showRepair.value = false
  if (name === "recognize") {
    return (show.value = true)
  } else {
    router.push({ name })
  }
}
// 使用takePicture组件的拍照返回结果
const handlePictureResult = async (result) => {
  const formData = new FormData()
  formData.append("file", result)
  const res = await RequestLoading(sendimgOcrApi, formData)
  if (res.code === 200) {
    showDialog.value = true
    // 将扫描结果赋值给文本框
    editText.value = res.data.full_text || "" // 兼容可能的空值
  }
}
const active = ref(0)
const tabbarData = reactive([
  {
    icon: starIcon,
    activeIcon: starIconActive,
    // title: computed(() => t("home.tabbar.home")),
    title: "看收藏",
    to: { name: "collection" },
  },
  {
    icon: archiveIcon,
    activeIcon: archiveIconActive,
    title: "档案馆",
    to: { name: "archives" },
  },
  {
    icon: xiucheIcon,
    activeIcon: xiucheIconActive,
    title: "修车",
    large: true,
  },
  {
    icon: xiuchequanIcon,
    activeIcon: xiuchequanIconActive,
    title: "修车圈",
    to: { name: "circle" },
  },
  {
    icon: recordLogIcon,
    activeIcon: recordLogIconActive,
    title: "记日志",
    to: { name: "log" },
  },
])

// 判断大图标是否激活（修车按钮）
const getLargeIcon = (item) => {
  // 修车按钮没有路由，所以总是显示未激活状态
  return item.icon
}

const onRepair = () => {
  showRepair.value = true
}

const handleConfirm = async () => {
  // 获取文本框中的内容（通过v-model绑定的editText）
  console.log("确认按钮被点击，文本内容：", editText.value)
  const { data, code } = await RequestLoading(getVehicleModel, editText.value)
  console.log(code)
  if (code == "200") {
    logStore.setLogs({
      vehicleModelYear: data.style,
      carSeries: data.carName,
      carBrand: data.brandName,
    })
    router.push({
      name: "chat",
      query: {
        mode: "vin",
        vinCode: editText.value, // 键为参数名，值为 editText.value
      },
    })

    // 关闭弹窗（可选，根据需求决定是否自动关闭）
    showDialog.value = false
  }
}
</script>
<style lang="scss" scoped>
@keyframes van-tabbar-item-active {
  20% {
    transform: scale(0.8);
  }

  100% {
    transform: scale(1);
  }
}

:deep(.van-tabbar) {
  .van-tabbar-item--active {
    .van-icon {
      animation: van-tabbar-item-active 0.3s ease-in-out;
    }
  }

  .tabbar-icon {
    width: 22px;
    height: 22px;
    object-fit: contain;
  }

  .large-tabbar-item {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    border: 3px solid black;
    z-index: 1;
    background: #2f323e;
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translate(-50%, 0px);
    text-align: center;
    line-height: 70px;
    .large-icon {
      width: 26px;
      height: 26px;
      object-fit: contain;
      margin-left: 20px;
      margin-top: 10px;
    }
  }
}
.repair-content {
  padding: 40px 40px 0px 40px;
  text-align: center;

  .repair-item-block {
    padding: 40px;

    .repair-item {
      height: 50px;
      width: 100%;
      margin-bottom: 30px;
      background: #d9d9d9;
      line-height: 50px;
      color: #000;
      font-weight: 400;
    }
  }
}
#editText {
  width: 100%;
  padding: 20px;
}

.van-tabbar-item {
  background-color: #222429;
  color: #fff;
}
// .van-tabbar-item--active{
//   background-color: #fff;
//   color: #000;
// }
.xiuche {
  // margin-top: -20px;
  line-height: 23px;
}
</style>
