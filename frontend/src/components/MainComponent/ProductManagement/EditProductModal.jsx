import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../../../redux/categorySlice";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import CategoryAutoComplete from "../../Common/CategoryAutoComplete";

const EditProductModal = ({
  setEditProductModalOpen,
  selectedProduct,
  setSelectedProduct,
  editFormData,
  setEditFormData,
  editFormErrors,
  setEditFormErrors,
  editFlashMessage,
  setEditFlashMessage,
  editFlashMsgType,
  setEditFlashMsgType,
  handleEditChange,
  handleEditSubmit,
}) => {
  const dispatch = useDispatch();
  const { allCategories, categoryLoading, categoryError } = useSelector(
    (state) => state.category
  );
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);
  return (
    <>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Edit Product
          </h2>
           <div className="fixed top-5 right-5 z-50">
                      {editFlashMessage && editFlashMsgType === "success" && (
                        <SuccessMessage message={editFlashMessage} />
                      )}
                      {editFlashMessage && editFlashMsgType === "error" && (
                        <ErrorMessage message={editFlashMessage} />
                      )}
                    </div>
          <div className="mt-5 md:mt-9 px-4 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Product Name :
              </label>
              <input
                type="text"
                name="product_name"
                placeholder="Product Name"
                value={editFormData.product_name}
                onChange={handleEditChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {editFormErrors.product_name && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.product_name}
                </p>
              )}
            </div>

            {/* <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select Category :
              </label>
              <select
                name="category_id"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-[9px]"
                value={editFormData.category_id} // Controlled state
                onChange={handleEditChange} // Update state
              >
                <option value="">Select Category</option>
                {allCategories?.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              {editFormErrors.category_id && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.category_id}
                </p>
              )}
            </div> */}

            <CategoryAutoComplete
              allCategories={allCategories}
              editMode={true}
              editFormData={editFormData}
              setEditFormData={setEditFormData}
              editFormErrors={editFormErrors}
            />

            {/* HSN Code */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                HSN Code :
              </label>
              <input
                type="text"
                name="HSN_code"
                placeholder="HSN Code"
                value={editFormData.HSN_code}
                onChange={handleEditChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {editFormErrors.HSN_code && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.HSN_code}
                </p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Stock :
              </label>
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={editFormData.stock}
                onChange={handleEditChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {editFormErrors.stock && (
                <p className="text-red-500 text-sm">{editFormErrors.stock}</p>
              )}
            </div>

            {/* Unit */}
            {/* <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Unit :
              </label>
              <input
                type="text"
                name="unit"
                placeholder="Unit"
                value={editFormData.unit}
                onChange={handleEditChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {editFormErrors.unit && (
                <p className="text-red-500 text-sm">{editFormErrors.unit}</p>
              )}
            </div> */}

            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Unit :
              </label>
              <select
                value={
                  editFormData.unit === ""
                    ? ""
                    : ["Kg", "Ltr"].includes(editFormData.unit)
                    ? editFormData.unit
                    : "Number"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    handleEditChange({ target: { name: "unit", value: "" } });
                  } else if (value === "Number") {
                    handleEditChange({ target: { name: "unit", value: "0" } }); // start with "0"
                  } else {
                    handleEditChange({ target: { name: "unit", value } });
                  }
                }}
                name="unit"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              >
                <option value="">Select Unit</option>
                <option value="Kg">Kg</option>
                <option value="Ltr">Ltr</option>
                <option value="Number">Number</option>
              </select>

              {/* Conditionally render number input if unit is numeric */}
              {editFormData.unit !== "" &&
                !["Kg", "Ltr"].includes(editFormData.unit) && (
                  <input
                    type="number"
                    name="unit"
                    value={editFormData.unit}
                    onChange={handleEditChange}
                    placeholder="Enter Number"
                     min="0"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
                    autoFocus
                  />
                )}

              {editFormErrors.unit && (
                <p className="text-red-500 text-sm">{editFormErrors.unit}</p>
              )}
            </div>

            {/* Rate */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Rate :
              </label>
              <input
                type="number"
                name="rate"
                placeholder="Rate"
                value={editFormData.rate}
                onChange={handleEditChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {editFormErrors.rate && (
                <p className="text-red-500 text-sm">{editFormErrors.rate}</p>
              )}
            </div>

            {/* Status */}
            <div className="">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Status :
              </label>
              <select
                name="status"
                value={editFormData.status}
                onChange={handleEditChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              >
                <option value="">Select Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
              {editFormErrors.status && (
                <p className="text-red-500 text-sm">{editFormErrors.status}</p>
              )}
            </div>

            <div className="">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Consumption per Sq. Mtr. :
              </label>
              <input
                name="area_mtr2"
                placeholder=" Consumption per Sq. Mtr."
                value={editFormData.area_mtr2}
                onChange={handleEditChange}
                type="number"
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {editFormErrors.area_mtr2 && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.area_mtr2}
                </p>
              )}
            </div>

            {/* Product Description */}
            <div className="">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Product Description :
              </label>
              <textarea
                name="product_description"
                placeholder="Product Description"
                value={editFormData.product_description}
                onChange={handleEditChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2 h-[80px]"
              ></textarea>
              {editFormErrors.product_description && (
                <p className="text-red-500 text-sm">
                  {editFormErrors.product_description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-end justify-end gap-2 px-4">
            <button
              className="bg-bgDataNew text-textdata whitespace-nowrap text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              onClick={handleEditSubmit}
            >
              Update Product
            </button>
            <button
              className="mt-4 bg-gray-500 text-textdata whitespace-nowrap text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setEditProductModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProductModal;
