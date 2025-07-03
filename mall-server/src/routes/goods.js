const express = require('express');
const goodsController = require('../controllers/goods');
const router = express.Router();

router.get('/list', goodsController.list);
router.get('/detail', goodsController.detail);

module.exports = router; 