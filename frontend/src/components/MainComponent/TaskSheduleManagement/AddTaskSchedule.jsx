import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";

const AddTaskSchedule = ({
  setIsAddTaskOpen,
  formData,
  setFormData,
  formErrors,
  handleChange,
  handleSubmitAddTask,
  flashMessage,
  flashMsgType,
  employeeList,
}) => {
  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add Task Shedule
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {flashMessage && flashMsgType === "success" && (
              <SuccessMessage message={flashMessage} />
            )}
            {flashMessage && flashMsgType === "error" && (
              <ErrorMessage message={flashMessage} />
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
                value={formData.task_title}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.task_title && (
                <p className="text-red-500 text-sm">{formErrors.task_title}</p>
              )}
            </div>

            {/* Assigned To */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Assigned To :
              </label>
              <select
                name="assigned_to"
                value={formData.assigned_to}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
              >
                <option value="">Select Employee</option>
                {employeeList.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.fullname}
                  </option>
                ))}
              </select>
              {formErrors.assigned_to && (
                <p className="text-red-500 text-sm">{formErrors.assigned_to}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Status :
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                {/* <option value="In Progress">In Progress</option> */}
                <option value="Completed">Completed</option>
              </select>
              {formErrors.status && (
                <p className="text-red-500 text-sm">{formErrors.status}</p>
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
                value={formData.due_date}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.due_date && (
                <p className="text-red-500 text-sm">{formErrors.due_date}</p>
              )}
            </div>

            {/* Task Description */}
            <div className="md:col-span-4">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Task Description:
              </label>
              <textarea
                placeholder="Task Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="block w-full mb-2 h-[50px] rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 resize-none"
                rows="3"
              />
              {formErrors.description && (
                <p className="text-red-500 text-sm">{formErrors.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-end justify-end gap-2 px-4">
            <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]" 
             onClick={handleSubmitAddTask}>
              Add Task
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setIsAddTaskOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddTaskSchedule;
