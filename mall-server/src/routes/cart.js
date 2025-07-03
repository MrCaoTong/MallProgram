const express = require('express');
const cartController = require('../controllers/cart');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/list', auth.jwtAuth, cartController.list);
router.post('/add', auth.jwtAuth, cartController.add);
router.post('/update', auth.jwtAuth, cartController.update);
router.post('/delete', auth.jwtAuth, cartController.delete);

module.exports = router; 