import React from "react";

const UserTable = ({
  currentUsers,
  setSelectedUser,
  setEditUserModalOpen,
  setUsers,
  setViewModalOpen,
  setNewUser,
  users,
  handleToggleStatus,
  currentPage,
  usersPerPage
}) => {

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
            <th className="px-4 py-2 text-left text-bgDataNew">Id</th>
            <th className="px-4 py-2 text-left text-bgDataNew">Name</th>
            <th className="px-4 py-2 text-left text-bgDataNew">Email</th>
            <th className="px-4 py-2 text-left text-bgDataNew">Role</th>
            <th className="px-4 py-2 text-left text-bgDataNew">
              Contact Number
            </th>
            <th className="px-4 py-2 text-left text-bgDataNew">Status</th>
            <th className="px-4 py-2 text-left text-bgDataNew">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{index + 1 + (currentPage - 1) * usersPerPage}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">{user.contact}</td>
              <td className="px-4 py-2">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={user.status === "active"}
                    onChange={() => handleToggleStatus(index)}
                    className="sr-only"
                  />
                  <div className={`block w-[48px] h-[24px] rounded-full transition ${user.status === "active" ? "bg-green-500" : "bg-gray-400"}`}>
                    <div
                      className={`dot w-[16px] h-[16px] bg-white rounded-full transition-transform ${
                        user.status === "active" ? "translate-x-[27px] translate-y-[4px]" : "translate-x-1 translate-y-[4px]"
                      }`}
                    ></div>
                  </div>
                </label>
              </td>
              <td className="px-4 py-2 space-x-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => {
                    setSelectedUser(user);
                    setViewModalOpen(true);
                  }}
                >
                  View
                </button>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => {
                    setSelectedUser(user);
                    setNewUser(user);
                    setEditUserModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => setUsers(users.filter((u) => u !== user))}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
