const pool = require('../../config/db');

// 获取商品列表（支持分页和搜索）
exports.getGoodsList = async (req, res) => {
  const { page = 1, limit = 10, name, category_id } = req.query;
  const offset = (page - 1) * limit;

  let whereClause = 'WHERE 1=1';
  const params = [];

  if (name) {
    whereClause += ' AND g.name LIKE ?';
    params.push(`%${name}%`);
  }
  if (category_id) {
    whereClause += ' AND g.category_id = ?';
    params.push(category_id);
  }

  try {
    const countSql = `SELECT COUNT(*) as total FROM goods g ${whereClause}`;
    const [totalRows] = await pool.query(countSql, params);
    const total = totalRows[0].total;

    const sql = `
      SELECT g.*, c.name as category_name, c.status as category_status
      FROM goods g
      LEFT JOIN category c ON g.category_id = c.id
      ${whereClause}
      ORDER BY g.id DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await pool.query(sql, [...params, parseInt(limit), parseInt(offset)]);

    res.json({
      code: 200,
      message: '获取成功',
      data: {
        items: rows,
        total: total
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 新增商品
exports.addGoods = async (req, res) => {
  const { category_id, name, image, price, stock, status, description } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO goods (category_id, name, image, price, stock, status, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [category_id, name, image, price, stock, status, description]
    );
    res.json({ code: 200, message: '新增成功', data: { id: result.insertId } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 更新商品
exports.updateGoods = async (req, res) => {
  const { id, category_id, name, image, price, stock, status, description } = req.body;
  try {
    await pool.query(
      'UPDATE goods SET category_id = ?, name = ?, image = ?, price = ?, stock = ?, status = ?, description = ? WHERE id = ?',
      [category_id, name, image, price, stock, status, description, id]
    );
    res.json({ code: 200, message: '更新成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 删除商品
exports.deleteGoods = async (req, res) => {
  const { id } = req.body;
  try {
    await pool.query('DELETE FROM goods WHERE id = ?', [id]);
    res.json({ code: 200, message: '删除成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 更新商品状态（上架/下架）
exports.updateGoodsStatus = async (req, res) => {
  const { id, status } = req.body;
  try {
    // 只有上架时才校验分类状态
    if (status == 1) {
      const [[goods]] = await pool.query('SELECT category_id FROM goods WHERE id = ?', [id]);
      if (!goods) {
        return res.status(404).json({ code: 404, message: '商品不存在' });
      }
      const [[category]] = await pool.query('SELECT status FROM category WHERE id = ?', [goods.category_id]);
      if (!category) {
        return res.status(404).json({ code: 404, message: '商品分类不存在' });
      }
      if (category.status == 0) {
        return res.status(400).json({ code: 400, message: '该分类已被禁用，需要将该商品分类打开，才能上架' });
      }
    }
    await pool.query('UPDATE goods SET status = ? WHERE id = ?', [status, id]);
    res.json({ code: 200, message: '状态更新成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
};

// 批量更新商品状态
exports.batchUpdateGoodsStatus = async (req, res) => {
  const { ids, status } = req.body;
  if (!ids || ids.length === 0) {
    return res.status(400).json({ code: 400, message: '缺少商品ID' });
  }
  try {
    if (status == 1) {
      // 校验所有商品的分类状态
      const placeholders = ids.map(() => '?').join(',');
      const [goodsList] = await pool.query(`SELECT g.id, g.category_id, c.status as category_status FROM goods g LEFT JOIN category c ON g.category_id = c.id WHERE g.id IN (${placeholders})`, ids);
      const forbidden = goodsList.filter(g => g.category_status == 0);
      if (forbidden.length > 0) {
        return res.status(400).json({ code: 400, message: `存在分类被禁用的商品，无法上架（商品ID: ${forbidden.map(g=>g.id).join(', ')}）` });
      }
    }
    const placeholders = ids.map(() => '?').join(',');
    await pool.query(`UPDATE goods SET status = ? WHERE id IN (${placeholders})`, [status, ...ids]);
    res.json({ code: 200, message: '批量操作成功' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器错误' });
  }
}; 