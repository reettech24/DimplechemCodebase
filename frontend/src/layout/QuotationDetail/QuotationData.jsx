import React from "react";
import ContentTop from "../../components/ContentTop/ContentTop";
import "./QuotationData.css";
import QuotationDetails from "../../components/QuotationManagement/QuotationDetails";

function QuotationData() {
  return (
    <div className="main-content">
      <ContentTop />
      <QuotationDetails />
    </div>
  );
}

export default QuotationData;
