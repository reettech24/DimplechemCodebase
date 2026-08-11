import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { iconsImgs } from "../../utils/images";
import "./Report.css";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

const colors = ["#fff", "#fff", "#fff", "#fff", "#fff"]; // Define your color combination

const colordata = ["#5d5d66", "#abacb5"];
const Report = () => {
  const navigate = useNavigate();
  const [setLeadsAnalysisGraphData, isSetLeadsAnalysisGraphData] = useState(
    []
  );

  //console.log("setLeadsAnalysisGraphData",setLeadsAnalysisGraphData);

   //api call for Leads Analysis
  const LeadsAnalysisGraph = async (id) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/getLeadAnalysis`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log("response", response?.data);
      isSetLeadsAnalysisGraphData(response?.data);
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };

  useEffect(() => {
    LeadsAnalysisGraph();
  }, []);
  //end api call for Leads Analysis


  const [chartData, setChartData] = useState({
    series: [
      // { name: "MKTG", data: [10, 15, 18, 16, 8] },
      // { name: "SALES", data: [7, 10, 8, 10, 5] },
       { name: "MKTG", data: [] },
      { name: "SALES", data: [] },
    ],
    options: {
      chart: { type: "bar", height: 430, toolbar: {
      show: false,  // <-- Add this line to hide the 3 lines toolbar
    } },
      colors: [colordata[0], colordata[1]], // Red for Marketing, Green for Sales
      plotOptions: {
        bar: { horizontal: true, dataLabels: { position: "top" } },
      },
      dataLabels: {
        enabled: false,
        offsetX: -6,
        style: { fontSize: "12px", colors: ["#fff"] },
      },
      stroke: { show: true, width: 1, colors: ["#fff"] },
      tooltip: {
        theme: "dark",
        shared: true,
        intersect: false,
        y: {
          formatter: function (value, { seriesIndex, dataPointIndex, w }) {
            // Get values of both series at the given index
            // const mktValue = w.globals.series[0][dataPointIndex] || 0;
            // const salesValue = w.globals.series[1][dataPointIndex] || 0;
            // const total = mktValue + salesValue;

            // return `MKTG: ${mktValue} | SALES: ${salesValue} | Total: ${total}`;
          },
        },
      },
      xaxis: {
        categories: ["January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"], // Reversed order
        labels: {
          style: {
            colors: [colors[2], colors[3], colors[4], colors[2], colors[3],colors[2],colors[2],colors[2],colors[2],colors[2],colors[2],colors[2]], // Dynamic colors for months
            fontSize: "12px",
          },
        },
        tickAmount: 4, // Controls the number of ticks displayed
        min: 0, // Start from 0
        max: 800, // End at 20
      },
      yaxis: {
        categories: ["January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"],
        labels: {
          style: {
            colors: [colors[1], colors[0], colors[3], colors[4], colors[2],colors[4],colors[4],colors[4],colors[4],colors[4],colors[4],colors[4]], // Dynamic colors for Y-axis labels
            fontSize: "12px",
          },
        },
      },
      legend: {
        labels: {
          colors: [colors[0], colors[1]], // Use dynamic colors for the legend items
        },
      },
    },
  });


   useEffect(() => {
    const fetchChartData = async () => {
      // Replace this simulated response with your real API call
      const response = {
        success: true,
        categories: setLeadsAnalysisGraphData?.categories,
        series: [
          { name: "MKTG", data: setLeadsAnalysisGraphData?.series[0]?.data },
          { name: "SALES", data: setLeadsAnalysisGraphData?.series[1]?.data },
        ],
      };

      if (response.success) {
        setChartData((prevState) => ({
          ...prevState,
          series: response.series,
          options: {
            ...prevState.options,
            xaxis: {
              ...prevState.options.xaxis,
              categories: response.categories,
            },
          },
        }));
      }
    };

    fetchChartData();
  }, [setLeadsAnalysisGraphData]);

  return (
    <div onClick={() => {
              navigate("/sale-management/leads/lead-management");
            }} className="grid-one-item grid-common grid-c1 flex flex-col justify-between">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Leads Analysis</h3>
        <button className="grid-c-title-icon">
          <img src={iconsImgs.plus} alt="Add" />
        </button>
      </div>
      <div className="grid-c3-content">
        <ReactApexChart
          options={chartData.options}
          series={chartData.series}
          type="bar"
          height={220}
        />
      </div>
    </div>
  );
};

export default Report;
