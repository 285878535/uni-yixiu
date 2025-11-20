
<template>
  <div class="rich-editor">
    <!-- 注意：需要在项目中引入 Quill 的 CSS，例如在 main.js 或组件外部：
             import 'quill/dist/quill.snow.css'
        -->
    <div ref="toolbar" class="quill-toolbar"></div>
    <div ref="editor" class="quill-editor"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Quill from 'quill'

const props = defineProps({
  modelValue: { type: String, default: '' },
  // 可选：传入异步上传函数，参数为 File，返回 Promise<string>（图片 URL）
  uploadImage: { type: Function, default: null }
})
const emit = defineEmits(['update:modelValue', 'change'])

const editor = ref(null)
const toolbar = ref(null)
let quill = null

onMounted(() => {
  // 初始化 toolbar 配置
  // 自定义 image handler，优先使用 props.uploadImage
  const toolbarOptions = {
    container: [
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'header': [1, 2, 3, false] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ],
    handlers: {
      image: function () {
        const input = document.createElement('input')
        input.setAttribute('type', 'file')
        input.setAttribute('accept', 'image/*')
        input.click()
        input.onchange = async () => {
          const file = input.files && input.files[0]
          if (!file) return
          try {
            if (props.uploadImage && typeof props.uploadImage === 'function') {
              const url = await props.uploadImage(file)
              const range = quill.getSelection(true)
              quill.insertEmbed(range.index, 'image', url)
              quill.setSelection(range.index + 1)
            } else {
              // fallback to base64
              const reader = new FileReader()
              reader.onload = () => {
                const range = quill.getSelection(true)
                quill.insertEmbed(range.index, 'image', reader.result)
                quill.setSelection(range.index + 1)
              }
              reader.readAsDataURL(file)
            }
          } catch (err) {
            console.error('图片上传或插入失败', err)
            alert('图片上传失败')
          }
        }
      }
    }
  }

  quill = new Quill(editor.value, {
    modules: { toolbar: toolbarOptions },
    theme: 'snow'
  })

  // 设置初始值
  if (props.modelValue) quill.root.innerHTML = props.modelValue

  quill.on('text-change', () => {
    const html = quill.root.innerHTML
    emit('update:modelValue', html)
  })

  quill.on('selection-change', (range, oldRange, source) => {
    if (range === null && oldRange !== null) {
      // blur
      emit('change', quill.root.innerHTML)
    }
  })
})

watch(() => props.modelValue, (v) => {
  if (!quill) return
  const current = quill.root.innerHTML
  if (v !== current) quill.root.innerHTML = v || ''
})

onBeforeUnmount(() => {
  quill = null
})
</script>

<style scoped>
.rich-editor {
  border: 1px solid #ddd;
  padding: 8px;
  border-radius: 6px
}

.quill-editor {
  min-height: 200px;
}
</style>
