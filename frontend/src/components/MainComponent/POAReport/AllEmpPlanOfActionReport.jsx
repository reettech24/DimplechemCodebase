import React from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AllEmpPlanOfActionReport = ({
  setAllEmpPlanOfActionReport,
  allselectedPOA,
}) => {
  const exportToExcel = () => {
    if (!allselectedPOA || allselectedPOA.length === 0) return;

    const dataToExport = allselectedPOA.map((poa, index) => ({
      "Sr. No.": index + 1,
      "Employee Name": poa.emp_fullname,
      "No. of Companies": poa.unique_customers_count,
      "Product Sale / Work Execution": poa.category_names,
      "Total Material Qty. / Total Area (in Sqm)": poa.total_material_qty,
      "Approx Business Potential": poa.total_approx_business,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    worksheet["!cols"] = [
      { wch: 10 },
      { wch: 25 },
      { wch: 20 },
      { wch: 40 },
      { wch: 35 },
      { wch: 25 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "All Employee POA");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const fileName = `Employee_POA_Report_${new Date().getFullYear()}-${
      new Date().getFullYear() + 1
    }.xlsx`;
    saveAs(file, fileName);
  };
  //console.log("allselectedPOA", allselectedPOA);
  return (
    <>
    <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 10px;
            cursor: pointer;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #fe6c00c4 !important; 
            border-radius: 8px;
            cursor: pointer;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            cursor: pointer;
          }

          /* For Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #68574c transparent;
            cursor: pointer;
          }
       `}
      </style>
    
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-[1400px] rounded-lg overflow-auto ">
        {/* Header */}
        <div className="text-center border-b border-gray-300 p-4">
          <h2 className="text-red-600 font-bold text-xl">
            ALL EMPLOYEE POA REPORT
          </h2>
          <h3 className="text-lg font-semibold mt-1">
            Consolidated Business Plan of Employee Format
          </h3>
          <div className="mt-2 text-[16px] font-medium">
            For the Year {new Date().getFullYear()} -{" "}
            {new Date().getFullYear() + 1}
          </div>
        </div>
        <div className="flex justify-end px-4 pt-2">
          <button
            onClick={exportToExcel}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Export to Excel
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto p-4 custom-scrollbar max-h-[calc(100vh-250px)]">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-sm text-center sticky top-0 z-10">
                {[
                  "Sr. No.",
                  "Employee Name",
                  "No. of Companies",
                  "Product Sale / Work Execution",
                  "Total Material Qty. / Total Area (in Sqm)",
                  "Approx Business Potential",
                ].map((col, idx) => (
                  <th
                    key={idx}
                    className="border px-4 py-2 font-medium text-newtextdata whitespace-nowrap"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {allselectedPOA && allselectedPOA.length > 0 ? (
                allselectedPOA.map((poa, index) => (
                  <tr key={index} className="text-center text-sm">
                    <td className="border px-4 py-2 text-newtextdata">
                      {index + 1}
                    </td>
                    <td className="border px-4 py-2 text-newtextdata">
                      {poa.emp_fullname}
                    </td>
                    <td className="border px-4 py-2 text-newtextdata">
                      {poa.unique_customers_count}
                    </td>
                    <td className="border px-4 py-2 text-newtextdata">
                      {poa.category_names}
                    </td>
                    <td className="border px-4 py-2 text-newtextdata">
                      {poa.total_material_qty}
                    </td>
                    <td className="border px-4 py-2 text-newtextdata">
                      {poa.total_approx_business}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="border px-4 py-4 text-center text-gray-500"
                  >
                    No Business Plan data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setAllEmpPlanOfActionReport(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default AllEmpPlanOfActionReport;
