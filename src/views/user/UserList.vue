<template>
  <div>
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
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
            <el-form-item label="性别" prop="sex">
              <el-select
                clearable
                placeholder="请选择性别"
                v-model.trim="searchFormData.sex"
                :style="{ width: '100%' }"
              >
                <el-option :value="1" label="男"></el-option>
                <el-option :value="0" label="女"></el-option>
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
                <el-option :value="1" label="正常"></el-option>
                <el-option :value="0" label="禁用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{ paddingLeft: '10px', minWidth: '300px' }">
            <el-button
              type="primary"
              @click="loadDataList"
              :style="{ marginLeft: '10px' }"
              >搜索</el-button
            >
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
      >
        <!-- 头像 -->
        <template #avatar="{ index, row }">
          <Avatar :userId="row.userId" :size="50"></Avatar>
        </template>
        <!-- 昵称-->
        <template #nickName="{ index, row }">
          {{ row.nickName }}
          <span v-if="row.sex">{{ row.sex === 0 ? "女" : "男" }}</span>
        </template>
        <!-- 登录信息 -->
        <template #loginInfo="{ index, row }">
          <div>最后登录时间 : {{ row.lastLoginTime }}</div>
          <div>最后登录IP : {{ row.lastLoginIp }}</div>
          <div>最后登录地点 : {{ row.lastLoginIpAddress }}</div>
        </template>
        <!-- 类型 -->
        <template #integral="{ index, row }">
          <div>总积分 : {{ row.totalIntegral }}</div>
          <div>当前积分 : {{ row.currentIntegral }}</div>
        </template>
        <!-- 状态 -->
        <template #status="{ index, row }">
          <span v-if="row.status === 1" :style="{ color: 'green' }">正常</span>
          <span v-else :style="{ color: 'red' }">禁用</span>
        </template>
        <!-- 操作信息 -->
        <template #op="{ index, row }">
          <div class="op" v-if="row.status !== -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updateUserStatus(row)"
                    >{{ row.status === 1 ? "禁用" : "启用" }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="sendMessage(row)"
                    >发送系统消息
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
  </div>
  <SendMessage ref="sendMessageRef" @reload="loadDataList"></SendMessage>
</template>

<script setup>
import SendMessage from "./SendMessage.vue";
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const searchFormData = ref({});
const api = {
  loadDataList: "/user/loadUserList",
  updateUserStatus: "/user/updateUserStatus",
  sendMessage: "/user/sendMessage",
};
const columns = [
  {
    label: "头像",
    prop: "avatar",
    width: 80,
    // 插槽名称
    scopedSlots: "avatar",
  },
  {
    label: "昵称",
    prop: "nickName",
    scopedSlots: "nickName",
    width: 150,
  },
  {
    label: "邮箱",
    prop: "email",
    width: 180,
  },
  {
    label: "个人描述",
    prop: "personDescription",
  },
  {
    label: "加入时间",
    prop: "joinTime",
    width: 180,
  },
  {
    label: "登录信息",
    prop: "lastLoginTime",
    width: 260,
    scopedSlots: "loginInfo",
  },
  {
    label: "积分",
    prop: "totalIntegral",
    width: 150,
    scopedSlots: "integral",
  },
  {
    label: "状态",
    prop: "status",
    width: 60,
    scopedSlots: "status",
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

const updateUserStatus = (row) => {
  const message = row.status === 1 ? "禁用" : "启用";
  proxy.Confirm(`你确定要${message}用户${row.nickName}`, async () => {
    const result = await proxy.Request({
      url: api.updateUserStatus,
      params: {
        userId: row.userId,
        status: row.status === 1 ? 0 : 1,
      },
    });
    if (!result) return;
    proxy.Message.success(`${message}成功!`);
    loadDataList();
  });
};
// 发送系统消息
const sendMessageRef = ref(null);
const sendMessage = (row) => {
  sendMessageRef.value.sendMessage(row);
};
</script>

<style lang="scss" scoped>
.op {
  cursor: pointer;
}
</style>
