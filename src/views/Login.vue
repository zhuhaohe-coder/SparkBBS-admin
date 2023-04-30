<template>
  <div class="login-body">
    <div class="login-panel">
      <div class="login-title">登录</div>
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <!--input输入-->
        <el-form-item prop="account">
          <el-input
            clearable
            placeholder="请输入账号"
            v-model.trim="formData.account"
            size="large"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            clearable
            placeholder="请输入密码"
            v-model.trim="formData.password"
            type="password"
            size="large"
            show-password
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              clearable
              placeholder="请输入验证码"
              v-model.trim="formData.checkCode"
              size="large"
              :style="{ width: '155px', 'margin-right': '12px' }"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
          </div>
          <img
            :src="checkCodeUrl"
            class="check-code"
            @click="changeCheckCode"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :style="{ width: '100%', 'margin-left': 0 }"
            @click="login"
            >登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
import md5 from "js-md5";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();

const formData = ref({});
const formDataRef = ref();
const rules = {
  account: [{ required: true, message: "请输入账号" }],
  password: [{ required: true, message: "请输入密码" }],
  checkCode: [{ required: true, message: "请输入验证码" }],
};

const api = {
  checkCode: "/api/checkCode",
  login: "/login",
};

const checkCodeUrl = ref(api.checkCode);
const changeCheckCode = () => {
  checkCodeUrl.value = api.checkCode + "?" + new Date().getTime();
};

const login = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) return;
    const params = Object.assign({}, formData.value);
    params.password = md5(params.password);
    const result = await proxy.Request({
      url: api.login,
      params,
      errorCallback: () => {
        changeCheckCode();
      },
    });
    if (!result) return;
    proxy.Message.success("登陆成功", () => {
      router.push("/");
    });
    proxy.VueCookies.set("userInfo", result.data, 0);
  });
};
</script>

<style lang="scss" scoped>
.login-body {
  width: 100%;
  height: 100vh;
  background-size: cover;
  background-position: center;
  background-image: url(@/assets/login-bg.jpg);
  .login-panel {
    padding: 25px;
    box-sizing: border-box;
    width: 350px;

    position: absolute;
    left: 15%;
    top: 25%;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 5px;
    .login-title {
      margin-bottom: 20px;
      font-size: 25px;
    }
  }
}
</style>
