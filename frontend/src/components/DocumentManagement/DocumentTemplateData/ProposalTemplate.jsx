import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ProposalTemplate = ({ proposalData }) => {
  const pdfRef = useRef();

  const generateProposalPDF = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${proposalData.title}.pdf`);
  };

  return (
    <div>
      <div
        className="bg-white h-[450px] flex flex-col justify-center shadow-lg p-6 rounded-lg"
        ref={pdfRef}
      >
        {/* Header */}
        <header className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {proposalData.title}
          </h1>
          <div>
            <p className="text-sm text-gray-600">
              Proposal ID: {proposalData.id}
            </p>
            <p className="text-sm text-gray-600">Date: {proposalData.date}</p>
          </div>
        </header>

        {/* Client Information */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Overview:</h2>
          <p className="text-sm text-gray-600">{proposalData.overview}</p>
        </section>

        {/* Key Points */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Key Points:</h2>
          <ul className="list-disc pl-5 text-sm text-gray-600 list-none">
            {proposalData.keyPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-500">
          Prepared by {proposalData.preparedBy}
        </footer>
      </div>
      <div className="flex items-end justify-center gap-2">
        {/* <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]">
          Edit
        </button>
        <button className="bg-red-700 text-white px-3 py-2 rounded mt-2 hover:bg-red-900">
          Delete
        </button>
        <button className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
          Share
        </button> */}
        <button
          className="mt-4 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-700"
          onClick={generateProposalPDF}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default ProposalTemplate;
