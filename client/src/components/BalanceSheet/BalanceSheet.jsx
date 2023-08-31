import React from "react";
import "./BalanceSheet.css";

function BalanceSheet({ balanceSheetData }) {
  return (
    <div>
      <label>Summary of Profit or loss by the year</label>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Month</th>
            <th>Profit/Loss</th>
            <th>Assets Value</th>
          </tr>
        </thead>
        <tbody>
          {balanceSheetData.map((data, index) => (
            <tr key={index}>
              <td>{data.year}</td>
              <td>{data.month}</td>
              <td>{data.profitOrLoss}</td>
              <td>{data.assetsValue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BalanceSheet;
