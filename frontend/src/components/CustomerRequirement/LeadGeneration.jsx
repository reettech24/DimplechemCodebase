import React, { useState, useEffect } from "react";
import "./UserManageDataCR.css";
import LeadGenerationTable from "./LeadGenerationTable";
import LeadPagination from "./LeadPagination";
import { useNavigate } from "react-router-dom";

const LeadGeneration = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;

  useEffect(() => {
    // Fetch data from localStorage
    const data = JSON.parse(localStorage.getItem("usersCR")) || [];
    setUserData(data);
  }, []);

  // Calculate indices for pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = userData.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(userData.length / usersPerPage);

  // Handle pagination controls
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div>
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold flex items-center cursor-pointer" onClick={() => navigate(-1)}>
              <svg
                width="25"
                height="25"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => navigate(-1)}
                className="cursor-pointer"
              >
                <path
                  d="M22.5 27L13.5 18L22.5 9"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              <span className="border border-gray-300 px-3 rounded-[5px]">Back</span> &nbsp;&nbsp;&nbsp;All Lead Generate Data
            </h1>
          </div>
        </div>
        <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
          {/*------- Table Data Start -------*/}
          <LeadGenerationTable
            currentUsers={currentUsers}
            indexOfFirstUser={indexOfFirstUser}
          />
          {/*------- Table Data End -------*/}
        </div>

        {/* Pagination Controls with Number */}
        <LeadPagination
          currentPage={currentPage}
          handlePageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default LeadGeneration;
