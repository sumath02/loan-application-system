const express = require("express");
const balanceSheetController = require("../controllers/balanceSheet");

const router = express.Router();

router.get("/", balanceSheetController.getBalanceSheet);

router.post("/getDecision", balanceSheetController.getDecision);

module.exports = router;
