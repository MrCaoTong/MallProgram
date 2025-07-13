const express = require('express');
const goodsController = require('../controllers/goods');
const router = express.Router();

router.get('/', goodsController.list);
router.get('/list', goodsController.list);
router.get('/detail', goodsController.detail);
router.get('/recommend', goodsController.recommend);

module.exports = router; 