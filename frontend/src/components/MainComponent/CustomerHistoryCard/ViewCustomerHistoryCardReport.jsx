import React from "react";
import html2pdf from "html2pdf.js";

const ViewCustomerHistoryCardReport = ({
  setViewModalOpen,
  selectedCustomer,
}) => {
  const headerCellStyle = {
    padding: "8px",
    border: "1px solid #ccc",
    fontWeight: "bold",
    textAlign: "left",
    backgroundColor: "#e5e7eb",
  };

  const cellStyle = {
    padding: "8px",
    border: "1px solid #ccc",
    textAlign: "left",
    verticalAlign: "top",
  };

  const userFirsthistoryData = [
    {
      label: "Date of Visit",
      value: new Date(
        selectedCustomer?.leads?.[0]?.assign_date
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    },
    {
      label: "Visit Remark",
      value:
        selectedCustomer?.leads?.[0]?.communications?.[0]?.followup_summary,
    },
    {
      label: "Next Visit Plan",
      value: new Date(
        selectedCustomer?.leads?.[0]?.next_followup
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    },
    {
      label: "Location mapping Tag",
      value: selectedCustomer?.leads?.[0]?.communications?.[0]?.end_location,
    },
  ];

  const userSecondhistoryData = [
    {
      label: "Date of Email",
      value: new Date(
        selectedCustomer?.secureDocuments?.[0]?.createdAt
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    },
    { label: "Email sent / received", value:selectedCustomer?.secureDocuments?.length  },
    {
      label: "Customer Email ID",
      value: selectedCustomer?.secureDocuments?.[0]?.to_email,
    },
    {
      label: "Subject of email",
      value: selectedCustomer?.secureDocuments?.[0]?.subject,
    },
  ];

  const userThirdhistoryData = [
    {
      label: "Date of Document Sent",
      value: new Date(
        selectedCustomer?.secureDocuments?.[0]?.createdAt
      ).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    },
    { label: "Document sent through", value: "Zip" },
    {
      label: "Server Location",
      value: selectedCustomer?.secureDocuments?.[0]?.downloadLink,
    },
    {
      label: "Document file name",
      value: selectedCustomer?.secureDocuments?.[0]?.filename,
    },
  ];

  const handleDownloadPDF = () => {
    const element = document.getElementById("pdf-download-content");
    import("html2pdf.js").then((html2pdf) => {
      html2pdf
        .default()
        .set({
          margin: 0.5,
          filename: "Customer_History_Report.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
        })
        .from(element)
        .save();
    });
  };

  return (
    <>
    <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 10px;
            cursor: pointer;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #fe6c00c4 !important; 
            border-radius: 8px;
            cursor: pointer;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
            cursor: pointer;
          }

          /* For Firefox */
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #68574c transparent;
            cursor: pointer;
          }
       `}
      </style>
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full w-full md:w-[1400px] overflow-y-auto pt-0 pb-4 rounded-[6px] flex flex-col">
          <h2 className="text-white text-[18px] font-poopins mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            Customer History Card Report
          </h2>

          <div className="mt-5 px-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="table-auto w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-400 rounded-[8px] ">
                    <th className="px-4 py-2 text-center text-gray-800  whitespace-nowrap ">
                      Required Fields
                    </th>
                    <th className="px-4 py-2 text-left text-gray-800 whitespace-nowrap ">
                      Description
                    </th>
                    <th className="px-4 py-2 text-left text-gray-800 whitespace-nowrap ">
                      Sample Data
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border">
                    <td className="px-4 py-2 text-center text-newtextdata whitespace-nowrap">
                      1
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      Name of Customer with address
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      {selectedCustomer?.company_name}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 text-center py-2 text-newtextdata whitespace-nowrap">
                      2
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      DCSPL employee name
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      {selectedCustomer?.salesPerson?.fullname}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 text-center py-2 text-newtextdata whitespace-nowrap">
                      3
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      Business Associate code
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      {selectedCustomer?.businessAssociates?.code}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 text-center py-2 text-newtextdata whitespace-nowrap">
                      4
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      <strong className="text-[15px]">Activity List:</strong>

                      <div className="mt-2">
                        <b> A. Visit index having details of</b>
                        <div className="w-fit border border-gray-300 text-sm text-left rounded-lg overflow-hidden">
                          {userFirsthistoryData.map((item, index) => (
                            <div
                              key={index}
                              className={`flex items-baseline py-2 px-4 ${
                                index < userFirsthistoryData.length - 1
                                  ? "border-b border-gray-200"
                                  : ""
                              }`}
                            >
                              <div className="font-semibold text-[13px] text-gray-600 w-52 flex-shrink-0">
                                {item.label}
                              </div>
                              <div className="text-gray-800 px-2">
                                : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              </div>
                              <div className="text-gray-800 text-[13px] flex-grow whitespace-normal">
                                {item.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <b> B. Email Index having details</b>
                        <div className="w-fit border border-gray-300 text-sm text-left rounded-lg overflow-hidden">
                          {userSecondhistoryData.map((item, index) => (
                            <div
                              key={index}
                              className={`flex items-baseline py-2 px-4 ${
                                index < userSecondhistoryData.length - 1
                                  ? "border-b border-gray-200"
                                  : ""
                              }`}
                            >
                              <div className="font-semibold text-[13px] text-gray-600 w-52 flex-shrink-0">
                                {item.label}
                              </div>
                              <div className="text-gray-800 px-2">
                                : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              </div>
                              <div className="text-gray-800 text-[13px] flex-grow">
                                {item.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <b> C. Document index with server hyperlink</b>
                        <div className="w-fit border border-gray-300 text-sm text-left rounded-lg overflow-hidden">
                          {userThirdhistoryData.map((item, index) => (
                            <div
                              key={index}
                              className={`flex items-baseline py-2 px-4 ${
                                index < userThirdhistoryData.length - 1
                                  ? "border-b border-gray-200"
                                  : ""
                              }`}
                            >
                              <div className="font-semibold text-[13px] text-gray-600 w-52 flex-shrink-0">
                                {item.label}
                              </div>
                              <div className="text-gray-800 px-2">
                                : &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              </div>
                              <div className="text-gray-800 text-[13px] flex-grow">
                                {item.value}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <b> D. Phone call index</b>
                      </div>
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 text-center py-2 text-newtextdata whitespace-nowrap">
                      5
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      Total Business Potential
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      {" "}
                      {selectedCustomer?.leads?.length > 0
                        ? selectedCustomer.leads.reduce(
                            (total, lead) =>
                              total + (parseFloat(lead.approx_business) || 0),
                            0
                          )
                        : 0}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 text-center py-2 text-newtextdata whitespace-nowrap">
                      6
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      Till date achieved Business
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      {" "}
                      {selectedCustomer?.leads?.length > 0
                        ? selectedCustomer.leads.reduce(
                            (total, lead) =>
                              total + (parseFloat(lead.approx_business) || 0),
                            0
                          )
                        : 0}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 text-center py-2 text-newtextdata whitespace-nowrap">
                      7
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      Reason for shortage / excess
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      Delayed shipment
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 text-center py-2 text-newtextdata whitespace-nowrap">
                      8
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      Reason for customer lost
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      {selectedCustomer?.leads?.[0]?.communications?.[0]?.lead_status?.includes(
                        "Lost"
                      ) ? (
                        <span>
                          {
                            selectedCustomer?.leads?.[0]?.communications?.[0]
                              ?.followup_summary
                          }
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 text-center py-2 text-newtextdata whitespace-nowrap">
                      9
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      Corrective action / future plan
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      Improve delivery speed
                    </td>
                  </tr>
                  <tr className="border">
                    <td className="px-4 text-center py-2 text-newtextdata whitespace-nowrap">
                      10
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap">
                      Lead / customer refered by, who is not a business
                      associates
                    </td>
                    <td className="px-4 py-2 text-newtextdata whitespace-nowrap"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-end justify-end gap-2 px-4">
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </button>
            <button
              className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
              onClick={() => setViewModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div
        id="pdf-download-content"
        style={{
          textAlign: "center",
          color: "black",
          padding: "20px",
          borderRadius: "5px",
          width: "100%",
          fontFamily: "Arial, sans-serif",
          fontSize: "14px",
        }}
      >
        <div style={{ marginBottom: "20px" }}>
          <h2
            style={{
              backgroundColor: "#f97316",
              color: "white",
              padding: "10px",
              borderRadius: "5px",
              margin: 0, // important: reset internal margin
            }}
          >
            Customer History Card Report
          </h2>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: "1px solid #ccc",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#e5e7eb" }}>
              <th style={headerCellStyle}>Required Fields</th>
              <th style={headerCellStyle}>Description</th>
              <th style={headerCellStyle}>Sample Data</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={cellStyle}>1</td>
              <td style={cellStyle}>Name of Customer with address</td>
              <td style={cellStyle}>{selectedCustomer?.company_name || "-"}</td>
            </tr>

            <tr>
              <td style={cellStyle}>2</td>
              <td style={cellStyle}>DCPSL employee name</td>
              <td style={cellStyle}>
                {selectedCustomer?.leads?.[0]?.assignedPerson?.fullname || "-"}
              </td>
            </tr>

            <tr>
              <td style={cellStyle}>3</td>
              <td style={cellStyle}>Business Associate code</td>
              <td style={cellStyle}>
                {selectedCustomer?.businessAssociates?.code || "-"}
              </td>
            </tr>

            <tr>
              <td style={cellStyle}>4</td>
              <td style={cellStyle}>
                <strong style={{ fontSize: "15px" }}>Activity List:</strong>

                {/* A. Visit Index */}
                <div style={{ marginTop: "12px" }}>
                  <b>A. Visit index having details of</b>
                  <table
                    style={{
                      width: "100%",
                      border: "1px solid #ccc",
                      borderCollapse: "collapse",
                      fontSize: "13px",
                      marginTop: "6px",
                    }}
                  >
                    <tbody>
                      {userFirsthistoryData.map((item, index) => (
                        <tr
                          key={index}
                          style={{ borderBottom: "1px solid #ddd" }}
                        >
                          <td
                            style={{
                              width: "200px",
                              fontWeight: "bold",
                              padding: "6px",
                              color: "#4b5563",
                            }}
                          >
                            {item.label}
                          </td>
                          <td style={{ padding: "6px" }}>: {item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* B. Email Index */}
                <div style={{ marginTop: "12px" }}>
                  <b>B. Email Index having details</b>
                  <table
                    style={{
                      width: "100%",
                      border: "1px solid #ccc",
                      borderCollapse: "collapse",
                      fontSize: "13px",
                      marginTop: "6px",
                    }}
                  >
                    <tbody>
                      {userSecondhistoryData.map((item, index) => (
                        <tr
                          key={index}
                          style={{ borderBottom: "1px solid #ddd" }}
                        >
                          <td
                            style={{
                              width: "200px",
                              fontWeight: "bold",
                              padding: "6px",
                              color: "#4b5563",
                            }}
                          >
                            {item.label}
                          </td>
                          <td style={{ padding: "6px" }}>: {item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* C. Document Index */}
                <div style={{ marginTop: "12px" }}>
                  <b>C. Document index with server hyperlink</b>
                  <table
                    style={{
                      width: "100%",
                      border: "1px solid #ccc",
                      borderCollapse: "collapse",
                      fontSize: "13px",
                      marginTop: "6px",
                    }}
                  >
                    <tbody>
                      {userThirdhistoryData.map((item, index) => (
                        <tr
                          key={index}
                          style={{ borderBottom: "1px solid #ddd" }}
                        >
                          <td
                            style={{
                              width: "200px",
                              fontWeight: "bold",
                              padding: "6px",
                              color: "#4b5563",
                            }}
                          >
                            {item.label}
                          </td>
                          <td style={{ padding: "6px" }}>: {item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* D. Phone call index */}
                <div style={{ marginTop: "12px" }}>
                  <b>D. Phone call index</b>
                  <div style={{ fontSize: "13px", marginTop: "6px" }}>
                    - (Phone data not available)
                  </div>
                </div>
              </td>

              {/* Leave third cell blank or with placeholder if needed */}
              <td style={cellStyle}></td>
            </tr>

            {/* <tr>
              <td style={cellStyle}>4</td>
              <td style={cellStyle}>
                <strong>Activity List:</strong>
                <br />
                <b>a. Visit index</b>
                <br />
                - Date of Visit
                <br />
                - Visit Remark
                <br />
                - Next Visit Plan
                <br />
                - Location mapping Tag
                <br />
                <b>b. Email Index</b>
                <br />
                - Date of Email
                <br />
                - Email sent / received
                <br />
                - Customer Email ID
                <br />
                - Subject
                <br />
                <b>c. Document Index</b>
                <br />
                - Date of Document Sent
                <br />
                - Sent through
                <br />
                - Server Link
                <br />
                - Filename
                <br />
                <b>d. Phone call index</b>
              </td>
              <td style={cellStyle}>
                -{" "}
                {selectedCustomer?.leads?.[0]?.assign_date
                  ? new Date(
                      selectedCustomer?.leads?.[0]?.assign_date
                    ).toLocaleDateString("en-GB")
                  : "-"}
                <br />-{" "}
                {selectedCustomer?.leads?.[0]?.communications?.[0]
                  ?.followup_summary || "-"}
                <br />-{" "}
                {selectedCustomer?.leads?.[0]?.next_followup
                  ? new Date(
                      selectedCustomer?.leads?.[0]?.next_followup
                    ).toLocaleDateString("en-GB")
                  : "-"}
                <br />-{" "}
                {selectedCustomer?.leads?.[0]?.communications?.[0]
                  ?.end_location || "-"}
                <br />
                <br />-{" "}
                {selectedCustomer?.secureDocuments?.[0]?.createdAt
                  ? new Date(
                      selectedCustomer?.secureDocuments?.[0]?.createdAt
                    ).toLocaleDateString("en-GB")
                  : "-"}
                <br />- Yes
                <br />-{" "}
                {selectedCustomer?.secureDocuments?.[0]?.to_email || "-"}
                <br />- {selectedCustomer?.secureDocuments?.[0]?.subject || "-"}
                <br />
                <br />-{" "}
                {selectedCustomer?.secureDocuments?.[0]?.createdAt
                  ? new Date(
                      selectedCustomer?.secureDocuments?.[0]?.createdAt
                    ).toLocaleDateString("en-GB")
                  : "-"}
                <br />- Zip
                <br />-{" "}
                {selectedCustomer?.secureDocuments?.[0]?.downloadLink || "-"}
                <br />-{" "}
                {selectedCustomer?.secureDocuments?.[0]?.filename || "-"}
                <br />- (Phone data not available)
              </td>
            </tr> */}

            <tr>
              <td style={cellStyle}>5</td>
              <td style={cellStyle}>Total Business Potential</td>
              <td style={cellStyle}>
                {selectedCustomer?.leads?.length > 0
                  ? selectedCustomer.leads.reduce(
                      (total, lead) =>
                        total + (parseFloat(lead.approx_business) || 0),
                      0
                    )
                  : 0}
              </td>
            </tr>

            <tr>
              <td style={cellStyle}>6</td>
              <td style={cellStyle}>Till date achieved Business</td>
              <td style={cellStyle}>
                {selectedCustomer?.leads?.length > 0
                  ? selectedCustomer.leads.reduce(
                      (total, lead) =>
                        total + (parseFloat(lead.approx_business) || 0),
                      0
                    )
                  : 0}
              </td>
            </tr>

            <tr>
              <td style={cellStyle}>7</td>
              <td style={cellStyle}>Reason for shortage / excess</td>
              <td style={cellStyle}>Delayed shipment</td>
            </tr>

            <tr>
              <td style={cellStyle}>8</td>
              <td style={cellStyle}>Reason for customer lost</td>
              <td style={cellStyle}>
                {selectedCustomer?.leads?.[0]?.communications?.[0]?.lead_status?.includes(
                  "Lost"
                )
                  ? selectedCustomer?.leads?.[0]?.communications?.[0]
                      ?.followup_summary
                  : "-"}
              </td>
            </tr>

            <tr>
              <td style={cellStyle}>9</td>
              <td style={cellStyle}>Corrective action / future plan</td>
              <td style={cellStyle}>Improve delivery speed</td>
            </tr>

            <tr>
              <td style={cellStyle}>10</td>
              <td style={cellStyle}>
                Lead / customer referred by, who is not a business associate
              </td>
              <td style={cellStyle}>-</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ViewCustomerHistoryCardReport;
