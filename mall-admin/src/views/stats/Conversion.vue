<template>
  <div class="stats-conversion-page">
    <el-card>
      <div slot="header">转化率统计</div>
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="stat-item">
            <div class="stat-title">总用户数</div>
            <div class="stat-value">{{ stats.totalUsers }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="stat-item">
            <div class="stat-title">有下单用户数</div>
            <div class="stat-value">{{ stats.orderUsers }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="stat-item">
            <div class="stat-title">有支付用户数</div>
            <div class="stat-value">{{ stats.payUsers }}</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="stat-item">
            <div class="stat-title">下单转化率</div>
            <div class="stat-value">{{ stats.orderConversion }}%</div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="stat-item">
            <div class="stat-title">支付转化率</div>
            <div class="stat-value">{{ stats.payConversion }}%</div>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getConversionStats } from '@/api/stats';

export default {
  name: 'StatsConversion',
  data() {
    return {
      stats: {
        totalUsers: 0,
        orderUsers: 0,
        payUsers: 0,
        orderConversion: '0.00',
        payConversion: '0.00'
      }
    };
  },
  created() {
    this.fetchStats();
  },
  methods: {
    async fetchStats() {
      const res = await getConversionStats();
      this.stats = res.data;
    }
  }
}
</script>

<style scoped>
.stats-conversion-page {
  padding: 20px;
}
.stat-item {
  text-align: center;
  margin-bottom: 20px;
}
.stat-title {
  font-size: 16px;
  color: #8c939d;
  margin-bottom: 10px;
}
.stat-value {
  font-size: 24px;
  font-weight: bold;
}
</style> 