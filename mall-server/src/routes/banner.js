const express = require('express');
const bannerController = require('../controllers/banner');
const router = express.Router();

router.get('/list', bannerController.list);

module.exports = router; 