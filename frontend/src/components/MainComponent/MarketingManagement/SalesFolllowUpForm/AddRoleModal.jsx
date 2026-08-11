import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../../AlertMessage/ErrorMessage";
import { fetchAllProducts } from "../../../../redux/productSlice";
import ProductMultiSelect from "./ProductMultiSelect";
import SearchableSelect from "./SearchableSelect";

const AddRoleModal = ({
  setAddUserModalOpen,
  poaData,
  setPoaData,
  handlePoaChange,
  handleSubmitPoa,
  poaFormErrors,
  poaFlashMessage,
  poaFlashMsgType,
  allCustomers,
  userDataWithRole,
  handlePoaCustomerChange,
  customerAddress,
  userDeatail,
}) => {
  const dispatch = useDispatch();
  const { allProducts, totalPages, productLoading, productError } = useSelector(
    (state) => state.product
  );
  //console.log("poaData", poaData);
  //console.log("allProducts", allProducts);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const customerOptions = allCustomers?.data?.map((customer) => ({
    value: customer.id,
    label: customer.company_name,
  }));
  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add New POA
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {poaFlashMessage && poaFlashMsgType === "success" && (
              <SuccessMessage message={poaFlashMessage} />
            )}
            {poaFlashMessage && poaFlashMsgType === "error" && (
              <ErrorMessage message={poaFlashMessage} />
            )}
          </div>

          <div className="mt-5 md:mt-9 px-4 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Customer */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Customer:
              </label>
              {/* <select
                  name="customer_id"
                  value={poaData?.customer_id}
                  onChange={handlePoaCustomerChange}
                  className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
                >
                  <option value="">Select the Customer</option>
                  {allCustomers?.data?.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.company_name}
                    </option>
                  ))}
                </select> */}
              <SearchableSelect
                options={customerOptions}
                value={poaData?.customer_id}
                onChange={(selectedValue) =>
                  handlePoaCustomerChange({
                    target: { name: "customer_id", value: selectedValue },
                  })
                }
                placeholder="Select the Customer"
              />
              {poaFormErrors?.customer_id && (
                <p className="text-red-500">{poaFormErrors?.customer_id}</p>
              )}
            </div>
            {poaData?.customer_id && (
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Select Location:
                </label>
                <select
                  name="lead_address"
                  value={poaData?.lead_address || ""}
                  onChange={handlePoaChange}
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                >
                  <option value="">Select the Address</option>

                  {/* Dynamic customer options */}
                  {customerAddress?.data?.addresses?.map((address, index) => (
                    <option
                      key={index}
                      value={`${address?.address_type} - ${address?.location}, ${address?.city}, ${address?.pincode}`}
                    >
                      {`${address?.address_type} - ${address?.location}, ${address?.city}, ${address?.pincode}`}
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
                value={poaData?.contact_person_name || ""}
                onChange={handlePoaChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
              >
                <option value="">Select Contact Person</option>

                {/* Dynamic customer options */}
                {customerAddress?.data?.contact_persons?.map(
                  (contact_person, index) => (
                    <option key={index} value={contact_person.id}>
                      {contact_person.name}
                    </option>
                  )
                )}
              </select>
              {poaFormErrors?.contact_persion_name && (
                <p className="text-red-500">
                  {poaFormErrors?.contact_persion_name}
                </p>
              )}
            </div>

            {/* Sales Person */}
            <div>
              <label>Select Sales Person</label>
              <select
                name="assigned_person_id"
                value={poaData?.assigned_person_id}
                onChange={handlePoaChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              >
                <option value="">Select the Person</option>
                {userDataWithRole?.data?.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.fullname}
                  </option>
                ))}
              </select>
              {poaFormErrors?.assigned_person_id && (
                <p className="text-red-500">
                  {poaFormErrors?.assigned_person_id}
                </p>
              )}
            </div>

            {/* Product Sale */}
            <div>
              <label>Product Sale</label>
              <ProductMultiSelect
                allProducts={allProducts}
                poaData={poaData}
                setPoaData={setPoaData}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              />
              {poaFormErrors?.product_sale && (
                <p className="text-red-500">{poaFormErrors?.product_sale}</p>
              )}
            </div>

            {/* Total Material Quantity */}
            <div>
              <label>Total Material Quantity (in Kg)</label>
              <input
                type="number"
                name="total_material_qty"
                value={poaData.total_material_qty}
                onChange={handlePoaChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              />
              {poaFormErrors?.total_material_qty && (
                <p className="text-red-500">
                  {poaFormErrors?.total_material_qty}
                </p>
              )}
            </div>

            {/* Approx Business */}
            <div>
              <label>Approx Business (₹)</label>
              <input
                type="number"
                name="approx_business"
                value={poaData.approx_business}
                onChange={handlePoaChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              />
              {poaFormErrors?.approx_business && (
                <p className="text-red-500">{poaFormErrors?.approx_business}</p>
              )}
            </div>

            {/* Project Name */}
            <div>
              <label>Application Area</label>
              <input
                type="text"
                name="project_name"
                value={poaData.project_name}
                onChange={handlePoaChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              />
              {poaFormErrors?.project_name && (
                <p className="text-red-500">{poaFormErrors?.project_name}</p>
              )}
            </div>

            {/* Meeting Date */}
            <div>
              <label>Meeting Date</label>
              <input
                type="date"
                name="assign_date"
                value={poaData.assign_date}
                onChange={handlePoaChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
                min={new Date().toISOString().split("T")[0]}
              />

              {poaFormErrors?.assign_date && (
                <p className="text-red-500">{poaFormErrors?.assign_date}</p>
              )}
            </div>

            {/* Meeting Type */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Meeting Type
              </label>
              <select
                name="meeting_type"
                value={poaData.meeting_type}
                onChange={handlePoaChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              >
                <option value="">Select the Meeting Type</option>
                <option value="In-Person">In-Person</option>
                <option value="Phone-Call">Phone Call</option>
                <option value="Video-Call">Video Call</option>
              </select>
              {poaFormErrors?.meeting_type && (
                <p className="text-red-500">{poaFormErrors?.meeting_type}</p>
              )}
            </div>

            <div>
              <label className="font-poppins font-medium text-black text-[16px]">
                Meeting Time :
              </label>
              <input
                type="time"
                name="meeting_time"
                value={poaData.meeting_time}
                onChange={handlePoaChange}
                placeholder="Meeting Time"
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              />
              {poaFormErrors.meeting_time && (
                <p className="text-red-500 text-sm">
                  {poaFormErrors.meeting_time}
                </p>
              )}
            </div>

            {/* Meeting Summary */}
            <div>
              <label>Meeting Agenda</label>
              <textarea
                name="lead_summary"
                value={poaData.lead_summary}
                onChange={handlePoaChange}
                className="block w-full mb-2 rounded-[5px] border border-[#473b33] px-3 py-2"
              />
              {poaFormErrors?.lead_summary && (
                <p className="text-red-500">{poaFormErrors?.lead_summary}</p>
              )}
            </div>

            <div>
            <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
              Lead Source :
            </label>
            <select
              name="lead_source"
              onChange={handlePoaChange}
              value={poaData.lead_source}
              className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
            >
              <option>Select the lead source</option>
              <option value="Marketing">Marketing</option>
              <option value="Sales">Sales</option>
              <option value="Reference">Other</option>
            </select>
          </div>
          </div>
          {/* Buttons */}
          <div className="flex items-end justify-end gap-2 px-4">
            <button
              type="submit"
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-4 hover:bg-[#cb6f2ad9]"
              onClick={handleSubmitPoa}
            >
              Add POA
            </button>
            <button
              type="button"
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setAddUserModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRoleModal;
