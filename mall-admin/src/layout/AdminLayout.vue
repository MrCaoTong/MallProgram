<template>
  <el-container style="height: 100vh;">
    <el-aside width="220px" style="background: #2d3a4b;">
      <el-menu :default-active="$route.path" class="el-menu-vertical-demo" background-color="#2d3a4b" text-color="#fff" active-text-color="#409EFF" router>
        <el-menu-item index="/admin/banner">
          <i class="el-icon-picture"></i>
          <span slot="title">轮播图管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/category">
          <i class="el-icon-menu"></i>
          <span slot="title">商品分类管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/goods">
          <i class="el-icon-goods"></i>
          <span slot="title">商品管理</span>
        </el-menu-item>
        <el-menu-item index="/admin/order">
          <i class="el-icon-document"></i>
          <span slot="title">订单管理</span>
        </el-menu-item>
        <el-submenu index="/admin/stats">
          <template slot="title">
            <i class="el-icon-data-analysis"></i>
            <span>数据统计</span>
          </template>
          <el-menu-item index="/admin/stats/sales">销售统计</el-menu-item>
          <el-menu-item index="/admin/stats/trend">销售趋势</el-menu-item>
          <el-menu-item index="/admin/stats/hot-goods">热销商品</el-menu-item>
          <el-menu-item index="/admin/stats/orders">订单统计</el-menu-item>
          <el-menu-item index="/admin/stats/conversion">转化率统计</el-menu-item>
        </el-submenu>
        <el-menu-item index="/admin/system">
          <i class="el-icon-setting"></i>
          <span slot="title">系统设置</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="background: #fff; box-shadow: 0 1px 4px rgba(0,21,41,.08); height: 60px; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-size: 20px; font-weight: bold; color: #2d3a4b;">商城管理后台</span>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            <i class="el-icon-user"></i> {{ adminUsername }}<i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main style="background: #f5f6fa;">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import { adminLogout } from '@/api/admin';

export default {
  name: 'AdminLayout',
  computed: {
    ...mapState(['adminInfo']),
    adminUsername() {
      return this.adminInfo ? this.adminInfo.nickname || this.adminInfo.username : '未登录';
    }
  },
  methods: {
    ...mapMutations(['clearAdminInfo']),
    handleCommand(command) {
      if (command === 'logout') {
        this.handleLogout();
      }
    },
    async handleLogout() {
      try {
        await this.$confirm('确定要退出登录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        });

        await adminLogout();
        this.clearAdminInfo();
        this.$router.push('/login');
        this.$message.success('退出成功');
      } catch (error) {
        // 如果是取消操作，则不提示错误
        if (error !== 'cancel') {
            console.error('退出操作失败', error);
        }
      }
    }
  }
}
</script>

<style scoped>
.el-menu {
  border-right: none;
}
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
  display: flex;
  align-items: center;
}
</style> 