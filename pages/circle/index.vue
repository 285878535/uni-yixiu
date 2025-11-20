<template>
  <view class="tabbar-page">
    <CustomSearch v-model="search" />
    <view class="circle-container">
      <view class="circle-item">
        <image
          src="https://picsum.photos/id/64/40/40"
          mode="aspectFill"
          class="avatar"
        />
        <view class="circle-item-content"></view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue"

const search = ref("")
</script>

<style scoped lang="scss">
.circle-container {
  padding: 12px;
}

.circle-item {
  display: flex;
  margin-top: 12px;
  gap: 16px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.circle-item-content {
  height: 160px;
  border-radius: 10px;
  width: 100%;
  background: #eaeaea;
}
</style>
