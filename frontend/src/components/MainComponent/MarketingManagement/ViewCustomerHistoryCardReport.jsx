import React from 'react';

const ViewCustomerHistoryCardReport = ({ 
  setViewCustomerHistoryCardModalOpen,
  selectedCustomer }) => {
    console.log("selectedCustomer",selectedCustomer);
  return (
    <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full w-full md:w-[900px] max-h-[90vh] overflow-y-auto pt-0 pb-4 rounded-[6px] flex flex-col">
        <h2 className="text-white text-[18px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
          Customer History Card Report
        </h2>

        <div className="mt-5 px-4 overflow-y-auto custom-scrollbar">
          <div className="overflow-x-auto w-full">
            <table className="w-full table-auto border border-black-100 text-sm">
              <thead>
                <tr className="bg-[#473b33] text-left text-white sticky top-0 z-10">
                  <th className="border px-2 py-1">Required Fields</th>
                  <th className="border px-2 py-1">Description</th>
                  <th className="border px-2 py-1">Sample Data</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border px-2 py-1">1</td><td className="border px-2 py-1">Name of Customer with address</td><td className="border px-2 py-1">{selectedCustomer?.company_name}, {selectedCustomer?.address}</td></tr>
                <tr><td className="border px-2 py-1">2</td><td className="border px-2 py-1">DCPSL employee name</td><td className="border px-2 py-1">John Doe</td></tr>
                <tr><td className="border px-2 py-1">3</td><td className="border px-2 py-1">Business Associate code</td><td className="border px-2 py-1">BA1234</td></tr>
                <tr>
                  <td className="border px-2 py-1">4</td>
                  <td className="border px-2 py-1">
                    <strong>Activity List</strong><br/>
                    a. Visit index having details of<br/>
                    - date of Visit<br/>
                    - Visit Remark<br/>
                    - Next Visit Plan<br/>
                    - Location mapping Tag<br/>
                    <hr/>
                    b. Email Index having details<br/>
                    - Date of Email<br/>
                    - Email sent / received<br/>
                    - Customer Email ID<br/>
                    - Subject of email<br/>
                    <hr/>
                    c. Document index with server hyperlink<br/>
                    - Date of Document Sent<br/>
                    - Document sent through<br/>
                    - Server Location<br/>
                    - Document file name<br/>
                    <hr/>
                    d. Phone call index
                  </td>
                  <td className="border px-2 py-1">Includes visit & communication history</td>
                </tr>
                <tr><td className="border px-2 py-1">5</td><td className="border px-2 py-1">Total Business Potential</td><td className="border px-2 py-1">$10,000</td></tr>
                <tr><td className="border px-2 py-1">6</td><td className="border px-2 py-1">Till date achieved Business</td><td className="border px-2 py-1">$4,000</td></tr>
                <tr><td className="border px-2 py-1">7</td><td className="border px-2 py-1">Reason for shortage / excess</td><td className="border px-2 py-1">Delayed shipment</td></tr>
                <tr><td className="border px-2 py-1">8</td><td className="border px-2 py-1">Reason for customer lost</td><td className="border px-2 py-1">Better pricing elsewhere</td></tr>
                <tr><td className="border px-2 py-1">9</td><td className="border px-2 py-1">Corrective action / future plan</td><td className="border px-2 py-1">Improve delivery speed</td></tr>
                <tr><td className="border px-2 py-1">10</td><td className="border px-2 py-1">Lead / customer refered by, who is not a business associates</td><td className="border px-2 py-1">Jane Smith</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-end justify-end gap-2 px-4">
          <button
            className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            onClick={() => setViewCustomerHistoryCardModalOpen(false)}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCustomerHistoryCardReport;
