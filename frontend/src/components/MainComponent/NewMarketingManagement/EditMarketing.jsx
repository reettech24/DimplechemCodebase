import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const EditMarketing = ({
  setIsEditMarketing,
  editFormData,
  setEditFormData,
  editFormErrors,
  handleEditChange,
  handleEditSubmit,
  editFlashMessage,
  editFlashMsgType,
  employeeList,
  selectedMarketing,
}) => {
  //console.log("editFormData", editFormData);
  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Edit Marketing
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {editFlashMessage && editFlashMsgType === "success" && (
              <SuccessMessage message={editFlashMessage} />
            )}
            {editFlashMessage && editFlashMsgType === "error" && (
              <ErrorMessage message={editFlashMessage} />
            )}
          </div>

          <div className="mt-4 md:mt-5 px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Activity Planned */}
            <div>
              <label className="font-poppins font-medium text-textdata">
                Activity Planned :
              </label>
              <textarea
                name="activity_planned"
                value={editFormData.activity_planned}
                onChange={handleEditChange}
                placeholder="Enter activity details"
                className="block w-full rounded-[5px] border border-solid border-[#473b33] px-3 py-2 resize-none"
                rows="3"
              />
              {editFormErrors.activity_planned && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.activity_planned}
                </p>
              )}
            </div>

            {/* Activity Date */}
            <div>
              <label className="font-poppins font-medium text-textdata">
                Activity Date :
              </label>
              <input
                type="date"
                name="activity_date"
                value={editFormData.activity_date}
                onChange={handleEditChange}
                min={new Date().toISOString().split("T")[0]}
                className="block w-full rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              />
              {editFormErrors.activity_date && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.activity_date}
                </p>
              )}
            </div>

            {/* Completion Date */}
            <div>
              <label className="font-poppins font-medium text-textdata">
                Completion Date :
              </label>
              <input
                type="date"
                name="complete_date"
                value={editFormData.complete_date}
                onChange={handleEditChange}
                min={new Date().toISOString().split("T")[0]}
                className="block w-full rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              />
              {editFormErrors.complete_date && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.complete_date}
                </p>
              )}
            </div>

            {/* Assigned To */}
            <div>
              <label className="font-poppins font-medium text-textdata">
                Assigned To :
              </label>
              <select
                name="assigned_to"
                value={editFormData.assigned_to}
                onChange={handleEditChange}
                className="block w-full rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              >
                <option value="">Select Employee</option>
                {employeeList?.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullname}
                  </option>
                ))}
              </select>
              {editFormErrors.assigned_to && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.assigned_to}
                </p>
              )}
            </div>

            {/* Total Spent */}
            <div>
              <label className="font-poppins font-medium text-textdata">
                Total Spent :
              </label>
              <input
                type="number"
                name="total_spent"
                value={editFormData.total_spent}
                onChange={handleEditChange}
                placeholder="Enter amount"
                 min="0"
                className="block w-full rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              />
              {editFormErrors.total_spent && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.total_spent}
                </p>
              )}
            </div>

            {/* Leads Generated */}
            <div>
              <label className="font-poppins font-medium text-textdata">
                Leads Generated :
              </label>
              <input
                type="number"
                name="lead_generated"
                value={editFormData.lead_generated}
                onChange={handleEditChange}
                placeholder="Enter number"
                 min="0"
                className="block w-full rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
              />
              {editFormErrors.lead_generated && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.lead_generated}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-end justify-end gap-2 px-4">
            <button
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              onClick={handleEditSubmit}
            >
              Submit
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setIsEditMarketing(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditMarketing;
