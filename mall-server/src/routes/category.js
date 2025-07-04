const express = require('express');
const categoryController = require('../controllers/category');
const router = express.Router();

router.get('/list', categoryController.getCategoryList);
router.get('/goods', categoryController.getCategoryGoods);
router.get('/detail', categoryController.detail);
router.get('/home', categoryController.home);

module.exports = router; 