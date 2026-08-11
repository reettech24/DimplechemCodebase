import React from "react";

const ViewDocumnetList = ({ setIsViewReportOpen, selectedDocList }) => {
  console.log("selectedDocList", selectedDocList);
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
      <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Documents
        </h2>

        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Details Grid */}
          <div className="py-3 px-7">
            <div className="mt-6">
              <h3 className="text-[15px] font-semibold mb-2 text-bgDataNew">
                Document List of {selectedDocList?.customer?.company_name}
              </h3>
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border border-[#d1d5db] rounded-[5px]">
                  <thead className="bg-[#f3f4f6]">
                    <tr>
                      <th className="px-4 py-2 border-b border-[#d1d5db] text-gray-900 text-newtextdata">
                        Sr. No.
                      </th>
                      <th className="px-4 py-2 border-b border-[#d1d5db] text-gray-900 text-newtextdata">
                        Document Name
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {selectedDocList?.filenames?.map((item, index) => (
                      <tr key={index} className="bg-white hover:bg-gray-50">
                        <td className="px-4 py-2 border-b border-[#e5e7eb] text-newtextdata">
                          {index + 1}
                        </td>
                        <td className="px-4 py-2 border-b border-[#e5e7eb] text-newtextdata">
                          {item}
                        </td>
                      </tr>
                    ))}
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
            onClick={() => setIsViewReportOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>   
    </>
    
  );
};

export default ViewDocumnetList;
