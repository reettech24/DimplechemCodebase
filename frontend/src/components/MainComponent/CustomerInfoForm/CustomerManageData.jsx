import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CustomerManageData.css";
import { iconsImgs } from "../../../utils/images";
import CustomerTable from "./CustomerTable";
import Pagination from "./Pagination";
import ViewCustomerInfoReport from "./ViewCustomerInfoReport";
import ContentTop from "../../ContentTop/ContentTop";
import { listCustomers } from "../../../redux/customerSlice";
import { fetchCurrentUser } from "../../../redux/authSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const CustomerManageData = () => {
  const dispatch = useDispatch();
  const { customers, totalPages, customerLoading, customerError } = useSelector(
    (state) => state.customer
  );

  const { user: userDeatail } = useSelector((state) => state.auth);

  const [selectedCustomer, setSelectedCustomer] = useState({});

  const [isViewModalOpen, setViewModalOpen] = useState(false);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  // Fetch customers whenever searchTerm or currentPage changes
  useEffect(() => {
    //dispatch(fetchCurrentUser());

    dispatch(
      listCustomers({
        page: currentPage,
        limit: customersPerPage,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, searchTerm]);

  const fetchCustomerHistory = async (id) => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(`${API_URL}/auth/customer-info/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSelectedCustomer(response.data.data);
      //console.log("responsec", response.data.data);
      //return response.data; // Return data if needed
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  //if (customerError) return <p>{customerError}</p>;
  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div className="md:mb-0 mb-2">
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Customer Information Form
            </h1>
          </div>
          <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
            <div>
              <input
                type="search"
                className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                placeholder="Search"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>
        </div>
        <div className="main-content-holder max-h-[460px] heightfixalldevice overflow-y-auto scrollbar-hide">
          <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
            {/*------- Table Data Start -------*/}
            <CustomerTable
              customers={customers?.data}
              setViewModalOpen={setViewModalOpen}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              fetchCustomerHistory={fetchCustomerHistory}
            />

            {/*------- Table Data End -------*/}
          </div>

          {/* View User Modal */}
          {isViewModalOpen && (
            <ViewCustomerInfoReport
              setViewModalOpen={setViewModalOpen}
              selectedCustomer={selectedCustomer}
            />
          )}

          {/* Assign Customer Modal */}
        </div>
        {/* Pagination Controls with Number */}
        <Pagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default CustomerManageData;
