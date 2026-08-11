import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const AgreementTemplate = ({ agreementData }) => {
  const pdfRef = useRef();

  const generateAgreementPDF = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${agreementData.title}.pdf`);
  };

  return (
    <div>
      {/* Agrement Format Data Start */}
      <div
        className="bg-white h-[450px] flex flex-col justify-center shadow-lg p-6 rounded-lg"
        ref={pdfRef}
      >
        {/* Header */}
        <header className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {agreementData.title}
          </h1>
          <div>
            <p className="text-sm text-gray-600">
              Agreement ID: {agreementData.id}
            </p>
            <p className="text-sm text-gray-600">Date: {agreementData.date}</p>
          </div>
        </header>

        {/* Parties Involved */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Parties Involved:
          </h2>
          <p className="text-sm text-gray-600">
            {agreementData.partyA} and {agreementData.partyB}
          </p>
        </section>

        {/* Terms */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Agreement Terms:
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-600 list-none">
            {agreementData.terms.map((term, index) => (
              <li key={index}>{term}</li>
            ))}
          </ul>
        </section>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-500">
          Prepared by {agreementData.preparedBy}
        </footer>
      </div>
      {/* Agrement Format Data End */}
      <div className="flex items-end justify-center gap-2">
        {/* <button className="bg-bgDataNew text-white px-3 py-2 rounded mt-2 hover:bg-[#cb6f2ad9]">
          Edit
        </button> */}
        {/* <button className="bg-red-700 text-white px-3 py-2 rounded mt-2 hover:bg-red-900">
          Delete
        </button> */}
        {/* <button className="mt-4 bg-gray-500 text-white px-3 py-2 rounded hover:bg-gray-600">
          Share
        </button> */}
        <button
          className="mt-4 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-700"
          onClick={generateAgreementPDF}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default AgreementTemplate;
