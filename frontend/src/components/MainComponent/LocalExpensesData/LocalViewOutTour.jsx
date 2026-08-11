import React, { useState, useEffect, useRef } from "react";
import Select from "react-select";
import axios from "axios";
import { saveAs } from "file-saver";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const LocalViewOutTour = ({
  setIslocalViewOutTourOpen,
  getLocalExpenseById,
}) => {
  const handleDownloadPDF = async (id) => {
    //alert(id);
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Authentication token missing.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/auth/exportLocalExpensessByIdToPDFWithHTML/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const fileName = `Local_Expense_${id}.pdf`;

      saveAs(response.data, fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF: " + error.message);
    }
  };

  return (
    <>
      {/* Modal Container */}
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px]  rounded-[6px]">
          <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            View Local Expenses Sheet
          </h2>

          {/* New Code */}
          {/* New Code */}
          <div className="p-4 mt-5 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* General Information */}
            <h3 className="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[20px] text-bgData mb-0 text-center mx-auto">
              DIMPLE CHEMICALS & SERVICES PVT LTD
              <br />
              <span className="text-gray-700 text-[18px]">
                OUTSTATION / LOCAL EXPENSES STATEMENT
              </span>
            </h3>

            <div className="border border-gray-400 mx-[2px]">
              <div className="w-100 flex items-start justify-between px-0">
                <div className="bg-[#e5e7eb38] rounded-[5px] w-[500px]">
                  <table className="w-full border border-gray-300 text-sm table-fixed">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600 w-[40%]">
                          Name of Employee
                        </td>
                        <td className="py-2 text-right align-middle w-[5%]">
                          :
                        </td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24 w-[40%]">
                          {getLocalExpenseById?.employee?.fullname || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Period of Expenses
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {getLocalExpenseById?.period_of_expenses || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Place of Visit
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {getLocalExpenseById?.place_of_visit || "-"}
                        </td>
                      </tr>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Bank A/C No.
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {getLocalExpenseById?.bank_account_no || "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Materials Table */}

              <div className="overflow-x-auto custom-scrollbar mt-16">
                <table className="min-w-full border border-gray-300 mt-6">
                  <thead className="bg-gray-400">
                    <tr>
                      {[
                        "S.N.",
                        "Date",
                        "Particulars",
                        "Travelling Exp.",
                        "Loading & Boarding",
                        "Printing & Stationery",
                        "Food Expenses",
                        "Company Car Exp.",
                        "Purchases",
                        "Other",
                        "Total",
                      ].map((header, index) => (
                        <th
                          key={index}
                          className={`border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2 ${
                            header === "S.N." ? "text-left" : "text-center"
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {getLocalExpenseById?.details?.map((item, index) => {
                      const rowTotal =
                        parseFloat(item.travelling_exp || 0) +
                        parseFloat(item.loading_boarding || 0) +
                        parseFloat(item.printing_stationery || 0) +
                        parseFloat(item.food_expenses || 0) +
                        parseFloat(item.company_car_exp || 0) +
                        parseFloat(item.purchases || 0) +
                        parseFloat(item.other || 0);

                      return (
                        <tr
                          key={index}
                          className="text-center hover:bg-gray-200 cursor-pointer"
                        >
                          <td className="border border-gray-300 px-4 py-2 text-left">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.date}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.particulars}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.travelling_exp}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.loading_boarding}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.printing_stationery}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.food_expenses}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.company_car_exp}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.purchases}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            {item.other}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 font-semibold">
                            {rowTotal.toFixed(2)}
                          </td>
                        </tr>
                      );
                    })}

                    {/* Grand Total Row */}
                    <tr className="text-center hover:bg-gray-200 cursor-pointer">
                      <td
                        colSpan={2}
                        className="border border-gray-300 px-4 py-2 text-left"
                      ></td>
                      <td className="border font-semibold text-bgDataNew border-gray-300 px-4 py-2 text-center">
                        Total:
                      </td>
                      {[
                        "travelling_exp",
                        "loading_boarding",
                        "printing_stationery",
                        "food_expenses",
                        "company_car_exp",
                        "purchases",
                        "other",
                      ].map((field, i) => (
                        <td
                          key={i}
                          className="border font-semibold text-gray-700 border-gray-300 px-4 py-2 text-center"
                        >
                          {getLocalExpenseById?.details
                            .reduce(
                              (sum, curr) => sum + parseFloat(curr[field] || 0),
                              0
                            )
                            .toFixed(2)}
                        </td>
                      ))}
                      <td className="border font-semibold text-bgDataNew border-gray-300 px-4 py-2 text-center">
                        {getLocalExpenseById?.details
                          .reduce(
                            (sum, curr) =>
                              sum +
                              parseFloat(curr.travelling_exp || 0) +
                              parseFloat(curr.loading_boarding || 0) +
                              parseFloat(curr.printing_stationery || 0) +
                              parseFloat(curr.food_expenses || 0) +
                              parseFloat(curr.company_car_exp || 0) +
                              parseFloat(curr.purchases || 0) +
                              parseFloat(curr.other || 0),
                            0
                          )
                          .toFixed(2)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="w-100 flex items-start justify-between px-0">
                <div className="bg-[#e5e7eb38] rounded-[5px] w-100">
                  <table className="w-full border border-gray-300 text-sm table-fixed">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td
                          colSpan={2}
                          className="py-2 px-4 text-center font-bold text-gray-900"
                        >
                          <h1>Reconciliation of Bank A/c </h1>{" "}
                        </td>
                        <td className="py-2 px-4 text-center font-bold text-gray-900"></td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Bank A/C Limit
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {getLocalExpenseById?.bank_ac_limit || "-"}
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Petty Cash Submitted On
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {getLocalExpenseById?.petty_cash_sub_on || "-"}
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Petty Cash Pending for Reload
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {getLocalExpenseById?.petty_cash_pending_for_reload ||
                            "-"}
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Cash in Hand
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {getLocalExpenseById?.cash_in_hand || "-"}
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Balance on Bank A/C
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {getLocalExpenseById?.balance_on_bank_ac || "-"}
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Difference
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {getLocalExpenseById?.diff || "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="w-100 flex items-start justify-between px-0">
                <div className="bg-[#e5e7eb38] rounded-[5px] w-100">
                  <table className="w-full border border-gray-300 text-sm table-fixed">
                    <tbody>
                      {/* Prepared By | Checked By | Approved By in a single row */}
                      <tr className="border-b border-gray-200">
                        {/* Prepared By */}
                        <td
                          className="py-2 px-4 text-left font-bold text-gray-600"
                          colSpan={2}
                        >
                          Prepared By
                          <div className="mt-1 text-gray-800 whitespace-pre-line border border-gray-300 rounded p-2 bg-gray-50 min-h-[120px]">
                            {getLocalExpenseById?.prepared_by || "-"}
                          </div>
                        </td>

                        {/* Checked By */}
                        <td
                          className="py-2 px-4 text-left font-bold text-gray-600"
                          colSpan={2}
                        >
                          Checked By
                          <div className="mt-1 text-gray-800 whitespace-pre-line border border-gray-300 rounded p-2 bg-gray-50 min-h-[120px]">
                            {getLocalExpenseById?.checked_by || "-"}
                          </div>
                        </td>

                        {/* Approved By */}
                        <td
                          className="py-2 px-4 text-left font-bold text-gray-600"
                          colSpan={2}
                        >
                          Approved By
                          <div className="mt-1 text-gray-800 whitespace-pre-line border border-gray-300 rounded p-2 bg-gray-50 min-h-[120px]">
                            {getLocalExpenseById?.approved_by || "-"}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Submit and Close Buttons */}
          <div className="flex items-end justify-end gap-2 px-4 my-4">
            <button
              type="button"
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              onClick={() => handleDownloadPDF(getLocalExpenseById?.id)}
            >
              Download PDF
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setIslocalViewOutTourOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LocalViewOutTour;
