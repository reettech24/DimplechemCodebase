import React from "react";

const AddRoleModal = ({ setAddUserModalOpen }) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Add New Assignement
        </h2>
        <div className="mt-5 md:mt-9 px-4 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Select SalesPerson Name :
            </label>
            <select className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2">
              <option>Select the SalesPerson Name</option>
              <option value="active">Rinshu Mishra</option>
              <option value="inactive">Uma Sharma</option>
              <option value="inactive">Rishav Chaurisya</option>
              <option value="inactive">Nikhil Patankar</option>
            </select>
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Assigned By :
            </label>
            <input
              type="text"
              placeholder="Assigned by Name"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Select Assigned Date :
            </label>
            <input
              type="date"
              placeholder="Assigned Date"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Select Priority Level :
            </label>
            <select className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2">
              <option>Select the Priority</option>
              <option value="active">High</option>
              <option value="inactive">Medium</option>
              <option value="inactive">Low</option>
            </select>
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Select Visit Date :
            </label>
            <input
              type="date"
              placeholder="visit date"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

        </div>
        <div className="flex items-end justify-end gap-2 px-4">
          <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]">
            Add Assignment
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
  );
};

export default AddRoleModal;
