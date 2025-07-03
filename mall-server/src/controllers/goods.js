const Goods = require('../models/goods');

const goodsController = {
  async list(req, res) {
    const { page = 1, pageSize = 10, category_id, keyword } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(pageSize);
    const goods = await Goods.findAll({ offset, limit: parseInt(pageSize), category_id, keyword });
    res.json({ code: 0, data: goods });
  },
  async detail(req, res) {
    const { id } = req.query;
    if (!id) return res.status(400).json({ code: 1, msg: 'id必传' });
    const goods = await Goods.findById(id);
    if (!goods) return res.status(404).json({ code: 1, msg: '商品不存在' });
    res.json({ code: 0, data: goods });
  },
  // 推荐商品API
  async recommend(req, res) {
    try {
      const [rows] = await require('../config/db').query('SELECT * FROM goods WHERE status=1 AND is_recommend=1 ORDER BY id DESC LIMIT 10');
      const baseUrl = req.protocol + '://' + req.get('host');
      const data = rows.map(item => ({
        ...item,
        image: item.image && !item.image.startsWith('http') ? baseUrl + item.image : item.image
      }));
      res.json({ code: 0, data });
    } catch (err) {
      res.status(500).json({ code: 500, msg: '获取推荐商品失败' });
    }
  }
};

module.exports = goodsController; 