<template>
  <div>
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="内容" prop="contentFuzzy">
              <el-input
                clearable
                placeholder="支持模糊搜索"
                v-model.trim="searchFormData.contentFuzzy"
                @keyup.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="昵称" prop="nickNameFuzzy">
              <el-input
                clearable
                placeholder="请输入昵称"
                v-model.trim="searchFormData.nickNameFuzzy"
                @keyup.native="loadDataList"
              ></el-input>
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
          <el-col :span="4" :style="{ paddingLeft: '10px', minWidth: '300px' }">
            <el-button-group>
              <el-button
                type="primary"
                @click="loadDataList"
                :style="{ marginLeft: '10px' }"
                >搜索</el-button
              >
              <el-button type="success" @click="auditBatch">批量审批</el-button>
              <el-button type="danger" @click="delBatch">批量删除</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-list">
      <Table
        ref="tableRef"
        :columns="columns"
        :dataSource="tableData"
        :fetch="loadDataList"
        :options="tableOptions"
        @rowSelected="setRowSelected"
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
        <!-- 查看文章 -->
        <template #contentInfo="{ index, row }">
          <span>
            <a
              :href="`${proxy.globalInfo.webDomain}/post/${row.articleId}`"
              class="a-link"
            >
              查看文章
            </a>
          </span>
          <div v-html="row.content"></div>
          <div v-if="row.imgPath">
            <CommentImage
              :src="proxy.globalInfo.imageUrl + row.imgPath.replace('.', '_.')"
              :image-list="[proxy.globalInfo.imageUrl + row.imgPath]"
            ></CommentImage>
          </div>
        </template>
        <!-- 状态 -->
        <template #statusInfo="{ index, row }">
          <span v-if="row.status === -1" :style="{ color: 'red' }">已删除</span>
          <span v-if="row.status === 0" :style="{ color: 'red' }">待审核</span>
          <span v-if="row.status === 1" :style="{ color: 'green' }"
            >已审核</span
          >
        </template>
        <!-- 操作信息 -->
        <template #op="{ index, row }">
          <div class="op" v-if="row.status !== -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="delComment(row)"
                    >删除
                  </el-dropdown-item>
                  <el-dropdown-item @click="audit(row)" v-if="row.status === 0"
                    >审核
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const searchFormData = ref({});
const api = {
  loadDataList: "/forum/loadComment",
  delComment: "/forum/delComment",
  auditComment: "/forum/auditComment",
};
const columns = [
  {
    label: "用户信息",
    prop: "avatar",
    width: 200,
    // 插槽名称
    scopedSlots: "userInfo",
  },
  {
    label: "评论内容",
    prop: "content",
    scopedSlots: "contentInfo",
  },
  {
    label: "点赞",
    prop: "goodCount",
    width: 150,
  },
  {
    label: "状态",
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
    label: "发布地址",
    prop: "userIpAddress",
    width: 100,
  },
  {
    label: "操作",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];
const tableRef = ref(null);
const tableData = ref({});
const tableOptions = ref({
  extHeight: 50,
  selectType: "checkbox",
});

const loadDataList = async () => {
  const params = {
    pageNo: tableData.value.pageNo || 1,
    pageSize: tableData.value.pageSize || 15,
  };
  Object.assign(params, searchFormData.value);

  const result = await proxy.Request({
    url: api.loadDataList,
    params,
  });
  if (!result) return;
  tableData.value = result.data;
};
const selectBatchList = ref([]);
const setRowSelected = (rows) => {
  selectBatchList.value = [];
  rows.forEach((item) => {
    selectBatchList.value.push(item.commentId);
  });
};
const delComment = (row) => {
  proxy.Confirm(`你确定要删除该评论么?`, async () => {
    const result = await proxy.Request({
      url: api.delComment,
      params: {
        commentIds: row.commentId,
      },
    });
    if (!result) return;
    proxy.Message.success("删除成功!");
    loadDataList();
  });
};
const audit = (row) => {
  proxy.Confirm(`你确定要审核该评论么?`, async () => {
    const result = await proxy.Request({
      url: api.auditComment,
      params: {
        commentIds: row.commentId,
      },
    });
    if (!result) return;
    proxy.Message.success("审核成功!");
    loadDataList();
  });
};
const auditBatch = () => {
  proxy.Confirm("你确定要批量审核么?", async () => {
    const result = await proxy.Request({
      url: api.auditComment,
      params: {
        commentIds: selectBatchList.value.join(","),
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
      url: api.delComment,
      params: {
        commentIds: selectBatchList.value.join(","),
      },
    });
    if (!result) return;
    tableRef.value.clearSelection();
    proxy.Message.success("删除成功!");
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
