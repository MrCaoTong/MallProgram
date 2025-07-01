// 权限验证中间件
exports.checkAuth = (req, res, next) => {
  if (req.session.adminUser) {
    next();
  } else {
    res.status(401).json({ code: 401, message: '用户未登录' });
  }
}; 