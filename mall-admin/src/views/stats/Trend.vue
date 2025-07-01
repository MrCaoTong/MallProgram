<template>
  <div class="stats-trend-page">
    <el-card>
      <div slot="header">近7日销售趋势</div>
      <v-chart class="chart" :options="trendOption" />
    </el-card>
  </div>
</template>

<script>
import VChart from 'vue-echarts';
import { getSalesTrend } from '@/api/stats';

export default {
  name: 'StatsTrend',
  components: { VChart },
  data() {
    return {
      trendOption: {}
    };
  },
  created() {
    this.fetchTrend();
  },
  methods: {
    async fetchTrend() {
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
.stats-trend-page {
  padding: 20px;
}
.chart {
  height: 400px;
}
</style> 