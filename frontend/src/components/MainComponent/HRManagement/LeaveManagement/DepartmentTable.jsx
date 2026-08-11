import React from "react";

const DepartmentTable = ({
  currentUsers,
  setEditUserModalOpen,
  setViewModalOpen,
  currentPage,
  usersPerPage
}) => {

  return (
    <div className="overflow-x-auto custom-scrollbar">
    <table className="table-auto w-full text-left border-collapse">
      <thead>
        <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
          <th className="px-4 py-2 text-left text-bgDataNew">Emp Id</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Leave Type</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Start Date</th>
          <th className="px-4 py-2 text-left text-bgDataNew">End Date</th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Reason for Leave
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Attached Doc
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Leave Status
          </th>
          
          {/* <th className="px-4 py-2 text-left text-bgDataNew">
            Action
          </th> */}
        </tr>
      </thead>
      <tbody>
        {currentUsers.map((user, index) => (
          <tr key={index}>
            <td className="px-4 py-2">{index + 1 + (currentPage - 1) * usersPerPage}</td>
            <td className="px-4 py-2">casual</td>
            <td className="px-4 py-2">1/02/25</td>
            <td className="px-4 py-2">4/02/25</td>
            <td className="px-4 py-2">Due to urgent work</td>
            <td className="px-4 py-2">NA</td>
            <td>Pending</td>
            {/* <td className="px-4 py-2 space-x-2">
              <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => {
                  setViewModalOpen(true);
                }}
              >
                View
              </button>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                onClick={() => {
                  setEditUserModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </td> */}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default DepartmentTable;
