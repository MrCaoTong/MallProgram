require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? '.env.production' : '.env' });

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const adminRoutes = require('./src/routes/admin');
const fs = require('fs');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
// const uploadController = require('./src/controllers/admin/uploadController'); //不再需要
// 自动根据环境加载对应的 env 文件
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
// 自动根据环境变量切换 config 文件
const env = process.env.NODE_ENV || 'development';
const config = require(`./config/config.${env}.js`);


const app = express();
const port = process.env.PORT || config.port;

// 【重要】信任代理，以确保session在代理环境下正常工作
app.set('trust proxy', 1);

app.use(cors({
  origin: process.env.CORS_ORIGIN || true, // 推荐用.env管理，默认允许所有
  credentials: true
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session配置 (更新为更健壮和安全的配置)
app.use(session({
  name: process.env.SESSION_NAME || 'mall_session_id',
  secret: process.env.SESSION_SECRET || 'a-super-secret-key-for-mall-project',
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
const uploadsDir = config.uploadDir ? path.join(__dirname, config.uploadDir) : path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// 静态文件服务
app.use('/uploads', express.static(uploadsDir));

// 路由
app.use('/admin', adminRoutes);

// 上传接口 (已移至 admin.js)
// app.post('/admin/upload', auth.checkAuth, uploadController.uploadMiddleware, uploadController.uploadImage);

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

app.listen(port, '0.0.0.0', () => {
  console.log(`后端服务已启动，监听端口 ${port}，可被网络访问`);
}); 