import React, { useState } from "react";

const DocumentAddUserModal = ({
  setAddUserModalOpen,
  templates,
  selectedTemplate,
  setSelectedTemplate,
  setTitle,
  title,
  handleFileUpload,
  handleSaveData,
}) => {
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[650px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-textdata whitespace-nowrap font-poopins font-semibold mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Upload Document with Template
        </h2>

        <div className="mt-5 md:mt-7 px-4 flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-200px)]">
          <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Select a Template :
            </label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              {templates.map((template) => (
                <div
                  key={template.id}
                  className={`p-3 rounded border-2 cursor-pointer ${
                    selectedTemplate?.id === template.id
                      ? "border-bgDataNew"
                      : "border-transparent"
                  } ${template.style}`}
                  onClick={() => setSelectedTemplate(template)}
                >
                  <h3 className="font-semibold text-center">{template.name}</h3>
                  <p className="text-sm text-center">
                    This is a preview of {template.name}.
                  </p>
                </div>
              ))}
            </div>
          </div>

          {selectedTemplate && (
            <>
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Document Title :
                </label>
                <input
                  type="text"
                  placeholder="Document Title"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Invoice Number :
                </label>
                <input
                  type="number"
                  placeholder="Document Title"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Invoice Date :
                </label>
                <input
                  type="date"
                  placeholder="Document Title"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Upload the Pdf/Docx :
                </label>
                <input
                  type="file"
                  accept=".pdf,.docx"
                  placeholder="pdf/Docx"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  onChange={handleFileUpload}
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Invoice Status :
                </label>
                <select className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2">
                  <option>Select the Status</option>
                  <option value="New">Paid</option>
                  <option value="InProgress">UnPaid</option>
                  <option value="Completed">Partically Paid</option>
                </select>
              </div>

              <h2 className="mt-4 font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Seller Company Details
              </h2>
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Company Name :
                </label>
                <input
                  type="text"
                  placeholder="name"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Contact Person :
                </label>
                <input
                  type="number"
                  placeholder="Number"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Company Tax Id :
                </label>
                <input
                  type="number"
                  placeholder="Number"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Company Address :
                </label>
                <textarea
                  type="text"
                  placeholder="address"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <h2 className="mt-4 font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Product Details
              </h2>
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Product code :
                </label>
                <input
                  type="number"
                  placeholder="product"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Quantity :
                </label>
                <input
                  type="number"
                  placeholder="Number"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   SubTotal Amount :
                </label>
                <input
                  type="number"
                  placeholder="Number"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Tax percentegae :
                </label>
                <input
                  type="number"
                  placeholder="Number"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Discount :
                </label>
                <input
                  type="number"
                  placeholder="Number"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Shipping Charges :
                </label>
                <input
                  type="number"
                  placeholder="Number"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Grand Total :
                </label>
                <input
                  type="number"
                  placeholder="Number"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
              </div>

              <h2 className="mt-4 font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Payment Details
              </h2>
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Payment Terms :
                </label>
                <select className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2">
                  <option>Select the Terms</option>
                  <option value="New">Credit</option>
                  <option value="InProgress">Debit</option>
                  <option value="Completed">Advance Payment</option>
                </select>
              </div>

              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                   Payment Method :
                </label>
                <select className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2">
                  <option>Select the Method</option>
                  <option value="New">Paypal</option>
                  <option value="InProgress">Cash</option>
                  <option value="Completed">Bank Transfer</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 mt-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="w-5 h-5 accent-[#473b33] cursor-pointer"
                />
                <label
                  htmlFor="terms"
                  className="font-poppins text-[16px] text-bgData cursor-pointer"
                >
                  Accept my terms and conditions
                </label>
              </div>
            </>
          )}
        </div>

        <div className="flex items-end justify-end gap-2 px-4">
          <button
            className={`text-white px-3 py-2 rounded mt-2 ${
              !selectedTemplate && !title
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-bgDataNew hover:bg-[#cb6f2ad9]"
            }`}
            onClick={handleSaveData}
            disabled={!selectedTemplate && !title}
          >
            Save Data
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

export default DocumentAddUserModal;
