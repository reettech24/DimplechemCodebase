import React from "react";

const AllEmpPlanOfActionReport = ({
  setAllEmpPlanOfActionReport,
  allselectedPOA,
}) => {
  console.log("allselectedPOA", allselectedPOA);
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
      <div className="bg-white w-full md:max-w-[1200px] rounded-lg overflow-auto">
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

        {/* Table */}
        <div className="overflow-x-auto  custom-scrollbar p-4 max-h-[360px]">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-sm text-center">
                {[
                  "Sr. No.",
                  "Employee Name",
                  "No. of Companies",
                  "Product Sale / Work Execution",
                  "Total Material Qty. / Total Area (in Sqm)",
                  "Approx Business Potential",
                ].map((col, idx) => (
                  <th key={idx} className="border px-4 py-2 font-medium text-newtextdata whitespace-nowrap ">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {allselectedPOA && allselectedPOA.length > 0 ? (
                allselectedPOA.map((poa, index) => (
                  <tr key={index} className="text-center text-sm">
                    <td className="border px-4 py-2 text-newtextdata">{index + 1}</td>
                    <td className="border px-4 py-2 text-newtextdata">
                      {poa.salesPerson?.fullname}
                    </td>
                    <td className="border px-4 py-2 text-newtextdata">{poa.total_customer}</td>
                    <td className="border px-4 py-2 text-newtextdata">{poa.product_sale}</td>
                    <td className="border px-4 py-2 text-newtextdata">
                      {poa.total_material_qty}
                    </td>
                    <td className="border px-4 py-2 text-newtextdata">{poa.approx_business}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="border px-4 py-4 text-center text-gray-500 text-newtextdata"
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
