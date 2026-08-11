import React from 'react'

const LeadGenerationTable = ({currentUsers, indexOfFirstUser}) => {
  return (
    <>
    <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 10px;
            cursor: pointer;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #fe6c00c4 !important; 
            border-radius: 8px;
            cursor: pointer;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            cursor: pointer;
          }

          /* For Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #68574c transparent;
            cursor: pointer;
          }
       `}
      </style>
    
    
    <div className="overflow-x-auto custom-scrollbar">
      <table className="table-auto w-full text-left border-collapse">
        <thead>
          <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
            <th className="px-4 py-2 text-left text-bgDataNew">SNo.</th>
            <th className="px-4 py-2 text-left text-bgDataNew">Name</th>
            <th className="px-4 py-2 text-left text-bgDataNew">Email</th>
            <th className="px-4 py-2 text-left text-bgDataNew">Title</th>
            <th className="px-4 py-2 text-left text-bgDataNew">Description</th>
            <th className="px-4 py-2 text-left text-bgDataNew">
              Contact
            </th>
            <th className="px-4 py-2 text-left text-bgDataNew">Status</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{indexOfFirstUser + index + 1}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.title}</td>
              <td className="px-4 py-2 w-[370px]">{user.requirement}</td>
              <td className="px-4 py-2">{user.contact}</td>
              <td className="px-4 py-2">{user.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default LeadGenerationTable
