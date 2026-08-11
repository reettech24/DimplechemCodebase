import React from "react";

const TodaysLeadReport = ({ setViewLeadReportOpen, selectedLeadData }) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Employee Activity Report Format
        </h2>

        <div className="mt-5 md:mt-5 px-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div className="overflow-x-auto custom-scrollbar w-[1058px]">
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
                {selectedLeadData?.leads?.length > 0 ? (
                  selectedLeadData.leads.map((visit, visitIndex) => (
                    <tr
                      key={visitIndex}
                      className="text-center bg-[#1e1e2d78] cursor-pointer"
                    >
                      <td className="px-4 py-2 text-textdata">
                        {visit.assign_date.split("T")[0]}
                      </td>
                      <td className="px-4 py-2 text-textdata">visit</td>
                      <td className="px-4 py-2 text-textdata">
                        {
                          visit?.first_check_in_time
                            ? new Date(
                                visit.first_check_in_time
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
                          visit?.second_check_out_time
                            ? new Date(
                                visit.second_check_out_time
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })
                            : "00:00" // Or any other placeholder you want to display
                        }
                      </td>
                      <td className="px-4 py-2 text-textdata">
                        {visit.customer.company_name}
                      </td>
                      <td className="px-4 py-2 text-textdata">
                        {visit.customer.client_name}
                      </td>
                      <td className="px-4 py-2 text-textdata">
                        {visit.special_requirement}
                      </td>
                      <td className="px-4 py-2 text-textdata">
                        <div key={visitIndex}>
                          {visit.costWorking?.map((cw, cwIndex) => (
                            <ul key={cwIndex}>
                              {cw.costWorkingProducts?.map(
                                (product, productIndex) => (
                                  <li key={productIndex}>
                                    {product.product_name}
                                  </li>
                                )
                              )}
                            </ul>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2 text-textdata" key={visitIndex}>
                      {visit.costWorking?.map((cw, cwIndex) => (
                      <div >
                          
                            
                             {cw.total_cost_amount}
                          
                        </div>
                      ))}
                      </td>
                      <td className="px-4 py-2 text-textdata">
                        <ol className="list-decimal list-inside">
                          {visit?.remarks?.map((remark, i) => (
                            <li key={i}>{remark}</li>
                          ))}
                        </ol>
                      </td>
                      <td className="px-4 py-2 text-textdata">
                        {visit?.next_followup?.split("T")[0]}
                      </td>
                    </tr>
                  ))
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
            onClick={() => setViewLeadReportOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodaysLeadReport;
