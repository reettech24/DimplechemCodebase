import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const EditTaskShedule = ({
  setIsEditTaskOpen,
  editFormData,
  setEditFormData,
  editFormErrors,
  handleEditChange,
  handleEditSubmit,
  editFlashMessage,
  editFlashMsgType,
  employeeList,
  selectedTask,
  empRole,
}) => {
  const isReadOnly = empRole === 3;

  //console.log("empRole", empRole);
  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Edit Task Shedule
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
            {/* Task Title */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Task Title :
              </label>
              <input
                type="text"
                name="task_title"
                placeholder="Enter Task Title"
                value={editFormData.task_title}
                onChange={handleEditChange}
                readOnly={isReadOnly}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {editFormErrors.task_title && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.task_title}
                </p>
              )}
            </div>

            {/* Assigned To */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Assigned To :
              </label>
              <select
                name="assigned_to"
                value={editFormData.assigned_to}
                onChange={handleEditChange}
                disabled={isReadOnly}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
              >
                <option value="">Select Employee</option>
                {employeeList.map((emp) => (
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

            {/* Status */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Status :
              </label>
              <select
                name="status"
                value={editFormData.status}
                onChange={handleEditChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                {/* <option value="In Progress">In Progress</option> */}
                <option value="Completed">Completed</option>
              </select>
              {editFormErrors.status && (
                <p className="text-red-500 text-sm">{editFormErrors.status}</p>
              )}
            </div>

            {/* Due Date */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Due Date :
              </label>
              <input
                type="date"
                name="due_date"
                value={
                  editFormData.due_date
                    ? new Date(editFormData.due_date)
                        .toISOString()
                        .split("T")[0]
                    : ""
                }
                onChange={handleEditChange}
                readOnly={isReadOnly}
                min={new Date().toISOString().split("T")[0]}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {editFormErrors.due_date && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.due_date}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-4">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Description:
              </label>
              <textarea
                placeholder="Enter Description"
                name="description"
                value={editFormData.description}
                onChange={handleEditChange}
                readOnly={isReadOnly}
                className="block w-full mb-2 h-[50px] rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 resize-none"
                rows="3"
              />
              {editFormErrors.description && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.description}
                </p>
              )}
            </div>
            {isReadOnly && (
              <div className="md:col-span-4">
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Sales Person Remark :
                </label>
                <textarea
                  placeholder="Enter Remark"
                  name="salesperson_remark"
                  value={editFormData.salesperson_remark}
                  onChange={handleEditChange}
                  className="block w-full mb-2 h-[50px] rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 resize-none"
                  rows="3"
                />
                {editFormErrors.salesperson_remark && (
                  <p className="text-red-500 text-sm">
                    {editFormErrors.salesperson_remark}
                  </p>
                )}
              </div>
            )}
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
              onClick={() => setIsEditTaskOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditTaskShedule;
