import React from "react";

const PoaReportOfUser = ({ setpoaReportOpen, selectedPOA }) => {
  //console.log("selectedPOA", selectedPOA);
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-[1200px] rounded-lg overflow-auto">
        {/* Header */}
        <div className="text-center border-b border-gray-300 p-4">
          <h2 className="text-red-600 font-bold text-xl">EMPLOYEE PLAN OF ACTION REPORT</h2>
          <h3 className="text-lg font-semibold mt-1">Consolidated Business Plan of Employee Format</h3>
          <div className="flex justify-between mt-2 px-8">
            <div className="font-medium">
              Name of Employee: <span className="font-semibold">{selectedPOA?.salesPerson?.fullname}</span>
            </div>
            <div className="font-medium">
              Date: {new Date().toLocaleDateString()}
            </div>
          </div>
          <div className="mt-2 text-[16px] font-medium">
            For the Year {new Date().getFullYear()} - {new Date().getFullYear() + 1}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar p-4">
          <table className="w-full border border-collapse">
            <thead>
              <tr className="bg-gray-200 text-sm text-center">
                {[
                  "Sr. No.",
                  "Customer name",
                  "Contact person",
                  "Project Name / Application Area",
                  "Location",
                  "Product Sale / Work Execution",
                  "Total Material Qty. / Total Area (in Sqm)",
                  "Approx Business Potential",
                ].map((col, idx) => (
                  <th
                    key={idx}
                    className="border px-4 py-2 font-medium"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
             
              
                  <tr className="text-center text-sm">
                    <td className="border px-4 py-2">1</td>
                    <td className="border px-4 py-2">{selectedPOA.customer?.company_name}</td>
                    <td className="border px-4 py-2">{selectedPOA.contact_persion_name}</td>
                    <td className="border px-4 py-2">{selectedPOA.project_name}</td>
                    <td className="border px-4 py-2 whitespace-pre-line">{selectedPOA.location}</td>
                    <td className="border px-4 py-2">{selectedPOA.product_sale}</td>
                    <td className="border px-4 py-2">{selectedPOA.total_material_qty}</td>
                    <td className="border px-4 py-2">{selectedPOA.approx_business}</td>
                  </tr>
                
             
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setpoaReportOpen(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoaReportOfUser;
