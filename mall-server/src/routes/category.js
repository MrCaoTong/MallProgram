const express = require('express');
const categoryController = require('../controllers/category');
const router = express.Router();

router.get('/list', categoryController.list);
router.get('/detail', categoryController.detail);

module.exports = router; 