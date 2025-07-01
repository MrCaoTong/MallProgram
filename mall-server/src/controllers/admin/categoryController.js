const pool = require('../../config/db');

// 获取商品分类列表
exports.getCategoryList = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM category ORDER BY sort ASC, id DESC');
    res.json({ code: 200, message: '获取成功', data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 新增商品分类
exports.addCategory = async (req, res) => {
  const { name, image, sort, status } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO category (name, image, sort, status) VALUES (?, ?, ?, ?)',
      [name, image, sort, status]
    );
    res.json({ code: 200, message: '新增成功', data: { id: result.insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 更新商品分类
exports.updateCategory = async (req, res) => {
  const { id, name, image, sort, status } = req.body;
  try {
    await pool.query(
      'UPDATE category SET name = ?, image = ?, sort = ?, status = ? WHERE id = ?',
      [name, image, sort, status, id]
    );
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 删除商品分类
exports.deleteCategory = async (req, res) => {
  const { id } = req.body;
  try {
    // 注意：在实际项目中，应检查该分类下是否有商品，防止误删
    await pool.query('DELETE FROM category WHERE id = ?', [id]);
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 更新分类状态
exports.updateCategoryStatus = async (req, res) => {
    const { id, status } = req.body;
    try {
      await pool.query('UPDATE category SET status = ? WHERE id = ?', [status, id]);
      res.json({ code: 200, message: '状态更新成功' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ code: 500, message: '服务器错误' });
    }
  }; 