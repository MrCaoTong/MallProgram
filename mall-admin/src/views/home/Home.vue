<template>
  <div class="dashboard">
    <el-row :gutter="20">
      <el-col :span="8">
        <el-card>
          <div class="stat-title">今日销售额</div>
          <div class="stat-value">￥{{ dashboard.todaySales }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="stat-title">本周销售额</div>
          <div class="stat-value">￥{{ dashboard.weekSales }}</div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <div class="stat-title">本月销售额</div>
          <div class="stat-value">￥{{ dashboard.monthSales }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 30px;">
      <el-col :span="12">
        <el-card>
          <div class="stat-title">订单统计</div>
          <div class="order-stats">
            <div class="order-stat-item">
              <div class="order-stat-value">{{ dashboard.orderStats.pendingPay }}</div>
              <div class="order-stat-label">待付款</div>
            </div>
            <div class="order-stat-item">
              <div class="order-stat-value">{{ dashboard.orderStats.pendingShip }}</div>
              <div class="order-stat-label">待发货</div>
            </div>
            <div class="order-stat-item">
              <div class="order-stat-value">{{ dashboard.orderStats.shipped }}</div>
              <div class="order-stat-label">已发货</div>
            </div>
            <div class="order-stat-item">
              <div class="order-stat-value">{{ dashboard.orderStats.finished }}</div>
              <div class="order-stat-label">已完成</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="stat-title">热销商品TOP5</div>
          <el-table :data="dashboard.hotGoods" style="width: 100%;" size="mini" v-if="dashboard.hotGoods && dashboard.hotGoods.length">
            <el-table-column prop="name" label="商品名称" />
            <el-table-column prop="sales" label="销量" />
          </el-table>
          <div v-else style="text-align:center;color:#bbb;padding:30px 0;">暂无数据</div>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="20" style="margin-top: 30px;">
      <el-col :span="12">
        <el-card>
          <div class="stat-title">近7天销售趋势</div>
          <v-chart :options="salesTrendOption" style="height:300px;" />
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="stat-title">近7天订单趋势</div>
          <v-chart :options="orderTrendOption" style="height:300px;" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getDashboard, getSalesTrend, getOrderTrend } from '@/api/stats';
import ECharts from 'vue-echarts';

export default {
  name: 'Home',
  components: { 'v-chart': ECharts },
  data() {
    return {
      dashboard: {
        todaySales: 0,
        weekSales: 0,
        monthSales: 0,
        orderStats: {
          pendingPay: 0,
          pendingShip: 0,
          shipped: 0,
          finished: 0
        },
        hotGoods: []
      },
      salesTrend: [],
      orderTrend: []
    };
  },
  async created() {
    const dashRes = await getDashboard();
    if (dashRes.code === 200) {
      this.dashboard = dashRes.data;
    }
    const salesRes = await getSalesTrend();
    if (salesRes.code === 200) {
      this.salesTrend = salesRes.data;
    }
    const orderRes = await getOrderTrend();
    if (orderRes.code === 200) {
      this.orderTrend = orderRes.data;
    }
  },
  computed: {
    salesTrendOption() {
      return {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: this.salesTrend.map(i => i.date) },
        yAxis: { type: 'value' },
        series: [{ name: '销售额', type: 'line', data: this.salesTrend.map(i => i.sales) }]
      };
    },
    orderTrendOption() {
      return {
        tooltip: { trigger: 'axis' },
        xAxis: { type: 'category', data: this.orderTrend.map(i => i.date) },
        yAxis: { type: 'value' },
        series: [{ name: '订单数', type: 'line', data: this.orderTrend.map(i => i.count) }]
      };
    }
  }
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: #f7f7fa;
}
.stat-title {
  font-size: 14px;
  color: #888;
  margin-bottom: 10px;
}
.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin-top: 10px;
  color: #409EFF;
}
.order-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
.order-stat-item {
  flex: 1;
  text-align: center;
}
.order-stat-value {
  font-size: 24px;
  color: #409EFF;
  font-weight: bold;
}
.order-stat-label {
  font-size: 14px;
  color: #888;
  margin-top: 5px;
}
</style> 