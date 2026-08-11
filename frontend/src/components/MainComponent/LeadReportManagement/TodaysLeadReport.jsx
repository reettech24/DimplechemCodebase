import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./ReportManageData.css";
import { useNavigate } from "react-router-dom";
import ContentTop from "../../ContentTop/ContentTop";
import { todaysLeadReport } from "../../../redux/leadSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const TodaysLeadReport = () => {
  const dispatch = useDispatch();

  const { todaysLeads } = useSelector((state) => state.lead);

  console.log("todaysLeads", todaysLeads);
  useEffect(() => {
    dispatch(todaysLeadReport());
  }, [dispatch]);

  const getAuthToken = () => localStorage.getItem("token");
  const handleExportData = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call
      const response = await axios.get(`${API_URL}/auth/export-todays-leads`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // ✅ Keep it outside headers
      });

      // ✅ Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // ✅ Create a temporary <a> tag to download the file
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Todays_Leads_Report.xlsx"); // File name
      document.body.appendChild(link);
      link.click();

      // ✅ Cleanup after download
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  const navigate = useNavigate();
  return (
    <div className="main-content">
      <ContentTop />
      <div className="main-content-holder max-h-[550px] heightfixalldevice overflow-y-auto scrollbar-hide">
        <div className="flex flex-col gap-[20px]">
          <div className="flex items-start md:items-center flex-row md:flex-row justify-between">
            <div>
              <h1
                className="text-white text-[14px] font-semibold flex items-center cursor-pointer"
                onClick={() => navigate(-1)}
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 36 36"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
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
                <span className="border border-gray-300 px-3 rounded-[5px]">
                  Back
                </span>{" "}
                &nbsp;&nbsp;&nbsp; Todays Leads
              </h1>
            </div>
            <button
              className="bg-bgDataNew text-white px-3 py-1 rounded hover:bg-bgDataNew"
              onClick={handleExportData}
            >
              Export Data
            </button>
          </div>
          <div className="main-content-holder max-h-[600px] heightfixalldevice overflow-y-auto scrollbar-hide">
            <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-6 overflow-auto">
              {/* {/------- Table Data Start -------/} */}
              <div className="overflow-x-auto custom-scrollbar">
                <table className="table-auto w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#473b33] rounded-[8px] sticky top-0 z-10">
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Id
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Email
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Phone
                      </th>
                      {/* <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                      Lead Source
                    </th>
                    <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                      Lead Status
                    </th> */}
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Comapny
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Meeting Date
                      </th>
                      <th className="px-4 py-2 text-left text-bgDataNew text-newtextdata whitespace-nowrap">
                        Meeting Agenda
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {todaysLeads &&
                      todaysLeads?.data?.map((lead, index) => (
                        <tr key={index + 1}>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {index + 1}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {lead?.assignedPerson?.fullname}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {lead?.customer?.email_id}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {lead?.customer?.primary_contact}
                          </td>

                          {/* <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                          {lead?.lead_source}
                        </td>
                        <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                          {lead?.lead_status}
                        </td> */}
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {lead?.customer?.company_name}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {lead?.assign_date
                              ? new Date(lead.assign_date).toLocaleDateString(
                                  "en-GB"
                                ) // outputs: DD/MM/YYYY
                              : "-"}
                          </td>
                          <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                            {lead?.lead_summary}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
              {/* {/------- Table Data End -------/} */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodaysLeadReport;
