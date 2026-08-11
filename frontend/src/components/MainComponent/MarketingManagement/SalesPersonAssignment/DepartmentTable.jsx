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
          <th className="px-4 py-2 text-left text-bgDataNew text-textdata">Id</th>
          <th className="px-4 py-2 text-left text-bgDataNew text-textdata">SalesPerson Name</th>
          <th className="px-4 py-2 text-left text-bgDataNew text-textdata">Assigned By</th>
          <th className="px-4 py-2 text-left text-bgDataNew text-textdata">Assigned Date</th>
          <th className="px-4 py-2 text-left text-bgDataNew text-textdata">
            Priority
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew text-textdata">
            Date Visit
          </th>
          
          <th className="px-4 py-2 text-left text-bgDataNew text-textdata">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {currentUsers.map((user, index) => (
          <tr key={index}>
            <td className="px-4 py-2 text-textdata">{index + 1 + (currentPage - 1) * usersPerPage}</td>
            <td className="px-4 py-2 text-textdata">{user.name}</td>
            <td className="px-4 py-2 text-textdata">{user.assignedby}</td>
            <td className="px-4 py-2 text-textdata">{user.date}</td>
            <td className="px-4 py-2 text-textdata">{user.priority}</td>
            <td className="px-4 py-2 text-textdata">{user.datevisit}</td>
            <td className="px-4 py-2 text-textdata whitespace-nowrap space-x-2">
              {/* <button
                className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => {
                  setViewModalOpen(true);
                }}
              >
                View
              </button> */}
              <button
                className="bg-bgDataNew text-white px-3 py-1 rounded hover:bg-green-600"
                // onClick={() => {
                //   setEditUserModalOpen(true);
                // }}
              >
                Deal
              </button>
              {/* <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button> */}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  );
};

export default DepartmentTable;
