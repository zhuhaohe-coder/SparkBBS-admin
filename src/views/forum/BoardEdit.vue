<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="110px"
      >
        <el-form-item
          label="一级版块"
          prop="boardName"
          v-if="formData.boardType === 1"
        >
          {{ formData.pBoardName }}
        </el-form-item>
        <el-form-item label="版块名称" prop="boardName">
          <el-input
            clearable
            placeholder="请输入名称"
            v-model="formData.boardName"
          ></el-input>
        </el-form-item>

        <el-form-item label="发帖权限" prop="postType">
          <el-radio-group v-model="formData.postType">
            <el-radio :label="1">任何人都可以发帖</el-radio>
            <el-radio :label="0">只允许管理员发帖</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>

        <el-form-item label="简介" prop="boardDesc">
          <el-input
            type="textarea"
            placeholder="请输入简介"
            v-model="formData.boardDesc"
            :autosize="{ minRows: 4, maxRows: 4 }"
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
import CoverUpload from "../../components/CoverUpload.vue";
const { proxy } = getCurrentInstance();
const api = {
  saveBoard: "/board/saveBoard",
};

const dialogConfig = reactive({
  show: false,
  title: "标题",
  buttons: [
    {
      type: "primary",
      text: "保存",
      click: (e) => {
        submitForm();
      },
    },
  ],
});
const formData = ref({});
const formDataRef = ref();
const rules = {
  boardName: [{ required: true, message: "请输入版块名称" }],
  postType: [{ required: true, message: "请选择发帖权限" }],
};
const emit = defineEmits(["reload"]);
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = Object.assign({}, formData.value);
    delete params.children;
    // 封面不是文件类型,值设为空
    if (!(params.cover instanceof File)) {
      delete params.cover;
    }
    const result = await proxy.Request({
      url: api.saveBoard,
      params,
    });
    if (!result) return;
    proxy.Message.success("保存成功!");
    dialogConfig.show = false;
    emit("reload");
  });
};
const editBoard = (opType, boardType, data, currentBoard) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    if (opType === "add") {
      dialogConfig.title = boardType === 0 ? "新增版块" : "新增二级板块";
      formData.value = {};
    } else if (opType === "update") {
      dialogConfig.title = boardType === 0 ? "修改版块" : "修改二级板块";
      formData.value = JSON.parse(JSON.stringify(data));
      if (formData.value.cover) {
        formData.value.cover = {
          imageUrl: formData.value.cover,
        };
      }
    }
    formData.value.boardType = boardType;
    if (boardType === 1) {
      formData.value.pBoardName = currentBoard.boardName;
      formData.value.pBoardId = currentBoard.boardId;
    } else {
      formData.value.pBoardId = 0;
    }
  });
};
defineExpose({ editBoard });
</script>

<style lang="scss" scoped></style>
