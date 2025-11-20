<script setup>
const router = useRouter()
const { t } = useI18n()
const goHome = () => {
  router.replace("/")
}
</script>

<template>
  <div flex justify-center items-center class="h100%">
    <div flex flex-col items-center>
      <img w="full" src="@/assets/images/404.png" alt="404" />
      <van-button type="primary" @click="goHome">{{
        t("backHomeBtn")
      }}</van-button>
    </div>
  </div>
</template>
