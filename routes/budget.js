const budgetController = require('../controllers/budget');

const express = require('express');
// const {check} = require('express-validator');

const router = express.Router();

router.post('/createBudget', budgetController.createBudget);
router.post('/updateBudget', budgetController.updateBudget);
router.post('/getBudgetDetails', budgetController.getBudgetDetails);

module.exports = router;