const pool = require('../config/db');

const Banner = {
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM banner WHERE status = 1 ORDER BY sort DESC, id DESC');
    return rows;
  },
  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM banner WHERE id = ?', [id]);
    return rows[0];
  }
};

module.exports = Banner; 