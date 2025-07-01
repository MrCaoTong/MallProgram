const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const adminRoutes = require('./src/routes/admin');
const fs = require('fs');
// const uploadController = require('./src/controllers/admin/uploadController'); //不再需要

const app = express();
const port = 3000;

// 【重要】信任代理，以确保session在代理环境下正常工作
app.set('trust proxy', 1);

app.use(cors({
  origin: 'http://localhost:8080', // 允许前端访问
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session配置 (更新为更健壮和安全的配置)
app.use(session({
  name: 'mall_session_id', // 与前端保持一致
  secret: 'a-super-secret-key-for-mall-project', // 建议替换为更复杂的密钥
  resave: false,
  saveUninitialized: false, // 只在登录成功后创建session
  cookie: { 
    path: '/',
    httpOnly: true, // 增强安全性，客户端js无法读取
    secure: false, // 如果是https，应设为true
    maxAge: 24 * 60 * 60 * 1000, // 24小时有效期
    sameSite: 'lax' // 明确设置SameSite策略，增强安全性
  }
}));

// 自动创建 uploads 目录
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由
app.use('/admin', adminRoutes);

// 上传接口 (已移至 admin.js)
// app.post('/admin/upload', auth.checkAuth, uploadController.uploadMiddleware, uploadController.uploadImage);

app.listen(port, () => {
  console.log(`后端服务已启动，监听端口 ${port}`);
}); 