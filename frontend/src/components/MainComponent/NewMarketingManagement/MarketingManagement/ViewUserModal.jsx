import React from "react";
import { useNavigate } from "react-router-dom";

const ViewUserModal = ({ setViewModalOpen, selectedLead }) => { 
  const navigate = useNavigate();
  console.log("selectedLead", selectedLead);
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-lg w-full lg:w-fit shadow-lg overflow-hidden">
        <div className="bg-bgDataNew px-6 text-center py-2 text-white text-xl font-semibold">
          Lead Details
        </div>

        <div className="overflow-auto custom-scrollbar max-h-[calc(100vh-200px)]">
        <div className="p-6 flex overflow-x-auto flex-col items-center justify-center custom-scrollbar">
          <table className="w-full lg:w-fit px-4 border border-gray-300 mb-8 text-sm text-left">
            <tbody>
              <TableRow label="Company Name" value={selectedLead?.customer?.company_name} />
              <TableRow label="Contact Person Name" value={selectedLead?.contactPerson?.name} />
              <TableRow label="Salse Person Name" value={selectedLead?.assignedPerson?.fullname} />
              <TableRow label="Lead Owner" value={selectedLead?.leadOwner?.fullname} />
              <TableRow label="Meeting Date" value={selectedLead?.communications[0]?.lead_date?.split("T")[0]} />
              <TableRow label="Meeting Type" value={selectedLead?.meeting_type} />
              {/* <TableRow label="Meeting Summary" value={selectedLead?.communications[0]?.lead_text?.split("\n").map((line, index) => (
                    <div key={index}>{line}</div>
                  ))} /> */}
             
            </tbody>
          </table>


          <div className="mt-4">
              <label className="font-poppins font-semibold  text-center text-bgData block mb-4 text-bgDataNew font-poppins border w-[300px] font-medium  text-bgData text-center mx-auto">
                Lead Re-Assigned Persons
              </label>

              {selectedLead?.assignmentHistory?.length > 0 ? (
                <div className="flex flex-wrap gap-4 items-center justify-center">
                  {selectedLead.assignmentHistory.map((person, index) => {
                    const formattedDate = new Date(
                      person.createdAt
                    ).toLocaleDateString("en-GB"); // DD-MM-YYYY

                    return (
                      <React.Fragment key={index}>
                        {/* Card */}
                        <div className="bg-gray-100 p-4 rounded-md shadow-md text-center min-w-[200px] flex flex-col items-center">
                          <p className="text-sm font-semibold text-gray-500">
                            #{index + 1}
                          </p>
                          <p className="text-base font-bold text-gray-800 mt-1">
                            {person?.assignedPerson?.fullname ?? null}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Assigned on: {formattedDate}
                          </p>
                        </div>

                        {/* Arrow */}
                        {index < selectedLead.assignmentHistory.length - 1 && (
                          <div className="text-[25px] text-green-800 font-bold">
                            →
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">
                  No assigned persons found.
                </p>
              )}
            </div>

         
        </div>
        
        </div>
        <div className="mt-4 pr-6 pb-4 flex justify-end">
            <button
              onClick={() => setViewModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
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







    
