import React from "react";
import html2pdf from "html2pdf.js";
import dcpllogo from "../../../assets/images/Dimple-Logos.png";

const CustomerInformationForm = ({ setViewModalOpen, selectedCustomer }) => {
  const cellStyleHeader = {
    padding: "8px",
    border: "1px solid #4b5563", // Gray-600 equivalent
    fontWeight: "bold",
    textAlign: "left",
    color: "black",
    fontSize: "11px", // Further reduced font size
    whiteSpace: "nowrap", // Prevent wrapping for headers
    verticalAlign: "top", // Align header text to top
  };

  const cellStyle = {
    padding: "8px",
    border: "1px solid #4b5563", // Gray-600 equivalent
    fontWeight: "normal",
    textAlign: "left",
    color: "#72360a", // Custom brownish-orange color
    fontSize: "12px", // Further reduced font size
    whiteSpace: "normal", // Allow wrapping for data cells by default
    wordWrap: "break-word", // Ensures long words break
    verticalAlign: "top", // Align data text to top
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("pdf-download-content");
    import("html2pdf.js").then((html2pdf) => {
      html2pdf
        .default()
        .set({
          margin: 0,
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
      <div className="fixed inset-0 p-2 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white w-full md:w-[1400px] rounded-[6px]">
          <h2 className="text-white text-[20px] font-poppins font-semibold mb-2 px-0 py-2 text-center bg-bgDataNew rounded-t-[5px]">
            DIMPLE CHEMICALS & SERVICES PVT. LTD.
          </h2>

          <div className="p-4 mt-5 overflow-y-auto max-h-[calc(100vh-200px)]">
            {/* Logo + Meta */}
            <div className="flex justify-between items-center mb-4 pr-1">
              <img src={dcpllogo} alt="DC Logo" className="h-14" />
              <div className="text-right text-xs space-y-1 mt-2">
                <div className="font-medium">
                  <b>FORMAT NO:</b> SAL-F-02
                </div>
                <div className="bg-yellow-300 rounded-[5px] inline-block px-2 py-1 mr-2">
                  <b> REVISION NO.:</b> 01
                </div>
                <div className="bg-yellow-300 rounded-[5px] inline-block py-1 px-2">
                  <b>ISSUE NO.:</b> 04
                </div>
              </div>
            </div>

            <div className="mt-5 px-1">
              {/* Title Row */}
              <h3 class="-mb-0 text-black font-poppins border bg-gray-400 py-2 rounded-t-[4px] font-semibold text-[18px] text-bgData mb-0 text-center mx-auto capitalize">
                {" "}
                Customer Information Form (CIF)
              </h3>
              <div className="px-[1px]">
                <table className="table-auto w-full text-left border-collapse border border-gray-600">
                  <tbody>
                    {/* CIF No. and Date */}
                    <tr className="hover:bg-gray-50 whitespace-nowrap ">
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[14px] border border-gray-600 font-semibold">
                        CIF NO.
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium"
                        colSpan={3}
                      >
                        {selectedCustomer?.cust_id || ""}
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[14px] border border-gray-600 font-semibold text-right">
                        Date :
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium"
                        colSpan={2}
                      >
                        {selectedCustomer?.createdAt
                          ? new Date(
                              selectedCustomer.createdAt
                            ).toLocaleDateString("en-GB")
                          : ""}
                      </td>
                    </tr>

                    {/* Customer Name */}
                    <tr>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[14px] border border-gray-600 font-semibold"
                        colSpan={1}
                      >
                        Customer Name
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium"
                        colSpan={8}
                      >
                        {selectedCustomer?.company_name || ""}
                      </td>
                    </tr>

                    {/* GST No. and PAN No. */}
                    <tr>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[14px] border border-gray-600 font-semibold"
                        colSpan={1}
                      >
                        GST NO.
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium"
                        colSpan={4}
                      >
                        {selectedCustomer?.gstNo || "GISTN345"}
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[14px] border border-gray-600 font-semibold">
                        PAN NO.
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium"
                        colSpan={2}
                      >
                        {selectedCustomer?.pan_no || ""}
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold"
                        rowSpan={
                          Math.ceil(selectedCustomer?.mergedDeals?.length / 3) +
                          1
                        }
                      >
                        Product to be
                        <br />
                        Targeted
                      </td>

                      {/* Table header cells */}
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[14px] border border-gray-600 font-semibold">
                        Product
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[14px] border border-gray-600 font-semibold">
                        Business Potential in Rs.
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[14px] border border-gray-600 font-semibold">
                        Product
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[14px] border border-gray-600 font-semibold">
                        Business Potential in Rs.
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[14px] border border-gray-600 font-semibold">
                        Product
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[14px] border border-gray-600 font-semibold">
                        Business Potential in Rs.
                      </td>
                    </tr>

                    {Array.from({
                      length: Math.ceil(
                        selectedCustomer?.mergedDeals?.length / 3
                      ),
                    }).map((_, rowIndex) => (
                      <tr key={rowIndex}>
                        {selectedCustomer?.mergedDeals
                          ?.slice(rowIndex * 3, rowIndex * 3 + 3)
                          .map((deal, i) => (
                            <React.Fragment key={i}>
                              <td className="px-4 py-2 text-[#72360a] font-poopins text-[14px] border border-gray-600 font-medium">
                                {deal.product.product_name}
                              </td>
                              <td className="px-4 py-2 text-[#72360a] font-poopins text-[14px] border border-gray-600 font-medium">
                                ₹ {deal.business_potential || "-"}
                              </td>
                            </React.Fragment>
                          ))}

                        {/* Empty filler cells if less than 3 products */}
                        {Array.from({
                          length:
                            3 -
                            selectedCustomer?.mergedDeals?.slice(
                              rowIndex * 3,
                              rowIndex * 3 + 3
                            ).length,
                        }).map((_, idx) => (
                          <React.Fragment key={`empty-${idx}`}>
                            <td className="px-4 py-2 text-[#72360a] font-poopins text-[14px] border border-gray-600 font-medium"></td>
                            <td className="px-4 py-2 text-[#72360a] font-poopins text-[14px] border border-gray-600 font-medium"></td>
                          </React.Fragment>
                        ))}
                      </tr>
                    ))}

                    {/* FACTORY ADDRESS */}
                    <tr>
                      <td
                        rowSpan={1}
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold"
                      >
                        Factory Address
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium"
                        colSpan={8}
                      >
                        {selectedCustomer?.address || ""}
                        <br />
                        {selectedCustomer?.factoryAddressLine2 || ""}
                        <br />
                        {selectedCustomer?.factoryAddressLine3 || ""}
                      </td>
                    </tr>

                    {/* ADDRESS FOR CORRESPONDENCE */}
                    <tr>
                      <td
                        rowSpan={1}
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold"
                      >
                        Address for Corrospondence
                      </td>
                      <td
                        className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium"
                        colSpan={6}
                      >
                        {selectedCustomer?.correspondenceAddressLine1 || ""}
                        <br />
                        {selectedCustomer?.correspondenceAddressLine2 || ""}
                        <br />
                        {selectedCustomer?.correspondenceAddressLine3 || ""}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8 px-1">
              <h3 class="-mb-0 text-black font-poppins border bg-gray-400 py-2 rounded-t-[4px] font-semibold text-[18px] text-bgData mb-0 text-center mx-auto capitalize">
                {" "}
                Contact Person Details
              </h3>
              <div className="px-[1px]">
                <table className="table-auto w-full text-left border-collapse border border-gray-600">
                  <tbody>
                    <tr className="text-center">
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold whitespace-nowrap "
                        colSpan={2}
                      >
                        Person Name
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold  "
                        colSpan={1}
                      >
                        Designation
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold "
                        colSpan={1}
                      >
                        Mobile No.
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold "
                        colSpan={2}
                      >
                        Landline No.
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold "
                        colSpan={2}
                      >
                        Email Id
                      </td>
                    </tr>

                    {selectedCustomer?.contactPersons &&
                    selectedCustomer.contactPersons.length > 0 ? (
                      selectedCustomer.contactPersons.map((person, index) => (
                        <tr className="text-center" key={person.id}>
                          <td
                            className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center whitespace-nowrap"
                            colSpan={2}
                          >
                            {person.name || "-"}
                          </td>
                          <td
                            className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center whitespace-nowrap"
                            colSpan={1}
                          >
                            {person.designation || "-"}
                          </td>
                          <td
                            className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center whitespace-nowrap"
                            colSpan={1}
                          >
                            +91 {person.phone_no || "-"}
                          </td>
                          <td
                            className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center whitespace-nowrap"
                            colSpan={2}
                          >
                            {person.secondary_contact || "-"}
                          </td>
                          <td
                            className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center whitespace-nowrap"
                            colSpan={2}
                          >
                            {person.email || "-"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="8"
                          className="px-4 py-2 text-gray-500 font-poopins text-[15px] border border-gray-600 text-center"
                        >
                          No contact persons available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8 px-1">
              <h3 class="-mb-0 text-black font-poppins border bg-gray-400 py-2 rounded-t-[4px] font-semibold text-[18px] text-bgData mb-0 text-center mx-auto capitalize">
                {" "}
                DCPSL Executive Details
              </h3>
              <div className="px-[1px]">
                <table className="table-auto w-full text-left border-collapse border border-gray-600">
                  <tbody>
                    {/* DCPSL EXECUTIVE DETAILS */}
                    <tr className="text-center">
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold"
                        colSpan={2}
                      >
                        Executive Name
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold">
                        Designation
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold">
                        Mobile No.
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold">
                        Landline No.
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold"
                        colSpan={2}
                      >
                        Email Id
                      </td>
                    </tr>
                    {selectedCustomer?.assignedPersons &&
                    selectedCustomer.assignedPersons.length > 0 ? (
                      selectedCustomer.assignedPersons.map((person) => (
                        <tr key={person.id} className="text-center">
                          <td
                            className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center"
                            colSpan={2}
                          >
                            {person.fullname}
                          </td>
                          <td className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center">
                            {/* If you have designation, else static */}
                            {"Sales Executive"}
                          </td>
                          <td className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center">
                            +91 {person.phone}
                          </td>
                          <td className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center">
                            {/* If no landline, use a static placeholder */}
                            {person.emergency_contact}
                          </td>
                          <td
                            className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center"
                            colSpan={2}
                          >
                            {person.email}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-4 py-2 text-gray-500 font-poopins text-[15px] border border-gray-600 text-center"
                        >
                          No assigned person data available.
                        </td>
                      </tr>
                    )}

                    {/* <tr className="text-center">
                    <td
                      className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center"
                      colSpan={2}
                    >
                      {selectedCustomer?.executive_name || "Amit Sharma"}
                    </td>
                    <td className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center">
                      {selectedCustomer?.executive_designation ||
                        "Sales Manager"}
                    </td>
                    <td className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center">
                      +91 {selectedCustomer?.executive_mobile || "9876543210"}
                    </td>
                    <td className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center">
                      {selectedCustomer?.executive_landline || "022-789456"}
                    </td>
                    <td
                      className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center"
                      colSpan={2}
                    >
                      {selectedCustomer?.executive_email || "amit@dcpsl.com"}
                    </td>
                  </tr> */}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8 px-1">
              <h3 class="-mb-0 text-black font-poppins border bg-gray-400 py-2 rounded-t-[4px] font-semibold text-[18px] text-bgData mb-0 text-center mx-auto capitalize">
                {" "}
                Buisness Associate Details
              </h3>
              <div className="px-[1px]">
                <table className="table-auto w-full text-left border-collapse border border-gray-600">
                  <tbody>
                    {/* BUSINESS ASSOCIATE */}
                    <tr className="text-center">
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold"
                        colSpan={2}
                      >
                        Associate Name
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold">
                        Code No.
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold">
                        Mobile No.
                      </td>
                      <td className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold">
                        Landline No.
                      </td>
                      <td
                        className="px-4 py-2 text-[#000000] font-poopins text-[15px] border border-gray-600 font-semibold"
                        colSpan={2}
                      >
                        Email Id
                      </td>
                    </tr>

                    {selectedCustomer?.businessAssociates &&
                    selectedCustomer.businessAssociates.length > 0 ? (
                      selectedCustomer.businessAssociates.map((associate) => (
                        <tr key={associate.id}>
                          <td
                            className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center"
                            colSpan={2}
                          >
                            {associate.associate_name}
                          </td>
                          <td className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center">
                            {/* No code field in response, so keep static fallback */}
                            {"BA001"}
                          </td>
                          <td className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center">
                            {associate.phone_no}
                          </td>
                          <td className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center">
                            {/* No landline field in response */}
                            {"022-123456"}
                          </td>
                          <td
                            className="px-4 py-2 text-[#72360a] font-poopins text-[15px] border border-gray-600 font-medium text-center"
                            colSpan={2}
                          >
                            {associate.email}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="7"
                          className="px-4 py-2 text-gray-500 font-poopins text-[15px] border border-gray-600 text-center"
                        >
                          No business associate data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature Section */}
            <div className="flex justify-between mt-4 px-4 text-[12px]">
              <div className="text-center border-black pt-2 w-1/2">
                SIGNATURE OF AUTHORISED SIGNATORY
                <br />
                <span className="text-xs">(Name of Customer)</span>
              </div>
              <div className="text-center border-black pt-2 w-1/2">
                SIGNATURE OF AUTHORISED SIGNATORY
                <br />
                <span className="text-xs">
                  DIMPLE CHEMICALS AND SERVICES PVT. LTD.
                </span>
              </div>
            </div>

            <p className="text-xs text-center mt-3 text-gray-600">
              NO. OF COPIES: 2 (ONE FOR CUSTOMER & ONE FOR DCPSL SALES
              DEPARTMENT)
            </p>
          </div>
          {/* Close Button */}
          <div className="flex items-end justify-end gap-2 px-4 my-4">
            <button
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleDownloadPDF}
            >
              Download PDF
            </button>
            <button
              onClick={() => setViewModalOpen(false)}
              className="bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      <div
        id="pdf-download-content"
        style={{
          width: "850px", // Increased width for the PDF content
          maxWidth: "100%",
          margin: "0 auto",
          padding: "20px",
          backgroundColor: "#ffffff",
          color: "black",
          fontFamily: "Arial, sans-serif",
          fontSize: "11px", // Further reduced base font size
          borderRadius: "5px",
          boxSizing: "border-box", // Include padding in the width calculation
        }}
      >
        {/* === HEADER === */}
        <h2
          style={{
            backgroundColor: "#f97316", // Changed to orange as per new screenshot
            color: "white",
            fontSize: "16px", // Further reduced font size
            fontWeight: "bold",
            padding: "10px 0",
            marginBottom: 0,
            borderRadius: "5px 5px 0 0",
            textAlign: "center",
          }}
        >
          DIMPLE CHEMICALS & SERVICES PVT. LTD.
        </h2>

        <div style={{ padding: "20px 0" }}>
          {/* === LOGO AND META === */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            {/* Using a placeholder image for dcpllogo */}
            <img
              src={dcpllogo} alt="DC Logo"
              style={{ height: "60px" }}
            />
            <div
              style={{
                textAlign: "right",
                fontSize: "11px",
                lineHeight: "1.5",
              }}
            >
              {" "}
              {/* Further reduced font size */}
              <div>
                <b>FORMAT NO:</b> SAL-F-02
              </div>
              <div
                style={{
                  //backgroundColor: "#fcd34d", // Yellow-300 equivalent
                  borderRadius: "5px",
                  display: "inline-block",
                  padding: "2px 8px",
                  marginRight: "5px",
                }}
              >
                <b>REVISION NO.:</b> 01
              </div>
              <div
                style={{
                 // backgroundColor: "#fcd34d", // Yellow-300 equivalent
                  borderRadius: "5px",
                  display: "inline-block",
                  padding: "2px 8px",
                }}
              >
                <b>ISSUE NO.:</b> 04
              </div>
            </div>
          </div>

          {/* === CUSTOMER INFO === */}
          <h3
            style={{
              backgroundColor: "#d1d5db", // Gray-300 equivalent
              marginTop: "30px",
              padding: "10px",
              fontWeight: "bold",
              fontSize: "16px", // Further reduced font size
              borderRadius: "4px 4px 0 0",
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            Customer Information Form (CIF)
          </h3>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #4b5563", // Gray-600 equivalent
              fontSize: "11px", // Further reduced font size
              marginTop: "0px", // Adjusted margin
              tableLayout: "fixed", // Ensure fixed layout for consistent columns
              wordWrap: "break-word", // Allow long words to break
            }}
          >
            <tbody>
              <tr>
                <td style={{ ...cellStyleHeader, width: "15%" }}>CIF NO.</td>
                <td style={{ ...cellStyle, width: "35%" }} colSpan={3}>
                  {selectedCustomer?.cust_id || ""}
                </td>
                <td
                  style={{
                    ...cellStyleHeader,
                    width: "15%",
                    textAlign: "right",
                  }}
                >
                  Date :
                </td>
                <td style={{ ...cellStyle, width: "35%" }} colSpan={2}>
                  {selectedCustomer?.createdAt
                    ? new Date(selectedCustomer.createdAt).toLocaleDateString(
                        "en-GB"
                      )
                    : ""}
                </td>
              </tr>

              <tr>
                <td style={{ ...cellStyleHeader, width: "15%" }}>
                  Customer Name
                </td>
                <td style={{ ...cellStyle, width: "85%" }} colSpan={6}>
                  {selectedCustomer?.company_name || ""}
                </td>
              </tr>

              <tr>
                <td style={{ ...cellStyleHeader, width: "15%" }}>GST NO.</td>
                <td style={{ ...cellStyle, width: "35%" }} colSpan={3}>
                  {selectedCustomer?.gstNo || ""}
                </td>
                <td style={{ ...cellStyleHeader, width: "15%" }}>PAN NO.</td>
                <td style={{ ...cellStyle, width: "35%" }} colSpan={2}>
                  {selectedCustomer?.pan_no || ""}
                </td>
              </tr>

              {/* Product to be Targeted Section */}
              <tr>
                <td
                  style={{
                    ...cellStyleHeader,
                    verticalAlign: "top",
                    width: "15%",
                  }}
                  rowSpan={
                    Math.ceil(
                      (selectedCustomer?.mergedDeals?.length || 0) / 3
                    ) + 1
                  }
                >
                  Product to be <br />
                  Targeted
                </td>
                {/* Table header cells for products - Adjusted widths for 3 pairs */}
                <td style={{ ...cellStyleHeader, width: "17%" }}>Product</td>
                <td style={{ ...cellStyleHeader, width: "12%" }}>
                  Business <br /> Potential in Rs.
                </td>
                <td style={{ ...cellStyleHeader, width: "17%" }}>Product</td>
                <td style={{ ...cellStyleHeader, width: "12%" }}>
                  Business <br /> Potential in Rs.
                </td>
                <td style={{ ...cellStyleHeader, width: "17%" }}>Product</td>
                <td style={{ ...cellStyleHeader, width: "12%" }}>
                  Business <br />
                  Potential in Rs.
                </td>{" "}
                {/* Adjusted to make total 100% with other columns */}
              </tr>

              {Array.from({
                length: Math.ceil(
                  (selectedCustomer?.mergedDeals?.length || 0) / 3
                ),
              }).map((_, rowIndex) => (
                <tr key={rowIndex}>
                  {selectedCustomer?.mergedDeals
                    ?.slice(rowIndex * 3, rowIndex * 3 + 3)
                    .map((deal, i) => (
                      <React.Fragment key={i}>
                        <td style={cellStyle}>
                          {deal?.product?.product_name || "-"}
                        </td>
                        <td style={cellStyle}>
                          ₹ {deal?.business_potential || "-"}
                        </td>
                      </React.Fragment>
                    ))}

                  {/* Fill empty cells if fewer than 3 deals in this row */}
                  {Array.from({
                    length:
                      3 -
                      (selectedCustomer?.mergedDeals?.slice(
                        rowIndex * 3,
                        rowIndex * 3 + 3
                      ).length || 0),
                  }).map((_, idx) => (
                    <React.Fragment key={`empty-${idx}`}>
                      <td style={cellStyle} />
                      <td style={cellStyle} />
                    </React.Fragment>
                  ))}
                </tr>
              ))}

              {/* Factory Address Section */}
              <tr>
                <td
                  style={{
                    ...cellStyleHeader,
                    verticalAlign: "top",
                    width: "15%",
                  }}
                >
                  Factory Address
                </td>
                <td
                  style={{ ...cellStyle, whiteSpace: "normal", width: "85%" }} // Allow wrapping for address
                  colSpan={6}
                >
                  {selectedCustomer?.address || ""}
                  <br />
                  {selectedCustomer?.factoryAddressLine2 || ""}
                  <br />
                  {selectedCustomer?.factoryAddressLine3 || ""}
                </td>
              </tr>

              {/* Address for Correspondence Section */}
              <tr>
                <td
                  style={{
                    ...cellStyleHeader,
                    verticalAlign: "top",
                    width: "15%",
                  }}
                >
                  Address for <br />
                  Correspondence
                </td>
                <td
                  style={{ ...cellStyle, whiteSpace: "normal", width: "85%" }} // Allow wrapping for address
                  colSpan={6}
                >
                  {selectedCustomer?.correspondenceAddressLine1 || ""}
                  <br />
                  {selectedCustomer?.correspondenceAddressLine2 || ""}
                  <br />
                  {selectedCustomer?.correspondenceAddressLine3 || ""}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Contact Person Details */}
          <h3
            style={{
              backgroundColor: "#d1d5db",
              marginTop: "30px",
              padding: "10px",
              fontWeight: "bold",
              fontSize: "16px", // Further reduced font size
              borderRadius: "4px 4px 0 0",
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            Contact Person Details
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #4b5563",
              fontSize: "11px", // Further reduced font size
              marginTop: "0px",
              tableLayout: "fixed", // Ensure fixed layout for consistent columns
              wordWrap: "break-word", // Allow long words to break
            }}
          >
            <tbody>
              <tr style={{ textAlign: "center" }}>
                <td
                  colSpan={2}
                  style={{ ...cellStyleHeader, width: "20%" }} // Adjusted width
                >
                  Person Name
                </td>
                <td style={{ ...cellStyleHeader, width: "15%" }}>
                  Designation
                </td>
                <td style={{ ...cellStyleHeader, width: "15%" }}>Mobile No.</td>
                <td colSpan={2} style={{ ...cellStyleHeader, width: "15%" }}>
                  Landline No.
                </td>
                <td colSpan={2} style={{ ...cellStyleHeader, width: "35%" }}>
                  Email Id
                </td>
              </tr>

              {selectedCustomer?.contactPersons?.length > 0 ? (
                selectedCustomer.contactPersons.map((person) => (
                  <tr key={person.id} style={{ textAlign: "center" }}>
                    <td colSpan={2} style={cellStyle}>
                      {person.name || "-"}
                    </td>
                    <td style={cellStyle}>{person.designation || "-"}</td>
                    <td style={cellStyle}>+91 {person.phone_no || "-"}</td>
                    <td colSpan={2} style={cellStyle}>
                      {person.secondary_contact || "-"}
                    </td>
                    <td colSpan={2} style={cellStyle}>
                      {person.email || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      ...cellStyle,
                      color: "#6b7280",
                      textAlign: "center",
                    }}
                  >
                    No contact persons available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* DCPSL Executive Details */}
          <h3
            style={{
              backgroundColor: "#d1d5db",
              marginTop: "30px",
              padding: "10px",
              fontWeight: "bold",
              fontSize: "16px", // Further reduced font size
              borderRadius: "4px 4px 0 0",
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            DCPSL Executive Details
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #4b5563",
              fontSize: "11px", // Further reduced font size
              marginTop: "0px",
              tableLayout: "fixed", // Ensure fixed layout for consistent columns
              wordWrap: "break-word", // Allow long words to break
            }}
          >
            <tbody>
              <tr style={{ textAlign: "center" }}>
                <td colSpan={2} style={{ ...cellStyleHeader, width: "20%" }}>
                  Executive Name
                </td>
                <td style={{ ...cellStyleHeader, width: "15%" }}>
                  Designation
                </td>
                <td style={{ ...cellStyleHeader, width: "15%" }}>Mobile No.</td>
                <td style={{ ...cellStyleHeader, width: "15%" }}>
                  Landline No.
                </td>
                <td colSpan={2} style={{ ...cellStyleHeader, width: "35%" }}>
                  Email Id
                </td>
              </tr>
              {selectedCustomer?.assignedPersons?.length > 0 ? (
                selectedCustomer.assignedPersons.map((person) => (
                  <tr key={person.id} style={{ textAlign: "center" }}>
                    <td colSpan={2} style={cellStyle}>
                      {person.fullname}
                    </td>
                    <td style={cellStyle}>{"Sales Executive"}</td>
                    <td style={cellStyle}>+91 {person.phone}</td>
                    <td style={cellStyle}>{person.emergency_contact || "-"}</td>
                    <td colSpan={2} style={cellStyle}>
                      {person.email}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    style={{
                      ...cellStyle,
                      color: "#6b7280",
                      textAlign: "center",
                    }}
                  >
                    No assigned person data available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Business Associate Details */}
          <h3
            style={{
              backgroundColor: "#d1d5db",
              marginTop: "30px",
              padding: "10px",
              fontWeight: "bold",
              fontSize: "16px", // Further reduced font size
              borderRadius: "4px 4px 0 0",
              textTransform: "capitalize",
              textAlign: "center",
            }}
          >
            Business Associate Details
          </h3>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid #4b5563",
              fontSize: "11px", // Further reduced font size
              marginTop: "0px",
              tableLayout: "fixed", // Ensure fixed layout for consistent columns
              wordWrap: "break-word", // Allow long words to break
            }}
          >
            <tbody>
              <tr style={{ textAlign: "center" }}>
                <td colSpan={2} style={{ ...cellStyleHeader, width: "20%" }}>
                  Associate Name
                </td>
                <td style={{ ...cellStyleHeader, width: "15%" }}>Code No.</td>
                <td style={{ ...cellStyleHeader, width: "15%" }}>Mobile No.</td>
                <td style={{ ...cellStyleHeader, width: "15%" }}>
                  Landline No.
                </td>
                <td colSpan={2} style={{ ...cellStyleHeader, width: "35%" }}>
                  Email Id
                </td>
              </tr>

              {selectedCustomer?.businessAssociates?.length > 0 &&
                selectedCustomer.businessAssociates.map((associate) => (
                  <tr key={associate.id} style={{ textAlign: "center" }}>
                    <td colSpan={2} style={cellStyle}>
                      {associate.associate_name}
                    </td>
                    <td style={cellStyle}>{"BA001"}</td>
                    <td style={cellStyle}>{associate.phone_no}</td>
                    <td style={cellStyle}>{"022-123456"}</td>
                    <td colSpan={2} style={cellStyle}>
                      {associate.email}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {/* === SIGNATURE === */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "50px",
              padding: "0 10px", // Add some horizontal padding
            }}
          >
            <div
              style={{
                textAlign: "center",
                width: "48%",
                borderTop: "1px solid black",
                paddingTop: "5px",
              }}
            >
              SIGNATURE OF AUTHORISED SIGNATORY
              <br />
              <span style={{ fontSize: "11px" }}>(Name of Customer)</span>{" "}
              {/* Further reduced font size */}
            </div>
            <div
              style={{
                textAlign: "center",
                width: "48%",
                borderTop: "1px solid black",
                paddingTop: "5px",
              }}
            >
              SIGNATURE OF AUTHORISED SIGNATORY
              <br />
              <span style={{ fontSize: "11px" }}>
                {" "}
                {/* Further reduced font size */}
                DIMPLE CHEMICALS AND SERVICES PVT. LTD.
              </span>
            </div>
          </div>

          <p
            style={{
              fontSize: "11px", // Further reduced font size
              textAlign: "center",
              marginTop: "20px",
              color: "#4b5563", // Gray-600 equivalent
            }}
          >
            NO. OF COPIES: 2 (ONE FOR CUSTOMER & ONE FOR DCPSL SALES DEPARTMENT)
          </p>
        </div>
      </div>
    </>
  );
};

export default CustomerInformationForm;
