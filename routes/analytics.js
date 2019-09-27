const analyticsController = require("../controllers/analytics");

const express = require("express");

const router = express.Router();

router.post("/getTransactions", analyticsController.getTransactions);
router.post("/getMonthlyDivision", analyticsController.getMonthlyDivision);
router.post("/getBandComparison", analyticsController.getBandComparison);

module.exports = router;