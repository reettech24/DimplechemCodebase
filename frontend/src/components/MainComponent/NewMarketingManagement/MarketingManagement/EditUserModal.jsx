import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import SuccessMessage from "../../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../../AlertMessage/ErrorMessage";
import { useLocation } from "react-router-dom";

const EditUserModal = ({
  setEditUserModalOpen,
  showBudgetPS,
  setShowBudgetPS,
  showQuantityPS,
  setShowQuantityPS,
  showTextareaPS,
  setShowTextareaPS,
  selectedLead,
  setSelectedLead,
  allCustomers,
  updateLeadData,
  setUpdateLeadData,
  updateLeadFormErrors,
  setUpdateLeadFormErrors,
  updateLeadFlashMessage,
  setUpdateLeadFlashMessage,
  updateLeadFlashMsgType,
  setUpdateLeadFlashMsgType,
  handleUpdateLeadChange,
  handleUpdateLeadFlashMessage,
  updateLeadValidateForm,
  handleSubmitUpdateLead,
  userDataWithRole,
  handleLeadUpdateCustomerChange,
  customerAddress,
}) => {
  const location = useLocation();
  //console.log(location.pathname);

  //console.log("selectedLead", selectedLead);
 //console.log("updateLeadData", updateLeadData);
  const [showTextareaCompany, setShowTextareaCompany] = useState(false);

  const handleSelectChange = (e) => {
    // Agar koi valid option select hoti hai, to textarea show karega
    setShowTextareaCompany(e.target.value !== "Select the Company");
  };

  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Edit Lead
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {updateLeadFlashMessage && updateLeadFlashMsgType === "success" && (
              <SuccessMessage message={updateLeadFlashMessage} />
            )}
            {updateLeadFlashMessage && updateLeadFlashMsgType === "error" && (
              <ErrorMessage message={updateLeadFlashMessage} />
            )}
          </div>

          <div className="mt-5 md:mt-9 px-4 grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Client Name :
              </label>
              <input
                type="text"
                value={updateLeadData?.client_name}
                name="client name"
                placeholder="Client Name"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                readOnly
              />
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Meeting date :
              </label>
              <input
                type="date"
                name="assign_date"
                value={updateLeadData?.assign_date}
                onChange={handleUpdateLeadChange}
                placeholder="Select Date"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                min={new Date().toISOString().split("T")[0]}
                disabled
              />
              {updateLeadFormErrors?.assign_date && (
                <p className="text-red-500">
                  {updateLeadFormErrors?.assign_date}
                </p>
              )}
            </div>
            {location.pathname === "/sale-management/lead-management" && (
              <>
                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Last Contact date :
                  </label>
                  <input
                    type="date"
                    name="last_contact"
                    value={updateLeadData?.last_contact}
                    onChange={handleUpdateLeadChange}
                    placeholder="Select Date"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                    min={new Date().toISOString().split("T")[0]}
                    disabled
                  />
                  {updateLeadFormErrors?.last_contact && (
                    <p className="text-red-500">
                      {updateLeadFormErrors?.last_contact}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Next FollowUp date :
                  </label>
                  <input
                    type="date"
                    name="next_followup"
                    value={updateLeadData?.next_followup}
                    onChange={handleUpdateLeadChange}
                    placeholder="Select Date"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </>
            )}

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Lead Source :
              </label>
              <select
                name="lead_source"
                value={updateLeadData?.lead_source}
                onChange={handleUpdateLeadChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              >
                <option>Select the lead source</option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Reference">Reference</option>
                <option value="Direct">Direct</option>
              </select>
              {updateLeadFormErrors?.lead_source && (
                <p className="text-red-500">
                  {updateLeadFormErrors?.lead_source}
                </p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Lead Owner :
              </label>
              <input
                type="text"
                value={updateLeadData?.lead_owner_id}
                name="owner lead name"
                placeholder="Owner lead Name"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                readOnly
              />
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Lead Status :
              </label>
              <select
                name="lead_status"
                value={updateLeadData?.lead_status}
                onChange={handleUpdateLeadChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              >
                <option>Select the Lead Status</option>
                <option value="Hot">Hot</option>
                <option value="Warm">Warm</option>
                <option value="Cold">Cold</option>
                <option value="In Discussion">In Discussion</option>
                <option value="On Hold">On Hold</option>
                <option value="Lost">Lost</option>
              </select>
              {updateLeadFormErrors?.lead_status && (
                <p className="text-red-500">
                  {updateLeadFormErrors?.lead_status}
                </p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Sales Person(contact before) :
              </label>
              <select
                name="assigned_person_id"
                value={updateLeadData?.assigned_person_id}
                onChange={handleUpdateLeadChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              >
                <option value="">Select the Person</option>
                {userDataWithRole?.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname}
                  </option>
                ))}
              </select>
              {updateLeadFormErrors?.assigned_person_id && (
                <p className="text-red-500">
                  {updateLeadFormErrors?.assigned_person_id}
                </p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Company:
              </label>
              <select
                name="customer_id"
                value={updateLeadData?.customer_id || ""}
                onChange={handleLeadUpdateCustomerChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              >
                <option value="">Select the Customer</option>

                {/* Dynamic customer options */}
                {allCustomers?.data?.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name}
                  </option>
                ))}
              </select>

              {updateLeadFormErrors?.customer_id && (
                <p className="text-red-500">
                  {updateLeadFormErrors?.customer_id}
                </p>
              )}
            </div>

            {updateLeadData?.customer_id && (
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Select address:
                </label>
                <select
                  name="lead_address"
                  value={updateLeadData?.lead_address || ""}
                  onChange={handleUpdateLeadChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                >
                  <option value="">Select the Address</option>

                  {/* Dynamic customer options */}
                  {customerAddress?.data?.addresses?.map((address, index) => (
                    <option key={index} value={address}>
                      {address}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Follow Up Record :
              </label>
              <input
                type="number"
                name="follow_up_record"
                value={updateLeadData?.follow_up_record || ""}
                onChange={handleUpdateLeadChange}
                 min="0"
                placeholder="No. of connects with client till now"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
            </div>

            <div className="">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Any Special Requirement :
              </label>
              <textarea
                type="text"
                name="lead_summary"
                value={updateLeadData?.lead_summary || ""}
                onChange={handleUpdateLeadChange}
                placeholder="description"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
            </div>

            <div className="">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Last Communication Details :
              </label>
              <textarea
                type="text"
                name="last_communication"
                value={updateLeadData?.last_communication}
                onChange={handleUpdateLeadChange}
                placeholder="description"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {updateLeadFormErrors?.last_communication && (
                <p className="text-red-500">
                  {updateLeadFormErrors?.last_communication}
                </p>
              )}
            </div>

            {updateLeadData?.customer_id && (
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Custome Company Address:
                </label>
                <textarea
                  name="lead_custom_address"
                  value={updateLeadData?.lead_custom_address}
                  onChange={handleUpdateLeadChange}
                  placeholder="Enter details about the selected company"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
                />
              </div>
            )}

            <div>
              <div className="flex items-start  flex-col  md:justify-between gap-[8px] md:gap-[0px] ">
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Interest Product/Service:
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="product_service_yes"
                      checked={updateLeadData?.product_service === true}
                      onChange={() => {
                        setUpdateLeadData({
                          ...updateLeadData,
                          product_service: true, // Set to true when Yes is checked
                        });
                        setShowTextareaPS(true); // Show textarea if Yes is checked
                        handleUpdateLeadChange();
                      }}
                      className="w-5 h-4"
                    />
                    Yes
                  </label>

                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="product_service_no"
                      checked={updateLeadData?.product_service === false}
                      onChange={() => {
                        setUpdateLeadData({
                          ...updateLeadData,
                          product_service: false, // Set to false when No is checked
                        });
                        setShowTextareaPS(false); // Hide textarea if No is checked
                        handleUpdateLeadChange();
                      }}
                      className="w-5 h-4"
                    />
                    No
                  </label>
                </div>
              </div>

              {showTextareaPS && (
                <div>
                  <textarea
                    name="product_detail"
                    value={updateLeadData?.product_detail}
                    onChange={handleUpdateLeadChange}
                    placeholder="Client Interest product/service details"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-start  flex-col  md:justify-between gap-[8px] md:gap-[0px] ">
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Budget:
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="budget_status"
                      checked={updateLeadData?.budget_status === true}
                      onChange={() => {
                        setUpdateLeadData({
                          ...updateLeadData,
                          budget_status: true, // Set to true when Yes is checked
                        });
                        setShowBudgetPS(true); // Show additional logic if needed
                        handleUpdateLeadChange();
                      }}
                      className="w-5 h-4"
                    />
                    Yes
                  </label>

                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="budget_status"
                      checked={updateLeadData?.budget_status === false}
                      onChange={() => {
                        setUpdateLeadData({
                          ...updateLeadData,
                          budget_status: false, // Set to false when No is checked
                        });
                        setShowBudgetPS(false); // Hide additional logic if needed
                        handleUpdateLeadChange();
                      }}
                      className="w-5 h-4"
                    />
                    No
                  </label>
                </div>
              </div>

              {showBudgetPS && (
                <div>
                  <input
                    type="number"
                    name="budget"
                    value={updateLeadData?.budget}
                    onChange={handleUpdateLeadChange}
                    placeholder=" Budget"
                     min="0"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
                  />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-start  flex-col  md:justify-between gap-[8px] md:gap-[0px] ">
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Quantity:
                </label>
                <div className="flex items-center gap-2 mt-2">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="quantity"
                      checked={updateLeadData?.quantity === true} // Check Yes if true
                      onChange={() => {
                        setUpdateLeadData({
                          ...updateLeadData,
                          quantity: true, // Set to true when Yes is checked
                        });
                        setShowQuantityPS(true); // Show additional logic if needed
                        handleUpdateLeadChange();
                      }}
                      className="w-5 h-4"
                    />
                    Yes
                  </label>

                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      name="quantity"
                      checked={updateLeadData?.quantity === false} // Check No if false
                      onChange={() => {
                        setUpdateLeadData({
                          ...updateLeadData,
                          quantity: false, // Set to false when No is checked
                        });
                        setShowQuantityPS(false); // Hide additional logic if needed
                        handleUpdateLeadChange();
                      }}
                      className="w-5 h-4"
                    />
                    No
                  </label>
                </div>
              </div>

              {showQuantityPS && (
                <div>
                  <input
                    type="number"
                    name="quantity_no"
                    value={updateLeadData?.quantity_no}
                    onChange={handleUpdateLeadChange}
                    placeholder=" Quantity"
                     min="0"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex items-end justify-end gap-2 px-4">
            <button
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              onClick={handleSubmitUpdateLead}
            >
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
    </>
  );
};

export default EditUserModal;
