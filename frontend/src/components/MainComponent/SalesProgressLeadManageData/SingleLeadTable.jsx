// import React from 'react'

// const SingleLeadTable = () => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="table-auto w-full text-left border-collapse">
//         <thead>
//         <tr className="bg-[#473b33] rounded-[8px]">
//           <th className="px-4 py-2 text-left text-bgDataNew">Date</th>
//           <th className="px-4 py-2 text-left text-bgDataNew">Lead Owner</th>
//           <th className="px-4 py-2 text-left text-bgDataNew">Company Name</th>
//           <th className="px-4 py-2 text-left text-bgDataNew">
//             Client Name
//           </th>
//           <th className="px-4 py-2 text-left text-bgDataNew">
//             Lead Source
//           </th>
//           <th className="px-4 py-2 text-left text-bgDataNew">
//             Lead status
//           </th>
//           <th className="px-4 py-2 text-left text-bgDataNew">
//             Action
//           </th>
//         </tr>
//         </thead>
//         <tbody>
//             <tr>
//               <td className="px-4 py-2">22/03/2025</td>
//               <td className="px-4 py-2">Nikhil</td>
//               <td className="px-4 py-2">Dimple Chemicals</td>
//               <td className="px-4 py-2">Dimple Gupta</td>
//               <td className="px-4 py-2">Marketing</td>
//               <td className="px-4 py-2">Warm</td>
//               <td className="px-4 py-2 space-x-2">
//               <button
//                 className="bg-bgDataNew text-white px-3 py-1 rounded hover:bg-orange-600"
//               >
//                 Follow Up
//               </button>
//               </td>
//             </tr>
//         </tbody>
//       </table>
//     </div>
//   )
// }

// export default SingleLeadTable
import React from 'react';

const SingleLeadTable = ({setLeadStatusProgress, LeadSingleData}) => {
  //console.log("LeadSingleData",LeadSingleData);
  const leadData = {
    date: '22/03/2025',
    leadOwner: 'Nikhil',
    companyName: 'Dimple Chemicals',
    clientName: 'Dimple Gupta',
    leadSource: 'Marketing',
    leadStatus: 'Warm',
  };

  return (
    <div className="bg-white w-full pt-0 pb-4 rounded-[6px] flex flex-col">
      <h2 className="text-white text-textdata whitespace-nowrap font-poppins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
        Lead Details
      </h2>
      <div className="mt-5 md:mt-6 px-6 grid grid-cols-1 md:grid-cols-3 gap-3 overflow-y-auto max-h-[calc(100vh-200px)] text-black">
          <Detail label="Date" value={LeadSingleData?.assign_date.split('T')[0]} />
          <Detail label="Lead Owner" value={LeadSingleData?.leadOwner?.fullname} />
          <Detail label="Company Name" value={LeadSingleData?.customer?.company_name} />
          <Detail label="Client Name" value={LeadSingleData?.customer?.client_name} />
          <Detail label="Lead Source" value={LeadSingleData?.lead_source} />
          <Detail label="Lead Status" value={LeadSingleData?.lead_status} />
      </div>
      <div className="flex items-end justify-end gap-2 px-6">
        <button className="mt-4 bg-bgDataNew text-white px-3 py-2 rounded hover:bg-orange-600"
         onClick={() => {
          setLeadStatusProgress(true);
        }}
        >
          Follow Up
        </button>
      </div>
    </div>
  );
};

// Reusable component for displaying details
const Detail = ({ label, value }) => (
  <div className="flex items-center gap-3">
    <label className="font-poppins font-semibold text-textdata whitespace-nowrap text-bgData">
      {label}
    </label>
    <p className="font-poppins font-semibold text-textdata">:</p>
    <p>{value}</p>
  </div>
);

export default SingleLeadTable;
