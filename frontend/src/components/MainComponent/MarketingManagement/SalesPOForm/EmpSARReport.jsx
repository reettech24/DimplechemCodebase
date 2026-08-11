import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../../AlertMessage/ErrorMessage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { addLeadCommunication } from "../../../../redux/leadSlice";
import axios from "axios";
//import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const EmpSARReport = ({
  setShowFinlizeDealProduct,
  selectedLead,
  setSelectedLead,
}) => {
  const dispatch = useDispatch();

  const [flashMessage, setFlashMessage] = useState("");
  const [flashMsgType, setFlashMsgType] = useState("");

  const handleFlashMessage = (message, type) => {
    setFlashMessage(message);
    setFlashMsgType(type);
    setTimeout(() => {
      setFlashMessage("");
      setFlashMsgType("");
    }, 3000);
  };

//   const exportToExcel = () => {
//   if (!selectedLead || !selectedLead.deals || selectedLead.deals.length === 0) return;

//   const companyTitle = `${selectedLead.company_name} Deal Products`;

//   const tableData = selectedLead.deals.map((deal, index) => ({
//     Id: index + 1,
//     Date: deal.date,
//     "Product Name": deal.product_name,
//     "Area - Sq mtr / Cub Mtr": "Sq mtr/cub mtr",
//     Quantity: deal.quantity,
//     Rate: `₹${deal.rate}`,
//     "Deal Amount": `₹${deal.amount || 0}`,
//     "Advance Amount": `₹${deal.advance_amount || ""}`,
//   }));

//   tableData.push({
//     Id: "",
//     Date: "",
//     "Product Name": "",
//     "Area - Sq mtr / Cub Mtr": "",
//     Quantity: "",
//     Rate: "",
//     "Deal Amount": `₹${selectedLead.total_deal_amount || 0}`,
//     "Advance Amount": `₹${selectedLead.total_advance_amount || 0}`,
//   });

//   const worksheet = XLSX.utils.json_to_sheet(tableData, { origin: "A2" });

//   // Add header at A1
//   XLSX.utils.sheet_add_aoa(worksheet, [[companyTitle]], { origin: "A1" });

//   // Merge A1 to H1
//   worksheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }];

//   // Center align the merged cell A1:H1
//   worksheet["A1"].s = {
//     alignment: {
//       horizontal: "center",
//       vertical: "center",
//     },
//     font: {
//       bold: true,
//       sz: 14,
//     },
//   };

//   worksheet["!cols"] = [
//     { wch: 5 },
//     { wch: 15 },
//     { wch: 25 },
//     { wch: 25 },
//     { wch: 10 },
//     { wch: 10 },
//     { wch: 15 },
//     { wch: 20 },
//   ];

//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, `${selectedLead.company_name} Deals`);

//   const excelBuffer = XLSX.write(workbook, {
//     bookType: "xlsx",
//     type: "array",
//     cellStyles: true, // ✅ Important for styles to apply
//   });

//   const file = new Blob([excelBuffer], {
//     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//   });

//   const fileName = `${selectedLead.company_name}_Deal_Products_${new Date().toISOString().slice(0, 10)}.xlsx`;
//   saveAs(file, fileName);
// };

const exportToExcel = async () => {
  if (!selectedLead || !selectedLead.deals || selectedLead.deals.length === 0) return;

  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Deals");

  // 👉 1. Add heading row with merge
  sheet.mergeCells("A1:H1");
  const titleRow = sheet.getCell("A1");
  titleRow.value = `${selectedLead.company_name} Deal Products`;
  titleRow.alignment = { horizontal: "center", vertical: "middle" };
  titleRow.font = { bold: true, size: 14 };

  // 👉 2. Add table headers
  const headerRow = sheet.addRow([
    "Id",
    "Date",
    "Product Name",
    "Area - Sq mtr / Cub Mtr",
    "Quantity",
    "Rate",
    "Deal Amount",
    "Advance Amount",
  ]);

  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center" };

  // 👉 3. Add deal data rows
  selectedLead.deals.forEach((deal, index) => {
    sheet.addRow([
      index + 1,
      deal.date,
      deal.product_name,
      "Sq mtr/cub mtr",
      deal.quantity,
      `₹${deal.rate}`,
      `₹${deal.amount || 0}`,
      `₹${deal.advance_amount || ""}`,
    ]);
  });

  // 👉 4. Add total row
  const totalRow = sheet.addRow([
    "",
    "",
    "",
    "",
    "",
    "",
    `₹${selectedLead.total_deal_amount || 0}`,
    `₹${selectedLead.total_advance_amount || 0}`,
  ]);
  totalRow.font = { bold: true };

  // 👉 5. Set column widths
  sheet.columns = [
    { width: 5 },
    { width: 15 },
    { width: 25 },
    { width: 25 },
    { width: 10 },
    { width: 10 },
    { width: 15 },
    { width: 20 },
  ];

  // 👉 6. Export and download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const fileName = `${selectedLead.company_name}_Deal_Products_${new Date().toISOString().slice(0, 10)}.xlsx`;
  saveAs(blob, fileName);
};

  console.log("selectedLead", selectedLead);
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-[1400px] rounded-lg overflow-auto">
        <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          {selectedLead?.company_name} Deal Products
        </h2>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar p-4 max-h-[calc(100vh-200px)]">
          <table className="w-full border border-collapse text-sm">
            <thead>
              <tr className="bg-gray-400 rounded-[8px] sticky top-0 z-10">
                <th className="px-4 py-2 text-center text-gray-800 whitespace-nowrap  whitespace-nowrap ">
                  Id
                </th>
                <th className="px-4 py-2 text-center text-gray-800 whitespace-nowrap  whitespace-nowrap ">
                  Date
                </th>
                <th className="px-4 py-2 text-center text-gray-800 whitespace-nowrap  whitespace-nowrap ">
                  Product Name
                </th>
                <th className="px-4 py-2 text-center text-gray-800 whitespace-nowrap  whitespace-nowrap ">
                  Area - Sq mtr / Cub Mtr
                </th>
                <th className="px-4 py-2 text-center text-gray-800 whitespace-nowrap  whitespace-nowrap ">
                  Quantity
                </th>
                <th className="px-4 py-2 text-center text-gray-800 whitespace-nowrap  whitespace-nowrap ">
                  Rate
                </th>
                <th className="px-4 py-2 text-center text-gray-800  whitespace-nowrap">
                  Deal Amount
                </th>
                <th className="px-4 py-2 text-center text-gray-800 whitespace-nowrap  whitespace-nowrap ">
                  Advance amount
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedLead?.deals?.map((user, index) => (
                <tr key={index} className="text-center">
                  <td className="px-4 py-2 text-newtextdata">{index + 1}</td>
                  <td className="px-4 py-2 text-newtextdata">{user?.date}</td>
                  <td className="px-4 py-2 text-newtextdata">
                    {user?.product_name}
                  </td>
                  <td className="px-4 py-2 text-newtextdata">
                    {user?.area} Sq mtr/cub mtr
                  </td>
                  <td className="px-4 py-2 text-newtextdata">
                    {user?.quantity}
                  </td>
                  <td className="px-4 py-2 text-newtextdata">₹{user?.rate}</td>
                  <td className="px-4 py-2 text-newtextdata text-center">
                    ₹{user?.amount}
                  </td>
                  <td className="px-4 py-2 text-newtextdata">
                    ₹{user?.advance_amount}
                  </td>
                </tr>
              ))}
              <tr className="text-center">
                <td className="px-4 py-2 text-newtextdata text-center"></td>
                <td className="px-4 py-2 text-newtextdata text-center"></td>
                <td className="px-4 py-2 text-newtextdata text-center"></td>
                <td className="px-4 py-2 text-newtextdata text-center"></td>
                <td className="px-4 py-2 text-newtextdata text-center"></td>
                <td className="px-4 py-2 text-newtextdata text-center"></td>
                <td className="px-4 py-2 text-newtextdata text-center">
                  ₹{selectedLead?.total_deal_amount}
                </td>
                <td className="px-4 py-2 text-newtextdata">
                  ₹{selectedLead?.total_advance_amount}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="flex gap-3 justify-end p-4">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export to Excel
          </button>

          <button
            onClick={() => setShowFinlizeDealProduct(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmpSARReport;
