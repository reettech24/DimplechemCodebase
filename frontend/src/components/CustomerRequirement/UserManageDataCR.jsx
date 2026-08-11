import React, { useState, useEffect } from "react";
import "./UserManageDataCR.css";
import { iconsImgs } from "../../utils/images";
import UserTableCR from "./UserTableCR";
import PaginationCR from "./PaginationCR";
import AddUserModalCR from "./AddUserModalCR";
import ViewUserModalCR from "./ViewUserModalCR";
import EditUserModalCR from "./EditUserModalCR";
import { useNavigate } from "react-router-dom";

const UserManageDataCR = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // Load initial users from localStorage or use default list
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("usersCR");
    return storedUsers
      ? JSON.parse(storedUsers)
      : [
          {
            name: "John Doe",
            email: "john.doe@example.com",
            title: "Mobile Phone",
            requirement:
              "Experience cutting-edge technology with this smartphone, featuring a powerful processor, stunning display, and long-lasting battery life for seamless multitasking and entertainment.",
            contact: "923-456-7890",
            status: "New",
          },
          {
            name: "Jane Smith",
            email: "jane.smith@example.com",
            title: "Laptop",
            requirement:
              "A sleek and powerful laptop designed for professionals and students alike, offering high performance, ample storage, and a lightweight build for easy portability.",
            contact: "987-654-3210",
            status: "InProgress",
          },
          {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            title: "Home Decor Item",
            requirement:
              "Enhance your living space with this beautifully designed decor piece, blending style and functionality to create a warm and inviting atmosphere in any room.",
            contact: "555-555-5555",
            status: "Completed",
          },
          {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            title: "Home Decor Item",
            requirement:
              "Enhance your living space with this beautifully designed decor piece, blending style and functionality to create a warm and inviting atmosphere in any room.",
            contact: "555-555-5555",
            status: "Completed",
          },
          {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            title: "Home Decor Item",
            requirement:
              "Enhance your living space with this beautifully designed decor piece, blending style and functionality to create a warm and inviting atmosphere in any room.",
            contact: "555-555-5555",
            status: "Completed",
          },
          {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            title: "Home Decor Item",
            requirement:
              "Enhance your living space with this beautifully designed decor piece, blending style and functionality to create a warm and inviting atmosphere in any room.",
            contact: "555-555-5555",
            status: "Completed",
          },
          {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            title: "Home Decor Item",
            requirement:
              "Enhance your living space with this beautifully designed decor piece, blending style and functionality to create a warm and inviting atmosphere in any room.",
            contact: "555-555-5555",
            status: "Completed",
          },
          {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            title: "Home Decor Item",
            requirement:
              "Enhance your living space with this beautifully designed decor piece, blending style and functionality to create a warm and inviting atmosphere in any room.",
            contact: "555-555-5555",
            status: "Completed",
          },
          {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            title: "Home Decor Item",
            requirement:
              "Enhance your living space with this beautifully designed decor piece, blending style and functionality to create a warm and inviting atmosphere in any room.",
            contact: "555-555-5555",
            status: "Completed",
          },
          {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            title: "Home Decor Item",
            requirement:
              "Enhance your living space with this beautifully designed decor piece, blending style and functionality to create a warm and inviting atmosphere in any room.",
            contact: "555-555-5555",
            status: "Completed",
          },
          {
            name: "Alice Johnson",
            email: "alice.johnson@example.com",
            title: "Home Decor Item",
            requirement:
              "Enhance your living space with this beautifully designed decor piece, blending style and functionality to create a warm and inviting atmosphere in any room.",
            contact: "555-555-5555",
            status: "Completed",
          },

        ];
  });

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    title: "",
    requirement: "",
    contact: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isAddUserModalOpen, setAddUserModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isEditUserModalOpen, setEditUserModalOpen] = useState(false);
  const navigate = useNavigate();
  const usersPerPage = 2;
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
    localStorage.setItem("usersCR", JSON.stringify(users));
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
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Paginate user data
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleAddUser = () => {
    setUsers([newUser, ...users]);
    setNewUser({
      name: "",
      email: "",
      title: "",
      requirement: "",
      contact: "",
    });
    setAddUserModalOpen(false);
  };

  const handleEditUser = () => {
    setUsers(users.map((user) => (user === selectedUser ? newUser : user)));
    setSelectedUser(null);
    setNewUser({
      name: "",
      email: "",
      title: "",
      requirement: "",
      contact: "",
    });
    setEditUserModalOpen(false);
  };

  return (
    <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div>
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              Customer Requirement
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
            <div>
              <button
                className="flex items-center text-textdata whitespace-nowrap text-white bg-[#fe6c00] rounded-[3px] px-3 py-[0.28rem]"
                onClick={() => setAddUserModalOpen(true)}
              >
                <img
                  src={iconsImgs.plus}
                  alt="plus icon"
                  className="w-[18px] mr-1"
                />{" "}
                Add New Requirement
              </button>
            </div>
          </div>
        </div>
        <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
          {/*------- Table Data Start -------*/}
          <UserTableCR
            setSelectedUser={setSelectedUser}
            setEditUserModalOpen={setEditUserModalOpen}
            setUsers={setUsers}
            currentUsers={currentUsers}
            setViewModalOpen={setViewModalOpen}
            setNewUser={setNewUser}
            users={users}
            currentPage={currentPage}
            usersPerPage={usersPerPage}
          />
          {/*------- Table Data End -------*/}
        </div>
        <div className="flex justify-between">
          <button
            className="flex items-center text-white bg-[#fe6c00] rounded-[5px] px-3 py-[0.15rem]" 
            onClick={() => navigate('/customer-requirement/lead-generate')}
          >
            All Lead Generate
          </button>
          {/* Pagination Controls with Number */}
          <PaginationCR
            currentPage={currentPage}
            handlePageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserModalOpen && (
        <AddUserModalCR
          newUser={newUser}
          setNewUser={setNewUser}
          handleAddUser={handleAddUser}
          setAddUserModalOpen={setAddUserModalOpen}
        />
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && (
        <EditUserModalCR
          newUser={newUser}
          setNewUser={setNewUser}
          handleEditUser={handleEditUser}
          setEditUserModalOpen={setEditUserModalOpen}
        />
      )}

      {/* View User Modal */}
      {isViewModalOpen && (
        <ViewUserModalCR
          setViewModalOpen={setViewModalOpen}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default UserManageDataCR;