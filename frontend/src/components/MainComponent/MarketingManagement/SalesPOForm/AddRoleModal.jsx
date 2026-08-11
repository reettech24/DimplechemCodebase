import React from "react";

const AddRoleModal = ({ setAddUserModalOpen }) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Add New Form
        </h2>
        <div className="mt-5 md:mt-9 px-4 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter PO Number :
            </label>
            <input
              type="number"
              placeholder="Assigned Date"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Select PO Date :
            </label>
            <input
              type="date"
              placeholder="Assigned Date"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Select Company Name :
            </label>
            <select className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2">
              <option>Select the Company Name</option>
              <option value="active">Idice Syatem</option>
              <option value="inactive">Google</option>
              <option value="inactive">Facebook</option>
            </select>
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Select Department :
            </label>
            <select className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2">
              <option>Select the Department</option>
              <option value="active">IT</option>
              <option value="inactive">Sales</option>
              <option value="inactive">Finance</option>
            </select>
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Supplier Name :
            </label>
            <input
              type="text"
              placeholder="Supplier Name"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Supplier Address :
            </label>
            <textarea
              type="text"
              placeholder="Address"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Supplier Contact :
            </label>
            <input
              type="number"
              placeholder="Supplier contact"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Supplier Email :
            </label>
            <input
              type="email"
              placeholder="Email"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Product Name :
            </label>
            <input
              type="email"
              placeholder="Email"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Select the Category :
            </label>
            <select className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2">
              <option>Select the cateogry</option>
              <option value="active">IT</option>
              <option value="inactive">Sales</option>
              <option value="inactive">Finance</option>
            </select>
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Qunatity :
            </label>
            <input
              type="number"
              placeholder="Quantity"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Amount :
            </label>
            <input
              type="number"
              placeholder="Quantity"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Product Code :
            </label>
            <input
              type="number"
              placeholder="Quantity"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Mention the Meeting Summary :
            </label>
            <textarea
              type="text"
              placeholder="Address"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>
        </div>
        <div className="flex items-end justify-end gap-2 px-4">
          <button className="bg-bgDataNew text-white text-textdata whitespace-nowrap px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]">
            Add Assignment
          </button>
          <button
            className="mt-4 bg-gray-500 text-white px-3 text-textdata whitespace-nowrap py-2 rounded hover:bg-gray-600"
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
