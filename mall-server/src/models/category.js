const pool = require('../config/db');

const Category = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM category WHERE status = 1 ORDER BY sort DESC, id DESC');
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM category WHERE id = ?', [id]);
    return rows[0];
  },
  async create(category) {
    const { name, image, sort, status } = category;
    const [result] = await pool.query(
      'INSERT INTO category (name, image, sort, status) VALUES (?, ?, ?, ?)',
      [name, image, sort, status]
    );
    return result.insertId;
  },
  async update(id, data) {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    values.push(id);
    const [result] = await pool.query(`UPDATE category SET ${fields} WHERE id = ?`, values);
    return result.affectedRows;
  }
};

module.exports = Category; 