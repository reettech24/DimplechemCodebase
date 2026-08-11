import React from "react";
import { invoices, reports, proposals, agreements } from "../../data/data";
import InvoiceTemplate from "./DocumentTemplateData/InvoiceTemplate";
import ReportTemplate from "./DocumentTemplateData/ReportTemplate";
import ProposalTemplate from "./DocumentTemplateData/ProposalTemplate";
import AgreementTemplate from "./DocumentTemplateData/AgreementTemplate";

const DocumentShow = ({ toggleSection, activeButton }) => {
  return (
    <div>
      <div className="flex items-center gap-[10px] mb-5">
        <button
          className={`h-[40px] px-3 font-poppins font-semibold text-[15px] md:text-textdata whitespace-nowrap flex items-center justify-center relative ${
            activeButton === "Invoice" ? "text-white" : "text-[#667877]"
          }`}
          onClick={() => toggleSection("Invoice")}
        >
          Invoice
          {activeButton === "Invoice" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bgDataNew"></div>
          )}
        </button>
        <button
          className={`h-[40px] px-3 font-poppins font-semibold text-[15px] md:text-textdata whitespace-nowrap flex items-center justify-center relative ${
            activeButton === "Report" ? "text-white" : "text-[#667877]"
          }`}
          onClick={() => toggleSection("Report")}
        >
          Report
          {activeButton === "Report" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bgDataNew"></div>
          )}
        </button>
        <button
          className={`h-[40px] px-3 font-poppins font-semibold text-[15px] md:text-textdata whitespace-nowrap flex items-center justify-center relative ${
            activeButton === "Proposal" ? "text-white" : "text-[#667877]"
          }`}
          onClick={() => toggleSection("Proposal")}
        >
          Proposal
          {activeButton === "Proposal" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bgDataNew"></div>
          )}
        </button>
        <button
          className={`h-[40px] px-3 font-poppins font-semibold text-[15px] md:text-textdata whitespace-nowrap flex items-center justify-center relative ${
            activeButton === "Agreement" ? "text-white" : "text-[#667877]"
          }`}
          onClick={() => toggleSection("Agreement")} 
        >
          Agreement
          {activeButton === "Agreement" && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-bgDataNew"></div>
          )}
        </button>
      </div>

      {activeButton === "Invoice" && (
        <div className="grid grid-row-1 md:grid-cols-2 gap-4">
          {invoices.map((invoice, index) => (
            <InvoiceTemplate key={index} invoiceData={invoice} />
          ))}
        </div>
      )}

      {activeButton === "Report" && (
        <div className="grid grid-row-1 md:grid-cols-2 gap-4">
          {reports.map((report, index) => (
            <ReportTemplate key={index} reportData={report} />
          ))}
        </div>
      )}

      {activeButton === "Proposal" && (
        <div className="grid grid-row-1 md:grid-cols-2 gap-4">
          {proposals.map((proposal, index) => (
            <ProposalTemplate key={index} proposalData={proposal} />
          ))}
        </div>
      )}

      {activeButton === "Agreement" && (
        <div className="grid grid-row-1 md:grid-cols-2 gap-4">
          {agreements.map((agreement, index) => (
            <AgreementTemplate key={index} agreementData={agreement} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentShow;
