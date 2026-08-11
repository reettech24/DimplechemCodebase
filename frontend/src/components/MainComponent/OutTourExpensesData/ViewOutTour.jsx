import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Select from "react-select";
import axios from "axios";
import { saveAs } from 'file-saver';

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const ViewOutTour = ({ setIsViewOutTourOpen, outTourDataById }) => {
   const handleDownloadPDF = async (id) => {
    //alert(id);
      try {
         
        const token = getAuthToken();
        if (!token) {
          alert("Authentication token missing.");
          return;
        }
  
        const response = await axios.get(
          `${API_URL}/auth/exportOutTourExpensessByIdToPDFWithHTML/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            responseType: "blob",
          } 
        );
  
        const fileName = `OutTour_Expense_${id}.pdf`;
  
        saveAs(response.data, fileName);
  
      } catch (error) {
          console.error("Error generating PDF:", error);
          alert("Error generating PDF: " + error.message);
      }
  }

  return (
    <>
      {/* Modal Container */}
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px]  rounded-[6px]">
          <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            View OutTour Expenses
          </h2>

          {/* New Code */}
          <div
            className="p-4 mt-5 overflow-y-auto max-h-[calc(100vh-200px)]"
          >
            {/* General Information */}
            <h3 className="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[20px] text-bgData mb-0 text-center mx-auto">
              DIMPLE CHEMICALS & SERVICES PVT LTD
              <br />
              <span className="text-gray-700 text-[18px]">
                OUT TOUR EXPENSES APPROVAL
              </span>
            </h3>

            <div className="border border-gray-400 mx-[2px]">
              <div className="w-100 flex items-start justify-between px-0">
                <div className="overflow-x-auto bg-[#e5e7eb38] rounded-[5px] w-[500px]">
                  <table className="w-full border border-gray-300 text-sm table-fixed">
                    <tbody>
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600 w-[40%]">
                          Name of Employee
                        </td>
                        <td className="py-2 text-right align-middle w-[5%]">
                          :
                        </td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24 w-[55%]">
                          {outTourDataById?.employee?.fullname || "-"}
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Person Accompanied
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {outTourDataById?.person_accompanied || "-"}
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Place of Visit
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {outTourDataById?.place_of_visit || "-"}
                        </td>
                      </tr>

                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-4 text-left font-bold text-gray-600">
                          Period of Visit (Days)
                        </td>
                        <td className="py-2 text-right align-middle">:</td>
                        <td className="py-2 px-4 text-left text-gray-800 pl-24">
                          {outTourDataById?.period_of_visit || "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Materials Table */}
              <div className="overflow-x-auto custom-scrollbar mt-8">
                {/* New Code */}
                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-400">
                    <tr className="bg-gray-300 text-center">
                      <td colSpan="9" className="py-2">
                        <div className="mb-1 border border-gray-400 w-fit mx-auto px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px] text-gray-700">
                          Details of Visit
                        </div>
                        <div className="border border-gray-400 w-fit mx-auto px-4 py-0 rounded-[3px] font-poppins font-medium text-[15px] text-gray-600">
                          Expected Potential (In Rupees)
                        </div>
                      </td>
                    </tr>
                    <tr>
                      {[
                        "S.N.",
                        "Date",
                        "Place of Visit",
                        "Purpose of Visit",
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
                    {outTourDataById?.details?.length > 0 ? (
                      outTourDataById.details.map((item, index) => (
                        <tr
                          key={item.id}
                          className="text-center hover:bg-gray-200 cursor-pointer"
                        >
                          <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                            {index + 1}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-textdata text-center">
                            {item.date}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-textdata text-center">
                            {item.place_of_visit}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-textdata text-center">
                            {item.purpose}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="4"
                          className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                        >
                          No visit details found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <table className="min-w-full border border-gray-300 mt-8">
                  <thead className="bg-gray-400">
                    <tr className="bg-gray-300 text-center">
                      <td colSpan="9" className="py-2">
                        <div className="border border-gray-400 w-fit mx-auto px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px] text-gray-700">
                          Expenses Budget
                        </div>
                      </td>
                    </tr>
                    <tr>
                      {["S.N.", "Description", "Amount"].map(
                        (header, index) => (
                          <th
                            key={index}
                            className={`border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2 ${
                              header === "S.N." ? "text-left" : "text-center"
                            }`}
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {outTourDataById?.expenses?.length > 0 ? (
                      <>
                        {outTourDataById.expenses.map((item, index) => (
                          <tr
                            key={item.id}
                            className="text-center hover:bg-gray-200 cursor-pointer"
                          >
                            <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                              {index + 1}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-textdata text-left pl-24">
                              {item.description}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 text-textdata text-center">
                              {item.amount}
                            </td>
                          </tr>
                        ))}

                        {/* Total Row */}
                        <tr className="text-center hover:bg-gray-200 cursor-pointer">
                          <td className="border border-gray-300 px-4 py-2 text-textdata text-left"></td>
                          <td className="border font-semibold border-gray-300 px-4 py-2 text-bgDataNew text-center">
                            Total
                          </td>
                          <td className="border font-semibold text-bgDataNew border-gray-300 px-4 py-2 text-center">
                            {outTourDataById.expenses
                              .reduce(
                                (total, item) =>
                                  total + parseFloat(item.amount),
                                0
                              )
                              .toFixed(2)}
                          </td>
                        </tr>
                      </>
                    ) : (
                      <tr>
                        <td
                          colSpan="3"
                          className="border border-gray-300 px-4 py-2 text-center text-gray-500"
                        >
                          No expenses found
                        </td>
                      </tr>
                    )}
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
                            {outTourDataById?.prepared_by || "-"}
                          </div>
                        </td>

                        {/* Checked By */}
                        {/* <td
                          className="py-2 px-4 text-left font-bold text-gray-600"
                          colSpan={2}
                        >
                          Checked By
                          <div className="mt-1 text-gray-800 whitespace-pre-line border border-gray-300 rounded p-2 bg-gray-50 min-h-[120px]">
                            {getLocalExpenseById?.checked_by || "-"}
                          </div>
                        </td> */}

                        {/* Approved By */}
                        <td
                          className="py-2 px-4 text-left font-bold text-gray-600"
                          colSpan={2}
                        >
                          Approved By
                          <div className="mt-1 text-gray-800 whitespace-pre-line border border-gray-300 rounded p-2 bg-gray-50 min-h-[120px]">
                            {outTourDataById?.approved_by || "-"}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
          </div>

          {/* Submit and Close Buttons */}
          <div className="flex items-end justify-end gap-2 px-4 my-4">
            <button
              type="button"
              className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
              onClick={()=>handleDownloadPDF(outTourDataById?.id)}
            >
              Download PDF
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setIsViewOutTourOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewOutTour;
