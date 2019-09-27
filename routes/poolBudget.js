const poolBudgetController = require('../controllers/poolBudget');

const express = require('express');

const router = express.Router();

router.post('/createPoolBudget', poolBudgetController.createPoolBudget);
router.post('/getAllPools', poolBudgetController.getAllPools);
module.exports = router;