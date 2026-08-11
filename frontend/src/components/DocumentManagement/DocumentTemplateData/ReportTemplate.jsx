import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const ReportTemplate = ({ reportData }) => {
  const pdfRef = useRef();

  const generateReportPDF = async () => {
    const element = pdfRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${reportData.title}.pdf`);
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
            {reportData.title}
          </h1>
          <div>
            <p className="text-sm text-gray-600">
              Invoice #: {reportData.reportNumber}
            </p>
            <p className="text-sm text-gray-600">Date: {reportData.date}</p>
          </div>
        </header>

        {/* Client Information */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Summary:</h2>
          <p className="text-sm text-gray-600">{reportData.summary}</p>
        </section>

        {/* Report Items */}
        <div className="overflow-x-auto">
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr className="border-b text-sm text-black">
                <th className="py-2 text-start">Section</th>
                <th className="py-2 text-start">Details</th>
              </tr>
            </thead>
            <tbody>
              {reportData.details.map((detail, index) => (
                <tr key={index} className="border-b text-sm text-gray-800">
                  <td className="py-2">{detail.section}</td>
                  <td className="py-2">{detail.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-500">
          Prepared by {reportData.preparedBy}
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
        <button className="mt-4 bg-green-500 text-white px-3 py-2 rounded hover:bg-green-700" onClick={generateReportPDF}>
          Download
        </button>
      </div>
    </div>
  );
};

export default ReportTemplate;
