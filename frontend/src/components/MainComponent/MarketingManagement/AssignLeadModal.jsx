import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { fetchAllProducts } from "../../../redux/productSlice";
import ProductMultiSelect from "./ProductMultiSelect";

const AssignLeadModal = ({
  setIsAssignModalOpen,
  userDataWithRole,
  leadData,
  setLeadData,
  addLeadFormErrors,
  addLeadFlashMessage,
  addLeadFlashMsgType,
  handleLeadChange,
  handleSubmitAddLead,
  allCustomers,
  handleLeadCustomerChange,
  customerAddress,
}) => {
  const dispatch = useDispatch();
  const { allProducts, totalPages, productLoading, productError } = useSelector(
    (state) => state.product
  );
  console.log("leadData", leadData);
  console.log("allProducts", allProducts);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);
  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add New Lead
          </h2>
          <div className="mt-5 md:mt-6 px-4 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Customer:
              </label>
              <select
                name="customer_id"
                value={leadData?.customer_id || ""}
                onChange={handleLeadCustomerChange}
                className="block w-full text-textdata whitespace-nowrap mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              >
                <option value="">Select the Customer</option>

                {/* Dynamic customer options */}
                {allCustomers?.data?.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.company_name}
                  </option>
                ))}
              </select>

              {addLeadFormErrors?.customer_id && (
                <p className="text-red-500">{addLeadFormErrors?.customer_id}</p>
              )}
            </div>
            {leadData?.customer_id && (
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Select address:
                </label>
                <select
                  name="lead_address"
                  value={leadData?.lead_address || ""}
                  onChange={handleLeadChange}
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

            {/* Contact Person Name */}
            <div>
              <label>Contact Person Name</label>
              <select
                name="contact_person_name"
                value={leadData?.contact_person_name || ""}
                onChange={handleLeadChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              >
                <option value="">Select Contact Person</option>
                {customerAddress?.data?.contact_persons?.map(
                  (contact_person, index) => (
                    <option key={index} value={contact_person}>
                      {contact_person}
                    </option>
                  )
                )}
              </select>
              {addLeadFormErrors?.contact_persion_name && (
                <p className="text-red-500">
                  {addLeadFormErrors?.contact_persion_name}
                </p>
              )}
            </div>

            {/* Sales Person */}
            <div>
              <label>Select Sales Person</label>
              <select
                name="assigned_person_id"
                value={leadData?.assigned_person_id}
                onChange={handleLeadChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              >
                <option value="">Select the Person</option>
                {userDataWithRole?.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname}
                  </option>
                ))}
              </select>
              {addLeadFormErrors?.assigned_person_id && (
                <p className="text-red-500">
                  {addLeadFormErrors?.assigned_person_id}
                </p>
              )}
            </div>

            {/* Product Sale */}
            <div>
              <label>Product Sale</label>
              <ProductMultiSelect
                allProducts={allProducts}
                leadData={leadData}
                setLeadData={setLeadData}
              />
              {addLeadFormErrors?.product_sale && (
                <p className="text-red-500">
                  {addLeadFormErrors?.product_sale}
                </p>
              )}
            </div>

            {/* Total Material Quantity */}
            <div>
              <label>Total Material Quantity (in Kg)</label>
              <input
                type="number"
                name="total_material_qty"
                value={leadData?.total_material_qty}
                onChange={handleLeadChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              />
              {addLeadFormErrors?.total_material_qty && (
                <p className="text-red-500">
                  {addLeadFormErrors?.total_material_qty}
                </p>
              )}
            </div>

            {/* Approx Business */}
            <div>
              <label>Approx Business (₹)</label>
              <input
                type="number"
                name="approx_business"
                value={leadData?.approx_business}
                onChange={handleLeadChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              />
              {addLeadFormErrors?.approx_business && (
                <p className="text-red-500">
                  {addLeadFormErrors?.approx_business}
                </p>
              )}
            </div>

            {/* Project Name */}
            <div>
              <label>Project Name</label>
              <input
                type="text"
                name="project_name"
                value={leadData?.project_name}
                onChange={handleLeadChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              />
              {addLeadFormErrors?.project_name && (
                <p className="text-red-500">
                  {addLeadFormErrors?.project_name}
                </p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Lead Source :
              </label>
              <select
                name="lead_source"
                value={leadData?.lead_source}
                onChange={handleLeadChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              >
                <option value="" disabled>
                  Select the lead source
                </option>
                <option value="Marketing">Marketing</option>
                <option value="Sales">Sales</option>
                <option value="Reference">Reference</option>
                <option value="Direct">Direct</option>
              </select>
              {addLeadFormErrors?.lead_source && (
                <p className="text-red-500">{addLeadFormErrors.lead_source}</p>
              )}
            </div>

            {leadData?.lead_source === "Reference" && (
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Reference Name :
                </label>
                <input
                  type="text"
                  name="reference_name"
                  value={leadData?.reference_name}
                  onChange={handleLeadChange}
                  placeholder="Enter reference name"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                />
                {addLeadFormErrors?.reference_name && (
                  <p className="text-red-500">
                    {addLeadFormErrors.reference_name}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Lead Status :
              </label>
              <select
                name="lead_status"
                value={leadData?.lead_status}
                onChange={handleLeadChange}
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
              {addLeadFormErrors?.lead_status && (
                <p className="text-red-500">{addLeadFormErrors?.lead_status}</p>
              )}
            </div>

            {/* Meeting Date */}
            <div>
              <label>Meeting Date</label>
              <input
                type="date"
                name="assign_date"
                value={leadData?.assign_date}
                onChange={handleLeadChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
                min={new Date().toISOString().split("T")[0]}
              />
              {addLeadFormErrors?.assign_date && (
                <p className="text-red-500">{addLeadFormErrors?.assign_date}</p>
              )}
            </div>

            {/* Meeting Time */}
            <div>
              <label className="font-poppins font-medium text-black text-[16px]">
                Meeting Time :
              </label>
              <input
                type="time"
                name="meeting_time"
                value={leadData?.meeting_time}
                onChange={handleLeadChange}
                placeholder="Meeting Time"
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              />
              {addLeadFormErrors?.meeting_time && (
                <p className="text-red-500 text-sm">
                  {addLeadFormErrors?.meeting_time}
                </p>
              )}
            </div>

            {/* Meeting Type */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Meeting Type
              </label>
              <select
                name="meeting_type"
                value={leadData?.meeting_type}
                onChange={handleLeadChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              >
                <option value="">Select the Meeting Type</option>
                <option value="In-Person">In-Person</option>
                <option value="Phone Call">Phone Call</option>
                <option value="Video Call">Video Call</option>
              </select>
              {addLeadFormErrors?.meeting_type && (
                <p className="text-red-500">
                  {addLeadFormErrors?.meeting_type}
                </p>
              )}
            </div>

            {/* Meeting Summary */}
            <div>
              <label>Meeting Summary</label>
              <textarea
                name="lead_summary"
                value={leadData?.lead_summary}
                onChange={handleLeadChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              />
              {addLeadFormErrors?.lead_summary && (
                <p className="text-red-500">
                  {addLeadFormErrors?.lead_summary}
                </p>
              )}
            </div>

            {/* <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Sales Person :
              </label>
              <select
                name="assigned_person_id"
                value={leadData?.assigned_person_id}
                onChange={handleLeadChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              >
                <option value="">Select the Person</option>
                {userDataWithRole?.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname}
                  </option>
                ))}
              </select>
              {addLeadFormErrors?.assigned_person_id && (
                <p className="text-red-500">
                  {addLeadFormErrors?.assigned_person_id}
                </p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Meeting date :
              </label>
              <input
                type="date"
                name="assign_date"
                value={leadData?.assign_date}
                onChange={handleLeadChange}
                placeholder="Select Date"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                min={new Date().toISOString().split("T")[0]}
              />
              {addLeadFormErrors?.assign_date && (
                <p className="text-red-500">{addLeadFormErrors?.assign_date}</p>
              )}
            </div> */}

            {/* <div className="">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Description :
              </label>
              <textarea
                type="text"
                name="lead_summary"
                value={leadData?.lead_summary}
                onChange={handleLeadChange}
                placeholder="description"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              />
              {addLeadFormErrors?.lead_summary && (
                <p className="text-red-500">
                  {addLeadFormErrors?.lead_summary}
                </p>
              )}
            </div> */}
          </div>

          <div className="flex items-end justify-end gap-2 px-4">
            <button
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              onClick={handleSubmitAddLead}
            >
              Add Lead
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssignLeadModal;
