const Category = require('../models/category');

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
      const db = require('../config/db');
      const baseUrl = req.protocol + '://' + req.get('host');
      // 查询所有启用分类
      const [categories] = await db.query('SELECT * FROM category WHERE status=1 ORDER BY sort DESC, id DESC');
      // 查询每个分类下最多3个商品
      for (let cat of categories) {
        if (cat.image && !cat.image.startsWith('http')) cat.image = baseUrl + cat.image;
        const [goods] = await db.query('SELECT * FROM goods WHERE category_id=? AND status=1 ORDER BY id DESC LIMIT 3', [cat.id]);
        cat.goodsList = goods.map(item => ({
          ...item,
          image: item.image && !item.image.startsWith('http') ? baseUrl + item.image : item.image
        }));
      }
      res.json({ code: 0, data: categories });
    } catch (err) {
      res.status(500).json({ code: 500, msg: '获取分类及商品失败' });
    }
  }
};

module.exports = categoryController; 