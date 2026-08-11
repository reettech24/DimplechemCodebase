import React, { useState, useEffect } from "react";
import "./UserManageData.css";
import { iconsImgs } from "../../utils/images";
import UserTable from "./UserTable";
import Pagination from "./Pagination";
import AddUserModal from "./AddUserModal";
import ViewUserModal from "./ViewUserModal";
import EditUserModal from "./EditUserModal";

const UserManageData = () => {
  const [searchTerm, setSearchTerm] = useState("");
   // Load initial users from localStorage or use default list
  const [users, setUsers] = useState(() => {
    const storedUsers = localStorage.getItem("users");
    return storedUsers ? JSON.parse(storedUsers) : [
    {
      name: "John Doe",
      email: "john.doe@example.com",
      role: "Admin",
      contact: "123-456-7890",
      status: "active"
    },
    {
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "User",
      contact: "987-654-3210",
      status: "inactive"
    },
    {
      name: "Alice Johnson",
      email: "alice.johnson@example.com",
      role: "User",
      contact: "555-555-5555",
      status: "active"
    },
    {
      name: "Bob Brown",
      email: "bob.brown@example.com",
      role: "Admin",
      contact: "444-444-4444",
      status: "inactive"
    },
    {
      name: "Charlie Davis",
      email: "charlie.davis@example.com",
      role: "User",
      contact: "333-333-3333",
      status: "active"
    },
    {
      name: "David Evans",
      email: "david.evans@example.com",
      role: "Admin",
      contact: "222-222-2222",
      status: "inactive"
    },
    {
      name: "Ella Fitzgerald",
      email: "ella.fitz@example.com",
      role: "User",
      contact: "111-111-1111",
      status: "active"
    },
    {
      name: "Frank Green",
      email: "frank.green@example.com",
      role: "Admin",
      contact: "999-999-9999",
      status: "inactive"
    },
    {
      name: "Grace Hopper",
      email: "grace.hopper@example.com",
      role: "User",
      contact: "888-888-8888",
      status: "active"
    },
    {
      name: "Hannah White",
      email: "hannah.white@example.com",
      role: "User",
      contact: "777-777-7777",
      status: "inactive"
    },  
  ]});

 

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "",
    contact: "",
  });
  const [selectedUser, setSelectedUser] = useState(null);
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
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);


  const handleToggleStatus = (index) => {
    const updatedUsers = users.map((user, i) =>
      i === index
        ? { ...user, status: user.status === "active" ? "inactive" : "active" }
        : user
    );
    setUsers(updatedUsers);
  };
  

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  // Filtered user list based on search
  const filteredUsers = users
    .sort((a, b) => b?.name.localeCompare(a?.name))
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Paginate user data
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const handleAddUser = () => {
    setUsers([newUser, ...users]);
    setNewUser({ name: "", email: "", role: "", contact: "" });
    setAddUserModalOpen(false);
  };

  const handleEditUser = () => {
    setUsers(users.map((user) => (user === selectedUser ? newUser : user)));
    setSelectedUser(null);
    setNewUser({ name: "", email: "", role: "", contact: "" });
    setEditUserModalOpen(false);
  };

  return (
    <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
      <div className="flex flex-col gap-[20px]">
        <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
          <div>
            <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
              User Management
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
                Add User
              </button>
            </div>
          </div>
        </div>
        <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
          {/*------- Table Data Start -------*/}
          <UserTable
            setSelectedUser={setSelectedUser}
            setEditUserModalOpen={setEditUserModalOpen}
            setUsers={setUsers}
            currentUsers={currentUsers}
            setViewModalOpen={setViewModalOpen}
            setNewUser={setNewUser}
            users={users}
            handleToggleStatus={handleToggleStatus}
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
        <AddUserModal
          newUser={newUser}
          setNewUser={setNewUser}
          handleAddUser={handleAddUser}
          setAddUserModalOpen={setAddUserModalOpen}
        />
      )}

      {/* Edit User Modal */}
      {isEditUserModalOpen && (
        <EditUserModal
          newUser={newUser}
          setNewUser={setNewUser}
          handleEditUser={handleEditUser}
          setEditUserModalOpen={setEditUserModalOpen}
        />
      )}

      {/* View User Modal */}
      {isViewModalOpen && (
        <ViewUserModal
          setViewModalOpen={setViewModalOpen}
          selectedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default UserManageData;
