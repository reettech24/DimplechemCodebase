import React from "react";

const EmpSARReport = ({ setpoaReportOpen, selectedPOA, getPoaByEmpIdData }) => {
  console.log("selectedPOA", selectedPOA);
  const formatTime = (seconds) => {
    if (!seconds || seconds <= 0) return "-";

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    let result = "";
    if (hrs) result += `${hrs} hr `;
    if (mins) result += `${mins} minute `;
    if (secs) result += `${secs} second`;

    return result.trim();
  };
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
        <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          POA Report of {selectedPOA?.fullname}
        </h2>
        {/* Header */}
        {/* <div className="text-center border-b border-gray-300 p-4">
          <h3 className="text-lg font-semibold mt-1">
            Summery of Sales Activity Report 
          </h3>
        </div> */}

        {/* Table */}
        <div className="overflow-x-auto p-4 custom-scrollbar max-h-[calc(100vh-200px)]">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
                <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                  Id
                </th>
                {/* <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                  Employee Name
                </th> */}
                <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                  Company Name
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap text-red-500">
                  Date of Visit
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                  No. of Visits
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                  Total Hrs Spend
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                  Approx Area SqM
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                  Approx Area Cub. Mtr
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                  Total Product Qty. in Kg
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                  Total Potential Amount
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                  Types of Documents Sent
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                  Next Visit Date
                </th>
              </tr>
            </thead>

            <tbody>
              {getPoaByEmpIdData && getPoaByEmpIdData.length > 0 ? (
                getPoaByEmpIdData.map((selectedPOA, index) => {
                  // <tr className="text-center" key={selectedPOA.id || index}>
                  //   <td className="px-4 py-2 text-newtextdata">{index + 1}</td>
                  //   <td className="px-4 py-2 text-newtextdata">
                  //     {selectedPOA?.employee_fullname || "-"}
                  //   </td>
                  //   <td className="px-4 py-2 text-newtextdata w-[400px] whitespace-normal">
                  //     {selectedPOA.customer?.company_name || "-"}
                  //   </td>
                  //   <td className="px-4 py-2 text-newtextdata">
                  //     {selectedPOA.assign_date
                  //       ? new Date(selectedPOA.assign_date).toLocaleDateString()
                  //       : "-"}
                  //   </td>
                  //   <td className="px-4 py-2 text-newtextdata">
                  //     {selectedPOA.communications?.[0]?.lead_status
                  //       ? selectedPOA.communications[0].lead_status.split("->")
                  //           .length
                  //       : "-"}
                  //   </td>
                  //   <td className="px-4 py-2 text-newtextdata">
                  //     {selectedPOA.communications?.[0]?.total_hrs_spent ?? "-"}
                  //     {/* {formatTime(selectedPOA.communications?.[0]?.total_hrs_spent)} */}
                  //   </td>
                  //   <td className="px-4 py-2 text-newtextdata">
                  //     {selectedPOA.project_name ?? "-"}
                  //   </td>
                  //   <td className="px-4 py-2 text-newtextdata">
                  //     {selectedPOA.approx_area_cubm ?? "-"}
                  //   </td>
                  //   <td className="px-4 py-2 text-newtextdata">
                  //     {selectedPOA.total_material_qty ?? "-"}
                  //   </td>
                  //   <td className="px-4 py-2 text-newtextdata">
                  //     {selectedPOA.approx_business ?? "-"}
                  //   </td>
                  //   <td className="px-4 py-2 text-newtextdata whitespace-nowrap whitespace-pre-line">
                  //     {selectedPOA.documents?.length > 0
                  //       ? selectedPOA.documents.join("\n")
                  //       : "-"}
                  //   </td>
                  //   <td className="px-4 py-2 text-newtextdata">
                  //     {selectedPOA.next_followup
                  //       ? new Date(
                  //           selectedPOA.next_followup
                  //         ).toLocaleDateString()
                  //       : "-"}
                  //   </td>
                  // </tr>

                  const sortedLeads = [...selectedPOA.leads].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                  );

                  const latestNextFollowup = sortedLeads[0]?.next_followup;

                  const latestassignDate = sortedLeads[0]?.assign_date;

                  return (
                    <tr className="text-center" key={selectedPOA.id || index}>
                      <td className="px-4 py-2 text-newtextdata">
                        {index + 1}
                      </td>
                      {/* <td className="px-4 py-2 text-newtextdata">
                        {selectedPOA?.employee_fullname || "-"}
                      </td> */}
                      <td className="px-4 py-2 text-newtextdata w-[400px] whitespace-normal">
                        {selectedPOA.company_name || "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata">
                        {latestassignDate
                          ? new Date(latestassignDate).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                        {/* {selectedPOA.assign_date
                        ? new Date(selectedPOA.assign_date).toLocaleDateString()
                        : "-"} */}
                      </td>
                      <td className="px-4 py-2 text-newtextdata">
                        {selectedPOA.leads?.reduce((total, lead) => {
                          lead.communications?.forEach((comm) => {
                            if (comm.lead_status) {
                              total += comm.lead_status.split("->").length;
                            }
                          });
                          return total;
                        }, 0) ?? "-"}
                        {/* {selectedPOA.communications?.[0]?.lead_status
                          ? selectedPOA.communications[0].lead_status.split(
                              "->"
                            ).length
                          : "-"} */}
                      </td>
                      <td className="px-4 py-2 text-newtextdata">
                        {selectedPOA.leads.reduce((totalHours, lead) => {
                          lead.communications.forEach((comm) => {
                            if (comm.total_hrs_spent) {
                              totalHours += Number(comm.total_hrs_spent);
                            }
                          });
                          return totalHours;
                        }, 0)}{" "}
                        hrs
                        {/* {selectedPOA.communications?.[0]?.total_hrs_spent ?? "-"} */}
                        {/* {formatTime(selectedPOA.communications?.[0]?.total_hrs_spent)} */}
                      </td>
                      <td className="px-4 py-2 text-newtextdata">
                        {selectedPOA.leads.reduce((total, lead) => {
                          if (lead.project_name) {
                            total += Number(lead.project_name);
                          }
                          return total;
                        }, 0)}
                        {/* {selectedPOA.project_name ?? "-"} */}
                      </td>
                      <td className="px-4 py-2 text-newtextdata">
                        {selectedPOA.approx_area_cubm ?? "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata">
                        {/* {selectedPOA.total_material_qty ?? "-"} */}
                        {selectedPOA.leads.reduce((total, lead) => {
                          if (lead.total_material_qty) {
                            total += Number(lead.total_material_qty);
                          }
                          return total;
                        }, 0)}
                      </td>
                      <td className="px-4 py-2 text-newtextdata">
                        {selectedPOA.leads.reduce((total, lead) => {
                          if (lead.approx_business) {
                            total += Number(lead.approx_business);
                          }
                          return total;
                        }, 0)}
                        {/* {selectedPOA.approx_business ?? "-"} */}
                      </td>
                      <td className="px-4 py-2 text-newtextdata whitespace-nowrap whitespace-pre-line">
                        {selectedPOA.documents?.length > 0
                          ? selectedPOA.documents.join("\n")
                          : "-"}
                      </td>
                      <td className="px-4 py-2 text-newtextdata">
                        {latestNextFollowup
                          ? new Date(latestNextFollowup).toLocaleDateString(
                              "en-GB"
                            )
                          : "-"}
                        {/* {selectedPOA.next_followup
                        ? new Date(
                            selectedPOA.next_followup
                          ).toLocaleDateString()
                        : "-"} */}
                      </td>
                    </tr>
                  );
                })
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
            onClick={() => setpoaReportOpen(false)}
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

export default EmpSARReport;
