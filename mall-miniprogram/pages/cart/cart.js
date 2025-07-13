const request = require('../../utils/request');

Page({
  data: {
    cartList: [], // [{goods_id, quantity, checked, ...goodsDetail}]
    allChecked: false,
    totalPrice: 0,
    totalCount: 0,
    loading: true
  },
  async onShow() {
    await this.loadCart();
  },
  async loadCart() {
    this.setData({ loading: true });
    // 1. 获取购物车列表
    const res = await request({ url: '/cart/list' });
    if (res.code !== 0) {
      wx.showToast({ title: '获取购物车失败', icon: 'none' });
      this.setData({ loading: false });
      return;
    }
    const cartList = res.data || [];
    // 2. 批量获取商品详情
    const goodsDetailList = await Promise.all(
      cartList.map(item => request({ url: '/goods/detail', data: { id: item.goods_id } }))
    );
    // 3. 合并数据
    const mergedList = cartList.map((item, idx) => ({
      ...item,
      ...goodsDetailList[idx].data,
      checked: true // 默认全选
    }));
    this.setData({
      cartList: mergedList,
      allChecked: mergedList.length > 0,
      loading: false
    });
    this.calcTotal();
  },
  // 数量加减
  async onChangeNum(e) {
    const { idx, type } = e.currentTarget.dataset;
    let { cartList } = this.data;
    let item = cartList[idx];
    let newNum = item.quantity + (type === 'add' ? 1 : -1);
    if (newNum < 1) return;
    // 更新后端
    await request({ url: '/cart/update', method: 'POST', data: { goods_id: item.goods_id, quantity: newNum } });
    cartList[idx].quantity = newNum;
    this.setData({ cartList });
    this.calcTotal();
  },
  // 删除
  async onDelete(e) {
    const { idx } = e.currentTarget.dataset;
    let { cartList } = this.data;
    const item = cartList[idx];
    await request({ url: '/cart/delete', method: 'POST', data: { goods_id: item.goods_id } });
    cartList.splice(idx, 1);
    this.setData({ cartList });
    this.calcTotal();
  },
  // 单选
  onCheck(e) {
    const { idx } = e.currentTarget.dataset;
    let { cartList } = this.data;
    cartList[idx].checked = !cartList[idx].checked;
    this.setData({ cartList });
    this.calcTotal();
  },
  // 全选
  onCheckAll() {
    let { cartList, allChecked } = this.data;
    allChecked = !allChecked;
    cartList = cartList.map(item => ({ ...item, checked: allChecked }));
    this.setData({ cartList, allChecked });
    this.calcTotal();
  },
  // 计算总价
  calcTotal() {
    const { cartList } = this.data;
    let totalPrice = 0, totalCount = 0, allChecked = cartList.length > 0;
    cartList.forEach(item => {
      if (item.checked) {
        totalPrice += item.price * item.quantity;
        totalCount += item.quantity;
      } else {
        allChecked = false;
      }
    });
    this.setData({ totalPrice: totalPrice.toFixed(2), totalCount, allChecked });
  },
  // 结算
  onCheckout() {
    const checkedGoods = this.data.cartList.filter(item => item.checked);
    if (checkedGoods.length === 0) {
      wx.showToast({ title: '请选择商品', icon: 'none' });
      return;
    }
    // 跳转订单确认页，传递选中商品信息
    wx.navigateTo({
      url: '/pages/order/order',
      // 可通过全局状态管理或storage传递数据，简单起见此处略
    });
  }
}); 