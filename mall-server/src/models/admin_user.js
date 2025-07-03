const pool = require('../config/db');

const AdminUser = {
  async findByUsername(username) {
    const [rows] = await pool.query('SELECT * FROM admin_user WHERE username = ?', [username]);
    return rows[0];
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM admin_user WHERE id = ?', [id]);
    return rows[0];
  },
  async create(admin) {
    const { username, password, nickname, avatar, status } = admin;
    const [result] = await pool.query(
      'INSERT INTO admin_user (username, password, nickname, avatar, status) VALUES (?, ?, ?, ?, ?)',
      [username, password, nickname, avatar, status]
    );
    return result.insertId;
  },
  async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    const [result] = await pool.query(`UPDATE admin_user SET ${fields} WHERE id = ?`, values);
    return result.affectedRows;
  }
};

module.exports = AdminUser; 