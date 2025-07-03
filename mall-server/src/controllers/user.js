const User = require('../models/user');
const jwt = require('jsonwebtoken');
const md5 = require('md5');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

const userController = {
  async login(req, res) {
    // 假设前端已通过微信授权，openid由前端传递
    const { openid, nickname, avatar, gender, phone } = req.body;
    if (!openid) return res.status(400).json({ code: 1, msg: 'openid必传' });
    let user = await User.findByOpenId(openid);
    if (!user) {
      const id = await User.create({ openid, nickname, avatar, gender, phone });
      user = await User.findById(id);
    }
    // 生成JWT
    const token = jwt.sign({ id: user.id, openid: user.openid }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ code: 0, data: { token, user } });
  },
  async info(req, res) {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ code: 1, msg: '用户不存在' });
    res.json({ code: 0, data: user });
  },
  async logout(req, res) {
    // JWT无状态，前端删除token即可
    res.json({ code: 0, msg: '退出成功' });
  }
};

module.exports = userController; 