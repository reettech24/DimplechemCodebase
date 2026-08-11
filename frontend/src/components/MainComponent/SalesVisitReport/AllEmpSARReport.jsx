import React from "react";

const AllEmpSARReport = ({ setAllEmpSARReport, allselectedSAR }) => {
  console.log("allselectedSAR", allselectedSAR);
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
      <div className="bg-white w-full max-w-[1400px] rounded-lg overflow-auto">
        {/* Header */}
        <div className="text-center border-b border-gray-300 p-4">
          <h2 className="text-red-600 font-bold text-xl">EMPLOYEE WISE SVR</h2>
          <h3 className="text-lg font-semibold mt-1">
            Summery of Sales Activity Report 
          </h3>
        </div>

        {/* Table */}
        <div className="overflow-x-auto custom-scrollbar p-4 max-h-[calc(100vh-200px)]">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-400 rounded-[8px] sticky top-0 z-10">
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Id</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Employee Name</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Company Name</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Date of Visit</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">No. of Visits</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Total Hrs Spend</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Approx Area SqM</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Approx Area Cub. Mtr</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Total Product Qty. in Kg</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Total Potential Amount</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Types of Documents Sent</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Last Visit Date</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Last Visit Remark</th>
                <th className="px-4 py-2 text-left text-gray-800 text-newtextdata whitespace-nowrap">Next Visit Plan</th>
              </tr>
            </thead>

            <tbody>
              {allselectedSAR && allselectedSAR.length > 0 ? (
                allselectedSAR.map((sar, index) => (
                    <tr key={sar.id || index} className="text-center">
                    <td className="px-4 py-2 text-textdata">{index + 1}</td>
                    <td className="px-4 py-2 text-textdata">{sar.assignedPerson?.fullname || "-"}</td>
                    <td className="px-4 py-2 text-textdata">{sar.customer?.company_name || "-"}</td>
                    <td className="px-4 py-2 text-textdata">
                      {sar.assign_date ? new Date(sar.assign_date).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-2 text-textdata">{sar.follow_up_record ?? "-"}</td>
                    <td className="px-4 py-2 text-textdata">{sar.total_hours_spent ?? "-"}</td>
                    <td className="px-4 py-2 text-textdata">{sar.approx_area_sqm ?? "-"}</td>
                    <td className="px-4 py-2 text-textdata">{sar.approx_area_cubm ?? "-"}</td>
                    <td className="px-4 py-2 text-textdata">{sar.quantity_no ?? "-"}</td>
                    <td className="px-4 py-2 text-textdata">{sar.budget ?? "-"}</td>
                    <td className="px-4 py-2 text-textdata whitespace-nowrap whitespace-pre-line">
                      {sar.documents?.length > 0 ? sar.documents.join("\n") : "-"}
                    </td>
                    <td className="px-4 py-2 text-textdata">
                      {sar.last_contact ? new Date(sar.last_contact).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-4 py-2 text-textdata">{sar.last_communication || "-"}</td>
                    <td className="px-4 py-2 text-textdata">
                      {sar.next_followup ? new Date(sar.next_followup).toLocaleDateString() : "-"}
                    </td>
                  </tr>
                  
                ))
              ) : (
                <tr>
                  <td
                    colSpan="13"
                    className="border px-4 py-4 text-center text-gray-500"
                  >
                    No Sales Activity Report data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Close Button */}
        <div className="flex justify-end p-4">
          <button
            onClick={() => setAllEmpSARReport(false)}
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

export default AllEmpSARReport;
