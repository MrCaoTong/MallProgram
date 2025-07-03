const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const adminRoutes = require('./src/routes/admin');
const fs = require('fs');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const uploadController = require('./src/controllers/admin/uploadController'); //不再需要
const config = require('./config');

const app = express();
const port = config.port;

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

dotenv.config();
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

const userRoutes = require('./src/routes/user');
const goodsRoutes = require('./src/routes/goods');
const categoryRoutes = require('./src/routes/category');
const bannerRoutes = require('./src/routes/banner');
const cartRoutes = require('./src/routes/cart');
const addressRoutes = require('./src/routes/address');
const orderRoutes = require('./src/routes/order');

app.use('/api/user', userRoutes);
app.use('/api/goods', goodsRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/banner', bannerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/address', addressRoutes);
app.use('/api/order', orderRoutes);

app.listen(port, () => {
  console.log(`后端服务已启动，监听端口 ${port}`);
}); 