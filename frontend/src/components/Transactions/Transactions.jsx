import React, { useState,useEffect } from "react";
import ReactApexChart from "react-apexcharts";
import { iconsImgs } from "../../utils/images";
import "./Transactions.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const getAuthToken = () => localStorage.getItem("token");

const Transactions = () => {

  const navigate = useNavigate();

//   const [salespersons, setSalespersons] = useState(['nikhil@dimplechem.com','accounts@dimplechem.com','umasharma0821@gmail.com']);

//   const [bkgmailAccessToken, setbkGmailAccessToken] = useState('');


//   const fetchAccessTokenFromBackend = async (userEmail) => {
//     try {
//         const response = await fetch(`${API_URL}/get-gmail-access-token`, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ userEmailToImpersonate: userEmail }),
//         });

//         if (!response.ok) {
//             throw new Error(`Backend token request failed: ${response.statusText}`);
//         }

//         const data = await response.json();
//         return data.accessToken;
//     } catch (error) {
//         console.error('Error fetching token from backend:', error);
//         return null;
//     }
// };

// useEffect(() => {

//     const getInitialToken = async () => {
//         // Example: Get token for the first salesperson in your list
//         if (salespersons.length > 0) {
//             const token = await fetchAccessTokenFromBackend("nikhil@dimplechem.com"); // Or the admin's own email if they are tracking their own
//             if (token) {
//                 setbkGmailAccessToken(token);
//             }
//         }
//     };
//     getInitialToken();
// }, [salespersons]); // Re-run if user or salespersons list changes

//  const [companyMetrics, setCompanyMetrics] = useState({
//     totalSent: 0,
//     totalBounced: 0,
//     totalUnopened: 0,
//     totalOpened: 0,
//   });

//   const [salespersonMetrics, setSalespersonMetrics] = useState([]);


//    const [loading, setLoading] = useState(false);
//   // Error state to display any issues during API calls
//   const [error, setError] = useState(null);


//    const fetchMessageCount = async (userEmail, query) => {
//     try {
//       // Construct the Gmail API URL to query messages for a specific user
//       const response = await fetch(
//         `https://gmail.googleapis.com/gmail/v1/users/${userEmail}/messages?q=${encodeURIComponent(query)}&maxResults=1`,
//         {
//           headers: {
//             Authorization: `Bearer ${bkgmailAccessToken}`, // Use the Domain-Wide Delegation access token for authorization
//           },
//         }
//       );

//       if (!response.ok) {
//         // Handle cases where the token might be expired or unauthorized
//         if (response.status === 401) {
//           console.warn(`Token expired or unauthorized for user ${userEmail}. Please ensure your DWD token is valid.`);
//           // In a production app, you would likely trigger a token refresh or re-authentication flow here.
//           return 0; // Return 0 to avoid breaking the aggregation
//         }
//         throw new Error(`Error fetching count for ${userEmail}: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       // The `resultSizeEstimate` provides an approximate count, which is suitable for dashboards.
//       return data.resultSizeEstimate || 0;
//     } catch (err) {
//       console.error(`Failed to fetch count for query "${query}" for user ${userEmail}:`, err);
//       // Set a user-facing error message if needed, or rethrow for higher-level handling
//       // setError(`Failed to load data for ${userEmail}.`);
//       return 0; // Return 0 to ensure aggregation continues even if one user fails
//     }
//   };

//    const fetchMetricsForUser = async (userEmail) => {
//     // Use Promise.all to execute multiple API calls concurrently for better performance
//     const [sentCount, unopenedCount, bouncedCount] = await Promise.all([
//       fetchMessageCount(userEmail, "in:sent"), // Counts all emails sent by this user
//       fetchMessageCount(userEmail, "is:unread in:sent"), // Counts sent emails that are still marked as unread (inferred unopened)
//       fetchMessageCount(userEmail, 'from:mailer-daemon@googlemail.com "delivery status notification (failure)"'), // Counts bounce notifications
//     ]);
    
//     // Calculate 'opened' count by subtracting unopened from total sent.
//     // The Gmail API does not provide a direct "opened" status, so this is an inference.
//     const openedCount = sentCount - unopenedCount;

//     return {
//       email: userEmail,
//       sentCount,
//       bouncedCount,
//       unopenedCount,
//       openedCount
//     };
//   };

//     const fetchAllSalespersonMetrics = async () => {
//     // Ensure we have a valid access token and a list of salespersons to process
//     if (!bkgmailAccessToken || !salespersons || salespersons.length === 0) {
//       console.warn("Cannot fetch metrics: Access token is missing or salesperson list is empty.");
//       // Reset metrics and clear loading state if prerequisites are not met
//       setSalespersonMetrics([]);
//       setCompanyMetrics({ totalSent: 0, totalBounced: 0, totalUnopened: 0, totalOpened: 0 });
//       setLoading(false);
//       return;
//     }
//     // Initialize aggregation variables
//     let totalSent = 0;
//     let totalBounced = 0;
//     let totalUnopened = 0;
//     let totalOpened = 0;

//     // Fetch metrics for all salespersons concurrently using Promise.all
//     // This creates an array of promises, one for each salesperson's metrics.
//     const promises = salespersons.map(fetchMetricsForUser);
//     const individualMetrics = await Promise.all(promises); // Wait for all promises to resolve

//     // Aggregate the totals from the individual salesperson metrics
//     individualMetrics.forEach(metrics => {
//       totalSent += metrics.sentCount;
//       totalBounced += metrics.bouncedCount;
//       totalUnopened += metrics.unopenedCount;
//       totalOpened += metrics.openedCount;
//     });

//     // Update the React state with the aggregated company metrics
//     setCompanyMetrics({
//       totalSent,
//       totalBounced,
//       totalUnopened,
//       totalOpened
//     });
//     // Update the React state with the individual salesperson metrics
//     setSalespersonMetrics(individualMetrics);
//     setLoading(false);
//     // Set loading state to false after fetching is complete
//   };

//   useEffect(() => {
//     if (bkgmailAccessToken && salespersons.length > 0) {
//       fetchAllSalespersonMetrics();
//     }
//   }, [bkgmailAccessToken, salespersons]);


  const series = [30, 10, 5, 65]; // Absolute values
  const colors = ["#abacb5", "#1abc9c", "#9b59b6", "#5d5d66"]; // New vibrant colors

  const [chartData, setChartData] = useState({
    series: series,
    options: {
      chart: {
        type: "pie",
      },
      labels: ["Opened", "Bounced", "Unopened", "Unmailed Data"], 
      colors: colors, // Apply the vibrant color combination
      dataLabels: {
        enabled: true,
        style: {
          colors: ["#ffffff"], // White text for data labels
          fontWeight: "bold",
        },
        formatter: (value, { seriesIndex, w }) => {
          return `${w.config.series[seriesIndex]} %`; // Show value with % sign
        },
      },
      legend: {
        labels: {
          colors: ["#fff", "#fff", "#fff", "#fff"], // White text for legend
          useSeriesColors: false, // Prevents using default colors
        },
        position: "right",
      },
      tooltip: {
        y: {
          formatter: (value, { seriesIndex, w }) => {
            return `${w.config.series[seriesIndex]} %`; // Show value with % in tooltip
          },
        },
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
        },
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
            },
            legend: {
              position: "bottom",
            },
          },
        },
      ],
    },
  });

  return (
    <>
    <div  onClick={() => {
              navigate("/report-management/email-sent-report");
            }} className="grid-one-item grid-common grid-c1 flex flex-col justify-between">
      <div className="grid-c-title">
        <h3 className="grid-c-title-text">Email Analysis</h3>
        <button className="grid-c-title-icon">
          <img src={iconsImgs.plus} alt="plus icon" />
        </button>
      </div>

      <div className="grid-content flex items-center justify-center mb-4">
        <div id="chart">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series}
            type="pie"
            width={350}
            className=""
          />
        </div>
      </div>
    </div>
    </>
  );
};

export default Transactions;