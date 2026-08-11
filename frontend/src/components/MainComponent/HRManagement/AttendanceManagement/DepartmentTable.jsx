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
          <th className="px-4 py-2 text-left text-bgDataNew">Emp. Id</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Check In Time</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Check out Time</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Overtime Hours</th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Work Location
          </th>
        </tr>
      </thead>
      <tbody>
        {currentUsers.map((user, index) => (
          <tr key={index}>
            <td className="px-4 py-2">{index + 1 + (currentPage - 1) * usersPerPage}</td>
            <td className="px-4 py-2">10:5 am</td>
            <td className="px-4 py-2">7:30 pm</td>
            <td className="px-4 py-2">3 hr</td>
            <td className="px-4 py-2">Indore</td>
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
