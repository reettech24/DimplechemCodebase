import { useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
// import SuccessMessage from "../../../AlertMessage/SuccessMessage";
// import ErrorMessage from "../../../AlertMessage/ErrorMessage";

const EditTaskShedule = ({ setIsEditTaskOpen }) => {
  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Edit Task Shedule
          </h2>
          {/* <div className="fixed top-5 right-5 z-50">
            {flashMessage && flashMsgType === "success" && (
              <SuccessMessage message={flashMessage} />
            )}
            {flashMessage && flashMsgType === "error" && (
              <ErrorMessage message={flashMessage} />
            )}
          </div> */}

          <div className="mt-4 md:mt-5 px-4 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Task Title :
              </label>
              <input
                type="text"
                name="fullname"
                placeholder="Enter Task Title"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Assigned To :
              </label>
              <select
                name="role_id"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
              >
                <option value="">Select Employee</option>
              </select>
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Status :
              </label>
              <select
                name="role_id"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
              >
                <option value="">Select Status</option>
              </select>
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Due Date :
              </label>
              <input
                type="date"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Address:
              </label>
              <textarea
                placeholder="Address"
                name="address"
                className="block w-full mb-2 h-[50px] rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 resize-none"
                rows="3"
              />
            </div>
          </div>

          <div className="flex items-end justify-end gap-2 px-4">
            <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]">
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
