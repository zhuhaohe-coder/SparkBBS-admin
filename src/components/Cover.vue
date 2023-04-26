<template>
  <div class="cover" :style="{ height: size + 'px' }">
    <el-image
      :style="{ width: size + 'px', height: size + 'px' }"
      fit="cover"
      :src="cover ? proxy.globalInfo.imageUrl + cover : localCover"
      loading="lazy"
    >
    </el-image>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const localCover = new URL("@/assets/images/defaultImg.jpg", import.meta.url)
  .href;

const props = defineProps({
  size: {
    type: Number,
  },
  cover: {
    type: String,
  },
});
</script>

<style lang="scss" scoped>
.cover {
  border-radius: 10px;
  overflow: hidden;
}
</style>
