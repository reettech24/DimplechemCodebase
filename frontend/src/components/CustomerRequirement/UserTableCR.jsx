import React,{useState} from "react";
import LeadGenerationModal from "./LeadGenerationModal";

const UserTableCR = ({
  currentUsers,
  setSelectedUser,
  setEditUserModalOpen,
  setUsers,
  setViewModalOpen,
  setNewUser,
  users,
  currentPage,
  usersPerPage
}) => {
  const [isLeadModalOpen, setLeadModalOpen] = useState(false);
  const [selectedUserLead, setSelectedUserLead] = useState(null);


  const onShowLead = (user) => {
    console.log("Selected User:", user); 
    setSelectedUserLead(user);
    setLeadModalOpen(true);
  };

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
            <th className="px-4 py-2 text-left text-bgDataNew">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={index}>
              <td className="px-4 py-2">{index + 1 + (currentPage - 1) * usersPerPage}</td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.title}</td>
              <td className="px-4 py-2 w-[370px]">{user.requirement}</td>
              <td className="px-4 py-2">{user.contact}</td>
              <td className="px-4 py-2">{user.status}</td>
              <td className="px-4 py-2 flex flex-col gap-2">
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => {
                    setSelectedUser(user);
                    setViewModalOpen(true);
                  }}
                >
                  View
                </button>
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => {
                    setSelectedUser(user);
                    setNewUser(user);
                    setEditUserModalOpen(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  onClick={() => setUsers(users.filter((u) => u !== user))}
                >
                  Delete
                </button>
                <button
                  className="bg-bgDataNew text-white px-3 py-1 rounded hover:bg-orange-600"
                  onClick={() => onShowLead(user)}
                >
                  Show Lead
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {isLeadModalOpen && (
        <LeadGenerationModal
          selectedUserLead={selectedUserLead}
          onClose={() => setLeadModalOpen(false)}
        />
      )}
    </div>
    </>
  );
};

export default UserTableCR;
