const jwt = require('jsonwebtoken');

// 权限验证中间件
exports.checkAuth = (req, res, next) => {
  if (req.session && req.session.adminUser) {
    next();
  } else {
    res.status(401).json({ code: 401, message: '用户未登录' });
  }
};

// 小程序JWT认证
exports.jwtAuth = (req, res, next) => {
  const token = req.headers['authorization'] || req.query.token;
  if (!token) return res.status(401).json({ code: 401, message: '未登录' });
  jwt.verify(token.replace(/^Bearer\s/, ''), process.env.JWT_SECRET || 'your_jwt_secret', (err, decoded) => {
    if (err) return res.status(401).json({ code: 401, message: 'token无效' });
    req.user = decoded;
    next();
  });
}; 