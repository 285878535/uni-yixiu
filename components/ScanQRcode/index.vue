<template>
  <div class="scan-container">
    <!-- 顶部操作区 -->
    <div class="scan-header">
      <button
        class="close-btn"
        @click="closeScan"
      >
        关闭
      </button>
      <button
        class="album-btn"
        @click="openGallery"
      >
        相册
      </button>
    </div>

    <!-- 扫码区域 -->
    <div class="scan-view">
      <video
        ref="videoRef"
        class="scan-video"
        autoplay
        playsinline
        webkit-playsinline
        x5-playsinline
        muted
      ></video>
      <canvas ref="canvasRef" class="scan-canvas"></canvas>
      <!-- 扫描框指示器 -->
      <div class="scan-frame"></div>
    </div>

    <!-- 底部操作区 -->
    <div class="scan-footer">
      <button
        @click="startScan('vin')"
        :class="{ 'active-btn': activeScanType === 'vin' }"
      >
        扫车架号
      </button>
      <button
        @click="startScan('fault')"
        :class="{ 'active-btn': activeScanType === 'fault' }"
      >
        扫故障码
      </button>
    </div>

    <!-- 图片上传组件已移除，使用原生 input -->
    <!-- 相册 -->
    <div class="wrapper_btm">
      <input
        type="file"
        accept="image/*"
        ref="galleryRef"
        @change="handleFileChange"
        style="display: none"
      />
    </div>
    <!-- 结果提示已使用 uni.showToast -->
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, defineEmits } from "vue"
// 移除 vant 依赖，使用 uni-app API
import jsQR from "jsqr"
import { compressImage } from "@/utils/compressImage"

const emit = defineEmits(
  {
    closeScan: () => true,
  },
  ["pictureResult"]
)

// 元素引用，避免与内置的 video 等变量冲突，重命名为 videoRef、canvasRef
const videoRef = ref(null)
const canvasRef = ref(null)
const canvasContext = ref(null)

// 状态管理
// const scanning = ref(false);
const scanType = ref("")
const activeScanType = ref("vin")
const fileList = ref([])
const showToast = ref(false)
const toastMessage = ref("")
const toastType = ref("info")
const galleryRef = ref(null)
// 动画和请求ID
let animationId = null
let stream = null

// 初始化画布
onMounted(() => {
  canvasContext.value = canvasRef.value.getContext("2d")
  // 移除自动调用，必须在用户交互事件中调用 getUserMedia
  // startScan('vin')
})

// 清理资源
onUnmounted(() => {
  stopScan()
})

// 关闭扫码
const closeScan = () => {
  stopScan()
  // 可以通过 emit 通知父组件关闭，这里假设在组件内处理关闭逻辑，若需要父组件处理，可添加 emit
  emit("closeScan", false)
  // 例如，若该组件是弹窗形式，可控制显示隐藏的变量，这里简单示例，直接停止扫描并提示
  showToastMessage("已关闭扫码", "info")
}
// 打开相册
const openGallery = () => {
  // 先停止当前扫描，避免冲突
  stopScan()
  // 正确获取DOM并判断是否存在
  if (galleryRef.value) {
    galleryRef.value.click()
  } else {
    showToastMessage("相册组件加载失败", "fail")
  }
}
// 相册选图
const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  // 新增：校验文件是否为图片
  const isImage = file.type.startsWith("image/")
  if (!isImage) {
    showToastMessage("请选择图片文件", "fail")
    e.target.value = "" // 清空选择，避免重复触发
    return
  }

  // 压缩图片并传值给父组件
  compressImage(file, (compressedFile) => {
    emit("pictureResult", compressedFile)
    e.target.value = "" // 清空选择，允许再次选择同一文件
  })
  closeScan()
}
// 从相册选择
// const selectFromAlbum = () => {
//   console.log("相册")
//   // 先停止可能正在进行的扫描
//   stopScan();
//   // 确保能获取到上传按钮并点击
//   nextTick(() => {
//     const uploadBtn = document.querySelector('.van-uploader__upload');
//     if (uploadBtn) {
//       uploadBtn.click();
//     } else {
//       showToastMessage('相册选择按钮获取失败', 'fail');
//     }
//   });
// };

// 处理上传的图片
const handleImageUpload = async (file) => {
  try {
    const img = new Image()
    img.src = file.content

    img.onload = () => {
      // 绘制图片到画布
      canvasRef.value.width = img.width
      canvasRef.value.height = img.height
      canvasContext.value.drawImage(img, 0, 0, img.width, img.height)

      // 识别图片中的二维码
      const imageData = canvasContext.value.getImageData(
        0,
        0,
        img.width,
        img.height
      )
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        handleScanResult(code.data)
      } else {
        showToastMessage("未识别到二维码", "fail")
      }
    }
  } catch (error) {
    console.error("图片识别错误:", error)
    showToastMessage("识别失败", "fail")
  }
}

// 开始扫码
const startScan = async (type) => {
  console.log(type)

  // 先停止之前的扫描
  stopScan()

  scanType.value = type
  // 点击按钮时，更新"选中状态"为当前类型
  activeScanType.value = type

  // 检查浏览器支持
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showToastMessage("您的浏览器不支持摄像头访问", "fail")
    return
  }

  try {
    // 请求相机权限
    const constraints = {
      video: {
        facingMode: "environment", // 使用后置摄像头
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
    }

    stream = await navigator.mediaDevices.getUserMedia(constraints)

    if (!videoRef.value) {
      showToastMessage("视频元素未准备好", "fail")
      return
    }

    // 设置视频流
    videoRef.value.srcObject = stream
    videoRef.value.setAttribute("playsinline", "true") // iOS 兼容
    videoRef.value.setAttribute("webkit-playsinline", "true") // iOS 兼容
    videoRef.value.setAttribute("x5-playsinline", "true") // 微信浏览器兼容
    videoRef.value.muted = true // 静音，避免某些浏览器的自动播放限制

    // 确保视频元素可见
    videoRef.value.style.display = "block"

    // 等待视频加载后播放
    const handleCanPlay = () => {
      if (!videoRef.value) return

      videoRef.value
        .play()
        .then(() => {
          // 开始扫描帧
          requestAnimationFrame(tick)
        })
        .catch((err) => {
          console.error("视频播放失败:", err)
          // 尝试再次播放
          setTimeout(() => {
            if (videoRef.value && videoRef.value.srcObject) {
              videoRef.value.play().catch((retryErr) => {
                console.error("重试播放失败:", retryErr)
                showToastMessage("视频播放失败，请检查权限", "fail")
                stopScan()
              })
            }
          }, 100)
        })
      // 移除事件监听，避免重复触发
      videoRef.value.removeEventListener("canplay", handleCanPlay)
      videoRef.value.removeEventListener("loadedmetadata", handleCanPlay)
    }

    // 监听多个事件确保视频可以播放
    videoRef.value.addEventListener("canplay", handleCanPlay)
    videoRef.value.addEventListener("loadedmetadata", handleCanPlay)

    // 如果视频已经可以播放，直接处理
    if (videoRef.value.readyState >= 3) {
      handleCanPlay()
    } else {
      // 如果视频还没准备好，等待 loadedmetadata 事件
      videoRef.value.addEventListener(
        "loadedmetadata",
        () => {
          if (videoRef.value && videoRef.value.readyState >= 2) {
            handleCanPlay()
          }
        },
        { once: true }
      )
    }
  } catch (error) {
    console.error("相机访问失败:", error)
    let errorMessage = "请授予相机权限"

    // 根据错误类型提供更具体的提示
    if (
      error.name === "NotAllowedError" ||
      error.name === "PermissionDeniedError"
    ) {
      errorMessage = "请允许访问摄像头权限"
    } else if (
      error.name === "NotFoundError" ||
      error.name === "DevicesNotFoundError"
    ) {
      errorMessage = "未找到摄像头设备"
    } else if (
      error.name === "NotReadableError" ||
      error.name === "TrackStartError"
    ) {
      errorMessage = "摄像头被其他应用占用，请关闭后重试"
    } else if (
      error.name === "OverconstrainedError" ||
      error.name === "ConstraintNotSatisfiedError"
    ) {
      errorMessage = "摄像头配置不支持，请重试"
    } else if (
      error.name === "NotSupportedError" ||
      error.name === "TypeError"
    ) {
      errorMessage = "浏览器不支持摄像头功能，请使用 HTTPS 访问"
    } else {
      errorMessage = error.message || "无法访问摄像头"
    }

    showToastMessage(errorMessage, "fail")
    stopScan()
  }
}

// 停止扫码
const stopScan = () => {
  // scanning.value = false;
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }
  if (stream) {
    stream.getTracks().forEach((track) => track.stop())
    stream = null
  }
  // 停止视频播放
  if (videoRef.value) {
    videoRef.value.pause()
    videoRef.value.srcObject = null
  }
}

// 扫描帧处理
const tick = () => {
  // 安全检查
  if (!videoRef.value || !canvasRef.value || !canvasContext.value) {
    return
  }

  if (videoRef.value.readyState >= videoRef.value.HAVE_ENOUGH_DATA) {
    // 设置画布尺寸与视频一致
    const videoWidth = videoRef.value.videoWidth
    const videoHeight = videoRef.value.videoHeight

    if (videoWidth > 0 && videoHeight > 0) {
      canvasRef.value.width = videoWidth
      canvasRef.value.height = videoHeight

      // 绘制视频帧到画布
      canvasContext.value.drawImage(
        videoRef.value,
        0,
        0,
        videoWidth,
        videoHeight
      )

      // 获取图像数据并识别
      const imageData = canvasContext.value.getImageData(
        0,
        0,
        videoWidth,
        videoHeight
      )
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        stopScan()
        handleScanResult(code.data)
        return
      }
    }
  }

  animationId = requestAnimationFrame(tick)
}

// 处理扫描结果
const handleScanResult = (result) => {
  console.log(`扫描结果[${scanType.value}]:`, result)
  showToastMessage("扫描成功", "success")
  // 可根据扫描类型做不同处理，比如发送不同的请求等
  // 示例：若扫描的是车架号
  if (scanType.value === "vin") {
    console.log("车架号扫描结果：", result)
    // 这里可以调用接口上传车架号等操作
  } else if (scanType.value === "fault") {
    console.log("故障码扫描结果：", result)
    // 这里可以调用接口上传故障码等操作
  }
}

// 显示提示消息
const showToastMessage = (message, type = "info") => {
  uni.showToast({
    title: message,
    icon: type === 'success' ? 'success' : type === 'fail' ? 'error' : 'none',
    duration: 2000
  })
}
</script>

<style scoped>
.scan-container {
  width: 100%;
  height: 100vh;
  background-color: #000;
  position: relative;
  overflow: hidden;
}

.scan-header {
  position: absolute;
  top: 20px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  z-index: 10;
}

.close-btn,
.album-btn {
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
}

.scan-view {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scan-video,
.scan-canvas {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
}

.scan-frame {
  width: 280px;
  height: 280px;
  border: 2px solid #4cd964;
  position: relative;
  z-index: 5;
}

.scan-footer {
  position: absolute;
  bottom: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 30px;
  z-index: 10;
}

.scan-footer .van-button {
  width: 140px;
  background-color: rgba(0, 0, 0, 0.5);
  border-color: #4cd964;
  color: #4cd964;
  transition: all 0.3s ease; /* 添加入场动画，过渡更自然 */
}

/* 选中按钮的样式：视觉区分明显 */
.scan-footer .van-button.active-btn {
  background-color: rgba(76, 217, 100, 0.3); /* 选中时背景色变浅（偏绿色） */
  border-color: #fff; /* 选中时边框变白色 */
  color: #fff; /* 选中时文字变白色 */
  box-shadow: 0 0 10px rgba(76, 217, 100, 0.8); /* 添加强调阴影，更醒目 */
}

.uploader-hidden {
  position: absolute;
  left: -9999px;
  opacity: 0;
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
</style>
