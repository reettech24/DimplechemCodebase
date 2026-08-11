import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { leadCommunicationById } from "../../../redux/leadSlice";
import Pagination from "./Pagination";
import ContentTop from "../../ContentTop/ContentTop";

export const LeadFollowList = () => {
  const { leadId } = useParams();
  const dispatch = useDispatch();
  const { communicationleadsList, totalPages, leadLoading, leadError } =
    useSelector((state) => state.lead);
  console.log("communicationleadsList", communicationleadsList);
  // Pagination & Search States
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const leadCumPerPage = 5;

  useEffect(() => {
    if (leadId) {
      dispatch(
        leadCommunicationById({
          leadId: leadId,
          page: currentPage,
          limit: leadCumPerPage,
          search: searchTerm,
        })
      );
    }
  }, [dispatch, leadId, currentPage, searchTerm]);
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  return (
    <div className="main-content">
      <ContentTop />
      <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-[20px]">
         <div className="flex items-start md:items-center flex-col md:flex-row md:justify-between gap-[8px] md:gap-[0px] ">
                   <div>
                     <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
                       Lead Follow Up
                     </h1>
                   </div>
                   <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
                     <div>
                       <input
                         type="search"
                         className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                         placeholder="Search"
                         value={searchTerm}
                         onChange={handleSearchChange}
                       />
                     </div>
                     
                   </div>
                 </div>
          <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
            {/* <div className="w-full mt-8 overflow-x-auto"> */}
              {/* <div className="flex items-start md:items-center flex-col md:flex-row gap-[5px]">
                <div>
                  <input
                    type="search"
                    className="relative m-0 block w-full min-w-0 flex-auto rounded border border-solid border-[#473b33] bg-transparent bg-clip-padding px-3 py-[0.15rem] text-base font-normal leading-[1.6] text-white outline-none transition duration-200 ease-in-out focus:z-[3] focus:border-[#473b33] focus:text-white focus:shadow-[#473b33] focus:outline-none dark:border-[#473b33] dark:text-white dark:placeholder:text-white dark:focus:border-[#473b33]"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
              </div> */}
              <div>
                <table className="table-auto w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
                      <th className="px-4 py-2 text-left text-bgDataNew">Id</th>
                      <th className="px-4 py-2 text-left text-bgDataNew">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew">
                        Company Name
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew">
                        Client Name
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew">
                        Communication
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {communicationleadsList?.data &&
                      communicationleadsList?.data.map((user, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{index + 1}</td>
                          {/* <td className="px-4 py-2">{user?.lead_date?.split('T')[0]}</td> */}
                          <td className="px-4 py-2">
                            {new Date(user?.lead_date)?.toLocaleDateString(
                              "en-GB",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {user?.Customer?.company_name}
                          </td>
                          <td className="px-4 py-2">{user?.client_name}</td>
                          <td className="px-4 py-2 w-[300px]">
                            {user?.lead_text}
                          </td>
                          <td className="px-4 py-2">{user?.lead_status}</td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls with Number */}
              <Pagination
                currentPage={currentPage}
                handlePageChange={handlePageChange}
                totalPages={totalPages}
              />
            {/* </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};
