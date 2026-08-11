import { iconsImgs } from "../../utils/images";
import "./Cards.css";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

const Cards = () => {
  const navigate = useNavigate();
  const [setLeadsFromMarketingData, isSetsetLeadsFromMarketingData] = useState(
    []
  );

  //api call for leads from marketing graph
  const LeadsfromMarketing = async (id) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/getMonthlyLeadCount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log("response", response?.data?.data);
      isSetsetLeadsFromMarketingData(response?.data?.data);
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };

  useEffect(() => {
    LeadsfromMarketing();
  }, []);

  //console.log("setLeadsFromMarketingData",setLeadsFromMarketingData)
  //end api call for leads from marketing graph

  const monthsArray = setLeadsFromMarketingData.map(item => item.quarter);
  const countArray = setLeadsFromMarketingData.map(item => item.count);

  //console.log(monthsArray); // ["Jan-Mar", "Apr-Jun", "Jul-Sep", "Oct-Dec"]
  //console.log(countArray);


  // const months1 = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","july", "Aug", "Sep", "Oct", "Nov", "Desc"];
  // const lead1 = months1.map((monthName) => {
  //   const monthData = setLeadsFromMarketingData.find(
  //     (item) => item.month === monthName
  //   );
  //   return monthData ? monthData.count : 0;
  // });
  // //console.log(lead1);

  //const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun","july", "Aug", "Sep", "Oct", "Nov", "Desc"];
  // const lead = [20, 30, 45, 50, 65, 95];
  const lead = countArray;
  //const conversion = ["30%", "50%", "60%", "50%", "10%", "30%","30%", "50%", "60%", "50%", "10%", "30%"];
  const colors = [
    "#fe6c00a3",
    "#fe6c00a3",
    "#fe6c00a3",
    "#fe6c00a3",
    "#fe6c00a3",
    "#fe6c00a3",
  ];

  const barData = {
    labels: monthsArray,
    datasets: [
      {
        label: "Monthly Leads & Conversion rate",
        data: lead,
         backgroundColor: function (context) {
      const chart = context.chart;
      const { ctx, chartArea } = chart;
      if (!chartArea) return null;
      const gradient = ctx.createLinearGradient( 
        0,
        chartArea.bottom,
        0,
        chartArea.top
      );
      gradient.addColorStop(0, "#5d5d66"); // Bottom orange
      gradient.addColorStop(1, "#abacb5"); // Top light orange
      
      return gradient;
    },
        // backgroundColor: function (context) {
        //   const chart = context.chart;
        //   const { ctx, chartArea } = chart;

        //   if (!chartArea) return null;

        //   const gradients = [];

        //   for (let i = 0; i < lead.length; i++) {
        //     const gradient = ctx.createLinearGradient(
        //       0,
        //       chartArea.bottom,
        //       0,
        //       chartArea.top
        //     );
        //     gradient.addColorStop(0, "#2b2b34"); // Bottom
        //     gradient.addColorStop(1, "#abacb5"); // Top
        //     gradients.push(gradient);
        //   }

        //   return gradients[context.dataIndex];
        // },
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false, // ✅ Graph ka height adjust karne ke liye
    plugins: {
      tooltip: {
        enabled: true,
        backgroundColor: "#000",
        displayColors: false,
        paddingTop: 10,
        callbacks: {
          label: function (tooltipItem) {
            const index = tooltipItem.dataIndex;
            const leadValue = lead[index];
            const conversionValue = conversion[index];
            return `Leads: ${leadValue}, Conversion: ${conversionValue}`;
          },
        },
      },
      datalabels: {
        display: true,
        color: "white", // Lead ka number white hoga
        font: {
          weight: "bold",
          size: 14,
        },
        formatter: (value) => value, // Sirf lead dikhayega
        anchor: "center",
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff", // X-axis labels white
          grid: { color: "rgba(255,255,255,0.1)" },
        },
        grid: {
          color: "rgba(255,255,255,0.1)", // Optional: X-axis grid lines ko halka white
        },
      },
      y: {
        min: 0, // Y-axis minimum value
        max: 1000, // Y-axis maximum value
        ticks: {
          stepSize: 100, // Har tick 5 ke gap me aayega (0, 5, 10, 15, ..., 80)
          color: "#ffffff",
        },
        grid: {
          color: "rgba(255,255,255,0.1)", // Optional: Y-axis grid lines ko halka white
        },
      },
    },
    animation: {
      onComplete: function () {
        const chartInstance = this;
        const ctx = chartInstance.ctx;
        ctx.font = "bold 10px Arial";
        ctx.fillStyle = "#ffffff"; // Conversion ka color yellow hoga
        ctx.textAlign = "center";

        chartInstance.data.datasets[0].data.forEach((value, index) => {
          const meta = chartInstance.getDatasetMeta(0).data[index];
          const x = meta.x;
          const y = meta.y - 10; // 20px upar taaki top per aaye
          ctx.fillText(conversion[index], x, y);
        });
      },
    },
    barThickness: 30, // Fixing bar width
    maxBarThickness: 30, // Maximum width allowed
  };

  return (
    <div  onClick={() => {
              navigate("/sale-management/leads/lead-management");
            }} className="grid-one-item grid-common grid-c1 flex flex-col justify-between">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Leads from Marketing</h3>
        <button className="grid-c-title-icon">
          <img src={iconsImgs.plus} alt="Add" />
        </button>
      </div>
      {/* <p className="text-[14px] text-bgDataNew mt-6 mb-2">Monthly Leads and Conversion Rate</p> */}
      <div className="">
        <Bar data={barData} options={barOptions} height={200} width={100} />
      </div>
    </div>
  );
};

export default Cards;
