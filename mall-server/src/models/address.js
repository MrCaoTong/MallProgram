const pool = require('../config/db');

const Address = {
  async findByUserId(user_id) {
    const [rows] = await pool.query('SELECT * FROM address WHERE user_id = ?', [user_id]);
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM address WHERE id = ?', [id]);
    return rows[0];
  },
  async create(address) {
    const { user_id, receiver, phone, province, city, district, detail, is_default } = address;
    const [result] = await pool.query(
      'INSERT INTO address (user_id, receiver, phone, province, city, district, detail, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [user_id, receiver, phone, province, city, district, detail, is_default]
    );
    return result.insertId;
  },
  async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    const [result] = await pool.query(`UPDATE address SET ${fields} WHERE id = ?`, values);
    return result.affectedRows;
  },
  async delete(id) {
    const [result] = await pool.query('DELETE FROM address WHERE id = ?', [id]);
    return result.affectedRows;
  },
  async setDefault(user_id, id) {
    await pool.query('UPDATE address SET is_default = 0 WHERE user_id = ?', [user_id]);
    const [result] = await pool.query('UPDATE address SET is_default = 1 WHERE id = ?', [id]);
    return result.affectedRows;
  }
};

module.exports = Address; 