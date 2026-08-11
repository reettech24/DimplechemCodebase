import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ProductManageData.css";
import { iconsImgs } from "../../../utils/images";
import ProductTable from "./ProductTable";
import Pagination from "./Pagination";
import AddProductModal from "./AddProductModal";
import ViewProductModal from "./ViewProductModal";
import EditProductModal from "./EditProductModal";
import ContentTop from "../../ContentTop/ContentTop";
import {
  listProducts,
  addProduct,
  updateProduct,
  removeProduct,
} from "../../../redux/productSlice";

import { fetchCurrentUser } from "../../../redux/authSlice";
import { useUserPermissionCheck } from "../../hooks/useUserPermissionCheck";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const ProductManageData = () => {
  const { hasPermission, isLoading, isError } = useUserPermissionCheck();
  
  const dispatch = useDispatch();
  const { products, totalPages, productLoading, productError } = useSelector(
    (state) => state.product
  );

  const { user: userDeatail } = useSelector((state) => state.auth);

  //console.log("login user", userDataWithRole);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState({});

  const [isAddProductModalOpen, setAddProductModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditProductModalOpen, setEditProductModalOpen] = useState(false);

  //-------- New Pagination Code Start --------//
  const [entriesPerPageNewData, setEntriesPerPageNewData] = useState(20);
  //-------- New Pagination Code End --------//

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ProductsPerPage = entriesPerPageNewData ? entriesPerPageNewData : 20;

  // Fetch Products whenever searchTerm or currentPage changes
  useEffect(() => {
    //dispatch(fetchCurrentUser());

    dispatch(
      listProducts({
        page: currentPage,
        limit: ProductsPerPage,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, searchTerm, entriesPerPageNewData]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  //add Product functinality===============================================================
  const [formData, setFormData] = useState({
    product_name: "",
    HSN_code: "",
    stock: "",
    unit: "",
    rate: "",
    product_description: "",
    status: "",
    category_id: "",
    area_mtr2: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [flashMessage, setFlashMessage] = useState("");
  const [flashMsgType, setFlashMsgType] = useState("");

  const handleFlashMessage = (message, type) => {
    setFlashMessage(message);
    setFlashMsgType(type);
    setTimeout(() => {
      setFlashMessage("");
      setFlashMsgType("");
    }, 1000);
  };

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    // Clear error when user types
    setFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateInputs = () => {
    let errors = {};

    if (!formData.product_name.trim())
      errors.product_name = "*Product name is required";
    //if (!formData.HSN_code.trim()) errors.HSN_code = "*HSN Code is required";
    if (!formData.stock.trim()) errors.stock = "*Stock is required";
    if (!formData.unit.trim()) errors.unit = "*Unit is required";
    if (!formData.rate.trim()) errors.rate = "*Rate is required";
    if (!formData.product_description.trim())
      errors.product_description = "*Product description is required";
    if (!formData.status.trim()) errors.status = "*Status is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitAddProduct = async (e) => {
    e.preventDefault();
    if (validateInputs()) {
      try {
        const response = await dispatch(addProduct(formData)).unwrap();
        //console.log(response);
        if (response?.success) {
          handleFlashMessage(response?.message, "success");
          //dispatch(listProducts());
          dispatch(
            listProducts({
              page: currentPage,
              limit: ProductsPerPage,
              search: searchTerm,
            })
          );
          setTimeout(() => {
            setAddProductModalOpen(false);
          }, 1000);
        } else {
          handleFlashMessage(
            response?.message || "Something went wrong",
            "error"
          );
        }
      } catch (error) {
        console.error("Error adding Product:", error?.message);
        handleFlashMessage(error?.message , "error");
      }
    }
  };

  //end add Product functinality==========================================================================

  //edit Product function=================================================================================

  const [editFormData, setEditFormData] = useState({
    product_name: "",
    HSN_code: "",
    stock: "",
    unit: "",
    rate: "",
    product_description: "",
    status: "",
    category_id: "",
    area_mtr2: "",
  });

  const [editFormErrors, setEditFormErrors] = useState({});
  const [editFlashMessage, setEditFlashMessage] = useState("");
  const [editFlashMsgType, setEditFlashMsgType] = useState("");

  // Update form data when a Product is selected for editing
  useEffect(() => {
    if (selectedProduct) {
      setEditFormData({
        product_name: selectedProduct.product_name || "",
        HSN_code: selectedProduct.HSN_code || "",
        stock: selectedProduct.stock || "",
        unit: selectedProduct.unit || "",
        rate: selectedProduct.rate || "",
        product_description: selectedProduct.product_description || "",
        status: selectedProduct.status || "",
        category_id: selectedProduct.category_id || "",
        area_mtr2: selectedProduct.area_mtr2 || "",
      });
    }
  }, [selectedProduct]);

  const handleEditFlashMessage = (message, type) => {
    setEditFlashMessage(message);
    setEditFlashMsgType(type);
    setTimeout(() => {
      setEditFlashMessage("");
      setEditFlashMsgType("");
    }, 1000);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({ ...prevData, [name]: value }));
    setEditFormErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateEditInputs = () => {
    let errors = {};

    if (!editFormData.product_name.trim())
      errors.product_name = "*Product name is required";
    //if (!editFormData.HSN_code) errors.HSN_code = "*HSN code is required";
    if (!editFormData.stock) errors.stock = "*Stock is required";
    if (!editFormData.unit.trim()) errors.unit = "*Unit is required";
    if (!editFormData.rate) errors.rate = "*Rate is required";
    if (!editFormData.product_description.trim())
      errors.product_description = "*Product description is required";
    if (!editFormData.status) errors.status = "*Status is required";

    setEditFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (validateEditInputs()) {
      try {
        //console.log("editFormData",editFormData);
        const response = await dispatch(
          updateProduct({
            id: selectedProduct.id,
            ProductData: editFormData,
          })
        ).unwrap();

        if (response.success) {
          handleEditFlashMessage(response.message, "success");
          dispatch(
            listProducts({
              page: currentPage,
              limit: ProductsPerPage,
              search: searchTerm,
            })
          );
          setTimeout(() => {
            setEditProductModalOpen(false);
          }, 1000);
        } else {
          handleEditFlashMessage(
            response?.message || "Something went wrong",
            "error"
          );
        }
      } catch (error) {
        handleEditFlashMessage(error.message || "An error occurred", "error");
      }
    }
  };

  //end edit Product function==============================================================================

  // delete Product =======================================================================================
  // const [deleteFlashMessage, setDeleteFlashMessage] = useState("");
  // const [deleteFlashMsgType, setDeleteFlashMsgType] = useState("");

  // // Function to show flash messages for delete actions
  // const handleDeleteFlashMessage = (message, type) => {
  //   setDeleteFlashMessage(message);
  //   setDeleteFlashMsgType(type);
  //   setTimeout(() => {
  //     setDeleteFlashMessage("");
  //     setDeleteFlashMsgType("");
  //   }, 3000); // Hide the message after 3 seconds
  // };

  // const handleDelete = async (id) => {
  //   try {
  //     await dispatch(removeProduct(id)).unwrap();
  //     handleDeleteFlashMessage("Product Status Updated successfully!", "success");
  //     dispatch(
  //       listProducts({
  //         page: currentPage,
  //         limit: ProductsPerPage,
  //         search: searchTerm,
  //       })
  //     );
  //   } catch (error) {
  //     handleDeleteFlashMessage(
  //       error?.message || "Failed to update status Product",
  //       "error"
  //     );
  //   }
  // };

  //end delete Product ========================================================================

  const handleDeactive = async (id) => {
    try {
      await dispatch(removeProduct(id)).unwrap();
      dispatch(
        listProducts({
          page: currentPage,
          limit: ProductsPerPage,
          search: searchTerm,
        })
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleExportData = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(`${API_URL}/auth/products-export`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          search: searchTerm,
        },
        responseType: "blob", // ✅ Important to keep it here
      });

      // ✅ Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // ✅ Create a temporary <a> tag to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Products.xlsx"); // File name
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup after download
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  //if (ProductLoading) return <p>Loading...</p>;
  //if (ProductError) return <p>{ProductError}</p>;

  return (
    <div className="main-content">
      <ContentTop />
      <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide mb-4">
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
            <div className="md:mb-0 mb-2">
              <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
                Product Management
              </h1>
            </div>
            <div className="flex items-center flex-row gap-[8px] md:gap-[5px]">
              <div className="">
                <input
                  type="search"
                  className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              <div>
                {hasPermission(11, 1) && (
                <button
                  className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                  onClick={() => setAddProductModalOpen(true)}
                >
                  <img
                    src={iconsImgs.plus}
                    alt="plus icon"
                    className="w-[18px] mr-1"
                  />{" "}
                  Add Product
                </button>
                )}
              </div>
              <div>
                <button
                  className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                  onClick={handleExportData}
                >
                  Export Data
                </button>
              </div>
            </div>
          </div>
          <div className="main-content-holder max-h-[460px] heightfixalldevice overflow-y-auto scrollbar-hide">
            <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
              {/*--------- New Pagination Code Start  ---------*/}
              <div className="flex justify-end items-center mb-5 text-white rounded-md font-sans gap-10">
                <div className="flex items-center">
                  <span className="text-sm text-white bg-[#473b33] rounded-l-[5px] flex items-center text-center px-3 h-8">
                    Show Data
                  </span> 
                  <div className="relative cursor-pointer">
                    <select
                      className="appearance-none cursor-pointer h-8 pr-8 pl-5 rounded-r-[5px] bg-[#3d3d57] text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                      value={entriesPerPageNewData}
                      onChange={(e) =>
                        setEntriesPerPageNewData(Number(e.target.value))
                      }
                    >
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={75}>75</option>
                      <option value={100}>100</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-300">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              {/*--------- New Pagination Code End  ---------*/}
              {/*------- Table Data Start -------*/}
              <ProductTable
                Products={products?.data}
                setEditProductModalOpen={setEditProductModalOpen}
                setViewModalOpen={setViewModalOpen}
                selectedProduct={selectedProduct}
                setSelectedProduct={setSelectedProduct}
                setIsAssignModalOpen={setIsAssignModalOpen}
                // deleteFlashMessage={deleteFlashMessage}
                // deleteFlashMsgType={deleteFlashMsgType}
                // handleDeleteFlashMessage={handleDeleteFlashMessage}
                handleDeactive={handleDeactive}
              />

              {/*------- Table Data End -------*/}
            </div>
          </div>
         
        </div>

        {/* Add User Modal */}
        {isAddProductModalOpen && (
          <AddProductModal
            setAddProductModalOpen={setAddProductModalOpen}
            handleSubmitAddProduct={handleSubmitAddProduct}
            formData={formData}
            setFormData={setFormData}
            handleChange={handleChange}
            setFormErrors={setFormErrors}
            formErrors={formErrors}
            flashMessage={flashMessage}
            setFlashMessage={setFlashMessage}
            setFlashMsgType={setFlashMsgType}
            flashMsgType={flashMsgType}
          />
        )}

        {/* Edit User Modal */}
        {isEditProductModalOpen && (
          <EditProductModal
            setEditProductModalOpen={setEditProductModalOpen}
            selectedProduct={selectedProduct}
            setSelectedProduct={setSelectedProduct}
            editFormData={editFormData}
            setEditFormData={setEditFormData}
            editFormErrors={editFormErrors}
            setEditFormErrors={setEditFormErrors}
            editFlashMessage={editFlashMessage}
            setEditFlashMessage={setEditFlashMessage}
            editFlashMsgType={editFlashMsgType}
            setEditFlashMsgType={setEditFlashMsgType}
            handleEditChange={handleEditChange}
            handleEditSubmit={handleEditSubmit}
          />
        )}

        {/* View User Modal */}
        {isViewModalOpen && (
          <ViewProductModal
            setViewModalOpen={setViewModalOpen}
            selectedProduct={selectedProduct}
          />
        )}

        {/* Assign Product Modal */}
      </div>
       {/* Pagination Controls with Number */}
          <Pagination
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          />
    </div>
  );
};

export default ProductManageData;