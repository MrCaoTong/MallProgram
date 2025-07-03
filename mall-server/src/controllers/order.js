const Order = require('../models/order');
const OrderGoods = require('../models/order_goods');
const Cart = require('../models/cart');
const Goods = require('../models/goods');
const Address = require('../models/address');

const orderController = {
  async create(req, res) {
    // 创建新订单
    const user_id = req.user.id;
    const { address_id, goods_list, total_amount } = req.body;
    if (!address_id || !goods_list || !Array.isArray(goods_list) || goods_list.length === 0) {
      return res.status(400).json({ code: 1, msg: '参数错误' });
    }
    // 生成订单号
    const order_no = 'M' + Date.now() + Math.floor(Math.random() * 1000);
    const orderId = await Order.create({
      order_no,
      user_id,
      status: 0,
      pay_status: 0,
      total_amount,
      address_id
    });
    // 插入订单商品表
    for (const item of goods_list) {
      const goods = await Goods.findById(item.goods_id);
      await OrderGoods.create({
        order_id: orderId,
        goods_id: item.goods_id,
        goods_name: goods.name,
        goods_image: goods.image,
        goods_price: goods.price,
        quantity: item.quantity
      });
      // 可选：减少库存
    }
    // 可选：清空购物车
    res.json({ code: 0, data: { order_no } });
  },
  async list(req, res) {
    const user_id = req.user.id;
    const { page = 1, pageSize = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const orders = await Order.findAllByUser(user_id, { offset, limit: parseInt(pageSize) });
    for (const order of orders) {
      order.goods_list = await OrderGoods.findByOrderId(order.id);
    }
    res.json({ code: 0, data: orders });
  },
  async pay(req, res) {
    // 模拟微信支付
    res.json({ code: 0, msg: '支付成功（模拟）' });
  },
  async confirm(req, res) {
    // 确认收货
    const user_id = req.user.id;
    const { order_no } = req.body;
    if (!order_no) return res.status(400).json({ code: 1, msg: 'order_no必传' });
    const order = await Order.findByOrderNo(order_no);
    if (!order || order.user_id !== user_id) return res.status(403).json({ code: 1, msg: '无权限' });
    await Order.update(order.id, { status: 3 });
    res.json({ code: 0, msg: '确认收货成功' });
  }
};

module.exports = orderController; 