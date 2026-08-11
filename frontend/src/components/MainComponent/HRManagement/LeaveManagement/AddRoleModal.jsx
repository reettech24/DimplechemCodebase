import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../../AlertMessage/ErrorMessage";

const AddRoleModal = ({
  setAddUserModalOpen,
  LeaveData,
  updatedLeaves,
  setUpdatedLeaves,
  handleChange,
  handleUpdate,
  flashMessage,
  setFlashMessage,
  flashMsgType,
  setFlashMsgType,
  handleFlashMessage,
}) => {
  //console.log("updatedLeaves", updatedLeaves);
  return (
    <>
    <div className="fixed top-5 right-5 z-50">
            {flashMessage && flashMsgType === "success" && (
              <SuccessMessage message={flashMessage} />
            )}
            {flashMessage && flashMsgType === "error" && (
              <ErrorMessage message={flashMessage} />
            )}
          </div>
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-textdata whitespace-nowrap font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Update Leave Data
        </h2>
        <div className="mt-5 md:mt-9 px-4 flex flex-col gap-2 overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)]">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
                <th className="px-4 py-2 text-left text-bgDataNew">Id</th>
                <th className="px-4 py-2 text-left text-bgDataNew">
                  Leave Type
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew">
                  Leave Code
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew">Details</th>
                <th className="px-4 py-2 text-left text-bgDataNew w-[180px]">
                  Date
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew w-[150px]">
                  Balance
                </th>
                <th className="px-4 py-2 text-left text-bgDataNew">
                  Leave Status
                </th>
              </tr>
            </thead>
            <tbody>
              {updatedLeaves.map((user, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{user?.type}</td>
                  <td className="px-4 py-2">{user?.code}</td>
                  <td className="px-4 py-2">{user?.detail}</td>

                  {/* Date Input */}
                  <td className="px-4 py-2">
                    <input
                      type="date"
                      name="date"
                      value={updatedLeaves[index]?.date?.split("T")[0] || ""}
                      onChange={(e) =>
                        handleChange(index, "date", e.target.value)
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-[7px]"
                    />
                  </td>

                  {/* Balance Input */}
                  <td className="px-4 py-2">
                    <input
                      type="number"
                      name="balance"
                      value={updatedLeaves[index]?.balance || ""}
                      onChange={(e) =>
                        handleChange(index, "balance", e.target.value)
                      }
                       min="0"
                      className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                    />
                  </td>

                  {/* Leave Status Dropdown */}
                  <td className="px-4 py-2">
                    <select
                      name="status"
                      value={updatedLeaves[index]?.status || ""}
                      onChange={(e) =>
                        handleChange(index, "status", e.target.value)
                      }
                      className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-[9px]"
                    >
                      <option value="">Status</option>
                      <option value="true">Active</option>
                      <option value="false">Deactive</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex items-end justify-end gap-2 px-4">
          <button
            className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
            onClick={handleUpdate}
          >
            Update
          </button>
          <button
            className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={() => setAddUserModalOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default AddRoleModal;
