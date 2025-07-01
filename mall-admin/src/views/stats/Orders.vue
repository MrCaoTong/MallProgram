<template>
  <div class="stats-orders-page">
    <!-- 订单概览卡片 -->
    <el-card class="overview-card">
      <div class="overview-header">
        <span>订单概览</span>
        <el-radio-group v-model="dateType" size="mini" style="float:right" @change="fetchAll">
          <el-radio-button label="today">今日</el-radio-button>
          <el-radio-button label="week">本周</el-radio-button>
          <el-radio-button label="month">本月</el-radio-button>
        </el-radio-group>
      </div>
      <el-row :gutter="20" class="overview-row">
        <el-col v-for="item in orderSummary" :key="item.label" :span="4">
          <div class="stat-item">
            <div class="stat-title">{{ item.label }}</div>
            <div class="stat-value">{{ item.value }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 转化率统计 -->
    <el-card class="conversion-card">
      <div class="conversion-header">转化率统计</div>
      <el-row :gutter="20">
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-title">访问量(PV)</div>
            <div class="stat-value">{{ conversionStats.pv }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-item">
            <div class="stat-title">访客数(UV)</div>
            <div class="stat-value">{{ conversionStats.uv }}</div>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="stat-title">下单数</div>
          <div class="stat-value">{{ conversionStats.orderCount }}</div>
        </el-col>
        <el-col :span="6">
          <div class="stat-title">转化率</div>
          <div class="stat-value">{{ conversionStats.conversionRate }}%</div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 订单状态分布 -->
    <el-card class="status-card">
      <div slot="header">订单状态分布</div>
      <v-chart class="chart" :options="orderOption" autoresize />
    </el-card>
  </div>
</template>

<script>
import VChart from 'vue-echarts';
import { getOrderStats, getConversionStats } from '@/api/stats';

export default {
  name: 'StatsOrders',
  components: { VChart },
  data() {
    return {
      dateType: 'today',
      orderSummary: [
        { label: '订单总数', value: 0 },
        { label: '待付款', value: 0 },
        { label: '待发货', value: 0 },
        { label: '已发货', value: 0 },
        { label: '已完成', value: 0 },
        { label: '已取消', value: 0 }
      ],
      conversionStats: { pv: 0, uv: 0, orderCount: 0, conversionRate: 0 },
      orderOption: {}
    };
  },
  created() {
    this.fetchAll();
  },
  methods: {
    async fetchAll() {
      await Promise.all([this.fetchOrderStats(), this.fetchConversionStats()]);
    },
    async fetchOrderStats() {
      // 假设 getOrderStats 支持 dateType 参数
      const res = await getOrderStats({ dateType: this.dateType });
      // 订单概览
      this.orderSummary = [
        { label: '订单总数', value: res.data.total || 0 },
        { label: '待付款', value: res.data.pendingPay || 0 },
        { label: '待发货', value: res.data.pendingShip || 0 },
        { label: '已发货', value: res.data.shipped || 0 },
        { label: '已完成', value: res.data.finished || 0 },
        { label: '已取消', value: res.data.canceled || 0 }
      ];
      // 订单状态分布图
      const statusMap = { 0: '待付款', 1: '待发货', 2: '已发货', 3: '已完成', 4: '已取消' };
      const chartData = Object.keys(res.data.statusCount || {}).map(key => ({
        name: statusMap[key] || '未知',
        value: res.data.statusCount[key]
      }));
      this.orderOption = {
        tooltip: { trigger: 'item' },
        legend: { top: '5%', left: 'center' },
        series: [{
          name: '订单状态',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: '20', fontWeight: 'bold' }
          },
          labelLine: { show: false },
          data: chartData
        }]
      };
    },
    async fetchConversionStats() {
      // 假设 getConversionStats 支持 dateType 参数
      const res = await getConversionStats({ dateType: this.dateType });
      this.conversionStats = res.data;
    }
  }
}
</script>

<style scoped>
.stats-orders-page {
  padding: 20px;
}
.overview-card, .conversion-card, .status-card {
  margin-bottom: 20px;
}
.overview-header, .conversion-header {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}
.overview-row {
  margin-top: 10px;
}
.stat-item {
  text-align: center;
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
.chart {
  height: 400px;
}
</style> 