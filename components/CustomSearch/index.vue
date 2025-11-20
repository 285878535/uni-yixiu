<template>
  <view class="search-container">
    <input 
      type="text" 
      v-model="searchValue" 
      placeholder="搜索" 
      @input="onInput"
      class="search-input" 
    />
    <button class="search-btn" @click="onHandleSearch">
      <text class="search-icon">🔍</text>
    </button>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["update:modelValue", "search", 'input-search'])

const searchValue = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit("update:modelValue", val)
  },
})

const onInput = (e) => {
  const value = e.detail.value
  searchValue.value = value
  emit('input-search', value)
}

const onHandleSearch = () => {
  emit("search", searchValue.value)
}
</script>

<style scoped>
.search-container {
  display: flex;
  width: 100%;
  border: 2px solid #FF915B;
  border-radius: 20px;
  overflow: hidden;
  height: 40px;
  align-items: center;
  padding: 0 5px;
}

.search-input {
  flex: 1;
  height: 100%;
  padding: 0 12px;
  border: none;
  outline: none;
  font-size: 14px;
  background: transparent;
}

.search-btn {
  border-radius: 20px;
  height: 30px;
  min-width: 50px;
  padding: 0;
  border: none;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .search-icon {
    color: #fff;
    font-size: 16px;
  }
}
</style>
