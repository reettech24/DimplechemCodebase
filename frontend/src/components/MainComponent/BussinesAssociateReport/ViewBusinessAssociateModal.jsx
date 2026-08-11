import React, { useState, useEffect } from "react";

const ViewBusinessAssociateModal = ({ setViewBAModalOpen,selectedBusinessAssocitae }) => {
  return (
    <>
      {/* Flash Messages */}

      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full w-full md:w-fit pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Business Associate Detail
          </h2>

          <div className="mt-5 md:mt-5 px-2 md:px-4  overflow-y-auto h-fit">
            {/* Details Grid */}
            <div className="py-3 px-6">
              <div className="bg-[#e5e7eb38] rounded-[5px] px-2 py-2">
                <table className="w-full border border-gray-300 text-sm text-left">
                  <tbody>
                    <TableRow label="Name" value={selectedBusinessAssocitae?.associate_name}/>
                    <TableRow label="Email" value={selectedBusinessAssocitae?.email} />
                   
                    <TableRow
                      label="Phone"
                      value={selectedBusinessAssocitae?.phone_no}
                    />
                   
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="flex items-end justify-end gap-2 px-4">
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setViewBAModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const TableRow = ({ label, value }) => (
  <tr className="border-b border-gray-200">
    <td className="py-2 px-4 font-bold text-gray-600 w-1/3">{label}</td>
    <td className="py-2 px-2 text-gray-800">:</td>
    <td className="py-2 px-4 text-gray-800">{value ?? null}</td>
  </tr>
);

export default ViewBusinessAssociateModal;
