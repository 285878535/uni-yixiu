<template>
  <view>
    <view v-if="loading" class="loading-container">
      <text>支付中...</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAlipay } from "@/api/user";
import { navigateBack } from '@/utils/router';

const loading = ref(true);

// 判断是否在APP环境中
const isInApp = () => {
  // #ifdef APP-PLUS
  return true;
  // #endif
  // #ifndef APP-PLUS
  return false;
  // #endif
};

const onLoad = async () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  const type = currentPage.options?.type || "0"
  
  let orderAmount, typeData;

  if (type === "0") {
    orderAmount = 29.99;
    typeData = "0";
  } else {
    orderAmount = 299.99;
    typeData = "1";
  }

  try {
    const responseCar = await getAlipay({
      orderAmount: orderAmount,
      paymentStatus: "WAIT_BUYER_PAY",
      paymentType: "0",
      productInfo: "智能维修服务套餐",
      orderRemark: "",
      type: typeData,
    });

    console.log("后端返回数据：", responseCar);

    // 如果在APP环境中，使用uni-app的支付API
    if (isInApp()) {
      handleAppPayment(responseCar);
    } else {
      // H5环境，使用表单提交
      handleH5Payment(responseCar);
    }
  } catch (error) {
    loading.value = false;
    console.error("接口请求失败：", error);
    uni.showToast({
      title: '支付请求失败，请稍后重试',
      icon: 'none'
    });
  }
};

// APP环境支付处理
const handleAppPayment = (orderInfo) => {
  loading.value = false;

  // 使用uni-app的支付API
  // #ifdef APP-PLUS
  plus.payment.request({
    provider: 'alipay',
    orderInfo: orderInfo,
    success: (res) => {
      console.log('支付成功:', res);
      uni.showToast({
        title: '支付成功',
        icon: 'success'
      });
      setTimeout(() => {
        navigateBack();
      }, 1500);
    },
    fail: (err) => {
      console.error('支付失败:', err);
      if (err.message && err.message.includes('cancel')) {
        uni.showToast({
          title: '支付已取消',
          icon: 'none'
        });
      } else {
        uni.showToast({
          title: '支付失败',
          icon: 'none'
        });
      }
      setTimeout(() => {
        navigateBack();
      }, 1500);
    }
  });
  // #endif
};

// H5环境支付处理
const handleH5Payment = (payFormHtml) => {
  // H5 环境需要跳转到支付页面或使用其他方式
  // 这里可以根据实际情况处理
  loading.value = false;
  console.log('H5支付处理:', payFormHtml);
  // 可以跳转到支付页面
  // window.location.href = payFormHtml;
}

onMounted(() => {
  onLoad();
});
</script>

<style scoped>
.loading-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
