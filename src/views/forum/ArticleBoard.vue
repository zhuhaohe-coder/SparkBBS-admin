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
        label-width="80px"
      >
        <el-form-item label="标题">
          {{ formData.title }}
        </el-form-item>

        <el-form-item label="版块" prop="boardIds">
          <el-cascader
            clearable
            :options="boardList"
            placeholder="请选择版块"
            v-model.trim="formData.boardIds"
            :style="{ width: '100%' }"
            :props="boardProps"
          />
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadBoard: "board/loadBoard",
  updateBoard: "/forum/updateBoard",
};
const dialogConfig = reactive({
  show: false,
  title: "修改版块",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});
const formData = ref({});
const formDataRef = ref();
const rules = {
  boardIds: [{ required: true, message: "请选择版块" }],
};
// 版块信息
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: "boardId",
  label: "boardName",
};
const boardList = ref([]);
const loadBoardList = async () => {
  const result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) return;
  boardList.value = result.data;
};
loadBoardList();

const emit = defineEmits(["reload"]);
const submitForm = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    const params = {
      articleId: formData.value.articleId,
    };
    params.boardIds = formData.value.boardIds;
    if (params.boardIds?.length === 1) {
      params.pBoardId = params.boardIds[0];
    } else if (params.boardIds?.length === 2) {
      params.pBoardId = params.boardIds[0];
      params.boardId = params.boardIds[1];
    }
    delete params.boardIds;
    const result = await proxy.Request({
      url: api.updateBoard,
      params,
    });
    if (!result) return;
    proxy.Message.success("版块修改成功!");
    dialogConfig.show = false;
    emit("reload");
  });
};

const updateBoard = (data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    // data中没有boardIds,需要重新定义
    data.boardIds = [];
    data.boardIds.push(data.pBoardId);
    if (data.boardId !== null && data.boardId !== 0) {
      data.boardIds.push(data.boardId);
    }
    formData.value = data;
  });
};
defineExpose({ updateBoard });
</script>

<style lang="scss" scoped></style>
