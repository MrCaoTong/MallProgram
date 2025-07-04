const Category = require('../models/category');
const pool = require('../config/db');

const categoryController = {
  async list(req, res) {
    const categories = await Category.findAll();
    res.json({ code: 0, data: categories });
  },
  async detail(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).json({ code: 1, msg: 'id必传' });
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ code: 1, msg: '分类不存在' });
    res.json({ code: 0, data: category });
  },
  // 首页分类及商品API
  async home(req, res) {
    try {
      const baseUrl = req.protocol + '://' + req.get('host');
      // 查询所有启用分类
      const [categories] = await pool.query('SELECT * FROM category WHERE status=1 ORDER BY sort DESC, id DESC');
      // 查询每个分类下最多3个商品
      for (let cat of categories) {
        if (cat.image && !cat.image.startsWith('http')) cat.image = baseUrl + cat.image;
        const [goods] = await pool.query('SELECT * FROM goods WHERE category_id=? AND status=1 ORDER BY id DESC LIMIT 3', [cat.id]);
        cat.goodsList = goods.map(item => ({
          ...item,
          image: item.image && !item.image.startsWith('http') ? baseUrl + item.image : item.image
        }));
      }
      res.json({ code: 0, data: categories });
    } catch (err) {
      res.status(500).json({ code: 500, msg: '获取分类及商品失败' });
    }
  },
  // 获取分类列表，支持模糊搜索
  async getCategoryList(req, res) {
    const { search } = req.query;
    let sql = 'SELECT * FROM category WHERE status = 1';
    const params = [];
    if (search) {
      sql += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }
    sql += ' ORDER BY sort DESC, id DESC';
    const [rows] = await pool.query(sql, params);
    const baseUrl = req.protocol + '://' + req.get('host');
    rows.forEach(item => {
      if (item.image && !item.image.startsWith('http')) {
        item.image = baseUrl + item.image;
      }
    });
    res.json({ code: 200, data: rows });
  },
  // 获取分类下商品列表，支持排序和价格区间筛选
  async getCategoryGoods(req, res) {
    const { category_id, sort, min_price, max_price } = req.query;
    let sql = 'SELECT * FROM goods WHERE status = 1 AND category_id = ?';
    const params = [category_id];

    if (min_price) {
      sql += ' AND price >= ?';
      params.push(Number(min_price));
    }
    if (max_price) {
      sql += ' AND price <= ?';
      params.push(Number(max_price));
    }

    // 检查 goods 表是否有 sort 字段
    let orderBy = '';
    try {
      const [columns] = await pool.query("SHOW COLUMNS FROM goods LIKE 'sort'");
      if (columns.length > 0) {
        orderBy = ' ORDER BY sort DESC, id DESC';
      } else {
        orderBy = ' ORDER BY id DESC';
      }
    } catch (e) {
      orderBy = ' ORDER BY id DESC';
    }

    if (sort === 'price_asc') orderBy = ' ORDER BY price ASC';
    if (sort === 'price_desc') orderBy = ' ORDER BY price DESC';
    if (sort === 'stock_asc') orderBy = ' ORDER BY stock ASC';
    if (sort === 'stock_desc') orderBy = ' ORDER BY stock DESC';

    sql += orderBy;
    const [rows] = await pool.query(sql, params);
    const baseUrl = req.protocol + '://' + req.get('host');
    rows.forEach(item => {
      if (item.image && !item.image.startsWith('http')) {
        item.image = baseUrl + item.image;
      }
    });
    res.json({ code: 200, data: rows });
  }
};

module.exports = categoryController; 