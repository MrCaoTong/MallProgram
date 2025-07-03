const pool = require('../config/db');

const User = {
  async findByOpenId(openid) {
    const [rows] = await pool.query('SELECT * FROM user WHERE openid = ?', [openid]);
    return rows[0];
  },
  async create(user) {
    const { openid, nickname, avatar, gender, phone } = user;
    const [result] = await pool.query(
      'INSERT INTO user (openid, nickname, avatar, gender, phone) VALUES (?, ?, ?, ?, ?)',
      [openid, nickname, avatar, gender, phone]
    );
    return result.insertId;
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM user WHERE id = ?', [id]);
    return rows[0];
  },
  async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    const [result] = await pool.query(`UPDATE user SET ${fields} WHERE id = ?`, values);
    return result.affectedRows;
  }
};

module.exports = User; 