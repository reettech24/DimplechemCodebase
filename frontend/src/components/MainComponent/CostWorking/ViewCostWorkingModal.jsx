import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { saveAs } from "file-saver";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const ViewCostWorkingModal = ({
  setViewCostWorkingModalOpen,
  selectedCostWorking,
}) => {
  console.log("selectedCostWorking", selectedCostWorking);
  const navigate = useNavigate();

  let serialNumber = 1;
  let lastCategoryId = null;

  const totalMaterialCost = selectedCostWorking?.products.reduce(
    (total, item) => {
      const basicAmount = parseFloat(item.basic_amount);
      return total + (isNaN(basicAmount) ? 0 : basicAmount);
    },
    0
  );

  //B2 start
  const totalLabourCost =
    Number(selectedCostWorking?.labour_cost || 0) +
    Number(selectedCostWorking?.cunsumable_cost || 0) +
    Number(selectedCostWorking?.transport_cost || 0) +
    Number(selectedCostWorking?.supervision_cost || 0);

  const totalAreaCost =
    (parseFloat(selectedCostWorking.labour_cost_area) || 0) +
    (parseFloat(selectedCostWorking.cunsumable_cost_area) || 0) +
    (parseFloat(selectedCostWorking.transport_cost_area) || 0) +
    (parseFloat(selectedCostWorking.supervision_cost_area) || 0);

  const FinanceCost = (
    (parseFloat(totalMaterialCost) + parseFloat(totalLabourCost)) *
    (selectedCostWorking?.finance_cost_persantage / 100) *
    selectedCostWorking?.finance_cost_month
  ).toFixed(2);

  const TotalFinanceCost =
    parseFloat(FinanceCost) + parseFloat(totalLabourCost);
  //end c

  const overhead_charges =
    //selectedCostWorking?.over_head_charges_area *
    (TotalFinanceCost.toFixed(2) *
      selectedCostWorking?.over_head_charges_persantage) /
    100;

  const total_application_labour_cost = (
    parseFloat(TotalFinanceCost) + parseFloat(overhead_charges)
  ).toFixed(2);

  const totalApplication_Totalmaterialcost = (
    Number(totalMaterialCost || 0) + Number(total_application_labour_cost || 0)
  ).toFixed(2);

  const contarctorprofit = (
    totalApplication_Totalmaterialcost *
    (parseFloat(selectedCostWorking?.contractor_profit_persantage) / 100)
  ).toFixed(2);

  const total_project_cost = (
    parseFloat(totalApplication_Totalmaterialcost) +
    parseFloat(contarctorprofit)
  ).toFixed(2);

  const cost_persqrtmt = (
    total_project_cost / selectedCostWorking?.area_to_be_coated
  ).toFixed(2);

  //export to pdf

  const quotationRef = useRef();

  const generateQuotationExcel = async (id) => {
    //alert(id);
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Authentication token missing.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/auth/costworking-export-excel/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob", // Ensure the response is treated as a binary file
        }
      );

      const fileName = `CostWorking_Report_${id}.xlsx`;

      // ✅ Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // ✅ Create a temporary <a> tag to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // File name
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup after download
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("Download failed. Please try again.");
    }
  };

  const generateQuotationPdf = async (id) => {
    try {
      const token = getAuthToken();
      if (!token) {
        alert("Authentication token missing.");
        return;
      }

      const response = await axios.get(
        `${API_URL}/auth/exportCostWorkingByIdToPDFWithHTML/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const fileName = `CostWorking_Report_${id}.pdf`;

      saveAs(response.data, fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF: " + error.message);
    }
  };

  const productsByCategory = selectedCostWorking?.products?.reduce(
    (acc, product) => {
      const category = product.category_name || "Uncategorized";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    },
    {}
  );

  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[1400px] rounded-[6px]">
        <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Cost Working Report
        </h2>

        <div className="p-4 mt-5 overflow-y-auto max-h-[calc(100vh-200px)] w-full">
          {/* General Information */}
          <h3 className="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[20px] text-bgData mb-0 text-center mx-auto">
            Cost Working Report
          </h3>
          <div className="border border-gray-400 mx-[2px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
              {[
                [
                  {
                    label: "Name of Company",
                    value: selectedCostWorking?.company?.company_name,
                  },
                  {
                    label: "Location/Site",
                    value: selectedCostWorking?.location,
                  },
                  {
                    label: "Nature of Work",
                    value: selectedCostWorking?.nature_of_work,
                  },
                  {
                    label: "Technology Used",
                    value: selectedCostWorking?.technology_used,
                  },
                  // {
                  //   label: "Area in Sq. Mtr.",
                  //   value: selectedCostWorking?.area_to_be_coated,
                  // },
                  {
                    label: "Total Area (in Sq. Mtr.)",
                    value: selectedCostWorking?.area_to_be_coated,
                  },
                  {
                    label: "Thickness in mm",
                    value: selectedCostWorking?.thickness_in_mm,
                  },
                ],
                [
                  {
                    label: "Estimate No",
                    value: selectedCostWorking?.estimate_no,
                  },
                  {
                    label: "Estimate Date",
                    value: selectedCostWorking?.estimate_date?.split("T")[0],
                  },
                  {
                    label: "Revision No",
                    value: selectedCostWorking?.revision_no,
                  },
                  {
                    label: "Revision Date",
                    value: selectedCostWorking?.revision_date?.split("T")[0],
                  },
                ],
              ].map((fields, tableIndex) => (
                <div key={tableIndex} className="overflow-x-auto custom-scrollbar">
                  <table className="table-auto w-full text-left border-collapse border border-gray-300">
                    <tbody>
                      {fields.map((field, index) => (
                        <tr
                          key={index}
                          className="hover:bg-gray-50 whitespace-nowrap cursor-pointer"
                        >
                          <td className="px-4 py-2 text-gray-900 font-poopins text-[16px] border border-gray-300 font-medium">
                            {field.label}:
                          </td>
                          <td className="px-4 py-2 text-[15px] text-gray-600 border border-gray-300 pl-16">
                            {field.value ?? null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Materials Table */}
            <div className="overflow-x-auto custom-scrollbar mt-8">
              {/* New Code */}
              <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-400">
                  <tr>
                    {[
                      "S.N.",
                      "Item",
                      "HSN Code",
                      "Qty/M²",
                      "Unit",
                      //"Qty for Sq. Mtr.",
                      "Qty. for Total Area (in SqM)",
                      "Std Pak",
                      "Basic Rate",
                      "Basic Amount",
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
                  {/* Section Header: Material Cost */}
                  <tr className="bg-gray-300 text-center">
                    <td className="py-2">
                      <div className="border border-gray-400 w-fit  px-2 py-0 rounded-[3px] font-poppins font-medium text-[18px]  text-gray-700">
                        A -
                      </div>
                    </td>
                    <td className="py-2">
                      <div className="border border-gray-400 w-fit  px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px]  text-gray-700">
                        Material Cost
                      </div>
                    </td>
                    <td className="py-2"></td>
                    <td className="py-2"></td>
                    <td className="py-2"></td>
                    <td className="py-2"></td>
                    <td className="py-2"></td>
                    <td className="py-2"></td>

                    <td colSpan="1" className="py-2"></td>
                  </tr>

                  {/* Subsection Header: Bond Coat */}

                  {Object.entries(productsByCategory).map(
                    ([categoryName, products], categoryIndex) => (
                      <React.Fragment key={categoryIndex}>
                        {/* Category Header Row */}
                        <tr className="bg-gray-100 font-medium text-left">
                          <td className="border border-gray-300 px-4 py-2 text-black">
                            {categoryIndex + 1}
                          </td>
                          <td
                            className="border border-gray-300 px-4 py-2 text-black font-bold"
                            colSpan={8}
                          >
                            {categoryName}
                          </td>
                        </tr>

                        {/* Product Rows */}
                        {products.map((material, index) => (
                          <tr
                            key={material.id}
                            className="hover:bg-gray-200 text-center"
                          >
                            <td className="border border-gray-300 px-4 py-2 text-left"></td>
                            <td className="border border-gray-300 px-4 py-2 text-left">
                              {material?.Product?.product_name}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {material?.Product?.HSN_code}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {material.qty_for}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {material.unit}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {material.qty_for_1}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {material.std_pak}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {material.std_basic_rate}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                              {material.basic_amount}
                            </td>
                          </tr>
                        ))}
                      </React.Fragment>
                    )
                  )}

                  {/* Total Row */}

                  <tr className="bg-gray-100 font-semibold text-black">
                    <td
                      className="px-4 py-2 text-bgDataNew border border-gray-300 text-right"
                      colSpan="6"
                    >
                      Total Material basic Cost :
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      A
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      Rs
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      {totalMaterialCost}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-semibold text-black">
                    <td
                      className="px-4 py-2 text-bgDataNew border border-gray-300 text-right"
                      colSpan="6"
                    >
                      Per Sq Mtr. Material cost
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      A
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      Per Sq Mtr.
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      {(
                        totalMaterialCost /
                        selectedCostWorking.area_to_be_coated
                      ).toFixed(2) || 0}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="min-w-full border border-gray-300 mt-14">
                <thead className="bg-gray-400">
                  <tr>
                    {["", "Description", "Area", "Unit", "Amount"].map(
                      (header, index) => (
                        <th
                          key={index}
                          className={`border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2 ${
                            header === "Description"
                              ? "text-left"
                              : "text-center"
                          }`}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                  <tr className="bg-gray-300 text-center">
                    <th className="py-2 px-4 text-left">
                      <div className="border border-gray-400 w-fit px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px] text-gray-700 text-left">
                        B -
                      </div>
                    </th>
                    <th className="py-2 px-4 text-left">
                      <div className="border border-gray-400 w-fit px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px] text-gray-700 text-left">
                        Cost as per project / Site condition
                      </div>
                    </th>
                    <th className="py-2 px-4 text-left"></th>
                    <th className="py-2 px-4 text-left"></th>
                    <th className="py-2 px-4 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  <br />
                  {/* Subsection Header: Bond Coat */}
                  <tr className="bg-gray-300 font-medium text-left">
                    <td
                      colSpan="5"
                      className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                    >
                      B1
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Labour cost
                    </td>
                    <td className="border border-gray-300 p-2 bg-yellow-100">
                      {selectedCostWorking?.labour_cost_area}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.labour_cost}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Consumable cost
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.cunsumable_cost_area}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.cunsumable_cost}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Transport cost
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.transport_cost_area}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.transport_cost}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Supervision cost
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.supervision_cost_area}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.supervision_cost}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-semibold text-black">
                    <td className="px-4 py-2 text-bgDataNew border border-gray-300 text-left"></td>
                    <td
                      colspan=""
                      className="px-4 py-2 text-bgDataNew border border-gray-300 text-left"
                    >
                      B1 - Total :
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      {totalAreaCost.toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center"></td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      {totalLabourCost.toFixed(2)}
                      {/* {selectedCostWorking?.labour_cost+selectedCostWorking?.cunsumable_cost+selectedCostWorking?.transport_cost+selectedCostWorking?.supervision_cost} */}
                    </td>
                  </tr>

                  <br />
                  {/* Subsection Header: Bond Coat */}
                  <tr className="bg-gray-300 font-medium text-left">
                    <td
                      colSpan="5"
                      className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                    >
                      B2
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 p-2  text-center"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left w-[400px]">
                      Finance cost
                    </td>
                    <td className="border border-gray-300 p-2 bg-yellow-100">
                      {selectedCostWorking?.finance_cost_month}{" "}
                      <span className="text-sm text-gray-600">month</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      {selectedCostWorking?.finance_cost_persantage}{" "}
                      <span className="text-sm text-gray-600">%</span>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {FinanceCost}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 font-semibold text-black">
                    <td className="border border-gray-300 p-2  text-center"></td>
                    <td
                      colspan=""
                      className="px-4 py-2 text-bgDataNew border border-gray-300 text-left"
                    >
                      Total Cost :
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      b2
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      M2
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      {TotalFinanceCost.toFixed(2)}
                    </td>
                  </tr>

                  <br />
                  {/* Subsection Header: Bond Coat */}
                  <tr className="bg-gray-300 font-medium text-left">
                    <td
                      colSpan="5"
                      className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                    >
                      B3
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 p-2  text-center"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Over Head Charges
                    </td>
                    <td className="border border-gray-300 p-2 bg-yellow-100">
                      {selectedCostWorking?.over_head_charges_area}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      {selectedCostWorking?.over_head_charges_persantage}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {overhead_charges.toFixed(2)}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-semibold text-black">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left"></td>
                    <td
                      colspan=""
                      className="px-4 py-2 text-bgDataNew border border-gray-300 text-left"
                    >
                      Total application ( Labour) Cost :
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      B=(b1+b2+b3)
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      M2
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-white text-center bg-red-400">
                      {total_application_labour_cost}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="min-w-full border border-gray-300 mt-14">
                <thead className="bg-gray-400">
                  <tr>
                    {["", "Total", "Unit", "Qty", "Total Project Cost RS"].map(
                      (header, index) => (
                        <th
                          key={index}
                          className={`border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2 ${
                            header === "Total" ? "text-left" : "text-center"
                          }`}
                        >
                          {header}
                        </th>
                      )
                    )}
                  </tr>
                  <tr className="bg-gray-300 text-center">
                    <th className="py-2 px-4">
                      <div className="border border-gray-400 w-fit px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px]  text-gray-700">
                        C -
                      </div>
                    </th>
                    <th className="py-2 px-4">
                      <div className="border border-gray-400 w-fit  px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px]  text-gray-700">
                        Project Calculation
                      </div>
                    </th>
                    <th className="py-2 px-4"></th>
                    <th className="py-2 px-4"></th>
                    <th className="py-2 px-4"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left font-bold text-gray-700">
                      Total Material basic Cost
                    </td>
                    <td className="border border-gray-300 p-2">A</td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      {totalMaterialCost}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left font-bold text-gray-700">
                      Total application (Labour) cost
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      B
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      {total_application_labour_cost}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left font-bold text-gray-700">
                      Total Material + Application basic Cost
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      {totalApplication_Totalmaterialcost}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 p-2"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left font-bold text-gray-700">
                      Contractor profit
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      C
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      {selectedCostWorking?.contractor_profit_persantage}
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      {contarctorprofit}
                    </td>
                  </tr>
                  <br />
                  <tr className="bg-gray-100 font-semibold text-black text-center">
                    <td className="border border-gray-300 p-2"></td>
                    <td className="px-4 py-2 font-bold text-gray-700 border border-gray-300 text-left">
                      Total Project Cost :
                    </td>
                    <td className="px-4 py-2 border border-gray-300 font-bold text-gray-600 text-center">
                      A+B+C
                    </td>
                    <td className="px-4 py-2 border border-gray-300 font-bold text-gray-600 text-center">
                      {selectedCostWorking?.area_to_be_coated}
                    </td>
                    <td className="px-4 py-2 border border-gray-300 font-bold text-gray-600 text-center">
                      {total_project_cost}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-semibold text-black text-center">
                    <td className="border border-gray-300 p-2"></td>
                    <td className="px-4 py-2 text-bgDataNew border border-gray-300 text-left">
                      Total Project Cost Per M2 :
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      M2
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center"></td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      {cost_persqrtmt}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="min-w-full border border-gray-300 mt-14">
                <tbody>
                  {/* Subsection Header: Note */}
                  <tr className="bg-gray-100 font-semibold text-black">
                    <td
                      colSpan="8"
                      className="px-4 py-2 text-bgDataNew border border-gray-300 text-left"
                    >
                      Note
                    </td>
                  </tr>

                  {/* Note Content */}
                  <tr className="text-center">
                    <td
                      colSpan="8"
                      className="border border-gray-300 p-4 bg-yellow-100 text-left whitespace-pre-wrap"
                    >
                      {selectedCostWorking?.notes?.trim() ||
                        "No notes available."}
                    </td>
                  </tr>
                </tbody>
              </table>

              <table className="min-w-full border border-gray-300 mt-14">
                <tbody>
                  <br />
                  {/* Subsection Header */}
                  <tr className="bg-gray-100 font-semibold text-black">
                    <td
                      colSpan="5"
                      className="px-4 py-2 text-bgDataNew border border-gray-300 text-left"
                    >
                      for Dimple Chemicals & Services Pvt. Ltd
                    </td>
                  </tr>

                  {/* Header Row */}
                  <tr className="text-center bg-gray-300 font-semibold">
                    <td className="border border-gray-400 p-2">Approved By</td>
                    <td className="border border-gray-400 p-2">Checked By</td>
                    <td className="border border-gray-400 p-2">
                      DCPL Representative
                    </td>
                    <td className="border border-gray-400 p-2">Prepared By</td>
                  </tr>

                  {/* Data Row */}
                  <tr className="text-center hover:bg-gray-100">
                    <td className="border border-gray-300 p-2 bg-yellow-50">
                      <textarea
                        readOnly
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center bg-yellow-50 resize-none"
                        value={selectedCostWorking?.approved_by || "-"}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-yellow-50">
                      <textarea
                        readOnly
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center bg-yellow-50 resize-none"
                        value={selectedCostWorking?.checked_by || "-"}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-yellow-50">
                      <textarea
                        readOnly
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center bg-yellow-50 resize-none"
                        value={selectedCostWorking?.dcpl_representative || "-"}
                      />
                    </td>
                    <td className="border border-gray-300 p-2 bg-yellow-50">
                      <textarea
                        readOnly
                        className="w-full px-2 py-1 border border-gray-300 rounded text-center bg-yellow-50 resize-none"
                        value={selectedCostWorking?.prepared_by || "-"}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end justify-end gap-2 px-4 my-4">
          <button
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={() => generateQuotationExcel(selectedCostWorking?.id)}
          >
            Excel
          </button>
          <button
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={() => generateQuotationPdf(selectedCostWorking?.id)}
          >
            Pdf
          </button>
          <button
            className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={() => setViewCostWorkingModalOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCostWorkingModal;
