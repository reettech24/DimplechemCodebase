import React from "react";

const ViewMarketing = ({ setIsViewMarketing, marketingData }) => {
  //console.log("marketingData", marketingData);
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          View Marketing Details
        </h2>

        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Details Grid */}
          <div className="py-3 px-7">
            <div className="mt-6">
              <h3 className="text-[15px] font-semibold mb-2 text-bgDataNew">
                Marketing Details
              </h3>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border border-[#d1d5db] rounded-[5px]">
                  <thead className="bg-[#f3f4f6]">
                    <tr>
                      <th className="px-4 py-2 border-b border-[#d1d5db] text-gray-900 text-newtextdata">
                        Activity Planned
                      </th>
                      <th className="px-4 py-2 border-b border-[#d1d5db] text-gray-900 text-newtextdata">
                        Activity Date
                      </th>
                      <th className="px-4 py-2 border-b border-[#d1d5db] text-gray-900 text-newtextdata">
                        Completion Date
                      </th>
                      <th className="px-4 py-2 border-b border-[#d1d5db] text-gray-900 text-newtextdata">
                        Assigned To
                      </th>
                      <th className="px-4 py-2 border-b border-[#d1d5db] text-gray-900 text-newtextdata">
                        Total Spent
                      </th>
                      <th className="px-4 py-2 border-b border-[#d1d5db] text-gray-900 text-newtextdata">
                        Leads Generated
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="bg-white hover:bg-gray-50">
                      <td className="px-4 py-2 border-b border-[#e5e7eb] text-newtextdata">
                        {marketingData?.activity_planned || "-"}
                      </td>

                      <td className="px-4 py-2 border-b border-[#e5e7eb] text-newtextdata">
                        {marketingData?.activity_date
                          ? new Date(
                              marketingData.activity_date
                            ).toLocaleDateString("en-GB")
                          : "-"}
                      </td>

                      <td className="px-4 py-2 border-b border-[#e5e7eb] text-newtextdata">
                        {marketingData?.complete_date
                          ? new Date(
                              marketingData.complete_date
                            ).toLocaleDateString("en-GB")
                          : "-"}
                      </td>

                      <td className="px-4 py-2 border-b border-[#e5e7eb] text-newtextdata">
                        {marketingData?.assignedUser?.fullname || "-"}
                      </td>

                      <td className="px-4 py-2 border-b border-[#e5e7eb] text-newtextdata">
                        {marketingData?.total_spent ?? "-"}
                      </td>

                      <td className="px-4 py-2 border-b border-[#e5e7eb] text-newtextdata">
                        {marketingData?.lead_generated || "-"}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-end gap-2 px-6">
          <button
            className="mt-4 bg-gray-500 text-texdata text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={() => setIsViewMarketing(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMarketing;
