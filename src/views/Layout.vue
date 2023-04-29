<template>
  <div class="layout-body">
    <el-container>
      <el-aside class="aside" :style="{ width: asideWidth + 'px' }">
        <div class="logo">
          <span v-if="!menuCollapse">SparkBBS后台管理系统</span>
        </div>
        <div class="menu-panel">
          <el-menu
            active-text-color="#ffd04b"
            background-color="#545c64"
            class="el-menu-vertical-demo"
            text-color="#fff"
            router
            :default-openeds="defaultOpeneds"
            :default-active="defaultActive"
            :collapse-transition="false"
            :collapse="menuCollapse"
          >
            <template v-for="item in menuList">
              <el-sub-menu v-if="item.children" :index="item.path">
                <template #title>
                  <i :class="['iconfont', item.icon]"></i>
                  <span class="menu-name">{{ item.menuName }}</span>
                </template>
                <el-menu-item
                  v-for="(subItem, index) in item.children"
                  :index="subItem.path"
                  :key="index"
                >
                  <span class="menu-name">{{ subItem.menuName }}</span>
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item v-else :index="item.path">
                <template #title>
                  <i :class="['iconfont', item.icon]"></i>
                  <span class="menu-name">{{ item.menuName }}</span>
                </template>
              </el-menu-item>
            </template>
          </el-menu>
        </div>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div
            class="op-menu iconfont"
            :class="menuCollapse ? 'icon-expand' : 'icon-collapse'"
            @click="opMenu"
          ></div>
          <div class="menu-bread">
            <el-breadcrumb>
              <template v-for="item in menuBreadCrumbList">
                <el-breadcrumb-item v-if="item.name">
                  {{ item.name }}
                </el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
        </el-header>
        <el-main class="main">
          <el-tabs
            type="card"
            v-if="tabList.length > 0"
            @tab-change="tabClick"
            @tab-remove="removeTab"
            v-model="defaultActive"
          >
            <el-tab-pane
              v-for="(tab, index) in tabList"
              :key="index"
              :name="tab.path"
              :label="tab.menuName"
              :closable="tabList.length > 1"
            >
            </el-tab-pane>
          </el-tabs>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const asideWidth = ref(250);

// 默认选中
const defaultActive = ref(null);

// 默认展开的菜单
const defaultOpeneds = ref([]);

const menuList = [
  {
    menuName: "内容管理",
    icon: "icon-article",
    path: "/forum",
    children: [
      {
        menuName: "帖子管理",
        path: "/forum/article",
      },
      {
        menuName: "评论管理",
        path: "/forum/comment",
      },
      {
        menuName: "版块管理",
        path: "/forum/board",
      },
    ],
  },
  {
    menuName: "用户管理",
    icon: "icon-user",
    path: "/user",
    children: [
      {
        menuName: "用户列表",
        path: "/user/list",
      },
    ],
  },
  {
    menuName: "设置",
    icon: "icon-settings",
    path: "/settings",
    children: [
      {
        menuName: "系统设置",
        path: "/settings/sys",
      },
    ],
  },
];

const menuMap = {};
const init = () => {
  menuList.forEach((item) => {
    defaultOpeneds.value.push(item.path);
    item.children.forEach((subItem) => {
      menuMap[subItem.path] = subItem;
    });
  });
};

// 面包屑
const menuBreadCrumbList = ref(null);

// 收起关闭菜单
const menuCollapse = ref(false);
// 展开收起aside
const opMenu = () => {
  menuCollapse.value = !menuCollapse.value;
  if (menuCollapse.value) {
    asideWidth.value = 63;
  } else {
    asideWidth.value = 250;
  }
};

//tab操作
const tabList = ref([]);
const tabClick = (tabName) => {
  router.push(tabName);
};
const removeTab = (tabName) => {
  let currentTab = defaultActive.value;
  // 关闭当前选中的标签
  if (tabName === currentTab) {
    tabList.value.forEach((tab, index) => {
      if (tab.path === tabName) {
        const nextTab = tabList.value[index + 1] || tabList.value[index - 1];
        if (nextTab) currentTab = nextTab.path;
      }
    });
  }
  tabList.value = tabList.value.filter((tab) => tab.path !== tabName);
  if (currentTab !== defaultActive.value) {
    router.push(currentTab);
  }
};

init();

watch(
  () => route,
  () => {
    defaultActive.value = route.path;
    menuBreadCrumbList.value = route.matched;
    //添加标签
    const currentMenu = tabList.value.find(
      (item) => item.path === defaultActive.value
    );
    if (!currentMenu) {
      tabList.value.push(menuMap[route.path]);
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.aside {
  background: #3d3c4a;
  .logo {
    color: #fff;
    height: 50px;
    line-height: 50px;
    padding-left: 10px;
    font-size: 18px;
  }
  .menu-panel {
    height: calc(100vh - 50px);
    .menu-name {
      margin-left: 10px;
    }
  }
}
.header {
  background: #fff;
  border-bottom: 1px solid #ddd;
  height: 50px;
  line-height: 50px;
  display: flex;
  align-items: center;
  .op-menu {
    font-size: 25px;
    cursor: pointer;
    color: #3a3a40;
  }
  .menu-bread {
    margin-left: 10px;
  }
}
</style>
