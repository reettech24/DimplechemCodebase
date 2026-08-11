import React from "react";
import { useNavigate } from "react-router-dom";

const DepartmentTable = ({
  SalesPersonleads,
  setEditUserModalOpen,
  setViewModalOpen,
}) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto custom-scrollbar">
    <table className="table-auto w-full text-left border-collapse">
      <thead>
        <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
          {/* <th className="px-4 py-2 text-left text-bgDataNew"></th> */}
          <th className="px-4 py-2 text-left text-bgDataNew">Id</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Date</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Lead Owner</th>
          <th className="px-4 py-2 text-left text-bgDataNew">Company Name</th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Client Name
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Lead Source
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Lead status
          </th>
          <th className="px-4 py-2 text-left text-bgDataNew">
            Action
          </th>
        </tr>
      </thead>
      <tbody>
        {SalesPersonleads.map((user, index) => (
          <tr key={index}>
            {/* <td className="px-4 py-2"><input type="checkbox" className="w-4 h-4 accent-orange-500" /></td> */}
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{user?.assign_date?.split('T')[0]}</td>
            <td className="px-4 py-2">{user?.leadOwner?.fullname}</td>
            <td className="px-4 py-2">{user?.customer?.company_name}</td>
            <td className="px-4 py-2">{user?.customer?.client_name}</td>
            <td className="px-4 py-2">{user?.lead_source}</td>
            <td className="px-4 py-2">{user?.lead_status}</td>
            <td className="px-4 py-2 space-x-2">
              <button
                className="bg-bgDataNew text-white px-3 py-1 rounded hover:bg-orange-600"
                onClick={() => navigate(`/lead-sales/lead/${user?.id}`)}
              >
                Work on Lead
              </button>
              {/* <button
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
