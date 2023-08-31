import React, { useState } from "react";
import { accountingSoftwareProviders } from "../../providers/Providers";
import "./LoanApplication.css";
import BalanceSheet from "../BalanceSheet/BalanceSheet";

function LoanApplicationForm() {
  const [businessDetails, setBusinessDetails] = useState({});
  const [loanAmount, setLoanAmount] = useState("");
  const [accountingSoftware, setAccountingSoftware] = useState("");
  const [balanceSheetData, setBalanceSheetData] = useState(null);
  const [decision, setdecision] = useState(null);

  const handleBusinessDetailsChange = (event) => {
    setBusinessDetails({
      ...businessDetails,
      [event.target.name]: event.target.value,
    });
  };

  const handleLoanAmountChange = (event) => {
    setLoanAmount(event.target.value);
  };

  const handleAccountingSoftwareChange = (
    accountingSoftwareProviders,
    provider
  ) => {
    setAccountingSoftware((prevSelectedAnswers) => ({
      ...prevSelectedAnswers,
      [accountingSoftwareProviders]: provider,
    }));
  };

  const handleGetBalanceSheet = () => {
    fetch(
      // `http://localhost:3001/api/url?accountingSoftware=${accountingSoftware}`,
      "http://localhost:3001/api/url",

      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((res) => {
        console.log("response : ", res);
        setBalanceSheetData(res.balanceSheet);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch("http://localhost:3001/api/url/getDecision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        balanceSheetData: balanceSheetData,
        loanAmount: loanAmount,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        setdecision(res);
        console.log("response : ", res);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="form-container">
      <form
        onSubmit={handleSubmit}
        className="loan-form"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <div className="business-form-details">
          <label>
            Business Name*
            <input
              required="true"
              type="text"
              name="businessName"
              value={businessDetails.businessName}
              onChange={handleBusinessDetailsChange}
            />
          </label>
          <label>
            Year Established*
            <input
              required="true"
              type="text"
              name="yearEstablished"
              value={businessDetails.yearEstablished}
              onChange={handleBusinessDetailsChange}
            />
          </label>
          <label>
            Loan Amount*
            <input
              required="true"
              type="text"
              name="loanAmount"
              value={loanAmount}
              onChange={handleLoanAmountChange}
            />
          </label>
          <label>
            Select an accounting software provider*
            {accountingSoftwareProviders.map((provider) => (
              <label key={provider.value}>
                <input
                  type="radio"
                  value={provider.value}
                  required="true"
                  checked={
                    accountingSoftware[accountingSoftwareProviders.value] ===
                    provider.value
                  }
                  // checked={selectedAnswers[question.id] === option.id}
                  onChange={() =>
                    handleAccountingSoftwareChange(
                      accountingSoftwareProviders.value,
                      provider.value
                    )
                  }
                />
                {provider.label}
              </label>
            ))}
          </label>
          <div className="submit-btn">
            <button type="submit">Submit</button>
            <label htmlFor="" style={{ color: "red" }}>
              *Request for your balance sheet before submiting your loan
              application
            </label>
          </div>
        </div>

        <div className="seperation">
          <div className="balance-sheet-container" style={{ padding: "1rem" }}>
            <div className="get-balance-sheet-btn">
              <button
                style={{ backgroundColor: "black" }}
                type="button"
                required
                onClick={handleGetBalanceSheet}
              >
                Request for Balance Sheet ↓
              </button>
            </div>
            <div className="balance-sheet-table">
              {balanceSheetData && (
                <BalanceSheet balanceSheetData={balanceSheetData} />
              )}
            </div>
            <div className="final-descision">
              {decision && (
                <p style={{ fontWeight: "bold", color: "blue" }}>
                  {decision?.finalDescision.status === "approved" && (
                    <p>"Your loan is {decision.finalDescision.status}"</p>
                  )}
                </p>
              )}
              {decision && (
                <p style={{ fontWeight: "bold", color: "red" }}>
                  {decision?.finalDescision.status === "rejected" && (
                    <p>"Your loan is {decision.finalDescision.status}"</p>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoanApplicationForm;
