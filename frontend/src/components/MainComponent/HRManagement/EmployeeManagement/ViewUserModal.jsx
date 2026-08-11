import React from "react";
const API_URL = import.meta.env.VITE_API_URL;
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

import "./EmployeeManageData.css";

const ViewUserModal = ({
  setViewModalOpen,
  selectedEmployee,
  setEditUserModalOpen,
}) => {
  //console.log("selectedEmployee",selectedEmployee);
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full md:w-[900px] pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-[20px] font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Employee Details
        </h2>

        <div className="overflow-y-auto max-h-[calc(100vh-200px)]">
          {/* Profile Section */}
          <div className="px-5 py-4">
            <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px]  bg-[#e5e7eb61] p-2 rounded-[10px]">
              <div className="flex items-center gap-2">
                {/* <img
                  src={
                    selectedEmployee.profile_image
                      ? `${API_URL.replace("api", "")}${
                          selectedEmployee.profile_image
                        }`
                      : "https://via.placeholder.com/80"
                  }
                  alt="Profile"
                  className="w-16 h-16 rounded-full border"
                /> */}
                <div>
                  <h3 className="text-[15px] font-semibold">
                    {selectedEmployee.fullname}
                  </h3>
                  <p className="text-gray-600 text-[12px]">
                    {selectedEmployee.email}
                  </p>
                </div>
              </div>

              {/* Right Section - Status Badge with Ribbon Effect */}
              <div className="relative inline-block">
                <div className="bg-green-500 text-white font-bold px-5 py-1 rounded-l-lg pr-8 relative text-[14px]">
                  {selectedEmployee.status}
                  {/* <div className="absolute top-0 right-0 h-full w-5 bg-red-500 clip-ribbon"></div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="py-3 px-6">
            <div className="bg-[#e5e7eb38] rounded-[5px] px-2 py-2">
              <table className="w-full border border-gray-300 text-sm text-left">
                <tbody>
                  <TableRow label="Status" value={selectedEmployee.status} />
                  <TableRow label="Email" value={selectedEmployee?.email} />
                  <TableRow
                    label="DOB"
                    value={selectedEmployee?.date_of_birth?.split("T")[0] || ""}
                  />
                  <TableRow
                    label="Username"
                    value={selectedEmployee?.username}
                  />
                  <TableRow
                    label="Role"
                    value={selectedEmployee?.employeeRole?.role?.role_name}
                  />
                  <TableRow label="Phone" value={selectedEmployee?.phone} />
                  <TableRow
                    label="Emergency Contact"
                    value={selectedEmployee?.emergency_contact}
                  />
                  <TableRow
                    label="Aadhar No."
                    value={selectedEmployee?.aadhar_no}
                  />
                  <TableRow label="PAN No." value={selectedEmployee?.pan_no} />
                  <TableRow
                    label="Employment Type"
                    value={selectedEmployee?.jobDetail?.employment_type}
                  />
                  <TableRow
                    label="Reporting Manager"
                    value={
                      selectedEmployee?.jobDetail?.reportingManager?.fullname
                    }
                  />
                  <TableRow
                    label="Work Location"
                    value={selectedEmployee?.jobDetail?.work_location}
                  />
                  <TableRow label="Address" value={selectedEmployee?.address} />
                  <TableRow
                    label="Joining Date"
                    value={
                      selectedEmployee?.jobDetail?.date_of_joining
                        ? new Date(selectedEmployee.jobDetail.date_of_joining)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                  />
                </tbody>
              </table>
               <div className="overflow-x-auto mt-4">
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 border-b text-left">#</th>
            <th className="px-4 py-2 border-b text-left">Document Name</th>
            <th className="px-4 py-2 border-b text-left">Preview / Download</th>
          </tr>
        </thead>
        <tbody>
          {selectedEmployee?.documents?.map((doc, index) => (
            <tr key={doc.id} className="hover:bg-gray-50">
              <td className="px-4 py-2 border-b">{index + 1}</td>
              <td className="px-4 py-2 border-b">
                {doc.documents.split('/').pop()}
              </td>
              <td className="px-4 py-2 border-b">
                <a
                  href={`${BACKEND_URL}/${doc.documents}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View / Download
                </a>
              </td>
            </tr>
          ))}
          {selectedEmployee?.documents?.length === 0 && (
            <tr>
              <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                No documents found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 px-6">
          <button
            className="mt-4 bg-bgDataNew text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={() => {
              setEditUserModalOpen(true);
              setViewModalOpen(false);
            }}
          >
            Edit
          </button>
          <button
            className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={() => setViewModalOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const TableRow = ({ label, value }) => (
  <tr className="border-b border-gray-200">
    <td className="py-2 px-4 font-bold text-gray-600 w-1/3">{label}</td>
    <td className="py-2 px-2 text-gray-800">:</td>
    <td className="py-2 px-4 text-gray-800">{value ?? null}</td>
  </tr>
);

export default ViewUserModal;
