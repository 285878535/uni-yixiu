<template>
  <div ref="wrapperRefRef">
    <!-- 视频或拍照预览 -->
    <div v-if="imgUrl">
      <img :src="imgUrl" class="take-picture" alt="拍照预览" />
    </div>
    <video
      v-else
      ref="videoRef"
      class="take-picture"
      autoplay
      playsinline
      muted
    ></video>

    <!-- 底部操作栏 -->
    <div class="wrapper_btm">
      <input
        type="file"
        accept="image/*"
        ref="galleryRef"
        @change="handleFileChange"
        style="display: none"
      />

      <!-- 已拍照状态 -->
      <template v-if="imgUrl">
        <span class="btn-text" @click="closePicture">取消</span>
        <button class="take-picture-btn" @click="refreshPicture">返回</button>
        <span class="btn-text" @click="submitResult">确定</span>
      </template>

      <!-- 拍照状态 -->
      <template v-else>
        <span class="btn-text" @click="openGallery">相册</span>
        <button class="take-picture-btn" @click="handleShoot">拍照</button>
        <span class="btn-text" @click="closePicture">关闭</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits, defineProps, watch } from "vue"
// 移除 vant 依赖，使用 uni-app API
import { compressImage } from "@/utils/compressImage"

const emit = defineEmits(["closePicture", "pictureResult"])

const videoRef = ref<HTMLVideoElement | null>(null)
const galleryRef = ref<HTMLInputElement | null>(null)
const imgUrl = ref("")
const imgResult = ref<File | null>(null)

const props = defineProps({
  show: { type: Boolean, required: true, default: false },
})

// 获取摄像头
const getMediaStream = async (
  facingMode: "environment" | "user" = "environment"
) => {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    uni.showToast({ title: "浏览器不支持摄像头访问", icon: 'none' })
    return
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode,
        width: { ideal: 1920, min: 1280 },
        height: { ideal: 1080, min: 720 },
      },
      audio: false,
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      await new Promise<void>((resolve) => {
        videoRef.value!.onloadedmetadata = () => resolve()
      })
      await videoRef.value.play().catch(() => {
        uni.showToast({ title: "视频播放失败，请检查权限", icon: 'none' })
      })
    }
  } catch (err: any) {
    console.error("摄像头打开失败", err)
    uni.showToast({
      title: "无法打开摄像头，请确保页面使用 HTTPS 或允许摄像头权限",
      icon: 'none'
    })
  }
}

// 拍照
const handleShoot = async () => {
  if (!videoRef.value) return

  // 确保元数据就绪，避免回退到低分辨率
  if (videoRef.value.readyState < 2) {
    await new Promise<void>((resolve) => {
      videoRef.value!.onloadedmetadata = () => resolve()
    })
  }

  // 优先使用高分辨率静态拍照（如果支持）
  const stream = videoRef.value.srcObject as MediaStream | null
  const track = stream?.getVideoTracks()[0]
  if (track && (window as any).ImageCapture) {
    try {
      const ic = new (window as any).ImageCapture(track)
      const blob: Blob = await ic.takePhoto()
      const file = new File([blob], "takePicture.jpg", { type: blob.type || "image/jpeg" })
      imgResult.value = file
      imgUrl.value = URL.createObjectURL(blob)
      return
    } catch (e) {
      // 回退到 canvas 截帧
    }
  }

  const vw = videoRef.value.videoWidth
  const vh = videoRef.value.videoHeight
  if (!vw || !vh) return

  const dpr = window.devicePixelRatio || 1
  const canvas = document.createElement("canvas")
  canvas.width = Math.round(vw * dpr)
  canvas.height = Math.round(vh * dpr)
  const ctx = canvas.getContext("2d")!
  ctx.scale(dpr, dpr)
  ctx.drawImage(videoRef.value, 0, 0, vw, vh)

  canvas.toBlob(
    (blob) => {
      if (!blob) return
      const file = new File([blob], "takePicture.jpg", { type: "image/jpeg" })
      imgResult.value = file
      imgUrl.value = URL.createObjectURL(blob)
    },
    "image/jpeg",
    0.92
  )
}

// 打开相册
const openGallery = () => galleryRef.value?.click()

// 相册选图
const handleFileChange = (e: any) => {
  const file = e.target.files[0]
  if (!file) return
  compressImage(file, (compressedFile) => {
    emit("pictureResult", compressedFile)
    e.target.value = ""
    closePicture()
  })
}

// 重置拍照
const refreshPicture = () => {
  if (videoRef.value) videoRef.value.srcObject = null
  imgUrl.value = ""
  getMediaStream()
}
const stopMediaStream = () => {
  const stream = videoRef.value?.srcObject as MediaStream | undefined
  if (stream) {
    stream.getTracks().forEach((track) => track.stop()) // 停止每个 track
    videoRef.value!.srcObject = null
  }
}

// 关闭组件
const closePicture = () => {
  stopMediaStream()
  imgUrl.value = ""
  emit("closePicture", false)
}

// 提交拍照结果
const submitResult = () => {
  if (imgResult.value) emit("pictureResult", imgResult.value)
  closePicture()
}

onMounted(() => {
  getMediaStream()
  watch(
    () => props.show,
    (newVal) => {
      if (newVal) getMediaStream()
    }
  )
})
</script>

<style scoped>
.take-picture {
  position: fixed; /* 占满屏幕 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover; /* 保持比例并裁剪 */
  z-index: 0;
  background: #000;
  /* 增强画面亮度和对比度，解决画面很灰的问题 */
  filter: brightness(1.2) contrast(1.3);
  -webkit-filter: brightness(1.2) contrast(1.3);
}

.wrapper_btm {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100px; /* 可调整操作栏高度 */
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  gap: 30px;
}

.take-picture-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #fff;
  border: none;
  cursor: pointer;
}

.btn-text {
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  user-select: none;
}
</style>
