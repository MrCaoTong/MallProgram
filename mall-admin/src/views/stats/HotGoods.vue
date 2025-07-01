<template>
  <div class="stats-hot-goods-page">
    <el-card>
        <div slot="header">热销商品排行 (Top 10)</div>
        <v-chart class="chart" :options="hotGoodsOption" autoresize />
    </el-card>
  </div>
</template>

<script>
import VChart from 'vue-echarts';
import { getHotGoods } from '@/api/stats';

export default {
  name: 'StatsHotGoods',
  components: { VChart },
  data() {
    return {
      hotGoodsOption: {}
    };
  },
  created() {
    this.fetchHotGoods();
  },
  methods: {
    async fetchHotGoods() {
      const res = await getHotGoods();
      this.hotGoodsOption = {
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        xAxis: {
          type: 'category',
          data: res.data.map(item => item.name),
          axisLabel: {
              interval: 0,
              rotate: 30
          }
        },
        yAxis: { type: 'value' },
        series: [{
          name: '销量',
          data: res.data.map(item => item.total_quantity),
          type: 'bar'
        }]
      };
    }
  }
}
</script>

<style scoped>
.stats-hot-goods-page {
  padding: 20px;
}
.chart {
  height: 400px;
}
</style> 