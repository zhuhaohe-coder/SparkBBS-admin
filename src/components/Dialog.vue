<template>
  <div>
    <el-dialog
      :model-value="show"
      :title="title"
      :width="width"
      :show-close="showClose"
      :draggable="true"
      :top="top"
      class="custom-dialog"
      @close="close"
    >
      <div class="dialog-body">
        <slot></slot>
      </div>
      <template v-if="(buttons && buttons.length > 0) || showCancel">
        <div class="dialog-footer">
          <el-button link v-if="showCancel" @click="close">取消</el-button>
          <el-button
            v-for="(btn, index) in buttons"
            :key="index"
            :type="btn.type"
            @click="btn.click"
            >{{ btn.text }}</el-button
          >
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "",
  },
  // 是否显示关闭按钮
  showClose: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "30%",
  },
  // Dialog CSS 中的 margin-top 值
  top: {
    type: String,
    default: "50px",
  },
  buttons: {
    type: Array,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["close"]);
const close = () => {
  emit("close");
};
</script>

<style lang="scss" scoped>
.custom-dialog {
  .dialog-body {
    padding: 10px 25px;
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    min-height: 100px;
    max-height: calc(100vh - 100px);
    overflow: auto;
  }
  .dialog-footer {
    text-align: right;
    padding: 5px 20px;
  }
}
</style>
