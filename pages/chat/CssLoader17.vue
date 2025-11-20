<template>
  <view id="cssLoader1" class="main-wrap">
    <view class="child-common child1"></view>
    <view class="child-common child2"></view>
    <view class="child-common child3"></view>
    <view class="child-common child4"></view>
    <view class="child-common child5"></view>
    <view class="child-common child6"></view>
    <view class="child-common child7"></view>
    <view class="child-common child8"></view>
    <view class="child-common child9"></view>
    <view class="child-common child10"></view>
  </view>
</template>

<script setup></script>

<style scoped>
.main-wrap {
  color: black;
  padding: 12px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

#cssLoader1.main-wrap .child-common {
  width: 5px;
  height: 10px;
  margin-right: 3px;
  background-color: #2b4661;
  animation: animate1 1s infinite;
}

#cssLoader1.main-wrap .child1 {
  margin-right: 3px;
}

#cssLoader1.main-wrap .child10 {
  animation-delay: 0.9s;
}

#cssLoader1.main-wrap .child9 {
  animation-delay: 0.8s;
}

#cssLoader1.main-wrap .child8 {
  animation-delay: 0.7s;
}

#cssLoader1.main-wrap .child7 {
  animation-delay: 0.6s;
}

#cssLoader1.main-wrap .child6 {
  animation-delay: 0.5s;
}

#cssLoader1.main-wrap .child5 {
  animation-delay: 0.4s;
}

#cssLoader1.main-wrap .child4 {
  animation-delay: 0.3s;
}

#cssLoader1.main-wrap .child3 {
  animation-delay: 0.2s;
}

#cssLoader1.main-wrap .child2 {
  animation-delay: 0.1s;
}

@keyframes animate1 {
  50% {
    transform: scaleY(0);
  }
}
</style>
