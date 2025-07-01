const pool = require('../../config/db');
const md5 = require('md5');

// 管理员登录
exports.login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ code: 400, message: '用户名和密码不能为空' });
  }

  try {
    const passwordHash = md5(password);
    const [rows] = await pool.query(
      'SELECT id, username, nickname, avatar FROM admin_user WHERE username = ? AND password = ? AND status = 1',
      [username, passwordHash]
    );

    if (rows.length > 0) {
      const user = rows[0];
      req.session.adminUser = user; // 存储用户信息到session
      res.json({ code: 200, message: '登录成功', data: user });
    } else {
      res.status(401).json({ code: 401, message: '用户名或密码错误' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, message: '服务器内部错误' });
  }
};

// 获取管理员信息
exports.getInfo = (req, res) => {
  res.json({ code: 200, message: '获取成功', data: req.session.adminUser });
};

// 管理员退出
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ code: 500, message: '退出失败' });
    }
    res.clearCookie('connect.sid'); // 清除cookie
    res.json({ code: 200, message: '退出成功' });
  });
}; 