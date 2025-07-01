const pool = require('../../config/db');

// 获取轮播图列表
exports.getBannerList = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM banner ORDER BY sort ASC, id DESC');
    res.json({ code: 200, message: '获取成功', data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 新增轮播图
exports.addBanner = async (req, res) => {
  const { title, image, link, sort, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO banner (title, image, link, sort, status) VALUES (?, ?, ?, ?, ?)',
      [title, image, link, sort, status]
    );
    res.json({ code: 200, message: '新增成功', data: { id: result.insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 更新轮播图
exports.updateBanner = async (req, res) => {
  const { id, title, image, link, sort, status } = req.body;
  try {
    await pool.query(
      'UPDATE banner SET title = ?, image = ?, link = ?, sort = ?, status = ? WHERE id = ?',
      [title, image, link, sort, status, id]
    );
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 删除轮播图
exports.deleteBanner = async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query('DELETE FROM banner WHERE id = ?', [id]);
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 更新轮播图状态
exports.updateBannerStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    await pool.query('UPDATE banner SET status = ? WHERE id = ?', [status, id]);
    res.json({ code: 200, message: '状态更新成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}; 