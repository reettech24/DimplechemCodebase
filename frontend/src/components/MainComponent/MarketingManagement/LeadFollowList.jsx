import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { leadCommunicationById } from "../../../redux/leadSlice";
import Pagination from "./Pagination";
import ContentTop from "../../ContentTop/ContentTop";
import { useNavigate } from "react-router-dom";

export const LeadFollowList = () => {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const dispatch = useDispatch();
  const { communicationleadsList, totalPages, leadLoading, leadError } =
    useSelector((state) => state.lead);
  //console.log("communicationleadsList", communicationleadsList);
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
            {/* <div>
            <button onClick={() => navigate(-1)} className="bg-bgDataNew text-white px-3 py-2 rounded hover:bg-[#cb6f2ad9]">
                ⬅ Back
              </button>
              <h1 className="text-white text-textdata whitespace-nowrap font-semibold">
                Lead Follow Up
              </h1>
              
            </div>*/}
            <div>
              <h1 className="text-white text-textdata whitespace-nowrap font-semibold flex items-center cursor-pointer" onClick={() => navigate(-1)}>
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  onClick={() => navigate(-1)}
                  className="cursor-pointer"
                >
                  <path
                    d="M22.5 27L13.5 18L22.5 9"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></path>
                </svg>
                <span className="border border-gray-300 px-3 rounded-[5px]">Back</span> &nbsp;&nbsp;&nbsp;Lead Follow Up
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
            <div className="overflow-x-auto custom-scrollbar">
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata">Id</th>
                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                      Meeting Date
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                      Start Time
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                      End Time
                    </th>

                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                      Next Meeting Date
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                      Company Name
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                      Client Name
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                      Communication
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap ">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {communicationleadsList?.data &&
                    communicationleadsList?.data.map((user, index) => (
                      <tr key={index}>
                        <td className="px-4 py-2 text-newtextdata ">{index + 1}</td>
                        {/* <td className="px-4 py-2 text-newtextdata ">{user?.lead_date?.split('T')[0]}</td> */}
                        <td className="px-4 py-2 text-newtextdata ">
                          {new Date(user?.createdAt)?.toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-4 py-2 text-newtextdata ">
                          {user?.start_meeting_time}
                        </td>
                        <td className="px-4 py-2 text-newtextdata ">{user?.end_meeting_time}</td>

                        <td className="px-4 py-2 text-newtextdata ">
                          {new Date(user?.lead_date)?.toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="px-4 py-2 text-newtextdata ">
                          {user?.Customer?.company_name}
                        </td>
                        <td className="px-4 py-2 text-newtextdata ">{user?.client_name}</td>
                        <td className="px-4 py-2 text-newtextdata  w-[300px]">
                          {user?.lead_text}
                        </td>
                        <td className="px-4 py-2 text-newtextdata ">{user?.lead_status}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            
            {/* </div> */}
          </div>
          {/* Pagination Controls with Number */}
            <Pagination
              currentPage={currentPage}
              handlePageChange={handlePageChange}
              totalPages={totalPages}
            />
        </div>
      </div>
    </div>
  );
};
