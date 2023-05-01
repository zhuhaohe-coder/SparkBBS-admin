<template>
  <el-image
    class="comment-img"
    :src="src"
    :zoom-rate="1.2"
    :preview-src-list="imageList ? imageList : [src]"
    :initial-index="0"
    loading="lazy"
    hide-on-click-modal
  >
  </el-image>
</template>

<script setup>
const props = defineProps({
  src: {
    type: String,
  },
  imageList: {
    type: Array,
  },
});
</script>

<style lang="scss" scoped>
.comment-img {
  width: 80px;
  height: 80px;
  background: #eee;
}
</style>
