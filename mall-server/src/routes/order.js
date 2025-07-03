const express = require('express');
const orderController = require('../controllers/order');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/create', auth.jwtAuth, orderController.create);
router.get('/list', auth.jwtAuth, orderController.list);
router.post('/pay', auth.jwtAuth, orderController.pay);
router.post('/confirm', auth.jwtAuth, orderController.confirm);

module.exports = router; 