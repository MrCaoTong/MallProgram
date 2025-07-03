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
  }
};

module.exports = categoryController; 