import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import SuccessMessage from "../AlertMessage/SuccessMessage";
import ErrorMessage from "../AlertMessage/ErrorMessage";
import axios from "axios";
import TodaysLeadReport from "./TodaysLeadReport";
import EmpSARReport from "./EmpSARReport";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

import { iconsImgs } from "../../utils/images";
import "../Loans/Loans.css";

const mettingsschedule = [
  {
    id: 1,
    name: "Rahul Sharma",
    todaymeeting: "rahul.sharma@example.com",
    archeieveday: "Active",
  },
  {
    id: 1,
    name: "Rahul Sharma",
    todaymeeting: "rahul.sharma@example.com",
    archeieveday: "Active",
  },
  {
    id: 1,
    name: "Rahul Sharma",
    todaymeeting: "rahul.sharma@example.com",
    archeieveday: "Active",
  },
];

const MeetingPage = () => {
  const today = new Date();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [viewLeadReportOpen, setViewLeadReportOpen] = useState(false);
  const [selectedLeadData, setSelectedLeadData] = useState(false);

  const [todayPOACount, settodayPOACount] = useState([]);
  //console.log("todayPOACount",todayPOACount);

  const fetchPlanOfActionReport = async () => {
    try {
      // ✅ Get token
      const token = getAuthToken();

      // ✅ Correct API call with query parameters
      const response = await axios.get(`${API_URL}/auth/poa-for-day`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      settodayPOACount(response.data.data);
      console.log("poa data", response);
      //return response.data; // Return data if needed
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };
  useEffect(() => {
    fetchPlanOfActionReport();
  }, [dispatch]);

  const formattedDate = today.toLocaleDateString("en-GB");

  return (
    <div className="grid-two-item grid-common heightfitdata grid-c4 flex flex-col gap-3">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Visit Plan</h3>
        <button className="grid-c-title-icon">
          <img src={iconsImgs.plus} />
        </button>
      </div>
      <p className="text-[#fbc02d] text-start -mb-2 text-[11px]">
        <b>Today's Date</b> : &nbsp;&nbsp;{formattedDate}
      </p>
      <div className="overflow-x-auto custom-scrollbar max-h-[500px]">
        <table className="table-auto w-full text-center border-collapse">
          <thead >
            <tr className="bg-[#473b33] rounded-[8px]">
              <th className="px-4 py-2 text-[10px] md:text-textdata">ID</th>
              <th className="px-4 py-2 text-[10px] md:text-textdata">Name</th>
              <th className="px-4 py-2 text-[10px] md:text-textdata">Today's Meetings</th>
              <th className="px-4 py-2 text-[10px] md:text-textdata whitespace-nowrap hidden md:block">Achieved for the day</th>
              <th className="px-4 py-2 text-[10px] md:text-textdata whitespace-nowrap block md:hidden">Achieved day</th>
            </tr>
          </thead>
          <tbody>
            {todayPOACount?.map((metting, index) => (
              <tr
                key={index + 1}
                className="text-center hover:bg-[#1e1e2d78] cursor-pointer"
              >
                <td className="px-4 py-2 text-[10px] md:text-textdata">{index + 1}</td>
                <td
                  className="px-4 py-2 text-[10px] md:text-textdata"
                  onClick={() => {
                    setSelectedLeadData(metting);
                    //setViewLeadReportOpen(true);
                  }}
                >
                  {metting?.fullname}
                </td>
                <td className="px-4 py-2 text-[10px] md:text-textdata">{metting?.email}</td>
                <td className="px-4 py-2 text-[10px] md:text-textdata">
                  {metting?.total_meetings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* View User Modal */}
      {/* {viewLeadReportOpen && (
        <TodaysLeadReport
          setViewLeadReportOpen={setViewLeadReportOpen}
          selectedLeadData={selectedLeadData}
        />
      )} */}

      {viewLeadReportOpen && (
        <EmpSARReport
        setpoaReportOpen={setViewLeadReportOpen}
        selectedPOA={selectedLeadData}
        />
      )}
    </div>
  );
};

export default MeetingPage;
