<template>
  <div class="order-page">
    <el-card>
      <!-- 筛选区域 -->
      <el-form :inline="true" :model="listQuery" class="filter-form">
        <el-form-item label="订单号">
          <el-input v-model="listQuery.order_no" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-select v-model="listQuery.status" placeholder="请选择状态" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
            <el-date-picker
                v-model="listQuery.date_range"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 订单表格 -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="order_no" label="订单号" width="220"></el-table-column>
        <el-table-column prop="user_nickname" label="下单用户"></el-table-column>
        <el-table-column prop="total_amount" label="订单金额" width="120"></el-table-column>
        <el-table-column label="订单状态" width="120">
            <template slot-scope="scope">
                <el-tag :type="scope.row.status | statusFilter">{{ formatStatus(scope.row.status) }}</el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="created_at" label="下单时间" width="180">
            <template slot-scope="scope">
                <span>{{ scope.row.created_at | formatDate }}</span>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleViewDetail(scope.row.id)">查看详情</el-button>
            <el-button v-if="scope.row.status === 1" size="mini" type="success" @click="handleShip(scope.row.id)">发货</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.page"
        :page-sizes="[10, 20, 50]"
        :page-size="listQuery.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 20px; text-align: right;">
      </el-pagination>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog title="订单详情" :visible.sync="detailDialogVisible" width="60%">
        <div v-if="currentOrder">
            <el-descriptions border :column="2">
                <el-descriptions-item label="订单号">{{ currentOrder.order_no }}</el-descriptions-item>
                <el-descriptions-item label="下单用户">{{ currentOrder.user_nickname }}</el-descriptions-item>
                <el-descriptions-item label="订单金额">¥{{ currentOrder.total_amount }}</el-descriptions-item>
                <el-descriptions-item label="订单状态">
                    <el-tag :type="currentOrder.status | statusFilter">{{ formatStatus(currentOrder.status) }}</el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="收货人">{{ currentOrder.receiver }}</el-descriptions-item>
                <el-descriptions-item label="联系电话">{{ currentOrder.phone }}</el-descriptions-item>
                <el-descriptions-item label="收货地址" :span="2">{{ currentOrder.province }}{{ currentOrder.city }}{{ currentOrder.district }}{{ currentOrder.detail }}</el-descriptions-item>
            </el-descriptions>
            <h4 style="margin-top: 20px;">商品列表</h4>
            <el-table :data="currentOrder.goods" border>
                <el-table-column prop="goods_name" label="商品名称"></el-table-column>
                <el-table-column label="图片" width="100">
                    <template slot-scope="scope">
                        <el-image :src="scope.row.goods_image" style="width: 60px; height: 60px" fit="cover"></el-image>
                    </template>
                </el-table-column>
                <el-table-column prop="goods_price" label="单价" width="100"></el-table-column>
                <el-table-column prop="quantity" label="数量" width="100"></el-table-column>
            </el-table>
        </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getOrders, getOrderDetail, shipOrder } from '@/api/order';

export default {
  name: 'Order',
  data() {
    return {
      orderList: [],
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        order_no: '',
        status: '',
        date_range: []
      },
      statusOptions: [
          { value: 0, label: '待支付' },
          { value: 1, label: '已支付' },
          { value: 2, label: '已发货' },
          { value: 3, label: '已完成' },
          { value: 4, label: '已取消' }
      ],
      detailDialogVisible: false,
      currentOrder: null
    };
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: 'warning',
        1: 'primary',
        2: 'info',
        3: 'success',
        4: 'danger'
      };
      return statusMap[status];
    },
    formatDate(time) {
        if (!time) return '';
        const date = new Date(time);
        return date.toLocaleString();
    }
  },
  created() {
    this.fetchOrders();
  },
  methods: {
    async fetchOrders() {
      const res = await getOrders(this.listQuery);
      this.orderList = res.data.items;
      this.total = res.data.total;
    },
    formatStatus(status) {
        const option = this.statusOptions.find(item => item.value === status);
        return option ? option.label : '未知';
    },
    handleSearch() {
        this.listQuery.page = 1;
        this.fetchOrders();
    },
    handleReset() {
        this.listQuery = { page: 1, limit: 10, order_no: '', status: '', date_range: [] };
        this.fetchOrders();
    },
    handleSizeChange(val) {
        this.listQuery.limit = val;
        this.fetchOrders();
    },
    handleCurrentChange(val) {
        this.listQuery.page = val;
        this.fetchOrders();
    },
    async handleViewDetail(id) {
        const res = await getOrderDetail(id);
        this.currentOrder = res.data;
        this.detailDialogVisible = true;
    },
    async handleShip(id) {
        await this.$confirm('确定要将此订单标记为已发货吗？', '提示', { type: 'warning' });
        await shipOrder(id);
        this.$message.success('发货成功');
        this.fetchOrders();
    }
  }
}
</script>

<style>
.order-page {
  padding: 20px;
}
.filter-form {
    margin-bottom: 20px;
}
</style> 