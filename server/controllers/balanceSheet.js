const balanceSheetService = require("../services/balanceSheet");

async function getBalanceSheet(req, res) {
  try {
    const balanceSheet = await balanceSheetService.getBalanceSheet();
    res.json({ balanceSheet });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function getDecision(req, res) {
  try {
    const { balanceSheetData, loanAmount } = req.body;
    //check if the business has made a profit in the last 12 months
    const last12Months = balanceSheetData.slice(0, 12);
    const hasProfit = last12Months.some(({ profitOrLoss }) => profitOrLoss > 0);

    //average asset value across 12 months
    const totalAssetValue = last12Months.reduce(
      (acc, { assetsValue }) => acc + assetsValue,
      0
    );
    const avgAssetValue = totalAssetValue / 12;

    //preAssessment value based on the rules
    let preAssessment = 20;
    if (hasProfit) {
      preAssessment = 60;
    }
    if (avgAssetValue > loanAmount) {
      preAssessment = 100;
    }

    //required business details
    const { name, yearEstablished } = balanceSheetData[0];
    const profitLossSummary = balanceSheetData.reduce(
      (acc, { year, profitOrLoss }) => {
        acc[year] = profitOrLoss;
        return acc;
      },
      {}
    );

    //send the final decision to the decision engine
    const decision = {
      preAssessment,
      businessDetails: {
        name,
        yearEstablished,
        profitLossSummary,
      },
    };

    const finalDescision = await balanceSheetService.getDecision(decision);

    res.json({ finalDescision });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = { getBalanceSheet, getDecision };
