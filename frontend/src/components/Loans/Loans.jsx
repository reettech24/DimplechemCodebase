import React, { useState, useEffect, useRef } from "react";
import { iconsImgs } from "../../utils/images";
import "./Loans.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

const Loans = () => {
    const navigate = useNavigate();
    const [setDeals, isSetDeals] = useState(
    []
  );

  //api call for leads from marketing graph
  const DealData = async (id) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/getDealCountByLead`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log("response", response?.data?.data[0]?.count);
      isSetDeals(response?.data?.data[0]?.count);
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };

  useEffect(() => {
    DealData();
  }, []);
  return (
    <div onClick={() => {
              navigate("/sale-management/leads/po-form");
            }} className="grid-one-item grid-common grid-c1 flex flex-col justify-between">
      <div className="grid-c-title pb-8">
        <h3 className="grid-c-title-text">Deal Creation</h3>
        <button className="grid-c-title-icon">
          <img src={iconsImgs.plus} />
        </button>
      </div>

      <div class="flex flex-col items-center justify-center">
        <span className="bg-gradient-to-br from-[#5d5d66] to-[#abacb5] text-white text-[30px]  rounded-full w-12 h-12 p-2 flex items-center justify-center h-[120px] w-[120px] mb-[10px]">
         {setDeals}
        </span>
        <h2 className="text-[12px] md:text-textdata whitespace-nowrap text-[#dccfc6] font-medium mb-5">
          Total Deal
        </h2> 
      </div>
    </div>
  );
};

export default Loans;
