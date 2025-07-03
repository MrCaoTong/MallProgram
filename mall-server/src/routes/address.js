const express = require('express');
const addressController = require('../controllers/address');
const auth = require('../middlewares/auth');
const router = express.Router();

router.get('/list', auth.jwtAuth, addressController.list);
router.post('/add', auth.jwtAuth, addressController.add);
router.post('/update', auth.jwtAuth, addressController.update);
router.post('/delete', auth.jwtAuth, addressController.delete);
router.post('/setDefault', auth.jwtAuth, addressController.setDefault);

module.exports = router; 