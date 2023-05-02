<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="80px"
        @submit.prevent
      >
        <!--textarea输入-->
        <el-form-item label="消息内容" prop="message">
          <el-input
            clearable
            placeholder="请输入消息内容"
            type="textarea"
            :rows="5"
            :maxlength="200"
            resize="none"
            show-word-limit
            v-model="formData.message"
          ></el-input>
        </el-form-item>
        <!--input输入-->
        <el-form-item label="奖惩积分" prop="integral">
          <el-input
            clearable
            placeholder="输入为空或0不改变积分, 输入负值减少积分"
            v-model="formData.integral"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  sendMessage: "/user/sendMessage",
};
const dialogConfig = reactive({
  show: false,
  title: "发送系统消息",
  buttons: [
    {
      type: "primary",
      text: "发送",
      click: (e) => {
        submitForm();
      },
    },
  ],
});
const formData = ref({});
const formDataRef = ref();
const rules = {
  message: [{ required: true, message: "请输入消息内容!" }],
};

const sendMessage = (data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    formData.value = {
      userId: data.userId,
      nickName: data.nickName,
    };
  });
};
defineExpose({ sendMessage });

// 提交表单 发送消息
const emit = defineEmits(["reload"]);
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = {};
    Object.assign(params, formData.value);
    const result = await proxy.Request({
      url: api.sendMessage,
      params,
    });
    if (!result) {
      return;
    }
    dialogConfig.show = false;
    proxy.Message.success("发送成功!");
    emit("reload");
  });
};
</script>

<style lang="scss" scoped></style>
