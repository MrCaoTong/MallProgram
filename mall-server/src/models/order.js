const pool = require('../config/db');

const Order = {
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM `order` WHERE id = ?', [id]);
    return rows[0];
  },
  async findByOrderNo(order_no) {
    const [rows] = await pool.query('SELECT * FROM `order` WHERE order_no = ?', [order_no]);
    return rows[0];
  },
  async findAllByUser(user_id, { offset = 0, limit = 10 }) {
    const [rows] = await pool.query('SELECT * FROM `order` WHERE user_id = ? ORDER BY created_at DESC LIMIT ?, ?', [user_id, offset, limit]);
    return rows;
  },
  async create(order) {
    const { order_no, user_id, status, pay_status, total_amount, address_id } = order;
    const [result] = await pool.query(
      'INSERT INTO `order` (order_no, user_id, status, pay_status, total_amount, address_id) VALUES (?, ?, ?, ?, ?, ?)',
      [order_no, user_id, status, pay_status, total_amount, address_id]
    );
    return result.insertId;
  },
  async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    const [result] = await pool.query(`UPDATE \order\ SET ${fields} WHERE id = ?`, values);
    return result.affectedRows;
  }
};

module.exports = Order; 