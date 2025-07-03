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
  }
};

module.exports = goodsController; 