<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    width="500px"
    :showCancel="false"
    @close="dialogConfig.show = false"
  >
    <el-form :model="formData" label-width="120px">
      <el-form-item label="发布人" :style="{ alignItems: 'center' }">
        <Avatar :userId="formData.userId" :width="40"></Avatar>
        <span :style="{ marginLeft: '5px' }">{{ formData.nickName }}</span>
      </el-form-item>
      <el-form-item label="文件名">
        {{ formData.fileName }}
      </el-form-item>
      <el-form-item label="大小">
        {{ proxy.Utils.sizeToStr(formData.fileSize) }}
      </el-form-item>
      <el-form-item label="下载所需积分">
        {{ formData.integral }}
      </el-form-item>
      <el-form-item>
        <a
          :href="`/api/forum/attachmentDownload?fileId=${formData.fileId}`"
          class="a-link"
          target="_blank"
          >下载</a
        >
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import { ref, reactive, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const dialogConfig = reactive({
  show: false,
  title: "查看附件",
  buttons: [
    {
      type: "primary",
      text: "确定",
      click: (e) => {
        dialogConfig.show = false;
      },
    },
  ],
});
const api = {
  getAttachment: "/forum/getAttachment",
};
const formData = ref({});
const show = async (nickName, articleId) => {
  console.log(proxy.Utils);
  dialogConfig.show = true;
  const result = await proxy.Request({
    url: api.getAttachment,
    params: {
      articleId,
    },
  });
  if (!result) return;
  formData.value = result.data;
  formData.value.nickName = nickName;
};
defineExpose({ show });
</script>

<style lang="scss" scoped></style>
