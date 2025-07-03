const pool = require('../config/db');

const Cart = {
  async findByUserId(user_id) {
    const [rows] = await pool.query('SELECT * FROM cart WHERE user_id = ?', [user_id]);
    return rows;
  },
  async addOrUpdate(user_id, goods_id, quantity) {
    // 先查找是否已存在
    const [rows] = await pool.query('SELECT * FROM cart WHERE user_id = ? AND goods_id = ?', [user_id, goods_id]);
    if (rows.length > 0) {
      await pool.query('UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND goods_id = ?', [quantity, user_id, goods_id]);
      return rows[0].id;
    } else {
      const [result] = await pool.query('INSERT INTO cart (user_id, goods_id, quantity) VALUES (?, ?, ?)', [user_id, goods_id, quantity]);
      return result.insertId;
    }
  },
  async updateQuantity(user_id, goods_id, quantity) {
    const [result] = await pool.query('UPDATE cart SET quantity = ? WHERE user_id = ? AND goods_id = ?', [quantity, user_id, goods_id]);
    return result.affectedRows;
  },
  async delete(user_id, goods_id) {
    const [result] = await pool.query('DELETE FROM cart WHERE user_id = ? AND goods_id = ?', [user_id, goods_id]);
    return result.affectedRows;
  }
};

module.exports = Cart; 