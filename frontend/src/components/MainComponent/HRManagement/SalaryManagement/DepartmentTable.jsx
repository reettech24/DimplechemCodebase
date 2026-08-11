import React from "react";

const DepartmentTable = ({
  currentUsers,
  setEditUserModalOpen,
  setViewModalOpen,
  currentPage,
  usersPerPage
}) => {

  return (
    <div className="overflow-x-auto w-[1120px] custom-scrollbar">
    <table className="table-auto w-full text-left border-collapse">
      <thead>
        <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
          <th className="px-4 py-2 text-left text-bgDataNew">Id</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Base Slary</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Bonus/Incentives</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Deduction(Tax,loan)</th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Overtime Pay
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Final Slary
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Salary Month 
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Bank Name
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Account Number
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            IFSC Code
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Payment Mode
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
            <td className="px-4 py-2">{user.baseslary}</td>
            <td className="px-4 py-2">{user.bonusincentives}</td>
            <td className="px-4 py-2">{user.duduction}</td>
            <td className="px-4 py-2">{user.overtime}</td>
            <td className="px-4 py-2">{user.Finalsalary}</td>
            <td className="px-4 py-2">{user.slaryMonth}</td>
            <td className="px-4 py-2">{user.BankName}</td>
            <td className="px-4 py-2">{user.Account}</td>
            <td className="px-4 py-2">{user.IFSC}</td>
            <td className="px-4 py-2">{user.Paymenet}</td>
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
