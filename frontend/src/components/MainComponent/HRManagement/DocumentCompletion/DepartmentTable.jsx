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
          <th className="px-4 py-2 text-left text-bgDataNew">Id</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Employee Name</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Document Type</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Employee File</th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Aadhar Card
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Pan Card
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
            <td className="px-4 py-2">{user.name}</td>
            <td className="px-4 py-2">{user.documentType}</td>
            <td className="px-4 py-2">{user.UploadData}</td>
            <td className="px-4 py-2">{user.Aadharcard}</td>
            <td className="px-4 py-2">{user.PanCard}</td>
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
