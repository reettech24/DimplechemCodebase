import React, { useState } from "react";
import "./Budget.css";
import { iconsImgs } from "../../utils/images";
import { budget } from "../../data/data";
import ReactApexChart from "react-apexcharts";

const colors = ['#5d5d66', '#abacb5']; 
const colordata = ['#fff', '#fff']

import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

const Budget = () => { 
  const navigate = useNavigate();
  const [setSalesAnalyticsData, isSetSalesAnalyticsData] = useState(
    []
  );


 //api call for leads from marketing graph
  const SalesAnalyticGraph = async (id) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/getSalesAnalytics`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log("SalesAnalyticGraph", response?.data?.data);
      isSetSalesAnalyticsData(response?.data?.data);
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };

  useEffect(() => {
    if(!setSalesAnalyticsData.length>0){
      SalesAnalyticGraph();
    } 
  }, []);

  //console.log("setSalesAnalyticsData",setSalesAnalyticsData);
  //end api call for leads from marketing graph
  //console.log("setSalesAnalyticsData",setSalesAnalyticsData);

  const [state, setState] = useState({
    series: [
      {
        name: "Expected",
        data: [25, 35, 40, 45, 50],
      },
      {
        name: "Achieved",
        data: [10, 15, 18, 16, 8],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "line",
        dropShadow: {
          enabled: true,
          color: colors[0], // Dynamic shadow color
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.5,
        },
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false,
        },
      },
      colors: ["red", "green"], // Dynamic line colors
      dataLabels: {
        enabled: true,
        style: {
          colors: [colors[0]], // Dynamic data label color
        },
      },
      stroke: {
        curve: "smooth",
      },
      title: {
        align: "left",
        style: {
          color: colordata[0], // Dynamic title color
        },
      },
      grid: {
        borderColor: colors[0], // Dynamic grid border color
        row: {
          colors: ["#2e2e3c", "transparent"],
          opacity: 0.5,
        },
      },
      markers: {
        size: 5,
        colors: [colors[1]],
        strokeColors: colors[0], // Dynamic marker border color
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        title: {
          text: "",
          style: {
            color: colordata[0], // Dynamic x-axis title color
          },
        },
        labels: {
          style: {
            colors: colordata[0], // Dynamic x-axis label color
          },
        },
      },
      yaxis: {
        title: {
          text: "Sales Analytics",
          style: {
            color: colors[0], // Dynamic y-axis title color
          },
        },
        labels: {
          style: {
            colors: "white", // Static white y-axis label color
          },
          offsety: 0,
        },
        min: 0,
        max: 2000,
      },
      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5,
        labels: {
          colors: ["white", "white"], // Static legend text color
        },
      },
      tooltip: {
        theme: "dark",
        style: {
          fontSize: "12px",
          colors: [colors[0]], // Dynamic tooltip text color
        },
        y: {
          formatter: function (val) {
            return val;
          },
        },
      },
    },
  });

   useEffect(() => {
    // 👉 Simulated API call — replace with your real API
    const fetchData = async () => {
      const response = {
        expected: setSalesAnalyticsData.expected,
        achieved: setSalesAnalyticsData.achieved,
        labels: setSalesAnalyticsData.labels,
      };

      // update state with new data
      setState((prevState) => ({
        ...prevState,
        series: [
          { ...prevState.series[0], data: response.expected },
          { ...prevState.series[1], data: response.achieved },
        ],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: setSalesAnalyticsData.labels,
          },
        },
      }));
    };

    
    fetchData();
    
  }, [setSalesAnalyticsData]);

  const handleNavigateSalesNavigate =() =>{
    navigate("/sale-management/leads/po-form");
  }

  return (
    <div className="grid-one-item grid-common grid-c1 flex flex-col gap-6 cursor-pointer" onClick={handleNavigateSalesNavigate}>
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">
          Sales Analytics (In Lac)
        </h3>
        <button className="grid-c-title-icon">
          <img src={iconsImgs.plus} alt="Plus Icon" />
        </button>
      </div>
      <div className="grid-c-top text-silver-v1 w-full overflow-hidden max-h-[250px]">
        <div id="chart" className="w-full">
          <ReactApexChart
            options={state.options}
            series={state.series}
            type="line"
            height={200}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    </div>
  );
};

export default Budget;
