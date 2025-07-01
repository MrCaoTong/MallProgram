<template>
  <div class="stats-orders-page">
    <el-card>
        <div slot="header">订单状态分布</div>
        <v-chart class="chart" :options="orderOption" autoresize />
    </el-card>
  </div>
</template>

<script>
import VChart from 'vue-echarts';
import { getOrderStats } from '@/api/stats';

export default {
  name: 'StatsOrders',
  components: { VChart },
  data() {
    return {
      orderOption: {}
    };
  },
  created() {
    this.fetchOrderStats();
  },
  methods: {
    async fetchOrderStats() {
      const res = await getOrderStats();
      const statusMap = { 0: '待支付', 1: '已支付', 2: '已发货', 3: '已完成', 4: '已取消' };
      const chartData = res.data.map(item => ({
          name: statusMap[item.status] || '未知',
          value: item.count
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
    }
  }
}
</script>

<style scoped>
.stats-orders-page {
  padding: 20px;
}
.chart {
  height: 400px;
}
</style> 