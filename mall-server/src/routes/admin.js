const express = require('express');
const authController = require('../controllers/admin/authController');
const bannerController = require('../controllers/admin/bannerController');
const categoryController = require('../controllers/admin/categoryController');
const goodsController = require('../controllers/admin/goodsController');
const orderController = require('../controllers/admin/orderController');
const statsController = require('../controllers/admin/statsController');
const auth = require('../middlewares/auth');
const uploadController = require('../controllers/admin/uploadController');

const router = express.Router();

// 管理员登录
router.post('/login', authController.login);

// 获取管理员信息
router.get('/info', auth.checkAuth, authController.getInfo);

// 管理员退出
router.post('/logout', auth.checkAuth, authController.logout);

// 轮播图管理
router.get('/banner/list', auth.checkAuth, bannerController.getBannerList);
router.post('/banner/add', auth.checkAuth, bannerController.addBanner);
router.post('/banner/update', auth.checkAuth, bannerController.updateBanner);
router.post('/banner/delete', auth.checkAuth, bannerController.deleteBanner);
router.post('/banner/status', auth.checkAuth, bannerController.updateBannerStatus);

// 上传接口 (修改：将上传路由从 app.js 移至此处统一管理)
router.post('/upload', auth.checkAuth, uploadController.uploadMiddleware, uploadController.uploadImage);

// 商品分类管理
router.get('/category/list', auth.checkAuth, categoryController.getCategoryList);
router.post('/category/add', auth.checkAuth, categoryController.addCategory);
router.post('/category/update', auth.checkAuth, categoryController.updateCategory);
router.post('/category/delete', auth.checkAuth, categoryController.deleteCategory);
router.post('/category/status', auth.checkAuth, categoryController.updateCategoryStatus);
router.get('/category/all', auth.checkAuth, categoryController.getAllCategoryList);

// 商品管理相关路由
router.get('/goods/list', auth.checkAuth, goodsController.getGoodsList);
router.post('/goods/add', auth.checkAuth, goodsController.addGoods);
router.post('/goods/update', auth.checkAuth, goodsController.updateGoods);
router.post('/goods/delete', auth.checkAuth, goodsController.deleteGoods);
router.post('/goods/status', auth.checkAuth, goodsController.updateGoodsStatus);
router.post('/goods/batch-status', auth.checkAuth, goodsController.batchUpdateGoodsStatus);
router.post('/goods/recommend', auth.checkAuth, goodsController.updateRecommend);

// 订单管理
router.get('/order/list', auth.checkAuth, orderController.getOrderList);
router.get('/order/detail/:id', auth.checkAuth, orderController.getOrderDetail);
router.post('/order/ship', auth.checkAuth, orderController.shipOrder);

// 数据统计
router.get('/stats/sales', auth.checkAuth, statsController.getSalesStats);
router.get('/stats/sales-trend', auth.checkAuth, statsController.getSalesTrend);
router.get('/stats/hot-goods', auth.checkAuth, statsController.getHotGoods);
router.get('/stats/orders', auth.checkAuth, statsController.getOrderStats);
router.get('/stats/conversion', auth.checkAuth, statsController.getConversionStats);
router.get('/summary', auth.checkAuth, statsController.getSummary);
router.get('/trend/sales', auth.checkAuth, statsController.getSalesTrend);
router.get('/trend/orders', auth.checkAuth, statsController.getOrderTrend);
router.get('/dashboard', auth.checkAuth, statsController.getDashboard);

module.exports = router; 