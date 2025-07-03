const Address = require('../models/address');

const addressController = {
  async list(req, res) {
    const user_id = req.user.id;
    const addresses = await Address.findByUserId(user_id);
    res.json({ code: 0, data: addresses });
  },
  async add(req, res) {
    const user_id = req.user.id;
    const { receiver, phone, province, city, district, detail, is_default } = req.body;
    if (!receiver || !phone || !province || !city || !district || !detail) return res.status(400).json({ code: 1, msg: '参数错误' });
    const id = await Address.create({ user_id, receiver, phone, province, city, district, detail, is_default: is_default ? 1 : 0 });
    res.json({ code: 0, data: { id } });
  },
  async update(req, res) {
    const { id, ...data } = req.body;
    if (!id) return res.status(400).json({ code: 1, msg: 'id必传' });
    const affected = await Address.update(id, data);
    res.json({ code: 0, data: { affected } });
  },
  async delete(req, res) {
    const { id } = req.body;
    if (!id) return res.status(400).json({ code: 1, msg: 'id必传' });
    const affected = await Address.delete(id);
    res.json({ code: 0, data: { affected } });
  },
  async setDefault(req, res) {
    const user_id = req.user.id;
    const { id } = req.body;
    if (!id) return res.status(400).json({ code: 1, msg: 'id必传' });
    const affected = await Address.setDefault(user_id, id);
    res.json({ code: 0, data: { affected } });
  }
};

module.exports = addressController; 