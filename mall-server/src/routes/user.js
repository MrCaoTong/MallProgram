require('dotenv').config();
const express = require('express');
const axios = require('axios');
const router = express.Router();
const pool = require('../config/db');
const userController = require('../controllers/user');
const auth = require('../middlewares/auth');

// 微信小程序配置
const appid = process.env.WECHAT_APPID;
const secret = process.env.WECHAT_SECRET;

// 1. code换openid
router.post('/login', async (req, res) => {
  const { code } = req.body;
  if (!code) return res.json({ code: 1, msg: 'code必传' });
  try {
    const wxResp = await axios.get(
      `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=authorization_code`
    );
    console.log('微信返回:', wxResp.data); // 打印微信接口返回内容
    const { openid } = wxResp.data;
    if (!openid) return res.json({ code: 2, msg: '获取openid失败', data: wxResp.data });
    res.json({ code: 0, data: { openid } });
  } catch (err) {
    res.json({ code: 500, msg: '微信登录失败', error: err });
  }
});

// 2. 保存用户信息
router.post('/info', async (req, res) => {
  const { openid, avatarUrl, nickName } = req.body;
  if (!openid) return res.json({ code: 1, msg: 'openid必传' });
  try {
    const [rows] = await pool.query('SELECT * FROM user WHERE openid=?', [openid]);
    if (rows.length > 0) {
      await pool.query('UPDATE user SET avatar=?, nickname=? WHERE openid=?', [avatarUrl, nickName, openid]);
    } else {
      await pool.query('INSERT INTO user (openid, avatar, nickname) VALUES (?, ?, ?)', [openid, avatarUrl, nickName]);
    }
    res.json({ code: 0, msg: 'ok', userInfo: { openid, avatarUrl, nickName } });
  } catch (err) {
    res.json({ code: 500, msg: '保存用户信息失败', error: err });
  }
});

router.get('/info', auth.jwtAuth, userController.info);
router.post('/logout', auth.jwtAuth, userController.logout);

module.exports = router; 