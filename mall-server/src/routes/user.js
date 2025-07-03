const express = require('express');
const userController = require('../controllers/user');
const auth = require('../middlewares/auth');
const router = express.Router();

router.post('/login', userController.login);
router.get('/info', auth.jwtAuth, userController.info);
router.post('/logout', auth.jwtAuth, userController.logout);

module.exports = router; 