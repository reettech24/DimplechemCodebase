import React, { useState, useEffect } from "react";
import "./MarketingManageData.css";
import "../../../../layout/MainCssFile.css";
import { iconsImgs } from "../../../../utils/images";
import DepartmentTable from "./DepartmentTable";
import Pagination from "./Pagination";
import AddRoleModal from "./AddRoleModal";
// import ViewUserModal from "./ViewUserModal";
// import EditUserModal from "./EditUserModal";
import ContentTop from "../../../ContentTop/ContentTop";

const Attandance = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Load initial users from localStorage or use default list
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("attandance");
    return storedUsers
      ? JSON.parse(storedUsers)
      : [
          {
            name: "Prashant Mishra",
            assignedby: "Uma Sharma",
            date: "25-01-2025",
            priority: "High",
            datevisit: "04-03-2025",
          },
          {
            name: "Rishav Chaurasiya",
            assignedby: "Nikhil Patankar",
            date: "28-01-2025",
            priority: "High",
            datevisit: "02-03-2025",
          },
        ];
  });

  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);
  const usersPerPage = 8;
  const totalPages = Math.ceil(users.length / usersPerPage);

  // Load currentPage from sessionStorage or default to page 1
  const [currentPage, setCurrentPage] = useState(() => {
    return parseInt(sessionStorage.getItem("currentPage")) || 1;
  });

  // Save currentPage to sessionStorage when it changes
  useEffect(() => {
    sessionStorage.setItem("currentPage", currentPage);
  }, [currentPage]);

  // Save users to localStorage whenever users state updates
  useEffect(() => {
    localStorage.setItem("attandance", JSON.stringify(users));
  }, [users]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Filtered user list based on search
  const filteredUsers = users
    .sort((a, b) => b.name.localeCompare(a.name))
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.assignedby.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Paginate user data
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <div className="main-content">
      <ContentTop />
      <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
            <div>
              <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
                Attendance Tracking List
              </h1>
            </div>
            <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
              <div>
                <input
                  type="search"
                  className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* <div>
                <button
                  className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                  onClick={() => setAddUserModalOpen(true)}
                >
                  <img
                    src={iconsImgs.plus}
                    alt="plus icon"
                    className="w-[18px] mr-1"
                  />{" "}
                  Add Assignment
                </button>
              </div> */}
            </div>
          </div>
          <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
            {/*------- Table Data Start -------*/}
            <DepartmentTable
              setEditUserModalOpen={setEditUserModalOpen}
              currentUsers={currentUsers}
              setViewModalOpen={setViewModalOpen}
              currentPage={currentPage}
              usersPerPage={usersPerPage}
            />
            {/*------- Table Data End -------*/}
          </div>
          {/* Pagination Controls with Number */}
          <Pagination
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>

        {/* Add User Modal */}
        {isAddUserModalOpen && (
          <AddRoleModal setAddUserModalOpen={setAddUserModalOpen} />
        )}

        {/* Edit User Modal */}
        {/* {isEditUserModalOpen && (
          <EditUserModal setEditUserModalOpen={setEditUserModalOpen} />
        )} */}

        {/* View User Modal */}
        {/* {isViewModalOpen && (
          <ViewUserModal setViewModalOpen={setViewModalOpen} />
        )} */}
      </div>
    </div>
  );
};

export default Attandance;
