import React from "react";

const QuotationAddForm = ({
  setQuotationAddPopup,
  handleChange,
  handleQuotationSubmit,
  today,
  formQuotationData,
}) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[450px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-textdata whitespace-nowrap font-poopins font-semibold mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Add New Quotation
        </h2>
        <div className="mt-5 md:mt-9 px-4 flex flex-col gap-2">
          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Project Name :
            </label>
            <input
              type="text"
              placeholder="Project Name"
              name="projectname"
              value={formQuotationData.projectname}
              onChange={handleChange}
              required
              className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-black"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Cost :
            </label>
            <input
              type="number"
              placeholder="Fill Cost"
              name="cost"
              value={formQuotationData.cost}
              onChange={handleChange}
              required
              className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-black"
            />
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Start and End Date :
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                name="startDate"
                placeholder="Fill Start Date"
                min={today}
                value={formQuotationData.startDate}
                onChange={handleChange}
                required
                className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-[#9ca6b7]"
              />
              <input
                type="date"
                name="endDate"
                placeholder="Fill End Date"
                min={formQuotationData.startDate || today}
                value={formQuotationData.endDate}
                onChange={handleChange}
                required
                className="block w-full text-black mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-[#9ca6b7]"
              />
            </div>
          </div>

          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
               Services Offered by Us :
            </label>
            <textarea
              type="text"
              name="services"
              placeholder="Fill Services Offered by Us"
              value={formQuotationData.services}
              onChange={handleChange}
              required
              className="block w-full mb-2 text-black rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 placeholder:text-black"
            />
          </div>

          <div className="flex items-end justify-end gap-2">
            <button
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              onClick={handleQuotationSubmit}
            >
              Add Data
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setQuotationAddPopup(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationAddForm;
