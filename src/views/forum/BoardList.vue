<template>
  <div>
    <div class="top-panel">
      <el-button
        @click="showEdit('add', 0)"
        type="primary"
        :style="{ marginLeft: '5px' }"
        >新增版块</el-button
      >
    </div>
    <el-row :gutter="10" :style="{ 'margin-top': '10px' }">
      <el-col :span="14">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>一级版块</span>
            </div>
          </template>
          <Table
            :columns="columns"
            :showPagination="false"
            :dataSource="tableData"
            :fetch="loadDataList"
            :options="tableOptions"
            ref="dataTableRef"
            @rowClick="rowClick"
          >
            <!-- 封面 -->
            <template #cover="{ index, row }">
              <Cover :cover="row.cover"></Cover>
            </template>
            <!-- 版块信息 -->
            <template #boardInfo="{ index, row }">
              <div>版块名称: {{ row.boardName }}</div>
              <div>发帖权限: {{ postTypeMap[row.postType] }}</div>
            </template>
            <!-- 操作 -->
            <template #op="{ index, row }">
              <div class="op">
                <a class="a-link" @click="showEdit('update', 0, row)">修改</a>
                <el-divider direction="vertical" />
                <a class="a-link" @click="del(row)">删除</a>
                <el-divider direction="vertical" />
                <span :style="{ cursor: 'not-allowed' }">
                  <a
                    :class="[index === 0 ? 'not-allow' : 'a-link']"
                    @click="changeSort(index, 'up', 0)"
                    >上移</a
                  >
                </span>
                <el-divider direction="vertical" />
                <span :style="{ cursor: 'not-allowed' }">
                  <a
                    :class="[
                      index === tableData.list.length - 1
                        ? 'not-allow'
                        : 'a-link',
                    ]"
                    @click="changeSort(index, 'down', 0)"
                    >下移</a
                  >
                </span>
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>二级版块</span>
              <a class="a-link" @click="showEdit('add', 1)">新增版块</a>
            </div>
          </template>
          <Table
            :columns="columns"
            :showPagination="false"
            :dataSource="tableChildData"
            :options="tableOptions"
          >
            <!-- 封面 -->
            <template #cover="{ index, row }">
              <Cover :cover="row.cover"></Cover>
            </template>
            <!-- 版块信息 -->
            <template #boardInfo="{ index, row }">
              <div>版块名称: {{ row.boardName }}</div>
              <div>发帖权限: {{ postTypeMap[row.postType] }}</div>
            </template>
            <!-- 操作 -->
            <template #op="{ index, row }">
              <div class="op">
                <a class="a-link" @click="showEdit('update', 1, row)">修改</a>
                <el-divider direction="vertical" />
                <a class="a-link" @click="del(row)">删除</a>
                <el-divider direction="vertical" />
                <span :style="{ cursor: 'not-allowed' }">
                  <a
                    :class="[index === 0 ? 'not-allow' : 'a-link']"
                    @click="changeSort(index, 'up', 1)"
                    >上移</a
                  >
                </span>
                <el-divider direction="vertical" />
                <span :style="{ cursor: 'not-allowed' }">
                  <a
                    :class="[
                      index === tableChildData.list.length - 1
                        ? 'not-allow'
                        : 'a-link',
                    ]"
                    @click="changeSort(index, 'down', 1)"
                    >下移</a
                  >
                </span>
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
    </el-row>
    <!-- 新增/修改版块弹窗 -->
    <BoardEdit ref="boardEditRef" @reload="loadDataList"></BoardEdit>
  </div>
</template>

<script setup>
import BoardEdit from "./BoardEdit.vue";
import { ref, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadBoard: "/board/loadBoard",
  delBoard: "/board/delBoard",
  changeBoardSort: "/board/changeBoardSort",
};
const postTypeMap = {
  0: "只允许管理员发帖",
  1: "任何人都可以发帖",
};

const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 80,
    scopedSlots: "cover",
  },
  {
    label: "版块信息",
    width: 210,
    prop: "boardName",
    scopedSlots: "boardInfo",
  },
  {
    label: "简介",
    prop: "boardDesc",
  },
  {
    label: "操作",
    width: 190,
    prop: "op",
    scopedSlots: "op",
  },
];
const tableData = ref({});
const tableOptions = {
  extHeight: 100,
};

const currentBoard = ref(null);
const loadDataList = async () => {
  const result = await proxy.Request({
    url: api.loadBoard,
  });
  if (!result) return;
  tableData.value.list = result.data;
  // 初始化后选择第一项
  if (currentBoard.value === null && result.data.length) {
    rowClick(result.data[0]);
  } else {
    currentBoard.value = result.data.find(
      (item) => item.boardId === currentBoard.value.boardId
    );
    rowClick(currentBoard.value);
  }
  nextTick(() => {
    dataTableRef.value.setCurrentRow("boardId", currentBoard.value.boardId);
  });
};

const tableChildData = ref({});
const rowClick = (data) => {
  tableChildData.value.list = data.children;
  currentBoard.value = data;
};

const dataTableRef = ref(null);

// 新增/修改
const boardEditRef = ref(null);
const showEdit = (opType, boardType, data) => {
  boardEditRef.value.editBoard(opType, boardType, data, currentBoard.value);
};

// 删除
const del = (row) => {
  proxy.Confirm(`你确定要删除${row.boardName}`, async () => {
    const result = await proxy.Request({
      url: api.delBoard,
      params: {
        boardId: row.boardId,
      },
    });
    if (!result) return;
    if (currentBoard.value.boardId === row.boardId) {
      currentBoard.value = null;
    }
    proxy.Message.success("删除成功!");
    loadDataList();
  });
};

//上移/下移
const changeSort = async (index, type, boardType) => {
  const dataList =
    boardType === 0 ? tableData.value.list : tableChildData.value.list;
  const temp = dataList[index];
  const number = type === "down" ? 1 : -1;
  dataList.splice(index, 1);
  dataList.splice(index + number, 0, temp);
  const boardIdList = [];
  dataList.forEach((item) => {
    boardIdList.push(item.boardId);
  });
  const result = await proxy.Request({
    url: api.changeBoardSort,
    params: {
      boardIds: boardIdList.join(","),
    },
  });
  if (!result) return;
  proxy.Message.success("重新排序成功!");
  loadDataList();
};
</script>

<style lang="scss" scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 700;
  .a-link {
    font-size: 14px;
  }
}
</style>
