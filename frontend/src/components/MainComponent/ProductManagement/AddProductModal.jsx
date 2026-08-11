import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCategories } from "../../../redux/categorySlice";

import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import CategoryAutoComplete from "../../Common/CategoryAutoComplete";

const AddProductModal = ({
  setAddProductModalOpen,
  handleSubmitAddProduct,
  formData,
  setFormData,
  handleChange,
  setFormErrors,
  formErrors,
  flashMessage,
  setFlashMessage,
  setFlashMsgType,
  flashMsgType,
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
      {/* Flash Messages */}

      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[20px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add New Product
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {flashMessage && flashMsgType === "success" && (
              <SuccessMessage message={flashMessage} />
            )}
            {flashMessage && flashMsgType === "error" && (
              <ErrorMessage message={flashMessage} />
            )}
          </div>
          <div className="mt-5 md:mt-5 px-4 grid grid-cols-1 md:grid-cols-4 gap-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Product Name :
              </label>
              <input
                type="text"
                name="product_name"
                placeholder="Product Name"
                value={formData.product_name}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.product_name && (
                <p className="text-red-500 text-sm">
                  {formErrors.product_name}
                </p>
              )}
            </div>

            <CategoryAutoComplete
              allCategories={allCategories}
              formData={formData}
              setFormData={setFormData}
              formErrors={formErrors}
            />

            {/* <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Select the Category :
              </label>
              <select
                name="category_id"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
                value={formData.category_id} // Controlled state
                onChange={handleChange} // Update state
              >
                <option value="">Select the Category</option>
                {allCategories?.data?.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category_name}
                  </option>
                ))}
              </select>
              {formErrors.category_id && (
                <p className="text-red-500 text-sm">{formErrors.category_id}</p>
              )}
            </div> */}

            {/* HSN Code */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                HSN Code :
              </label>
              <input
                type="text"
                name="HSN_code"
                placeholder="HSN Code"
                value={formData.HSN_code}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.HSN_code && (
                <p className="text-red-500 text-sm">{formErrors.HSN_code}</p>
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
                value={formData.stock}
                onChange={handleChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.stock && (
                <p className="text-red-500 text-sm">{formErrors.stock}</p>
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
                value={formData.unit}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.unit && (
                <p className="text-red-500 text-sm">{formErrors.unit}</p>
              )}
            </div> */}
            <div>
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Unit :
              </label>
              <select
                value={
                  formData.unit === ""
                    ? ""
                    : ["Kg", "Ltr"].includes(formData.unit)
                    ? formData.unit
                    : "Number"
                }
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setFormData({ ...formData, unit: "" });
                  } else if (value === "Number") {
                    setFormData({ ...formData, unit: "0" }); // start with "0"
                  } else {
                    setFormData({ ...formData, unit: value });
                  }
                }}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              >
                <option value="">Select Unit</option>
                <option value="Kg">Kg</option>
                <option value="Ltr">Ltr</option>
                <option value="Number">Number</option>
              </select>

              {/* Conditionally render number input if unit is numeric */}
              {formData.unit !== "" &&
                !["Kg", "Ltr"].includes(formData.unit) && (
                  <input
                    type="number"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                     min="0"
                    placeholder="Enter Number"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
                    autoFocus
                  />
                )}

              {formErrors.unit && (
                <p className="text-red-500 text-sm">{formErrors.unit}</p>
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
                value={formData.rate}
                onChange={handleChange}
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.rate && (
                <p className="text-red-500 text-sm">{formErrors.rate}</p>
              )}
            </div>

            {/* Status */}
            <div className="">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Status :
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              >
                <option value="">Select Status</option>
                <option value="1">Active</option>
                <option value="0">Inactive</option>
              </select>
              {formErrors.status && (
                <p className="text-red-500 text-sm">{formErrors.status}</p>
              )}
            </div>

            <div className="">
              <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                Consumption per Sq. Mtr. :
              </label>
              <input
                name="area_mtr2"
                placeholder=" Consumption per Sq. Mtr."
                value={formData.area_mtr2}
                onChange={handleChange}
                type="number"
                 min="0"
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2"
              />
              {formErrors.area_mtr2 && (
                <p className="text-red-500 text-sm">{formErrors.area_mtr2}</p>
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
                value={formData.product_description}
                onChange={handleChange}
                className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] px-3 py-2 h-[80px]"
              ></textarea>
              {formErrors.product_description && (
                <p className="text-red-500 text-sm">
                  {formErrors.product_description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-end justify-end gap-2 px-4">
            <button
              className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]"
              //onClick={handleSubmit}
              onClick={handleSubmitAddProduct}
            >
              Add Product
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setAddProductModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductModal;
