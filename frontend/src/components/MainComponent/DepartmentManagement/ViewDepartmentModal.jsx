import React from "react";

const ViewDepartmentModal = ({ setViewModalOpen,selectedDepartment }) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[450px] pt-0 pb-4 rounded-[6px] flex flex-col">
      <h2 className="text-white text-textdata whitespace-nowrap font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Department Details
        </h2>
        <div className="mt-5 md:mt-6 px-6 flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <label className="font-poppins font-semibold text-textdata whitespace-nowrap text-bgData">
              Name
            </label>
            <p className="font-poppins font-semibold text-textdata">:</p>
            <p>{selectedDepartment.department_name}</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-poppins font-semibold text-textdata whitespace-nowrap text-bgData">
              Status
            </label>
            <p className="font-poppins font-semibold text-textdata">:</p>
            <p>{selectedDepartment.status}</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="font-poppins font-semibold text-textdata whitespace-nowrap text-bgData">
              Description
            </label>
            <p className="font-poppins font-semibold text-textdata">:</p>
            <p>{selectedDepartment.department_description}</p>
          </div>
          <div className="flex items-end justify-end gap-2">
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewDepartmentModal;
