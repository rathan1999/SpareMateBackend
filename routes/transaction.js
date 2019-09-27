const transactionController = require('../controllers/transaction');

const express = require('express');

const router = express.Router();

router.post('/createTransaction', transactionController.createTransaction);
router.post('/getTransactionsByUserId', transactionController.getTransactionsByUserId);
router.post('/getTransactionsByBudgetId', transactionController.getTransactionsByBudgetId);
router.post('/createPoolTransaction', transactionController.createPoolTransaction);

module.exports = router;