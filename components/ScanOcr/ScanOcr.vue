<template>
  <div class="scan-ocr">
    <div class="controls">
      <input type="file" accept="image/*" @change="onFileChange" />
      <button @click="openCamera">打开摄像头拍照</button>
      <button @click="stopCamera" v-if="stream">停止摄像头</button>
    </div>
  
    <div class="preview">
      <video v-if="stream" ref="video" autoplay playsinline></video>
      <img v-else-if="previewData" :src="previewData" alt="preview" />
    </div>
  
    <div class="actions">
      <button @click="runOcr" :disabled="!previewData && !stream">识别文字</button>
    </div>
  
    <div class="result">
      <h3>识别结果</h3>
      <pre>{{ recognizedText }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue'
import Tesseract from 'tesseract.js'

const previewData = ref(null)
const recognizedText = ref('')
const stream = ref(null)
const video = ref(null)

const onFileChange = (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    previewData.value = reader.result
  }
  reader.readAsDataURL(file)
}

const openCamera = async () => {
  try {
    const s = await navigator.mediaDevices.getUserMedia({ video: true })
    stream.value = s
    if (video.value) video.value.srcObject = s
  } catch (err) {
    console.error('打开摄像头失败', err)
    alert('无法打开摄像头：' + (err.message || err))
  }
}

const stopCamera = () => {
  if (!stream.value) return
  stream.value.getTracks().forEach(t => t.stop())
  stream.value = null
}

const captureFromVideo = () => {
  if (!video.value) return null
  const v = video.value
  const canvas = document.createElement('canvas')
  canvas.width = v.videoWidth || 640
  canvas.height = v.videoHeight || 480
  const ctx = canvas.getContext('2d')
  ctx.drawImage(v, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/png')
}

const runOcr = async () => {
  recognizedText.value = '识别中...'
  let imageData = previewData.value
  if (!imageData && stream.value) {
    imageData = captureFromVideo()
  }
  if (!imageData) {
    recognizedText.value = '请先上传图片或打开摄像头'
    return
  }
  try {
    const worker = Tesseract.createWorker({
      logger: m => {
        // 可在这里显示进度 m
        // console.log(m)
      }
    })
    await worker.load()
    await worker.loadLanguage('chi_sim')
    await worker.initialize('chi_sim')
    const { data } = await worker.recognize(imageData)
    recognizedText.value = data.text
    await worker.terminate()
  } catch (err) {
    console.error(err)
    recognizedText.value = '识别失败：' + (err.message || err)
  }
}

onBeforeUnmount(() => {
  stopCamera()
})
</script>

<style scoped>
.scan-ocr {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 6px
}

.controls {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px
}

.preview {
  margin: 8px 0
}

.preview img,
.preview video {
  max-width: 100%;
  height: auto;
  border: 1px solid #ddd
}

.actions {
  margin-bottom: 8px
}

.result pre {
  white-space: pre-wrap;
  word-break: break-word;
  background: #f7f7f7;
  padding: 8px
}
</style>
