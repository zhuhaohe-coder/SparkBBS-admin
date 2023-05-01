<template>
  <div class="data-list">
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="标题" prop="titleFuzzy">
              <el-input
                clearable
                placeholder="请输入标题"
                v-model.trim="searchFormData.titleFuzzy"
                @keyup.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="昵称" prop="nickNameFuzzy">
              <el-input
                clearable
                placeholder="请输入标题"
                v-model.trim="searchFormData.nickNameFuzzy"
                @keyup.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="版块" prop="boardIds">
              <el-cascader
                clearable
                :options="boardList"
                placeholder="请选择版块"
                v-model.trim="searchFormData.boardIds"
                :style="{ width: '100%' }"
                :props="boardProps"
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="附件" prop="attachmentType">
              <el-select
                clearable
                placeholder="请选择"
                v-model.trim="searchFormData.attachmentType"
                :style="{ width: '100%' }"
              >
                <el-option :value="1" label="有附件"></el-option>
                <el-option :value="0" label="无附件"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="状态" prop="status">
              <el-select
                clearable
                placeholder="请选择状态"
                v-model.trim="searchFormData.status"
                :style="{ width: '100%' }"
              >
                <el-option :value="-1" label="已删除"></el-option>
                <el-option :value="0" label="待审核"></el-option>
                <el-option :value="1" label="已审核"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="4">
            <el-form-item label="置顶" prop="topType">
              <el-select
                clearable
                placeholder="请选择"
                v-model.trim="searchFormData.topType"
                :style="{ width: '100%' }"
              >
                <el-option :value="0" label="未置顶"></el-option>
                <el-option :value="1" label="已置顶"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{ paddingLeft: '10px', minWidth: '300px' }">
            <el-button-group>
              <el-button
                type="primary"
                @click="loadDataList"
                :style="{ marginLeft: '10px' }"
                >搜索</el-button
              >
              <el-button
                type="success"
                @click="auditBatch"
                :disabled="selectBatchList.length === 0"
                >批量审批</el-button
              >
              <el-button
                type="danger"
                @click="delBatch"
                :disabled="selectBatchList.length === 0"
                >批量删除</el-button
              >
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <Table
      ref="tableRef"
      :columns="columns"
      :dataSource="tableData"
      :fetch="loadDataList"
      :options="tableOptions"
      @rowSelected="setRowSelect"
    >
      <!-- 用户信息 -->
      <template #userInfo="{ index, row }">
        <div class="user-info">
          <Avatar :userId="row.userId" :size="50"></Avatar>
          <div class="right">
            <div>
              <a
                :href="`${proxy.globalInfo.webDomain}/user/${row.userId}`"
                class="a-link"
                target="_blank"
                >{{ row.nickName }}
              </a>
            </div>
            <div>{{ row.userIpAddress }}</div>
          </div>
        </div>
      </template>
      <!-- 封面 -->
      <template #cover="{ index, row }">
        <Cover :cover="row.cover" :size="60"></Cover>
      </template>
      <!-- 标题 -->
      <template #titleInfo="{ index, row }">
        <a
          :href="`${proxy.globalInfo.webDomain}/post/${row.articleId}`"
          class="a-link"
        >
          {{ row.title }}
        </a>
      </template>
      <!-- 版块 -->
      <template #boardInfo="{ index, row }">
        <span>{{ row.pBoardName }}</span>
        <span v-if="row.boardName">、{{ row.boardName }}</span>
      </template>
      <!-- 互动信息 -->
      <template #interactionInfo="{ index, row }">
        <div>阅读：{{ row.readCount }}</div>
        <div>点赞：{{ row.goodCount }}</div>
        <div>
          评论：<span>{{ row.commentCount }}</span>
          <span
            class="a-link"
            :style="{ marginLeft: '5px', cursor: 'pointer' }"
            v-if="row.commentCount"
            @click="showComment(row.articleId)"
            >查看</span
          >
        </div>
      </template>
      <!-- 附件信息 -->
      <template #attachmentInfo="{ index, row }">
        <div v-if="row.attachmentType === 0">无附件</div>
        <div v-if="row.attachmentType === 1">
          <span
            class="a-link"
            @click="showAttachment(row.nickName, row.articleId)"
            >查看附件</span
          >
        </div>
      </template>
      <!-- 状态 -->
      <template #statusInfo="{ index, row }">
        <span v-if="row.status === -1" :style="{ color: 'red' }">已删除</span>
        <span v-if="row.status === 0" :style="{ color: 'red' }">待审核</span>
        <span v-if="row.status === 1" :style="{ color: 'green' }">已审核</span>
        <div v-if="row.topType === 1" :style="{ color: 'green' }">已置顶</div>
        <div v-if="row.topType === 0" :style="{ color: 'green' }">未置顶</div>
      </template>
      <!-- 操作信息 -->
      <template #op="{ index, row }">
        <div class="op" v-if="row.status != -1">
          <el-dropdown trigger="click">
            <span class="iconfont icon-more"></span>
            <template #dropdown>
              <el-dropdown-item @click="updateBoard(row)"
                >修改版块</el-dropdown-item
              >
              <el-dropdown-item
                @click="topArticle(row)"
                v-if="row.topType === 1 && row.status === 1"
                >取消置顶
              </el-dropdown-item>
              <el-dropdown-item
                @click="topArticle(row)"
                v-if="row.topType === 0 && row.status === 1"
                >置顶
              </el-dropdown-item>
              <el-dropdown-item @click="delArticle(row)"
                >删除
              </el-dropdown-item>
              <el-dropdown-item @click="audit(row)" v-if="row.status === 0"
                >审核
              </el-dropdown-item>
            </template>
          </el-dropdown>
        </div>
      </template>
    </Table>
  </div>
  <ArticleBoard ref="articleBoardRef" @reload="loadDataList"></ArticleBoard>
</template>

<script setup>
import ArticleBoard from "@/views/forum/ArticleBoard.vue";
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const api = {
  loadDataList: "/forum/loadArticle",
  loadBoard: "/board/loadBoard",
  auditArticle: "/forum/auditArticle",
  delArticle: "/forum/delArticle",
  topArticle: "/forum/topArticle",
};

// 搜索
const searchFormData = ref({});
//选中
const selectBatchList = ref([]);

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

// 批量操作
const auditBatch = () => {
  proxy.Confirm("你确定要批量审核么?", async () => {
    const result = await proxy.Request({
      url: api.auditArticle,
      params: {
        articleIds: selectBatchList.value.join(","),
      },
    });
    if (!result) return;
    tableRef.value.clearSelection();
    proxy.Message.success("审核成功!");
    loadDataList();
  });
};
const delBatch = () => {
  proxy.Confirm("你确定要批量删除么?", async () => {
    const result = await proxy.Request({
      url: api.delArticle,
      params: {
        articleIds: selectBatchList.value.join(","),
      },
    });
    if (!result) return;
    tableRef.value.clearSelection();
    proxy.Message.success("删除成功!");
    loadDataList();
  });
};

const tableRef = ref(null);
const tableOptions = ref({
  selectType: "checkbox",
  extHeight: 0,
});
const columns = [
  {
    label: "用户信息",
    prop: "avatar",
    width: 200,
    // 插槽名称
    scopedSlots: "userInfo",
  },
  {
    label: "封面",
    prop: "cover",
    width: 100,
    scopedSlots: "cover",
  },
  {
    label: "标题",
    scopedSlots: "titleInfo",
    width: 400,
  },
  {
    label: "版块",
    width: 150,
    scopedSlots: "boardInfo",
  },
  {
    label: "互动信息",
    width: 150,
    scopedSlots: "interactionInfo",
  },
  {
    label: "是否有附件",
    prop: "attachment",
    width: 100,
    scopedSlots: "attachmentInfo",
  },
  {
    label: "状态信息",
    prop: "status",
    width: 100,
    scopedSlots: "statusInfo",
  },
  {
    label: "发布时间",
    prop: "postTime",
    width: 180,
  },
  {
    label: "操作",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];
const tableData = ref({});
const loadDataList = async () => {
  const params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
  };
  Object.assign(params, searchFormData.value);
  if (params.boardIds?.length === 1) {
    params.pBoardId = params.boardIds[0];
  } else if (params.boardIds?.length === 2) {
    params.pBoardId = params.boardIds[0];
    params.boardId = params.boardIds[1];
  }
  delete params.boardIds;
  const result = await proxy.Request({
    url: api.loadDataList,
    params,
  });
  if (!result) return;
  tableData.value = result.data;
};
const setRowSelect = (rows) => {
  selectBatchList.value = [];
  rows.forEach((item) => {
    selectBatchList.value.push(item.articleId);
  });
};

const showComment = (articleId) => {};
const showAttachment = (nickName, articleId) => {};
// 修改版块
const articleBoardRef = ref(null);
const updateBoard = (row) => {
  articleBoardRef.value.updateBoard(row);
};
// 置顶/取消置顶
const topArticle = (row) => {
  const modalText = row.topType === 0 ? "设为置顶" : "取消置顶";
  proxy.Confirm(`你确定要将文章《${row.title}》${modalText}么?`, async () => {
    const result = await proxy.Request({
      url: api.topArticle,
      params: {
        articleId: row.articleId,
        topType: row.topType === 0 ? 1 : 0,
      },
    });
    if (!result) return;
    proxy.Message.success(`${modalText}成功`);
    loadDataList();
  });
};
const delArticle = (row) => {
  proxy.Confirm(`你确定要删除《${row.title}》么?`, async () => {
    const result = await proxy.Request({
      url: api.delArticle,
      params: {
        articleIds: row.articleId,
      },
    });
    if (!result) return;
    proxy.Message.success("删除成功!");
    loadDataList();
  });
};
// 审核
const audit = (row) => {
  proxy.Confirm(`你确定要审核《${row.title}》么?`, async () => {
    const result = await proxy.Request({
      url: api.auditArticle,
      params: {
        articleIds: row.articleId,
      },
    });
    if (!result) return;
    proxy.Message.success("审核成功!");
    loadDataList();
  });
};
</script>

<style lang="scss" scoped>
.user-info {
  display: flex;
  align-items: center;
  .right {
    margin-left: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
.icon-more {
  cursor: pointer;
}
</style>
