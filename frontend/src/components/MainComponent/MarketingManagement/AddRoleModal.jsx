import React from "react";

const AddRoleModal = ({
  setAddUserModalOpen,
}) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-textdata whitespace-nowrap font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Add New Lead
        </h2>
        <div className="mt-5 md:mt-9 px-4 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               leadtype :
            </label>
            <input
              type="text"
              placeholder="leadtype"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Email :
            </label>
            <input
              type="email"
              placeholder="email"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Lead :
            </label>
            <select
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            >
              <option>Select the lead type</option>
              <option value="active">Hot</option>
              <option value="inactive">Warm</option>
              <option value="inactive">Cool</option>
            </select>
          </div>


          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Number :
            </label>
            <input
              type="number"
              placeholder="Number"
               min="0"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Lead Source :
            </label>
            <select
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            >
              <option>Select the lead source</option>
              <option value="New">Google Ads</option>
              <option value="InProgress">Facebook Ads</option>
              <option value="Completed">Linkedin</option>
              <option value="">Referral</option>
              <option value="">Website Form</option>
              <option value="">Event</option>
            </select>
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Lead Status :
            </label>
            <select
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            >
              <option>Select the Lead Status</option>
              <option value="active">New</option>
              <option value="inactive">Contacted</option>
              <option value="active">Qualified</option>
              <option value="active">Proposal sent</option>
              <option value="active">Negotiation</option>
              <option value="active">Closed-Won</option>
              <option value="active">Closed-Lost</option>
            </select>
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Description :
            </label>
            <textarea
              type="text"
              placeholder="description"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          
        </div>
        <div className="flex items-end justify-end gap-2 px-4">
            <button
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
            >
              Add Department
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
