import React from "react";

const LeadGenerationModal = ({ selectedUserLead, onClose }) => {

    console.log("Selected User", selectedUserLead)

    if (!selectedUserLead) return null;

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
      <div className="bg-white w-full md:w-[1080px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-textdata whitespace-nowrap font-poopins font-semibold mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Lead of {selectedUserLead.name}
        </h2>

        <div className="overflow-x-auto custom-scrollbar px-4 mt-4">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
                <th className="px-4 py-2 text-left text-bgDataNew">Name</th>
                <th className="px-4 py-2 text-left text-bgDataNew">Email</th>
                <th className="px-4 py-2 text-left text-bgDataNew">Title</th>
                <th className="px-4 py-2 text-left text-bgDataNew">
                  Description
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew">Contact</th>
                <th className="px-4 py-2 text-left text-bgDataNew">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-2 text-[#473b33] font-poppins font-semibold">{selectedUserLead?.name}</td>
                <td className="px-4 py-2 text-[#473b33] font-poppins font-semibold">{selectedUserLead?.email}</td>
                <td className="px-4 py-2 text-[#473b33] font-poppins font-semibold">{selectedUserLead?.title}</td>
                <td className="px-4 py-2 w-[370px] text-[#473b33] font-poppins font-semibold">{selectedUserLead?.requirement}</td>
                <td className="px-4 py-2 text-[#473b33] font-poppins font-semibold">{selectedUserLead?.contact}</td>
                <td className="px-4 py-2 text-[#473b33] font-poppins font-semibold">{selectedUserLead?.status}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex items-end justify-end gap-2 px-4">
          <button
            className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </>
    
  );
};

export default LeadGenerationModal;