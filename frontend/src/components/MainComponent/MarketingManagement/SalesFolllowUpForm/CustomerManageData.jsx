import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./CustomerManageData.css";
import { iconsImgs } from "../../../../utils/images";
import CustomerTable from "./CustomerTable";
import Pagination from "./Pagination";
import ContentTop from "../../../ContentTop/ContentTop";
import {
  listCustomers,
} from "../../../../redux/customerSlice";
import { fetchCurrentUser } from "../../../../redux/authSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const CustomerManageData = () => {
  const dispatch = useDispatch();
  const { customers, allBAdata, totalPages, customerLoading, customerError } =
    useSelector((state) => state.customer);

  const { user: userDeatail } = useSelector((state) => state.auth);

 // console.log("customers", customers);

  const [selectedCustomer, setSelectedCustomer] = useState({});
  //console.log("selectedCustomer",selectedCustomer);

  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 5;

  // Fetch customers whenever searchTerm or currentPage changes
  //console.log("selectedCustomer",selectedCustomer?.id);
  useEffect(() => {
    //dispatch(fetchCurrentUser());
    dispatch(
      listCustomers({
        page: currentPage,
        limit: customersPerPage,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, searchTerm, selectedCustomer?.id]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="main-content">
      <ContentTop />
      <div className="flex flex-col gap-[20px]">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-5 md:justify-between">
          <div>
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Customer Lead List
            </h1>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-[5px]">
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
        <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
          <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
            {/*------- Table Data Start -------*/}
            <CustomerTable
              customers={customers?.data}
              selectedCustomer={selectedCustomer}
              setSelectedCustomer={setSelectedCustomer}
              userDeatail={userDeatail}
            />

            {/*------- Table Data End -------*/}
          </div>
          {/* Assign Customer Modal */}
          {/* Pagination Controls with Number */}
          <Pagination
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerManageData;
