import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SuccessMessage from "../../AlertMessage/SuccessMessage";
import ErrorMessage from "../../AlertMessage/ErrorMessage";
import { fetchAllProducts } from "../../../redux/productSlice";
import { fetchAllCategories } from "../../../redux/categorySlice";
import CategoryAutocomplete from "./CategoryAutocomplete";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const EditAnnualReport = ({
  userDeatail,
  setIsEditABPModalOpen,
  selectedABP,
  editAbpData,
  setEditAbpData,
  editFormErrors,
  setEditFormErrors,
  editFlashMessage,
  editFlashMsgType,
  handleEditFlashMessage,
  handleEditABPChange,
  handleEditABPSubmit,
  allCustomers,
  customerAddress,
  handleEditABPCustomerChange,
}) => {
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

  // Function to add a new product entry
  const handleAddProduct = () => {
    setEditAbpData((prevData) => ({
      ...prevData,
      products: [
        ...prevData.products,
        {
          technology_used: "",
          product_id: "",
          qty: "",
          rate: "",
          value_in_rs: "",
          gst_amt: "",
          gross_sale_include_gst: "",
          commission: "",
          net_sale: "",
        },
      ],
    }));
    setProductOptions((prev) => [...prev, []]);
  };

  const [productOptions, setProductOptions] = useState([]); // dynamic products for each category

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
      //console.log(response.data.data);

      return response.data.data; // assuming your API responds with { data: [...] }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadProductOptionsForEdit = async () => {
      const optionsArray = [...productOptions]; // clone

      for (let i = 0; i < editAbpData?.products?.length; i++) {
        const prod = editAbpData?.products[i];
        if (prod.technology_used) {
          const products = await fetchProductsByCategory(prod.technology_used);
          optionsArray[i] = products;
        }
      }

      setProductOptions(optionsArray);
    };

    if (editAbpData?.products?.length > 0) {
      loadProductOptionsForEdit();
    }
  }, [editAbpData?.products]);

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...editAbpData.products];
    updatedProducts.splice(index, 1);

    setEditAbpData({
      ...editAbpData,
      products: updatedProducts,
    });
  };

  const handleProductChange = async (e, index) => {
    const { name, value } = e.target;

    const updatedProducts = [...editAbpData.products];
    const productToUpdate = { ...updatedProducts[index] };

    // Update the selected field value
    productToUpdate[name] = value;

    // Get latest values — use value from event if it's qty, rate, gst_amt or commission
    const quantity =
      name === "qty" ? parseFloat(value) : parseFloat(productToUpdate.qty) || 0;
    const rate =
      name === "rate"
        ? parseFloat(value)
        : parseFloat(productToUpdate.rate) || 0;
    const gstPercent =
      name === "gst_percent"
        ? parseFloat(value)
        : parseFloat(productToUpdate.gst_percent) || 0;
    const commission =
      name === "commission"
        ? parseFloat(value)
        : parseFloat(productToUpdate.commission) || 0;

    const valueInRs = quantity * rate;
    // const gstAmt = (gstPercent / 100) * valueInRs;
    const gstAmt = parseFloat(((gstPercent / 100) * valueInRs).toFixed(2));
    const grossSale = valueInRs + gstAmt;
    const netSale = grossSale - commission;

    productToUpdate.value_in_rs = valueInRs || 0;
    productToUpdate.gst_amt = gstAmt || 0;
    productToUpdate.gross_sale_include_gst = grossSale || 0;
    productToUpdate.net_sale = netSale || 0;

    // Replace updated product in the array
    updatedProducts[index] = productToUpdate;

    // If category changed, fetch new product list for this row
    if (name === "technology_used") {
      const products = await fetchProductsByCategory(value);
      //console.log("products",products);
      setProductOptions((prev) => {
        const updatedOptions = [...prev];
        updatedOptions[index] = products;
        return updatedOptions;
      });
    }

    // Update the overall state
    setEditAbpData({
      ...editAbpData,
      products: updatedProducts,
    });
  };

  const fields = [
    { name: "qty", placeholder: "Qty.", type: "number" },
    { name: "rate", placeholder: "Rate", type: "number" },
    {
      name: "value_in_rs",
      placeholder: "Value in Rs.",
      type: "number",
      disabled: true,
    },
    { name: "gst_percent", placeholder: "GST %", type: "number" }, // new field for GST percentage
    { name: "gst_amt", placeholder: "GST Amt", type: "number", disabled: true }, // now separate
    {
      name: "gross_sale_include_gst",
      placeholder: "Gross Sale including GST",
      type: "number",
      disabled: true,
    },
    { name: "commission", placeholder: "Commission", type: "number" },
    {
      name: "net_sale",
      placeholder: "Net Sale including GST",
      type: "number",
      disabled: true,
    },
  ];

  // const fields = [
  //   { name: "qty", placeholder: "Qty." },
  //   { name: "rate", placeholder: "Rate" },
  //   { name: "value_in_rs", placeholder: "Value in Rs." },
  //   { name: "gst_amt", placeholder: "GST Amt" },
  //   { name: "gross_sale_include_gst", placeholder: "Gross Sale including GST" },
  //   { name: "commission", placeholder: "Commission" },
  //   { name: "net_sale", placeholder: "Net Sale including GST " },
  // ];

  const customerOptions =
    allCustomers?.data?.map((customer) => ({
      value: customer.id,
      label: customer.company_name,
    })) || [];

  const customFilterOption = (option, inputValue) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase());

  const productOptionsLists =
    allProducts?.data?.map((product) => ({
      value: product.id,
      label: product.product_name,
    })) || [];

  const customProductFilterOption = (option, inputValue) =>
    option.label.toLowerCase().startsWith(inputValue.toLowerCase());

  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileRef = useRef(null);

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const departmentOptions = [
    { value: "IT", label: "IT" },
    { value: "HR", label: "HR" },
    { value: "Sales", label: "Sales" },
    { value: "Marketing", label: "Marketing" },
  ];

  return (
    <>
      {/* Modal Container */}
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px]  rounded-[6px]">
          <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Update Report
          </h2>

          <div className="fixed top-5 right-5 z-50">
            {editFlashMessage && editFlashMsgType === "success" && (
              <SuccessMessage message={editFlashMessage} />
            )}
            {editFlashMessage && editFlashMsgType === "error" && (
              <ErrorMessage message={editFlashMessage} />
            )}
          </div>

          <div className="p-4 mt-2 overflow-y-auto max-h-[calc(100vh-200px)]">
            <h3 className="mt-2 mb-2 text-bgDataNew font-poppins border w-[300px] font-medium text-[20px] text-bgData mb-0 text-center mx-auto">
              Annual Business Plan
            </h3>
            <h3 className="mt-2 mb-8 text-bgDataNew font-poppins border w-[540px] font-medium text-[17px] text-bgData mb-0 text-center mx-auto">
              Business Plan for the year {new Date().getFullYear()}-{new Date().getFullYear() + 1} for Work Execution
            </h3>

            <div className="w-100 flex items-start justify-between px-0 mt-12 ">
              <div className="bg-[#e5e7eb38] rounded-[5px] w-[450px]">
                <table className="w-full border border-gray-300 text-sm table-fixed">
                  <tbody>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600 w-[40%]">
                        Name of Employee
                      </td>
                      <td className="py-2 text-right align-middle w-[5%]">:</td>
                      <td className="py-2 px-4 text-right text-gray-800 w-[40%]">
                        {userDeatail?.fullname}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-200">
                      <td className="py-2 px-4 text-left font-bold text-gray-600">
                        Employee code
                      </td>
                      <td className="py-2 text-right align-middle">:</td>
                      <td className="py-2 px-4 text-right text-gray-800">
                        {userDeatail?.emp_id}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex flex-col items-start">
                  <select
                    name="for_month"
                    value={editAbpData.for_month || ""}
                    disabled
                    //onChange={handleEditABPChange}
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                  >
                    <option value="">Select Duration</option>

                    <option value={3}>3 month</option>
                    <option value={6}>6 month</option>
                    <option value={9}>9 month</option>
                    <option value={12}>12 month</option>
                  </select>
                </div>
                <div>
                  <FontAwesomeIcon
                    icon={faChevronDown}
                    className="text-white text-[12px] mb-[2px]"
                  />
                </div>
              </div>

              {/* <span className="notification-btn-dot"></span> */}
            </div>

            <div className="mt-8 overflow-auto">
              <h3 class="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[18px] text-bgData mb-0 text-center mx-auto capitalize">
                {" "}
                Customer Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-x-4 gap-y-2 px-1 mt-2">
                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Customer Name :
                  </label>
                  <Select
                    options={customerOptions}
                    value={customerOptions.find(
                      (option) => option.value === editAbpData.customer_id
                    )}
                    onChange={(selectedOption) =>
                      handleEditABPCustomerChange({
                        target: {
                          name: "customer_id",
                          value: selectedOption.value,
                        },
                      })
                    }
                    placeholder="Select the Customer"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] py-[0.8px]"
                    isSearchable
                    filterOption={customFilterOption}
                  />
                  {editFormErrors?.customer_id && (
                    <p className="text-red-500">
                      {editFormErrors?.customer_id}
                    </p>
                  )}
                  {/* <Select
                    options={customerOptions}
                    placeholder="Select Customer"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] py-[0.8px]"
                  /> */}
                </div>

                {/* Select Address */}

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Select Location Site:
                  </label>
                  <select
                    name="location"
                    value={editAbpData?.location || ""}
                    onChange={handleEditABPChange}
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                  >
                    <option value="">Select the Address</option>
                    {customerAddress?.data?.addresses?.map((address, index) => (
                      <option key={index} value={address.location}>
                        {address.location}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData ">
                    Business Associate code
                  </label>
                  :{" "}
                  <select
                    name="associate_id"
                    value={editAbpData.associate_id || ""}
                    onChange={handleEditABPChange}
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                  >
                    <option value="">Select the BA</option>
                    {customerAddress?.data?.business_associates?.map(
                      (associate, index) => (
                        <option key={index} value={associate.id}>
                          {associate.code}
                        </option>
                      )
                    )}
                  </select>
                   {editFormErrors?.associate_id && (
                    <p className="text-red-500">
                      {editFormErrors?.associate_id}
                    </p>
                  )}
                </div>

                {/* <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Country :
                  </label>
                  <Select
                    //options={countryOptions}
                    placeholder="Select Country"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] py-[0.8px]"
                  />
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    State :
                  </label>
                  <Select
                    //options={stateOptions}
                    placeholder="Select State"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] py-[0.8px]"
                  />
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    City :
                  </label>
                  <Select
                    //options={cityOptions}
                    placeholder="Select City"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] py-[0.8px]"
                  />
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Location :
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder=""
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Department :
                  </label>
                  <Select
                    options={departmentOptions}
                    placeholder="Select Department"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] py-[0.8px]"
                  />
                </div> */}

                <div>
                  <label>Contact Person Name</label>
                  <select
                    name="contact_person_id"
                    value={editAbpData?.contact_person_id || ""}
                    onChange={handleEditABPChange}
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
                  {editFormErrors?.contact_person_id && (
                    <p className="text-red-500">
                      {editFormErrors?.contact_person_id}
                    </p>
                  )}
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Project Name / Application Area :
                  </label>
                  <input
                    name="project_name"
                    value={editAbpData.project_name || ""}
                    onChange={handleEditABPChange}
                    type="text"
                    placeholder="Project Name / Application Area"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  />
                  {editFormErrors?.project_name && (
                    <p className="text-red-500">
                      {editFormErrors?.project_name}
                    </p>
                  )}
                </div>

                {/* <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Designation :
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="number"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Phone No. :
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="number"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  />
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Email ID :
                  </label>
                  <input
                    type="text"
                    name="company_name"
                    placeholder="number"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  />
                </div> */}

                {/* <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Technology :
                  </label>
                  <Select
                    //options={technologyOptions}
                    placeholder="Select Technology"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] py-[0.8px]"
                  />
                </div> */}

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Approx Area in SqM :
                  </label>
                  <input
                    name="area_mtr2"
                    value={editAbpData.area_mtr2 || ""}
                    onChange={handleEditABPChange}
                    type="number"
                     min="0"
                    placeholder="Area in SqM"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  />
                  {editFormErrors?.area_mtr2 && (
                    <p className="text-red-500">{editFormErrors?.area_mtr2}</p>
                  )}
                </div>

                <div>
                  <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                    Business Potential :
                  </label>
                  <input
                    name="buisness_potential"
                    value={editAbpData.buisness_potential || ""}
                    onChange={handleEditABPChange}
                    type="number"
                     min="0"
                    placeholder="Business Potential"
                    className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                  />
                  {editFormErrors?.buisness_potential && (
                    <p className="text-red-500">
                      {editFormErrors?.buisness_potential}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 overflow-auto">
              <h3 class="-mb-0 text-black font-poppins border bg-gray-400 py-1 rounded-t-[4px] font-medium text-[18px] text-bgData mb-0 text-center mx-auto capitalize">
                {" "}
                Product Details
              </h3>
              <div className="px-4">
                {editAbpData.products.map((product, index) => (
                  <>
                    <h3 className=" text-bgDataNew font-poppins font-medium text-textdatanew text-bgData mt-5">
                      Product {index + 1} :
                    </h3>
                    <div
                      key={index}
                      className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2"
                    >
                      {/* category drop down */}
                      {/* <CategoryAutocomplete
                        allCategories={allCategories}
                        handleProductChange={handleProductChange}
                        index={index}
                        product={product}
                      /> */}

                      <input
                        type="text"
                        name="technology_used"
                        value={product?.technology_used || ""}
                        onChange={(e) => handleProductChange(e, index)}
                        placeholder="Technology Used"
                        className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                      />

                      {/* Product ID as Dropdown */}
                      {/* <select
                        name="product_id"
                        value={product.product_id || ""}
                        onChange={(e) => handleProductChange(e, index)}
                        className="block w-full rounded-[5px] border px-3 py-2"
                      >
                        <option value="">Select Product</option>
                        {allProducts?.data?.map((prod, index) => (
                          <option key={prod?.id} value={prod?.id}>
                            {prod?.product_name}
                          </option>
                        ))} */}
                        {/* {productOptions[index]?.map((prod) => (
                          <option key={prod.id} value={prod.id}>
                            {prod.product_name}
                          </option>
                        ))} */}
                      {/* </select> */}

                      <Select
                        options={productOptionsLists}
                        value={productOptionsLists.find(
                          (option) => option.value === product.product_id
                        )}
                        onChange={(selectedOption) =>
                          handleProductChange(
                            {
                              target: {
                                name: "product_id",
                                value: selectedOption
                                  ? selectedOption.value
                                  : "",
                              },
                            },
                            index
                          )
                        }
                        placeholder="Select Product"
                        className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] py-[0.8px]"
                        isSearchable
                        isClearable
                        filterOption={customProductFilterOption}
                      />

                      {fields.map(({ name, placeholder, type, disabled }) =>
                        type === "select" ? (
                          <select
                            key={name}
                            name={name}
                            value={product[name] || ""}
                            onChange={(e) => handleProductChange(e, index)}
                            className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                          >
                            <option value="">Select GST %</option>
                            <option value="5">5%</option>
                            <option value="12">12%</option>
                            <option value="18">18%</option>
                            <option value="28">28%</option>
                          </select>
                        ) : (
                          <input
                            key={name}
                            type={type}
                            name={name}
                            value={product[name] || ""}
                            onChange={(e) => handleProductChange(e, index)}
                            placeholder={placeholder}
                            className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] px-3 py-2"
                            disabled={disabled}
                          />
                        )
                      )}
                      {/* {fields.map(({ name, placeholder }) => (
                      <input
                        key={name}
                        type="text"
                        name={name}
                        value={product[name] || ""}
                        onChange={(e) => handleProductChange(e, index)}
                        placeholder={placeholder}
                        className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                      />
                    ))} */}

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Remove Product Field
                      </button>
                      {/* <div>
                        <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                          Product Name :
                        </label>
                        <input
                          type="text"
                          name="company_name"
                          placeholder="Product Name"
                          className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                          Qty. :
                        </label>
                        <input
                          type="number"
                          name="company_name"
                          placeholder="Qty."
                          className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                          Rate :
                        </label>
                        <input
                          type="number"
                          name="company_name"
                          placeholder="Rate"
                          className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                          Value in Rs. :
                        </label>
                        <input
                          type="number"
                          name="company_name"
                          placeholder="Value in Rs."
                          className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                          GST Amt :
                        </label>
                        <input
                          type="number"
                          name="company_name"
                          placeholder="GST Amt"
                          className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                          Gross Sale including GST :
                        </label>
                        <input
                          type="number"
                          name="company_name"
                          placeholder="Gross Sale including GST"
                          className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                          Commission :
                        </label>
                        <input
                          type="number"
                          name="company_name"
                          placeholder="Commission"
                          className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                      </div>

                      <div>
                        <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                          Net Sale including GST :
                        </label>
                        <input
                          type="number"
                          name="company_name"
                          placeholder="Net Sale including GST"
                          className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2"
                        />
                      </div> */}
                    </div>
                  </>
                ))}
                {/* Add Product Button */}
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="bg-bgDataNew text-white px-3 py-2 rounded hover:bg-orange-600 mt-2"
                >
                  Add Product
                </button>
              </div>
            </div>

            {/* comment section */}
            <div className="mt-8 overflow-auto">
              <div>
                <label className="font-poppins font-medium text-textdata whitespace-nowrap text-bgData">
                  Product Comment :
                </label>
                <textarea
                  name="comment"
                  value={editAbpData.comment || ""}
                  onChange={handleEditABPChange}
                  placeholder="Business Potential"
                  className="block w-full mb-2 rounded-[5px] border border-solid border-[#473b33] focus:border-[#473b33] dark:focus:border-[#473b33] px-3 py-2 resize-none"
                />

                {editFormErrors?.comment && (
                  <p className="text-red-500">{editFormErrors?.comment}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-end justify-end gap-2 px-4 my-4">
            <button
              type="submit"
              className="bg-bgDataNew text-white px-3 py-2 rounded hover:bg-[#cb6f2ad9]"
              onClick={handleEditABPSubmit}
            >
              Submit
            </button>
            <button
              type="button"
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setIsEditABPModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAnnualReport;
