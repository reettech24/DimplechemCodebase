import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { iconsImgs } from "../../utils/images";
import "./Financial.css";
import { useNavigate } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";
const API_URL = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem("token");

const Financial = () => {
  const navigate = useNavigate();
  const [setLeadsAnalysisGraphData, isSetLeadsAnalysisGraphData] = useState([]);

  const [chartData, setChartData] = useState({
    series: [{ data: [] }],
    options: {}, // will fill later
  });

  //api call for leads from marketing graph
  const LeadAnalysisGraph = async (id) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/auth/getLeadStatusCount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      //console.log("12", response?.data?.data);
      isSetLeadsAnalysisGraphData(response?.data?.data);
    } catch (error) {
      console.error("Error in fetching data:", error);
    }
  };

  //console.log("setLeadsAnalysisGraphData",setLeadsAnalysisGraphData);

  useEffect(() => {
    LeadAnalysisGraph();
  }, []);

  //end api call for leads from marketing graph

  const colors = [
    "#fe6c00a3",
    "#fe6c00a3",
    "#fe6c00a3",
    "#fe6c00a3",
    "#fe6c00a3",
    "#fe6c00a3",
  ];

  // const [chartData] = useState({
  //   series: [
  //     {
  //       data: [50, 20, 40, 5, 25],

  //     },
  //   ],
  //   options: {
  //     chart: {
  //       height: 350,
  //       type: "bar",
  //       toolbar: {
  //     show: false,  // <-- Add this line to hide the 3 lines toolbar
  //   },
  //       events: {
  //         click: function (chart, w, e) {
  //           // console.log(chart, w, e)
  //         },
  //       },
  //     },
  //     colors: colors,
  //     plotOptions: {
  //       bar: {
  //         columnWidth: "50%",
  //         distributed: true,
  //       },
  //     },
  //     dataLabels: {
  //       enabled: true,
  //       style: {
  //         colors: ['#fff'],
  //         fontSize: '14px',
  //         fontWeight: 'bold'
  //       },
  //       offsetY: 0,
  //       position: 'center'
  //     },
  //     legend: {
  //       show: false,
  //     },
  //     xaxis: {
  //       categories: [
  //         ["Cold"],
  //         ["Hot"],
  //         ["Lost"],
  //         ["On Hold"],
  //         ["Warm"],
  //       ],
  //       labels: {
  //         style: {
  //           colors: "#fff",
  //           fontSize: "12px",
  //           fontWeight: "500"
  //         },
  //       },
  //     },
  //     yaxis: {
  //       min: 0,
  //       max: 50,
  //       tickAmount: 10,
  //       labels: {
  //         style: {
  //           colors: "#ffffff", // Makes Y-axis labels white
  //           fontSize: "12px",
  //         },
  //       },
  //        grid: {
  //         borderColor: "#434350", // Sets the grid line color behind the graph
  //       },
  //     },
  //     tooltip: {
  //       theme: "dark", // This will make the tooltip background black
  //     },
  //     // plotOptions: {
  //     //   bar: {
  //     //     columnWidth: "40%", // Graph bars ki thickness ko adjust karne ke liye
  //     //     distributed: true,
  //     //   },
  //     // },

  //   },
  // });

  useEffect(() => {
    const data = setLeadsAnalysisGraphData.map((item) => item.count); // your custom logic
    // const colors = [
    //   "#fe6c00a3",
    //   "#fe6c00a3",
    //   "#fe6c00a3",
    //   "#fe6c00a3",
    //   "#fe6c00a3",
    // ];

    setChartData({
      series: [{ data }],
      options: {
        chart: {
          height: 350,
          type: "bar",
          toolbar: { show: false },
        },
        // colors: colors,
        plotOptions: {
          bar: {
            columnWidth: "50%",
            distributed: true,
          },
        },
        dataLabels: {
          enabled: true,
          style: {
            colors: ["#fff"],
            fontSize: "14px",
            fontWeight: "bold",
          },
          offsetY: 0,
          position: "center",
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "light",
            type: "vertical", // vertical gradient from bottom to top
            shadeIntensity: 0.4,
            gradientToColors: ["#5d5d66"], // ending color
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
            colorStops: [
              {
                offset: 0,
                color: "#abacb5", // starting color
                opacity: 1,
              },
              {
                offset: 100,
                color: "#5d5d66", // ending color
                opacity: 1,
              },
            ],
          },
        },
        legend: { show: false },
        xaxis: {
          categories: [["Hot"], ["Warm"], ["Cold"], ["OC"], ["Lost"]],
          labels: {
            style: {
              colors: "#fff",
              fontSize: "12px",
              fontWeight: "500",
            },
          },
        },
        yaxis: {
          min: 0,
          max: 60, // adjust based on expected max
          tickAmount: 10,
          labels: {
            style: { colors: "#ffffff", fontSize: "12px" },
          },
        },
        tooltip: { theme: "dark" },
      },
    });
  }, [setLeadsAnalysisGraphData]);

  //console.log("chartData", chartData);

  return (
    <div
      onClick={() => {
        navigate("/sale-management/leads/lead-management");
      }}
      className="grid-one-item grid-common grid-c1 flex flex-col justify-between"
    >
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Lead Analysis Graph</h3>
        <button className="grid-c-title-icon">
          <img src={iconsImgs.plus} alt="plus-icon" />
        </button>
      </div>
      <div className="grid-c8-content">
        <div id="chart">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="bar"
            height={220}
          />
        </div>
        <div id="html-dist"></div>
      </div>
    </div>
  );
};

export default Financial;
