<template>
  <div class="stats-sales-page">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-title">今日销售额</div>
            <div class="stat-value">¥ {{ salesStats.today | numberFormat }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-title">本周销售额</div>
            <div class="stat-value">¥ {{ salesStats.week | numberFormat }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
          <div class="stat-item">
            <div class="stat-title">本月销售额</div>
            <div class="stat-value">¥ {{ salesStats.month | numberFormat }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-card style="margin-top: 20px;">
        <div slot="header">近7日销售趋势</div>
        <v-chart class="chart" :option="trendOption" autoresize />
    </el-card>
  </div>
</template>

<script>
import VChart from 'vue-echarts';
import { getSalesStats, getSalesTrend } from '@/api/stats';

export default {
  name: 'StatsSales',
  components: { VChart },
  data() {
    return {
      salesStats: { today: 0, week: 0, month: 0 },
      trendOption: {}
    };
  },
  filters: {
      numberFormat(value) {
          return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
  },
  created() {
    this.fetchSalesStats();
    this.fetchSalesTrend();
  },
  methods: {
    async fetchSalesStats() {
      const res = await getSalesStats();
      this.salesStats = res.data;
    },
    async fetchSalesTrend() {
      const res = await getSalesTrend();
      this.trendOption = {
        tooltip: { trigger: 'axis' },
        xAxis: {
          type: 'category',
          data: res.data.map(item => new Date(item.date).toLocaleDateString())
        },
        yAxis: { type: 'value' },
        series: [{
          data: res.data.map(item => item.sales),
          type: 'line',
          smooth: true
        }]
      };
    }
  }
}
</script>

<style scoped>
.stats-sales-page {
  padding: 20px;
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