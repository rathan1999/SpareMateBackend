const userController = require('../controllers/user');

const express = require('express');
const {check} = require('express-validator');

const router = express.Router();

router.post('/getUser', check('email').isEmail(), userController.getUser);
router.post('/createUser', [check('email').isEmail(), check('phone').isNumeric(), check('phone').isLength(10)], userController.createUser);
router.post('/getUsersByPhone', userController.getUsersByPhone);
module.exports = router;