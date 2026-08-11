import React from "react";
import { useNavigate } from "react-router-dom";

const ViewTaskShedule = ({
  setViewCostWorkingModalOpen,
  selectedCostWorking,
}) => {
  console.log("selectedCostWorking", selectedCostWorking);
  const navigate = useNavigate();

  let serialNumber = 1;
  let lastCategoryId = null;

  //B2 start
  const totalCost =
  selectedCostWorking?.labour_cost +
  selectedCostWorking?.cunsumable_cost +
  selectedCostWorking?.transport_cost +
  selectedCostWorking?.supervision_cost;

  const sixPercentAmount = ((totalCost * 6) / 100).toFixed(2);
  const totalWithSixPercent = (totalCost + parseFloat(sixPercentAmount)).toFixed(2);

  //B2 end

  //B3 start
  const twentyPercentAmount = (parseFloat(totalWithSixPercent) * 20) / 100;
  const grandTotal = (parseFloat(totalWithSixPercent) + twentyPercentAmount).toFixed(2);

  //B3 end

  //c
  const totalMaterialAndGrandTotal =
  parseFloat(selectedCostWorking?.total_material_cost ?? "0") +
  parseFloat(grandTotal);

const contractorProfit = Math.round((totalMaterialAndGrandTotal * 10) / 100 * 100) / 100;

const finalAmount = (totalMaterialAndGrandTotal + contractorProfit).toFixed(2);

  //end c

  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[1400px]  rounded-[6px]">
        <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Cost Working Report
        </h2>
        <div className="p-4 mt-5 overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* General Information */}
          <h3 className="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[20px] text-bgData mb-0 text-center mx-auto">
            Cost Working Format
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
                  {
                    label: "Area to be Coated",
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
                          <td className="px-4 py-2 text-[15px] text-gray-600 border border-gray-300">
                            {field.value || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>

            {/* Materials Table */}
            <div className="overflow-x-auto mt-8">
              {/* Old Code */}
              {/* <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-400">
                  <tr>
                    {[
                      "S.N.",
                      "Item",
                      "HSN Code",
                      "Qty/M²",
                      "Unit",
                      "Qty For",
                      "Std Pak",
                      "Basic Rate",
                      "Basic Amount",
                    ].map((header, index) => (
                      <th
                        key={index}
                        className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2 text-center"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {selectedCostWorking?.products?.map((material, index) => (
                    <tr key={index} className="hover:bg-gray-200 cursor-pointer text-center">
                      <td className="border border-gray-300 text-gray-700 text-[14px] px-4 py-2 text-center">
                        {index + 1}
                      </td>
                      <td className="border border-gray-300 text-gray-700 text-[14px] px-4 py-2 text-center">
                        {material?.Product?.product_name}
                      </td>
                      <td className="border border-gray-300 text-gray-700 text-[14px] px-4 py-2 text-center">
                        {material?.Product?.HSN_code}
                      </td>
                      <td className="border border-gray-300 text-gray-700 text-[14px] px-4 py-2 text-center">
                        {material.qty_for}
                      </td>
                      <td className="border border-gray-300 text-gray-700 text-[14px] px-4 py-2 text-center">
                        {material.unit}
                      </td>
                      <td className="border border-gray-300 text-gray-700 text-[14px] px-4 py-2 text-center">
                        {material.qty_for}
                      </td>
                      <td className="border border-gray-300 text-gray-700 text-[14px] px-4 py-2 text-center">
                        {material.std_pak}
                      </td>
                      <td className="border border-gray-300 text-gray-700 text-[14px] px-4 py-2 text-center">
                        {material.std_basic_rate}
                      </td>
                      <td className="border border-gray-300 text-gray-700 text-[14px] px-4 py-2 text-center">
                        {material.basic_amount}
                      </td>
                    </tr>
                  ))}

                  
                  <tr className="bg-gray-100 font-semibold text-gray-800 text-center">
                    <td
                      className="border border-gray-300 text-bgDataNew text-[14px] px-4 py-2 text-right"
                      colSpan={8}
                    >
                      Total Material Cost:
                    </td>
                    <td className="border border-gray-300 text-bgDataNew text-[14px] px-4 py-2">
                      {selectedCostWorking?.total_material_cost ?? "0"}
                    </td>
                  </tr>
                </tbody>
              </table> */}

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
                      "Qty for 1",
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
                    <td colSpan="9" className="py-2">
                      <div className="border border-gray-400 w-fit mx-auto px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px]  text-gray-700">
                        A - Material Cost
                      </div>
                    </td>
                  </tr>

                  {/* Subsection Header: Bond Coat */}

                  {selectedCostWorking?.products?.map((material, index) => {
                    const showCategory =
                      material.category_id !== lastCategoryId;
                    if (showCategory) {
                      lastCategoryId = material.category_id;
                    }

                    return (
                      <React.Fragment key={index}>
                        {showCategory && (
                          <tr className="bg-gray-100 font-medium text-left">
                            <td className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2">
                              {serialNumber++}
                            </td>
                            <td className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2">
                              {material?.category?.category_name}
                            </td>
                            <td
                              className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                              colSpan="7"
                            >
                              {/* blank cell */}
                            </td>
                          </tr>
                        )}

                        <tr className="text-center hover:bg-gray-200 cursor-pointer">
                          <td className="border border-gray-300 px-4 py-2 text-textdata text-left"></td>
                          <td
                            className="border border-gray-300 px-4 py-2 text-textdata text-left"
                            colSpan="1"
                          >
                            {material?.Product?.product_name}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-textdata">
                            {material?.Product?.HSN_code}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-textdata">
                            {material.qty_for}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-textdata">
                            {material.unit}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-textdata">
                            {material.qty_for_1}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-textdata">
                            {material.std_pak}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-textdata">
                            {material.std_basic_rate}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-textdata">
                            {material.basic_amount}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}

                  {/* <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      
                    </td>
                    <td
                      className="border border-gray-300 px-4 py-2 text-textdata text-left"
                      colSpan="1"
                    >
                      Kelox H 404
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      390720
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      0.200
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      Kg
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      0.20
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      10
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      746.00
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      149.20
                    </td>
                  </tr> */}

                  {/* Subsection Header: PICC 50 mm Depth coat */}
                  {/* <tr className="bg-gray-100 font-medium text-left" colSpan="9">
                    <td
                      className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                    >
                      2
                    </td>
                    <td
                      className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                    >
                      PICC 50 mm Depth coat
                    </td>
                    <td
                      className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                      colSpan="7"
                    >
                      
                    </td>
                  </tr> */}

                  {/* PICC Items */}
                  {/* <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Nicocil C 80
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      382450
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      38
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      Kg
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      38
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      30
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      34.00
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      1,297.44
                    </td>
                  </tr> */}
                  {/* <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Cement 53 Grade Birla Super
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      252329
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      22
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      Kg
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      22
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      50
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      10.00
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      222.60
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Aggregate 10 to 20 mm
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      42
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      Kg
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      42
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      2.00
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      84.80
                    </td>
                  </tr> */}

                  {/* Total Row */}

                  <tr className="bg-gray-100 font-semibold text-black">
                    <td
                      className="px-4 py-2 text-bgDataNew border border-gray-300 text-right"
                      colSpan="8"
                    >
                      Total Material basic Cost :
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      {selectedCostWorking?.total_material_cost ?? "0"}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="min-w-full border border-gray-300 mt-14">
                <thead className="bg-gray-400">
                  <tr>
                    {["Description", "Area", "Unit", "Amount"].map(
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
                    <th colspan="4" className="py-2">
                      <div className="border border-gray-400 w-fit mx-auto px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px]  text-gray-700">
                        B - Cost as per project / Site condition
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <br />
                  {/* Subsection Header: Bond Coat */}
                  <tr className="bg-gray-300 font-medium text-left">
                    <td
                      colSpan="4"
                      className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                    >
                      B1
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Labour cost
                    </td>
                    <td className="border border-gray-300 p-2 bg-yellow-100">
                      1
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.labour_cost}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Consumable cost
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      1
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.cunsumable_cost}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Transport cost
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      1
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.transport_cost}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Supervision cost
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      1
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.supervision_cost}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-semibold text-black">
                    <td
                      colspan=""
                      className="px-4 py-2 text-bgDataNew border border-gray-300 text-right"
                    >
                      Total :
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      b1
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      M2
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      {selectedCostWorking?.b1_total}
                      {/* {selectedCostWorking?.labour_cost+selectedCostWorking?.cunsumable_cost+selectedCostWorking?.transport_cost+selectedCostWorking?.supervision_cost} */}
                    </td>
                  </tr>

                  <br />
                  {/* Subsection Header: Bond Coat */}
                  <tr className="bg-gray-300 font-medium text-left">
                    <td
                      colSpan="4"
                      className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                    >
                      B2
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left w-[400px]">
                      Finance cost consider payment received after 6 month
                      Interest will be 1% per month
                    </td>
                    <td className="border border-gray-300 p-2 bg-yellow-100">
                      1
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      6.0%
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.b2_percent_amount}
                    </td>
                  </tr>
                  <tr className="bg-gray-50 font-semibold text-black">
                    <td
                      colspan=""
                      className="px-4 py-2 text-bgDataNew border border-gray-300 text-right"
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
                      {selectedCostWorking?.b2_total_cost}
                    </td>
                  </tr>

                  <br />
                  {/* Subsection Header: Bond Coat */}
                  <tr className="bg-gray-300 font-medium text-left">
                    <td
                      colSpan="4"
                      className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                    >
                      B3
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                      Over Head Charges for 1 sqm
                    </td>
                    <td className="border border-gray-300 p-2 bg-yellow-100">
                      1
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      20%
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                      {selectedCostWorking?.b3_percent_amount}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-semibold text-black">
                    <td
                      colspan=""
                      className="px-4 py-2 text-bgDataNew border border-gray-300 text-right"
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
                      {selectedCostWorking?.b3_total_application_labour_cost}
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="min-w-full border border-gray-300 mt-14">
                <thead className="bg-gray-400">
                  <tr>
                    {["Total", "Unit", "Qty", "Total Project Cost RS"].map(
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
                    <th colspan="4" className="py-2">
                      <div className="border border-gray-400 w-fit mx-auto px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px]  text-gray-700">
                        C - Project Calculation
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left font-bold text-gray-700">
                      Total Material basic Cost
                    </td>
                    <td className="border border-gray-300 p-2">A</td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                    {selectedCostWorking?.total_material_cost ?? "0"}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
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
                       {selectedCostWorking?.b3_total_application_labour_cost}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left font-bold text-gray-700">
                      Total Material + Application basic Cost
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata"></td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      M2
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                     {selectedCostWorking?.total_material_cost + selectedCostWorking?.b3_total_application_labour_cost}
                    </td>
                  </tr>
                  <tr className="text-center hover:bg-gray-200 cursor-pointer">
                    <td className="border border-gray-300 px-4 py-2 text-textdata text-left font-bold text-gray-700">
                      Contractor profit
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      C
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      10%
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-textdata">
                      {selectedCostWorking?.contractor_profit_amount}
                    </td>
                  </tr>
                  <br />
                  <tr className="bg-gray-100 font-semibold text-black text-center">
                    <td className="px-4 py-2 font-bold text-gray-700 border border-gray-300 text-left">
                      Total Material basic Cost :
                    </td>
                    <td className="px-4 py-2 border border-gray-300 font-bold text-gray-600 text-center">
                      A+B+C
                    </td>
                    <td className="px-4 py-2 border border-gray-300 font-bold text-gray-600 text-center"></td>
                    <td className="px-4 py-2 border border-gray-300 font-bold text-gray-600 text-center">
                      {selectedCostWorking?.grand_total}
                    </td>
                  </tr>
                  <tr className="bg-gray-100 font-semibold text-black text-center">
                    <td className="px-4 py-2 text-bgDataNew border border-gray-300 text-left">
                      Total project Area
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      M2
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      1
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                       {selectedCostWorking?.total_project_cost}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cost Summary Section */}
            {/* <div className="mt-8 overflow-x-auto">
              <table className="table-auto w-full text-left border-collapse border border-gray-300 rounded">
                <thead>
                  <tr className="bg-gray-400 text-left">
                    <th className="px-4 py-2 border font-poopins text-black font-medium text-[16px] border-gray-300">
                      Cost Category
                    </th>
                    <th className="px-4 py-2 border font-poopins text-black font-medium text-[16px] border-gray-300 text-center">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: "Labour Cost",
                      value: selectedCostWorking?.labour_cost,
                    },
                    {
                      label: "Supervision Cost",
                      value: selectedCostWorking?.supervision_cost,
                    },
                    {
                      label: "Transport Cost",
                      value: selectedCostWorking?.transport_cost,
                    },
                    {
                      label: "Consumable Cost",
                      value: selectedCostWorking?.cunsumable_cost,
                    },
                    {
                      label: "Overhead Charges",
                      value: selectedCostWorking?.over_head_charges,
                    },
                    {
                      label: "Contractor Profit",
                      value: selectedCostWorking?.contractor_profit,
                    },
                    {
                      label: "Total Application Labour Cost",
                      value: selectedCostWorking?.total_application_labour_cost,
                    },
                    {
                      label: "Total Material Cost",
                      value: selectedCostWorking?.total_material_cost,
                    },
                    {
                      label: "Total Project Cost",
                      value: selectedCostWorking?.total_project_cost,
                    },
                  ].map((field, index) => (
                    <tr
                      key={index}
                      className="text-sm hover:bg-gray-200 cursor-pointer"
                    >
                      <td className="px-4 py-2 border text-gray-700 text-[15px] border-gray-300 font-medium">
                        {field.label}
                      </td>
                      <td className="px-4 py-2 text-gray-700 text-[13.5px] font-poppins border border-gray-300 text-center">
                        {field.value ?? "N/A"}
                      </td>
                    </tr>
                  ))}

                  <tr className="bg-gray-100 font-semibold text-black">
                    <td className="px-4 py-2 text-bgDataNew border border-gray-300 text-right">
                      Grand Total :
                    </td>
                    <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                      {[
                        selectedCostWorking?.labour_cost || 0,
                        selectedCostWorking?.supervision_cost || 0,
                        selectedCostWorking?.transport_cost || 0,
                        selectedCostWorking?.cunsumable_cost || 0,
                        selectedCostWorking?.over_head_charges || 0,
                        selectedCostWorking?.contractor_profit || 0,
                        selectedCostWorking?.total_application_labour_cost || 0,
                        selectedCostWorking?.total_material_cost || 0,
                      ].reduce((acc, val) => acc + parseFloat(val), 0)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> */}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex items-end justify-end gap-2 px-4 my-4">
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

export default ViewTaskShedule;
