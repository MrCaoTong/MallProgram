const Cart = require('../models/cart');

const cartController = {
  async list(req, res) {
    const user_id = req.user.id;
    const cart = await Cart.findByUserId(user_id);
    res.json({ code: 0, data: cart });
  },
  async add(req, res) {
    const user_id = req.user.id;
    const { goods_id, quantity } = req.body;
    if (!goods_id || !quantity) return res.status(400).json({ code: 1, msg: '参数错误' });
    const id = await Cart.addOrUpdate(user_id, goods_id, quantity);
    res.json({ code: 0, data: { id } });
  },
  async update(req, res) {
    const user_id = req.user.id;
    const { goods_id, quantity } = req.body;
    if (!goods_id || !quantity) return res.status(400).json({ code: 1, msg: '参数错误' });
    const affected = await Cart.updateQuantity(user_id, goods_id, quantity);
    res.json({ code: 0, data: { affected } });
  },
  async delete(req, res) {
    const user_id = req.user.id;
    const { goods_id } = req.body;
    if (!goods_id) return res.status(400).json({ code: 1, msg: '参数错误' });
    const affected = await Cart.delete(user_id, goods_id);
    res.json({ code: 0, data: { affected } });
  }
};

module.exports = cartController; 