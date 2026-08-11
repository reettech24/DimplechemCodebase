import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { fetchAllProducts } from "../../../redux/productSlice";
import { fetchAllCategories } from "../../../redux/categorySlice";
import CategoryAutocomplete from "./CategoryAutocomplete";
import Select from "react-select";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const AddCostWorkingModal = ({
  setIsCostWorkingModalOpen,
  costWorkingData,
  setCostWorkingData,
  costWorkingFormErrors,
  costWorkingFlashMessage,
  costWorkingFlashMsgType,
  handleCostWorkingChange,
  handleSubmitCostWorking,
  allCustomers,
  handleCostWorkingCustomerChange,
  customerAddress,
}) => {
  console.log("costWorkingData",costWorkingData);
  const dispatch = useDispatch();
  const { allProducts, totalPages, productLoading, productError } = useSelector(
    (state) => state.product
  );

  const { allCategories, categoryLoading, categoryError } = useSelector(
    (state) => state.category
  );

  useEffect(() => {
    dispatch(fetchAllCategories());
    dispatch(fetchAllProducts());
  }, [dispatch]);

  //console.log("allProducts", allProducts?.data);
  // Function to add a new product entry
  // const handleAddProduct = () => {
  //     setCostWorkingData((prevData) => ({
  //       ...prevData,
  //       products: [
  //         ...prevData.products,
  //         {
  //           //category_id: "",
  //           category_name: "",
  //           product_id: "",
  //           unit: "",
  //           qty_for: "",
  //           std_pak: "",
  //           std_basic_rate: "",
  //           basic_amount: "",
  //           qty_for_1: "",
  //         },
  //       ],
  //     }));
  //     setProductOptions((prev) => [...prev, []]);
  //   };

  const handleAddCategory = () => {
    setCostWorkingData((prev) => ({
      ...prev,
      products: [
        ...prev.products,
        {
          category_name: "",
          items: [
            {
              product_id: "",
              unit: "",
              qty_for: "",
              std_pak: "",
              std_basic_rate: "",
              basic_amount: "",
              qty_for_1: "",
            },
          ],
        },
      ],
    }));
  };

  const handleAddRowInCategory = (catIndex) => {
    const updated = [...costWorkingData.products];
    updated[catIndex].items.push({
      product_id: "",
      unit: "",
      qty_for: "",
      std_pak: "",
      std_basic_rate: "",
      basic_amount: "",
      qty_for_1: "",
    });
    setCostWorkingData({ ...costWorkingData, products: updated });
  };

  const [productOptions, setProductOptions] = useState([]); // dynamic products for each category

  //console.log("productOptions",productOptions);

  const fetchProductsByCategory = async (categoryId) => {
    try {
      const token = getAuthToken();
      //console.log("token",token);
      const response = await axios.get(
        `${API_URL}/auth/get-product-category/${categoryId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.data);

      return response.data.data; // assuming your API responds with { data: [...] }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  };

  // Function to remove a product entry
  // const handleRemoveProduct = (index) => {
  //   const updatedProducts = [...costWorkingData.products];
  //   updatedProducts.splice(index, 1);

  //   // Recalculate total material cost
  //   const totalMaterialCost = updatedProducts.reduce((total, item) => {
  //     const basicAmount = parseFloat(item.basic_amount);
  //     return total + (isNaN(basicAmount) ? 0 : basicAmount);
  //   }, 0);

  //   setCostWorkingData({
  //     ...costWorkingData,
  //     products: updatedProducts,
  //     total_material_cost: totalMaterialCost.toFixed(2),
  //   });
  // };

  // Function to handle product input change

  // const handleProductChange = async (e, index) => {
  //   const { name, value } = e.target;

  //   const updatedProducts = [...costWorkingData.products];
  //   const productToUpdate = { ...updatedProducts[index] };

  //   // Update the selected field value
  //   productToUpdate[name] = value;

  //   // If product_id changed, set unit too
  //   if (name === "product_id") {
  //     const selectedProduct = productOptions[index]?.find(
  //       (prod) => prod.id.toString() === value
  //     );
  //     productToUpdate.unit = selectedProduct ? selectedProduct.unit : "";
  //   }

  //   productToUpdate.qty_for_1 = parseFloat(
  //     (
  //       parseFloat(productToUpdate.qty_for) *
  //       (parseFloat(costWorkingData?.area_to_be_coated) || 0)
  //     ).toFixed(2)
  //   );

  //   const qty_for_1 = parseFloat(
  //     (
  //       parseFloat(productToUpdate.qty_for) *
  //       (parseFloat(costWorkingData?.area_to_be_coated) || 0)
  //     ).toFixed(2)
  //   );

  //   //const qty_for_1 = parseFloat(productToUpdate.qty_for_1) || 0;
  //   const rate = parseFloat(productToUpdate.std_basic_rate) || 0;

  //   productToUpdate.basic_amount = (qty_for_1 * rate).toFixed(2);

  //   // Replace updated product in the array
  //   updatedProducts[index] = productToUpdate;

  //   // Recalculate total material cost
  //   const totalMaterialCost = updatedProducts.reduce(
  //     (sum, item) => sum + (parseFloat(item.basic_amount) || 0),
  //     0
  //   );

  //   // If category changed, fetch new product list for this row
  //   if (name === "category_id") {
  //     const products = await fetchProductsByCategory(value);
  //     setProductOptions((prev) => {
  //       const updatedOptions = [...prev];
  //       updatedOptions[index] = products;
  //       return updatedOptions;
  //     });
  //   }

  //   // Update the overall state
  //   setCostWorkingData({
  //     ...costWorkingData,
  //     products: updatedProducts,
  //     total_material_cost: totalMaterialCost.toFixed(2),
  //   });
  // };

  const handleProductChange = (e, catIndex, itemIndex) => {
    const { name, value } = e.target;
    const updated = [...costWorkingData.products];
    const item = updated[catIndex].items[itemIndex];

    item[name] = value;

    if (name === "product_id") {
      const selectedProduct = allProducts?.data?.find(
        (p) => p.id.toString() === value
      );
      item.unit = selectedProduct?.unit || "";
    }

    const qty = parseFloat(item.qty_for || 0);

    item.qty_for_1 = (qty * costWorkingData?.area_to_be_coated).toFixed(2);

    const rate = parseFloat(item.std_basic_rate || 0);

    const qty_for_1 = parseFloat(item.qty_for_1 || 0);
    item.basic_amount = (qty_for_1 * rate).toFixed(2);

    // Recalculate total
    const total = updated
      .flatMap((cat) => cat.items)
      .reduce((sum, i) => sum + (parseFloat(i.basic_amount) || 0), 0);

    const costPerSqFt = costWorkingData?.area_to_be_coated
      ? (total / costWorkingData?.area_to_be_coated).toFixed(2)
      : "0.00";

    setCostWorkingData({
      ...costWorkingData,
      products: updated,
      total_material_cost: total.toFixed(2),
      cost_per_sqft: costPerSqFt,
    });
  };

  const fields = [
    { name: "qty_for", placeholder: "Quantity" },
    { name: "unit", placeholder: "Unit No." },
    { name: "qty_for_1", placeholder: "Quantity For 1" },
    { name: "std_pak", placeholder: "Std Pack (Unit No.)" },
    { name: "std_basic_rate", placeholder: "Std Basic Rate" },
    { name: "basic_amount", placeholder: "Basic Amount" },
  ];

  const handleRemoveRowInCategory = (catIndex, itemIndex) => {
    const updated = [...costWorkingData.products];
    updated[catIndex].items.splice(itemIndex, 1);

    // Recalculate total
    const total = updated
      .flatMap((cat) => cat.items)
      .reduce((sum, i) => sum + (parseFloat(i.basic_amount) || 0), 0);

    setCostWorkingData({
      ...costWorkingData,
      products: updated,
      total_material_cost: total.toFixed(2),
    });
  };

  const handleRemoveCategory = (catIndex) => {
    const updated = [...costWorkingData.products];
    updated.splice(catIndex, 1);

    const total = updated
      .flatMap((cat) => cat.items)
      .reduce((sum, i) => sum + (parseFloat(i.basic_amount) || 0), 0);

    setCostWorkingData({
      ...costWorkingData,
      products: updated,
      total_material_cost: total.toFixed(2),
    });
  };

  //customer auto search

  const customerOptions =
    allCustomers?.data?.map((customer) => ({
      value: customer.id,
      label: customer.company_name,
    })) || [];

  const customFilterOption = (option, inputValue) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase());

  const labourCostFields = [
    { name: "labour_cost", label: "Labour cost" },
    { name: "cunsumable_cost", label: "Consumable cost" },
    { name: "transport_cost", label: "Transport cost" },
    { name: "supervision_cost", label: "Supervision cost" },
  ];

  const totalLabourCost = labourCostFields.reduce(
    (sum, item) => sum + Number(costWorkingData[item.name] || 0),
    0
  );

  const totalAreaCost =
    (parseFloat(costWorkingData.labour_cost_area) || 0) +
    (parseFloat(costWorkingData.cunsumable_cost_area) || 0) +
    (parseFloat(costWorkingData.transport_cost_area) || 0) +
    (parseFloat(costWorkingData.supervision_cost_area) || 0);

  const FinanceCost = (
    (parseFloat(costWorkingData.total_material_cost) +
      parseFloat(totalLabourCost)) *
    (costWorkingData?.finance_cost_persantage / 100) *
    costWorkingData?.finance_cost_month
  ).toFixed(2);

  //console.log("FinanceCost + totalLabourCost",parseFloat(FinanceCost) + parseFloat(totalLabourCost));
  const TotalFinanceCost =
    parseFloat(FinanceCost) + parseFloat(totalLabourCost);

  const overhead_charges =
    //costWorkingData?.over_head_charges_area *
    (TotalFinanceCost.toFixed(2) *
      costWorkingData?.over_head_charges_persantage) /
    100;

  const total_application_labour_cost = (
    parseFloat(TotalFinanceCost) + parseFloat(overhead_charges)
  ).toFixed(2);

  const totalApplication_Totalmaterialcost = (
    Number(costWorkingData.total_material_cost || 0) +
    Number(total_application_labour_cost || 0)
  ).toFixed(2);

  const contarctorprofit = (
    totalApplication_Totalmaterialcost *
    (parseFloat(costWorkingData?.contractor_profit_persantage) / 100)
  ).toFixed(2);

  const total_project_cost = (
    parseFloat(totalApplication_Totalmaterialcost) +
    parseFloat(contarctorprofit)
  ).toFixed(2);

  const cost_persqrtmt = (
    total_project_cost / costWorkingData?.area_to_be_coated
  ).toFixed(2);

  return (
    <>
      {/* Flash Messages */}

      {/* Modal Container */}
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px]  rounded-[6px]">
          <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Add Cost Working
          </h2>
          <div className="fixed top-5 right-5 z-50">
            {costWorkingFlashMessage &&
              costWorkingFlashMsgType === "success" && (
                <SuccessMessage message={costWorkingFlashMessage} />
              )}
            {costWorkingFlashMessage && costWorkingFlashMsgType === "error" && (
              <ErrorMessage message={costWorkingFlashMessage} />
            )}
          </div>

          {/* New Code */}
          <div className="p-4 mt-5 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* General Information */}
            <h3 className="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[20px] text-bgData mb-0 text-center mx-auto">
              Cost Working Format
            </h3>
            <div className="border border-gray-400 mx-[2px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-2 gap-y-2">
                {[
                  [
                    {
                      label: "Name of Company",
                      type: "custom-select",
                      name: "company_name",
                    },
                    {
                      label: "Location/Site",
                      type: "conditional-location",
                      name: "location",
                    },
                    {
                      label: "Nature of Work",
                      type: "text",
                      name: "nature_of_work",
                    },
                    {
                      label: "Technology Used",
                      type: "text",
                      name: "technology_used",
                    },
                    // {
                    //   label: "Area in Sq. Mtr.",
                    //   type: "number",
                    //   name: "area_to_be_coated",
                    // },
                    {
                      label: "Total Area (in Sq. Mtr.)",
                      type: "number",
                      name: "area_to_be_coated",
                    },
                    {
                      label: "Thickness in mm",
                      type: "number",
                      name: "thickness_in_mm",
                    },
                  ],
                  [
                    //{ label: "Estimate No", type: "number", name: "estimate_no" },
                    {
                      label: "Estimate Date",
                      type: "date",
                      name: "estimate_date",
                    },
                    {
                      label: "Estimate No",
                      type: "text",
                      name: "estimate_no",
                      defaultValue: "001",
                      readOnly: true,
                    },
                    //{ label: "Revision No", type: "number", name: "revision_no" },
                    {
                      label: "Revision Date",
                      type: "date",
                      name: "revision_date",
                    },
                    {
                      label: "Revision No",
                      type: "text",
                      name: "revision_no",
                      defaultValue: "R00",
                      readOnly: true,
                    },
                  ],
                ].map((fields, tableIndex) => (
                  <div key={tableIndex} className="overflow-x-auto custom-scrollbar">
                    <table className="table-auto w-full text-left border-collapse border border-gray-300">
                      <tbody>
                        {fields.map((field, index) => (
                          <tr
                            key={index}
                            className="hover:bg-gray-50 whitespace-nowrap"
                          >
                            <td className="px-4 py-2 text-gray-900 font-poopins text-[16px] border border-gray-300 font-medium">
                              {field.label}:
                            </td>
                            <td className="px-4 py-2 text-[15px] text-gray-600 border border-gray-300">
                              {/* Custom Select for Company */}
                              {field.type === "custom-select" ? (
                                <>
                                  <Select
                                    options={customerOptions}
                                    value={customerOptions.find(
                                      (option) =>
                                        option.value ===
                                        costWorkingData.company_name
                                    )}
                                    onChange={(selectedOption) =>
                                      handleCostWorkingCustomerChange({
                                        target: {
                                          name: field.name,
                                          value: selectedOption.value,
                                        },
                                      })
                                    }
                                    placeholder="Select the Company"
                                    className="w-full px-0 py-0 border border-gray-400 rounded"
                                    isSearchable
                                    filterOption={customFilterOption}
                                  />
                                  {costWorkingFormErrors?.[field.name] && (
                                    <p className="text-red-500 text-sm">
                                      {costWorkingFormErrors[field.name]}
                                    </p>
                                  )}
                                </>
                              ) : field.type === "conditional-location" ? (
                                <>
                                  {costWorkingData.company_name ? (
                                    <select
                                      name={field.name}
                                      value={costWorkingData[field.name] || ""}
                                      onChange={handleCostWorkingChange}
                                      className="w-full px-2 py-[7px] border border-gray-400 rounded"
                                    >
                                      <option value="">
                                        Select the Address
                                      </option>
                                      {customerAddress?.data?.addresses?.map(
                                        (address, i) => (
                                          <option
                                            key={i}
                                            value={address.location}
                                          >
                                            {address.location}
                                          </option>
                                        )
                                      )}
                                    </select>
                                  ) : (
                                    <span className="text-red-600">
                                      Please Select a company first
                                    </span>
                                  )}
                                  {costWorkingFormErrors?.[field.name] && (
                                    <p className="text-red-500 text-sm">
                                      {costWorkingFormErrors[field.name]}
                                    </p>
                                  )}
                                </>
                              ) : (
                                <>
                                  <input
                                    type={field.type}
                                    name={field.name}
                                    //value={costWorkingData[field.name] || ""}
                                    value={
                                      costWorkingData[field.name] !== undefined
                                        ? costWorkingData[field.name]
                                        : field.defaultValue || ""
                                    }
                                    onChange={handleCostWorkingChange}
                                    className="w-full px-2 py-[6px] border border-gray-400 rounded"
                                    placeholder={`Enter ${field.label}`}
                                    readOnly={field.readOnly}
                                  />
                                  {costWorkingFormErrors?.[field.name] && (
                                    <p className="text-red-500 text-sm">
                                      {costWorkingFormErrors[field.name]}
                                    </p>
                                  )}
                                </>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>

              {/* Materials Table */}
              <div className="overflow-x-auto custom-scrollbar mt-8">
                {/* New Code */}

                <table className="min-w-full border border-gray-300">
                  <thead className="bg-gray-400">
                    <tr>
                      {[
                        "S.N.",
                        "Item",
                        //"HSN Code",
                        "Qty/M²",
                        "Unit",
                        //"Qty for Sq. Mtr.",
                        "Qty. for Total Area (in SqM)",
                        "Std Pak",
                        "Basic Rate",
                        "Basic Amount",
                        "Action",
                      ].map((header, index) => (
                        <th
                          key={index}
                          className={`border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2 ${
                            header === "S.N." ? "text-left" : "text-center"
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody>
                    {/* Section Header: Material Cost */}

                    <tr className="bg-gray-300 text-center">
                      <td className="py-2">
                        <div className="border border-gray-400 w-fit mx-auto px-3 py-0 rounded-[3px] font-poppins font-medium text-[18px]  text-gray-700">
                          A -
                        </div>
                      </td>
                      <td className="py-2 px-4">
                        <div className="border border-gray-400 w-fit px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px]  text-gray-700">
                          Material Cost
                        </div>
                      </td>
                      <td className="py-2"></td>
                      <td className="py-2"></td>
                      <td className="py-2"></td>
                      <td className="py-2"></td>
                      <td className="py-2"></td>
                      {/* <td className="py-2"></td> */}
                      <td colSpan="2" className="py-2">
                        <button
                          type="button"
                          onClick={handleAddCategory}
                          className="bg-bgDataNew text-white px-2 py-1 rounded hover:bg-orange-600"
                        >
                          Category +{/* <FontAwesomeIcon icon={faPlus} /> */}
                        </button>
                      </td>
                    </tr>
                  </tbody>
                  {costWorkingData.products.map((cat, catIndex) => (
                    <tbody key={catIndex}>
                      {/* Subsection Header: Bond Coat */}
                      <tr
                        className="bg-gray-100 font-medium text-left"
                        colSpan="9"
                      >
                        <td className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2">
                          {catIndex + 1}
                        </td>
                        <td className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2">
                          {/* <CategoryAutocomplete
                            allCategories={allCategories}
                            handleProductChange={handleProductChange}
                            index={index}
                          /> */}
                          <input
                            type="text"
                            name="category_name"
                            value={cat.category_name}
                            onChange={(e) => {
                              const updated = [...costWorkingData.products];
                              updated[catIndex].category_name = e.target.value;
                              setCostWorkingData({
                                ...costWorkingData,
                                products: updated,
                              });
                            }}
                            placeholder="Enter Category Name"
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                          />
                        </td>
                        <td className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2">
                          <button
                            onClick={() => handleAddRowInCategory(catIndex)}
                            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded"
                          >
                            Row +
                          </button>
                        </td>
                        <td
                          colSpan="6"
                          className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                        >
                          <button
                            onClick={() => handleRemoveCategory(catIndex)}
                            className="ml-2 px-2 py-1 bg-red-600 text-white rounded"
                          >
                            Category x{/* <FontAwesomeIcon icon={faTrash} /> */}
                          </button>
                        </td>
                      </tr>
                      {cat.items.map((item, itemIndex) => (
                        <tr
                          key={itemIndex}
                          className="text-center hover:bg-gray-200 cursor-pointer"
                        >
                          <td className="border border-gray-300 px-4 py-2 text-textdata text-left"></td>
                          <td
                            className="border border-gray-300 px-4 py-2 text-textdata text-left"
                            colSpan="1"
                          >
                            <select
                              name="product_id"
                              value={item.product_id || ""}
                              onChange={(e) =>
                                handleProductChange(e, catIndex, itemIndex)
                              }
                              className="block w-full rounded-[5px] border px-2 py-1"
                            >
                              <option value="">Select Product</option>
                              {/* {allProducts?.data?.map((prod) => (
                              <option key={prod.id} value={prod.id}>
                                {prod.product_name}
                              </option>
                            ))} */}
                              {allProducts?.data
                                ?.slice() // create a shallow copy to avoid mutating original
                                ?.sort((a, b) =>
                                  a.product_name.localeCompare(b.product_name)
                                )
                                ?.map((prod) => (
                                  <option key={prod.id} value={prod.id}>
                                    {prod.product_name}
                                  </option>
                                ))}
                            </select>
                          </td>
                          {fields.map((f) => (
                            <td
                              key={f.name}
                              className="border border-gray-300 px-4 py-2 text-textdata"
                            >
                              <input
                                type="text"
                                name={f.name}
                                value={item[f.name] || ""}
                                onChange={(e) =>
                                  handleProductChange(e, catIndex, itemIndex)
                                }
                                placeholder={f.placeholder}
                                className="w-full px-2 py-1 border border-gray-300 rounded"
                              />
                            </td>
                          ))}
                          <td className="border border-gray-300 px-4 py-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveRowInCategory(catIndex, itemIndex)
                              }
                              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                              x{/* <FontAwesomeIcon icon={faTrash} /> */}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ))}

                  <tbody>
                    {/* Total Row */}
                    <tr className="bg-gray-100 font-semibold text-black">
                      <td
                        className="px-4 py-2 text-bgDataNew border border-gray-300 text-right"
                        colSpan="6"
                      >
                        Total Material basic Cost :
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        A
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        Rs
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        {costWorkingData.total_material_cost || 0}
                      </td>
                    </tr>

                    {/* Total Row */}
                    <tr className="bg-gray-100 font-semibold text-black">
                      <td
                        className="px-4 py-2 text-bgDataNew border border-gray-300 text-right"
                        colSpan="6"
                      >
                        Per Sq Mtr. Material cost
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        A
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        Per Sq Mtr.
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        {costWorkingData?.cost_per_sqft}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="min-w-full border border-gray-300 mt-14">
                  <thead className="bg-gray-400">
                    <tr>
                      {["", "Description", "Area", "Unit", "Amount"].map(
                        (header, index) => (
                          <th
                            key={index}
                            className={`border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2 ${
                              header === "Description"
                                ? "text-left "
                                : "text-center"
                            }`}
                          >
                            {header}
                          </th>
                        )
                      )}
                    </tr>
                    <tr className="bg-gray-300 text-left">
                      <th className="py-2 px-4 text-left">
                        <div className="border border-gray-400 w-fit px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px] text-gray-700 text-left">
                          B -
                        </div>
                      </th>
                      <th className="py-2 px-4 text-left">
                        <div className="border border-gray-400 w-fit px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px] text-gray-700 text-left">
                          Cost as per project / Site condition
                        </div>
                      </th>
                      <th className="py-2 px-4 text-left"></th>
                      <th className="py-2 px-4 text-left"></th>
                      <th className="py-2 px-4 text-left"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <br />
                    {/* Subsection Header: Bond Coat */}
                    <tr className="bg-gray-300 font-medium text-left">
                      <td
                        colSpan="5"
                        className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                      >
                        B1
                      </td>
                    </tr>
                    {labourCostFields.map((item, index) => (
                      <tr
                        key={index}
                        className="text-center hover:bg-gray-200 cursor-pointer"
                      >
                        <td className="border border-gray-300 px-4 py-2 text-textdata text-left"></td>
                        <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                          {item.label}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 bg-yellow-100 text-center">
                          <input
                            type="number"
                            name={`${item.name}_area`}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                            placeholder="Area"
                            value={costWorkingData[`${item.name}_area`] || ""}
                            onChange={handleCostWorkingChange}
                             min="0"
                          />
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-textdata text-center">
                          {/* <input
                            type="text"
                            className="w-full px-2 py-1 border border-gray-300 rounded bg-gray-100 text-gray-600"
                            value="M2"
                            disabled
                          /> */}
                          M2
                        </td>
                        <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                          <input
                            type="number"
                            name={item.name}
                            className="w-full px-2 py-1 border border-gray-300 rounded"
                            placeholder={`Enter the ${item?.name}` || ""}
                            value={costWorkingData[item.name] || ""}
                            onChange={handleCostWorkingChange}
                             min="0"
                          />
                          {/* Show validation error like your old code */}
                          {costWorkingFormErrors?.[item.name] && (
                            <p className="text-red-500 text-sm text-left mt-1">
                              {costWorkingFormErrors[item.name]}
                            </p>
                          )}
                        </td>
                      </tr>
                    ))}

                    {/* Total Row */}
                    <tr className="bg-gray-100 font-semibold text-black">
                      <td className="px-4 py-2 text-bgDataNew border border-gray-300 text-left"></td>
                      <td className="px-4 py-2 text-bgDataNew border border-gray-300 text-right">
                        B1 - Total :
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        {/* b1 */}
                        {totalAreaCost.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        {/* M2 */}
                        {}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        {totalLabourCost.toFixed(2)}
                        {/* Dynamically calculate total */}
                        {/* {labourCostFields
                          .reduce(
                            (sum, item) =>
                              sum + Number(costWorkingData[item.name]),
                            0
                          )
                          .toFixed(2)} */}
                      </td>
                    </tr>

                    <br />
                    {/* Subsection Header: Bond Coat */}
                    <tr className="bg-gray-300 font-medium text-left">
                      <td
                        colSpan="5"
                        className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                      >
                        B2
                      </td>
                    </tr>
                    <tr className="text-center hover:bg-gray-200 cursor-pointer">
                      <td className="border border-gray-300 p-2  text-center"></td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata text-left w-[400px]">
                        Finance cost
                      </td>
                      <td className="border border-gray-300 p-2 bg-yellow-100 text-center">
                        {/* <input
                          type="number"
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          placeholder="Enter the 1"
                          value="1"
                          disabled
                        /> */}
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            name="finance_cost_month"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                            placeholder="month"
                            value={costWorkingData?.finance_cost_month || ""}
                            onChange={handleCostWorkingChange}
                             min="0"
                          />
                          <span className="text-sm text-gray-600">month</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            name="finance_cost_persantage"
                            className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                            placeholder="%"
                            value={
                              costWorkingData?.finance_cost_persantage || ""
                            }
                            onChange={handleCostWorkingChange}
                             min="0"
                          />
                          <span className="text-sm text-gray-600">%</span>
                        </div>
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                        {FinanceCost}
                      </td>
                    </tr>
                    <tr className="bg-gray-50 font-semibold text-black">
                      <td className="border border-gray-300 p-2 text-center"></td>
                      <td
                        colspan=""
                        className="px-4 py-2 text-bgDataNew border border-gray-300 text-left"
                      >
                        Total Cost :
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        b2
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        M2
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        {TotalFinanceCost.toFixed(2)}
                      </td>
                    </tr>

                    <br />
                    {/* Subsection Header: Bond Coat */}
                    <tr className="bg-gray-300 font-medium text-left">
                      <td
                        colSpan="5"
                        className="border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2"
                      >
                        B3
                      </td>
                    </tr>
                    <tr className="text-center hover:bg-gray-200 cursor-pointer">
                      <td className="border border-gray-300 p-2  text-center"></td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata text-left">
                        Over Head Charges
                      </td>
                      <td className="border border-gray-300 p-2 bg-yellow-100 text-center">
                        <input
                          type="number"
                          name="over_head_charges_area"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="area"
                          value={costWorkingData?.over_head_charges_area || ""}
                          onChange={handleCostWorkingChange}
                           min="0"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata">
                        <input
                          type="number"
                          name="over_head_charges_persantage"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="%"
                          value={
                            costWorkingData?.over_head_charges_persantage || ""
                          }
                          onChange={handleCostWorkingChange}
                           min="0"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata bg-yellow-100">
                        {/* <input
                          type="number"
                          className="w-full px-2 py-1 border border-gray-300 rounded"
                          //placeholder="Enter the 101.76"
                          value={twentyPercentAmount}
                          disabled
                        /> */}
                        {overhead_charges.toFixed(2)}
                      </td>
                    </tr>
                    <tr className="bg-gray-100 font-semibold text-black">
                      <td className="border border-gray-300 p-2  text-center"></td>
                      <td
                        colspan=""
                        className="px-4 py-2 text-bgDataNew border border-gray-300 text-left"
                      >
                        Total application ( Labour) Cost :
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        B=(a+b2+b3)
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        M2
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-white text-center bg-red-400">
                        {total_application_labour_cost}
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table className="min-w-full border border-gray-300 mt-14">
                  <thead className="bg-gray-400">
                    <tr>
                      {[
                        "",
                        "Total",
                        "Unit",
                        "Qty",
                        "Total Project Cost RS",
                      ].map((header, index) => (
                        <th
                          key={index}
                          className={`border text-black border-gray-300 font-poopins font-medium text-[16px] px-4 py-2 ${
                            header === "Total" ? "text-left" : "text-center"
                          }`}
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                    <tr className="bg-gray-300 text-center">
                      <th className="py-2 px-4">
                        <div className="border border-gray-400 w-fit px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px]  text-gray-700">
                          C -
                        </div>
                      </th>
                      <th className="py-2 px-4">
                        <div className="border border-gray-400 w-fit  px-4 py-0 rounded-[3px] font-poppins font-medium text-[18px]  text-gray-700">
                          Project Calculation
                        </div>
                      </th>
                      <th className="py-2 px-4"></th>
                      <th className="py-2 px-4"></th>
                      <th className="py-2 px-4"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="text-center hover:bg-gray-200 cursor-pointer">
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata text-left font-bold text-gray-700">
                        Total Material basic Cost
                      </td>
                      <td className="border border-gray-300 p-2">A</td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata">
                        M2
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata">
                        {costWorkingData.total_material_cost || 0}
                      </td>
                    </tr>
                    <tr className="text-center hover:bg-gray-200 cursor-pointer">
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata text-left font-bold text-gray-700">
                        Total application (Labour) cost
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata">
                        B
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata">
                        M2
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata">
                        {total_application_labour_cost}
                      </td>
                    </tr>
                    <tr className="text-center hover:bg-gray-200 cursor-pointer">
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata text-left font-bold text-gray-700">
                        Total Material + Application basic Cost
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata"></td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata">
                        M2
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata">
                        {totalApplication_Totalmaterialcost}
                      </td>
                    </tr>
                    <tr className="text-center hover:bg-gray-200 cursor-pointer">
                      <td className="border border-gray-300 p-2"></td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata text-left font-bold text-gray-700">
                        Contractor profit
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata">
                        C
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata">
                        <input
                          type="number"
                          name="contractor_profit_persantage"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="%"
                          value={
                            costWorkingData?.contractor_profit_persantage || ""
                          }
                          onChange={handleCostWorkingChange}
                           min="0"
                        />
                      </td>
                      <td className="border border-gray-300 px-4 py-2 text-textdata">
                        {contarctorprofit}
                      </td>
                    </tr>
                    <br />
                    <tr className="bg-gray-100 font-semibold text-black text-center">
                      <td className="border border-gray-300 p-2"></td>
                      <td className="px-4 py-2 font-bold text-gray-700 border border-gray-300 text-left">
                        Total Project Cost :
                      </td>
                      <td className="px-4 py-2 border border-gray-300 font-bold text-gray-600 text-center">
                        A+B+C
                      </td>
                      <td className="px-4 py-2 border border-gray-300 font-bold text-gray-600 text-center">
                        {costWorkingData?.area_to_be_coated}
                      </td>
                      <td className="px-4 py-2 border border-gray-300 font-bold text-gray-600 text-center">
                        {total_project_cost}
                      </td>
                    </tr>
                    <tr className="bg-gray-100 font-semibold text-black text-center">
                      <td className="border border-gray-300 p-2"></td>
                      <td className="px-4 py-2 text-bgDataNew border border-gray-300 text-left">
                        Total Project Cost Per M2 :
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        M2
                      </td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center"></td>
                      <td className="px-4 py-2 border border-gray-300 text-bgDataNew text-center">
                        {cost_persqrtmt}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="min-w-full border border-gray-300 mt-14">
                  <tbody>
                    <br />
                    {/* Subsection Header: Bond Coat */}
                    <tr className="bg-gray-100 font-semibold text-black">
                      <td
                        colspan="8"
                        className="px-4 py-2 text-bgDataNew border border-gray-300 text-left"
                      >
                        Note
                      </td>
                    </tr>

                    <tr className="text-center hover:bg-gray-200 cursor-pointer">
                      <td
                        colspan="8"
                        className="border border-gray-300 p-2 bg-yellow-100 text-center"
                      >
                        <textarea
                          rows={4}
                          name="notes"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-left"
                          placeholder="Please Enter........."
                          value={costWorkingData?.notes || ""}
                          onChange={handleCostWorkingChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="min-w-full border border-gray-300 mt-14">
                  <tbody>
                    <br />
                    {/* Subsection Header: Bond Coat */}
                    <tr className="bg-gray-100 font-semibold text-black">
                      <td
                        colspan="5"
                        className="px-4 py-2 text-bgDataNew border border-gray-300 text-left"
                      >
                        for Dimple Chemicals & Services Pvt. Ltd
                      </td>
                    </tr>
                    {/* Header Row */}
                    <tr className="text-center bg-gray-300 font-semibold">
                      <td className="border border-gray-400 p-2">
                        Approved By
                      </td>
                      <td className="border border-gray-400 p-2">Checked By</td>
                      <td className="border border-gray-400 p-2">
                        DCPL Representative
                      </td>
                      <td className="border border-gray-400 p-2">
                        Prepared By
                      </td>
                    </tr>
                    <tr className="text-center hover:bg-gray-200 cursor-pointer">
                      <td className="border border-gray-300 p-2 bg-yellow-100 text-center">
                        <textarea
                          name="approved_by"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="Approved by"
                          value={costWorkingData?.approved_by || ""}
                          onChange={handleCostWorkingChange}
                        />
                      </td>
                      <td className="border border-gray-300 p-2 bg-yellow-100 text-center">
                        <textarea
                          name="checked_by"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="Checked by"
                          value={costWorkingData?.checked_by || ""}
                          onChange={handleCostWorkingChange}
                        />
                      </td>
                      <td className="border border-gray-300 p-2 bg-yellow-100 text-center">
                        <textarea
                          name="dcpl_representative"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="DCPL Representative"
                          value={costWorkingData?.dcpl_representative || ""}
                          onChange={handleCostWorkingChange}
                        />
                      </td>
                      <td className="border border-gray-300 p-2 bg-yellow-100 text-center">
                        <textarea
                          name="prepared_by"
                          className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                          placeholder="Prepared by"
                          value={costWorkingData?.prepared_by || ""}
                          onChange={handleCostWorkingChange}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Submit and Close Buttons */}
          <div className="flex items-end justify-end gap-2 px-4 my-4">
            <button
              type="submit"
              className="bg-bgDataNew text-white px-3 py-2 rounded hover:bg-[#cb6f2ad9]"
              onClick={handleSubmitCostWorking}
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setIsCostWorkingModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCostWorkingModal;
