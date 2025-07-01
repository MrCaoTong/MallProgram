const pool = require('../../config/db');

// 获取商品分类列表（只返回启用的分类）
exports.getCategoryList = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM category WHERE status = 1 ORDER BY sort ASC, id DESC');
    res.json({ code: 200, message: '获取成功', data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 获取所有分类（含禁用）
exports.getAllCategoryList = async (req, res) => {
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
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query('UPDATE category SET status = ? WHERE id = ?', [status, id]);
      if (status == 0) {
        // 分类被禁用时，只下架原本上架的商品
        const [goods] = await conn.query('SELECT id FROM goods WHERE category_id = ? AND status != 0', [id]);
        const goodsIds = goods.map(g => g.id);
        let affectedRows = 0;
        if (goodsIds.length > 0) {
          const [result] = await conn.query(`UPDATE goods SET status = 0 WHERE id IN (${goodsIds.join(',')})`);
          affectedRows = result.affectedRows;
        }
        console.log(`[分类禁用] 分类ID: ${id}，本次实际下架商品数量: ${affectedRows}，商品ID: [${goodsIds.join(', ')}]`);
      } else if (status == 1) {
        // 分类被启用时，自动上架该分类下所有商品
        const [goods] = await conn.query('SELECT id FROM goods WHERE category_id = ? AND status = 0', [id]);
        const goodsIds = goods.map(g => g.id);
        let affectedRows = 0;
        if (goodsIds.length > 0) {
          const [result] = await conn.query(`UPDATE goods SET status = 1 WHERE id IN (${goodsIds.join(',')})`);
          affectedRows = result.affectedRows;
        }
        console.log(`[分类启用] 分类ID: ${id}，本次实际上架商品数量: ${affectedRows}，商品ID: [${goodsIds.join(', ')}]`);
      }
      await conn.commit();
      res.json({ code: 200, message: '状态更新成功' });
    } catch (error) {
      await conn.rollback();
      console.error(error);
      res.status(500).json({ code: 500, message: '服务器错误' });
    } finally {
      conn.release();
    }
  }; 