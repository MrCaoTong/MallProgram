const pool = require('../config/db');

const OrderGoods = {
  async findByOrderId(order_id) {
    const [rows] = await pool.query('SELECT * FROM order_goods WHERE order_id = ?', [order_id]);
    return rows;
  },
  async create(orderGoods) {
    const { order_id, goods_id, goods_name, goods_image, goods_price, quantity } = orderGoods;
    const [result] = await pool.query(
      'INSERT INTO order_goods (order_id, goods_id, goods_name, goods_image, goods_price, quantity) VALUES (?, ?, ?, ?, ?, ?)',
      [order_id, goods_id, goods_name, goods_image, goods_price, quantity]
    );
    return result.insertId;
  }
};

module.exports = OrderGoods; 