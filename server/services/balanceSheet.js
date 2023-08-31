const mockData = require("../database/db");

//Fetch balancesheet from database
getBalanceSheet = async () => {
  const balanceSheet = mockData.map(
    ({ year, month, profitOrLoss, assetsValue }) => ({
      year,
      month,
      profitOrLoss,
      assetsValue,
    })
  );
  return balanceSheet;
};

//Return status decision engine
getDecision = async (decision) => {
  if (decision.preAssessment > 20) {
    return { status: "approved" };
  } else {
    return { status: "rejected" };
  }
};

module.exports = { getBalanceSheet, getDecision };
