<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2 style="text-align: center; margin-bottom: 20px;">后台管理系统登录</h2>
      <el-form :model="loginForm" :rules="loginRules" ref="loginForm" @submit.native.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="用户名" prefix-icon="el-icon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" placeholder="密码" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" style="width: 100%;" :loading="loading">
            {{ loading ? '登录中...' : '登 录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { adminLogin } from '@/api/admin';

export default {
  name: 'Login',
  data() {
    return {
      loading: false,
      loginForm: {
        username: 'admin',
        password: 'admin'
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            const res = await adminLogin(this.loginForm);
            if (res.code === 200) {
              // 登录成功后，将用户信息存入Vuex
              this.$store.commit('setAdminInfo', res.data);
              this.$message.success('登录成功');
              this.$router.push({ path: this.$route.query.redirect || '/admin' });
            }
          } catch (error) {
            console.error('登录失败:', error);
          } finally {
            this.loading = false;
          }
        }
      });
    }
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f2f3f5;
}
.login-card {
  width: 400px;
}
</style> 