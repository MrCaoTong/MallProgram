const pool = require('../config/db');

const Goods = {
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM goods WHERE id = ?', [id]);
    return rows[0];
  },
  async findAll({ offset = 0, limit = 10, category_id, keyword }) {
    let sql = 'SELECT * FROM goods WHERE 1=1';
    const params = [];
    if (category_id) {
      sql += ' AND category_id = ?';
      params.push(category_id);
    }
    if (keyword) {
      sql += ' AND name LIKE ?';
      params.push(`%${keyword}%`);
    }
    sql += ' LIMIT ?, ?';
    params.push(offset, limit);
    const [rows] = await pool.query(sql, params);
    return rows;
  },
  async create(goods) {
    const { category_id, name, image, price, stock, status, description } = goods;
    const [result] = await pool.query(
      'INSERT INTO goods (category_id, name, image, price, stock, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, image, price, stock, status, description]
    );
    return result.insertId;
  },
  async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    const [result] = await pool.query(`UPDATE goods SET ${fields} WHERE id = ?`, values);
    return result.affectedRows;
  }
};

module.exports = Goods; 