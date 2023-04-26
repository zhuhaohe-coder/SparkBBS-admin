<template>
  <div
    class="avatar"
    :style="{
      width: size + 'px',
      height: size + 'px',
      borderRadius: '50%',
    }"
  >
    <div
      class="circle-1"
      v-if="showCircle"
      :style="{
        width: size + 8 + 'px',
        height: size + 8 + 'px',
        borderRadius: '50%',
      }"
    ></div>
    <div
      class="circle-2"
      v-if="showCircle"
      :style="{
        width: size + 16 + 'px',
        height: size + 16 + 'px',
        borderRadius: '50%',
      }"
    ></div>
    <el-image
      v-if="userId"
      :style="{
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
      }"
      :src="proxy.globalInfo.avatarUrl + userId"
      fit="scale-down"
      loading="lazy"
      @click="goToUserCenter"
    />
    <div
      class="no-user"
      v-else
      :style="{
        width: size + 'px',
        height: size + 'px',
        borderRadius: '50%',
      }"
    >
      <span>未登录</span>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();

const props = defineProps({
  userId: {
    type: String,
  },
  size: {
    type: Number,
    default: 60,
  },
  addLink: {
    type: Boolean,
    default: true,
  },
  showCircle: {
    type: Boolean,
    default: false,
  },
});

const goToUserCenter = () => {
  if (props.addLink) {
    router.push("/user/" + props.userId);
  }
};
</script>

<style lang="scss" scoped>
.avatar {
  position: relative;
}
.no-user {
  background-color: #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  span {
    font-size: 13px;
  }
}

.avatar:hover {
  .circle-1 {
    transform: rotate(360deg);
  }
  .circle-2 {
    transform: rotate(-360deg);
  }
}
.circle-1,
.circle-2 {
  box-sizing: border-box;
  border-style: solid;
  border-width: 1px;
  transition: all ease-in-out 1.5s;
  position: absolute;
}
.circle-1 {
  border-color: var(--link) var(--link) var(--link) transparent;
  top: -4px;
  left: -4px;
}
.circle-2 {
  border-color: var(--link) transparent var(--link) var(--link);
  top: -8px;
  left: -8px;
}
</style>
