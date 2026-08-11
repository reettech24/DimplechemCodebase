import React from "react";

const AddRoleModal = ({ setAddUserModalOpen }) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-textdata whitespace-nowrap font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Add New Customer
        </h2>
        <div className="mt-5 md:mt-9 px-4 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-200px)]">
        <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Date :
            </label>
            <input
              type="date"
              placeholder="Date"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>
          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Company Name :
            </label>
            <input
              type="text"
              placeholder="Company Name"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>
          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Client Name :
            </label>
            <input
              type="text"
              placeholder="Client Name"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Name of Lead Owner :
            </label>
            <input
              type="text"
              placeholder="Client Name"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Select the Lead Source :
            </label>
            <select className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]">
              <option>Select the Source</option>
              <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Reference">Reference</option>
                  <option value="Direct">Direct</option>
            </select>
          </div>


          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Select the Status :
            </label>
            <select className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]">
              <option>Select the Status</option>
              <option value="New">Hot</option>
              <option value="InProgress">Warm</option>
              <option value="Completed">Cold</option>
              <option value="">In Discussion</option>
              <option value="">On Hold</option>
              <option value="">Lost</option>
            </select>
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Designation :
            </label>
            <input
              type="text"
              placeholder="Designation"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Primary Contact :
            </label>
            <input
              type="number"
              placeholder="Primary Contact"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Secondary Contact :
            </label>
            <input
              type="number"
              placeholder="Secondary Contact"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Enter Email Id :
            </label>
            <input
              type="email"
              placeholder="Email Id"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Address :
            </label>
            <textarea
              type="text"
              placeholder="Address"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               AadharNo :
            </label>
            <input
              type="number"
              placeholder="aadharNo"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               PanNo :
            </label>
            <input
              type="text"
              placeholder="panNo"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>
          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               PinCode :
            </label>
            <input
              type="number"
              placeholder="pincode"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>
          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Location:
            </label>
            <input
              type="text"
              placeholder="Enter Location"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

        </div>
        <div className="flex items-end justify-end gap-2 px-4">
          <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]">
            Add Customer
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
