import React from 'react'

const SarReportOfUser = ({setsarReportOpen,
    selectedSAR}) => {
    //console.log("selectedSAR", selectedSAR);
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white w-full w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
      <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
        Sales Activity Report of {selectedSAR?.employee_fullname}
      </h2>

      <div className="mt-5 md:mt-5 px-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#473b33] rounded-[8px] text-center sticky top-0 z-10">
                {[
                  "Date",
                  "Visit / Phone Call",
                  "Visit Start time",
                  "Visit End time",
                  "Customer Name",
                  "Contact Person Name",
                  "Customer Need",
                  "Product Proposed",
                  "Total Cost Amount",
                  "Visit Remarks",
                  "Next Visit Plan Date",
                ].map((col, index) => (
                  <th className="px-4 py-2 text-left text-bgDataNew text-textdata">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {selectedSAR ? (
                  <tr
                    className="text-center bg-[#1e1e2d78] cursor-pointer"
                  >
                    <td className="px-4 py-2 text-textdata">
                      {selectedSAR.assign_date.split("T")[0]}
                    </td>
                    <td className="px-4 py-2 text-textdata">visit</td>
                    <td className="px-4 py-2 text-textdata">
                      {
                        selectedSAR?.first_check_in_time
                          ? new Date(
                            selectedSAR.first_check_in_time
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "00:00" // Or any other placeholder you want to display
                      }
                    </td>
                    <td className="px-4 py-2 text-textdata">
                      {
                        selectedSAR?.second_check_out_time
                          ? new Date(
                            selectedSAR.second_check_out_time
                            ).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "00:00" // Or any other placeholder you want to display
                      }
                    </td>
                    <td className="px-4 py-2 text-textdata">
                      {selectedSAR.customer.company_name}
                    </td>
                    <td className="px-4 py-2 text-textdata">
                      {selectedSAR.customer.client_name}
                    </td>
                    <td className="px-4 py-2 text-textdata">
                      {selectedSAR.special_requirement}
                    </td>
                    <td className="px-4 py-2 text-textdata">
                      {selectedSAR.product_detail}
                    </td>
                    <td className="px-4 py-2 text-textdata">
                     {selectedSAR.budget}
                    </td>
                    <td className="px-4 py-2 text-textdata">
                     {selectedSAR.last_communication}
                    </td>
                    <td className="px-4 py-2 text-textdata">
                      {selectedSAR?.next_followup?.split("T")[0]}
                    </td>
                  </tr>
              ) : (
                <tr>
                  <td colSpan="15" className="px-4 py-2 text-textdata">
                    No visit data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-end justify-end gap-2 px-4">
        <button
          className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
          onClick={() => setsarReportOpen(false)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
  )
}

export default SarReportOfUser