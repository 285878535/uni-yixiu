<template>
  <div v-if="item.children.length > 0">
    <div class="content-title" :style="{ paddingLeft: level * 12 + 'px' }">
      {{ item.value }}
    </div>
    <div class="content-container">
      <Content v-for="cont in item.children" :key="cont.index" :level="level + 1" :item="cont"
        @onHadleClick="$emit('onHadleClick', cont)" />
    </div>
  </div>
  
  <div v-else class="content" @click="$emit('onHadleClick', item)" :style="{ paddingLeft: level * 12 + 'px' }"
    v-html="item.value"></div>
</template>

<script setup>
const defaultProps = defineProps({
  level: {
    type: Number,
    default: 1,
  },
  item: {
    type: Object,
    default: () => ({
      value: "",
      children: [],
    }),
  },
})
const emit = defineEmits(["onHadleClick"])
</script>

<style scoped lang="scss">
.content-title {
  font-size: 20px;
  margin-top: 20px;
}

.content {
  margin-top: 10px;
  padding: 10px 0;
  border-top: 1px solid #000;
  border-bottom: 1px solid #000;
  background: #f3f2f2;
}
</style>
