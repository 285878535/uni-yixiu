<template>
  <view class="payment-result">
    <view v-if="loading" class="loading-container">
      <text>处理支付结果中...</text>
    </view>
    <view v-else class="result-content">
      <text v-if="success" class="result-icon success">✓</text>
      <text v-else class="result-icon fail">✗</text>
      <text class="result-text">{{ resultText }}</text>
      <button class="back-btn" @click="goBack">
        返回
      </button>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { navigateTo } from '@/utils/router';

const loading = ref(true);
const success = ref(false);
const resultText = ref('');

onMounted(() => {
  // 从URL参数中获取支付结果
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const status = currentPage.options?.status
  const out_trade_no = currentPage.options?.out_trade_no
  const trade_no = currentPage.options?.trade_no

  loading.value = false;

  if (status === 'success' || status === '9000') {
    success.value = true;
    resultText.value = '支付成功';
    uni.showToast({
      title: '支付成功',
      icon: 'success'
    });
  } else if (status === 'cancel' || status === '6001') {
    success.value = false;
    resultText.value = '支付已取消';
  } else {
    success.value = false;
    resultText.value = '支付失败';
  }
});

const goBack = () => {
  navigateTo('archives');
};
</script>

<style lang="scss" scoped>
.payment-result {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;

  .loading-container {
    text-align: center;
  }

  .result-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    width: 100%;
    max-width: 400px;

    .result-icon {
      font-size: 60px;
      font-weight: bold;
      
      &.success {
        color: #07c160;
      }
      
      &.fail {
        color: #ee0a24;
      }
    }

    .result-text {
      font-size: 18px;
      font-weight: 500;
      color: #333;
      text-align: center;
    }

    .back-btn {
      margin-top: 20px;
      width: 100%;
      padding: 12px;
      background: #f46205;
      color: #fff;
      border: none;
      border-radius: 20px;
      font-size: 16px;
    }
  }
}
</style>
