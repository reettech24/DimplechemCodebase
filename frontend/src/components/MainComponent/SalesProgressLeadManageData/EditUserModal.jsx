import React from "react";

const EditUserModal = ({
  setEditUserModalOpen,
}) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[450px] pt-0 pb-4 rounded-[6px] flex flex-col">
      <h2 className="text-white text-textdata whitespace-nowrap font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Edit Department
        </h2>

        <div className="mt-5 md:mt-5 px-4 flex flex-col gap-2">
          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Department Name:
            </label>
            <input
              type="text"
              placeholder="Department Name"
              value="Human Resources"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Department Head:
            </label>
            <input
              type="text"
              placeholder="Department Head"
              value="John Doe"
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Status:
            </label>
            <select className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Department Description:
            </label>
            <textarea
              placeholder="Department Description"
              value="Handles employee relations and hiring."
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            />
          </div>

          <div className="flex items-end justify-end gap-2">
            <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]">
              Save Changes
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setEditUserModalOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
