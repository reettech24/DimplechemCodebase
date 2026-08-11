import React, { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

const AgreementShowData = ({
  agreement,
  handleButtonClickSignature,
  handleFileChangePhoto,
  hiddenFileInputSignature,
  index,
  handleButtonClientSignature,
}) => {
  const pdfAgreementRef = useRef();

  const generateAgreementPDF = async () => {
    const element = pdfAgreementRef.current;
    if (!element) return; // Ensure element exists

    // Hide excluded elements from PDF
    const hiddenElements = document.querySelectorAll(".exclude-from-pdf");
    hiddenElements.forEach((el) => (el.style.display = "none"));

    // Generate canvas
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    console.log("pdfHeight", pdfHeight);

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);


    // Restore excluded elements
    hiddenElements.forEach((el) => (el.style.display = ""));

    pdf.save(`Agreement_of_${agreement.clientName}.pdf`);
};


  return (
    <div>
      <div
        className="bg-white max-h-[calc(100vh-200px)] py-5 flex flex-col justify-start shadow-lg p-6 rounded-lg pdf-container"
        ref={pdfAgreementRef}
      >
        {/* Header */}
        <header className="flex justify-center items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Agreement Details
          </h1>
        </header>

        {/* Mail Information */}
        <div className="mb-6">
          <h2 className="font-poppins font-medium text-md text-gray-800">
            Dear ,
          </h2>
          <p className="font-poppins text-sm text-gray-600 font-medium">
            I hope this email finds you well. As discussed, I am sharing the
            details of our agreement. Kindly review the terms below:
          </p>
        </div>

        <div className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900">
            Company Details:
          </h2>
          <div className="ml-5 flex flex-col items-start w-full gap-2">
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Name:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                Idice Systems
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Email:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                hr@idicesystems.com
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Phone:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                095849 01234
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Technology:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                HTML5, CSS3, Bootstrap, Wordpress, React, MongoDB, Node.js, PHP,
                SQL, MongoDB
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Address:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                402, krishna tower, Pipliyahana Rd, above ICICI Bank,
                Brajeshwari Extension, Greater Brajeshwari, Indore, Madhya
                Pradesh 452016, India
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900">
            Client Details:
          </h2>
          <div className="ml-5 flex flex-col items-start w-full gap-2">
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Name:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {agreement.clientName}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Email:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {agreement.email}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Phone:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {agreement.contact}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Address:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {agreement.address}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900">
            Scope of Work:
          </h2>
          <p className="font-poppins font-medium text-[15px] text-gray-800">
            {agreement.scopeOfWork}
          </p>
        </div>
        
        <div className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900">
            Payment Terms:
          </h2>
          <div className="ml-5 flex flex-col items-start w-full gap-2">
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Total Project Cost:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                Rs. {agreement.totalCost}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Payment Milestones:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {agreement.milestoneSchedule}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Payments Method:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {agreement.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900">
            Predefined Terms (Fixed for Most Projects):
            <br />
            These are standard clauses that do not change across projects:
          </h2>
          <div className="ml-5 flex flex-col items-start w-full gap-2">
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Rights:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                Upon full payment, the Client will have complete ownership of
                the website and its associated source code.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Confidentiality:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                Both parties agree to keep shared information confidential.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Termination Clause:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                Either party can terminate this agreement with a 7-day written
                notice. Any completed work will be charged accordingly.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Liabilities:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                The Service Provider is not liable for misuse of the website or
                unauthorized changes after delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900">
            Responsibilities:
          </h2>
          <div className="ml-5 flex flex-col items-start w-full gap-2">
            <div className="flex flex-col items-start">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Company Responsibilities:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {agreement.developersResponsibilities}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Client's Responsibilities:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {agreement.clientsResponsibilities}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900">
            If you agree with the above terms, please reply to this email with
            your confirmation.
            <br /> Once confirmed, I will proceed with the next steps. <br />
            Looking forward to your response!
          </h2>
        </div>

        {/* Footer */}
        <footer className="mt-6">
          <h2 className="font-poppins font-bold text-lg text-gray-900 mb-2">
            Signatures :
          </h2>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-poppins font-semibold text-md text-gray-900">
                Best regards,
              </h2>
              <div className="flex items-center gap-3">
                <p className="font-poppins font-medium text-[15px] text-gray-800">
                  Name:
                </p>
                <p className="font-poppins text-sm text-gray-600 font-medium">
                  Idice System
                </p>
              </div>
              <div className="flex flex-col items-start ">
                <p className="font-poppins font-medium text-[15px] text-gray-800 mb-2">
                  Signature:
                </p>
                {agreement.idiceSignature && (
                  <img
                    src={agreement.idiceSignature}
                    alt="Company Signature"
                    className={`rounded-[5px] ${
                      agreement.activeButtonSignature === "photoSignature"
                        ? "bg-[#fe6c00] py-0 object-cover w-[120px] h-[100px]"
                        : "bg-[#fe6c00] py-3 px-3 object-contain w-[120px] h-[100px]"
                    }`}
                  />
                )}
              </div>
              <div className="flex items-center gap-3">
                <p className="font-poppins font-medium text-[15px] text-gray-800">
                  Date:
                </p>
                <p className="font-poppins text-sm text-gray-600 font-medium">
                  {agreement.companyDate}
                </p>
              </div>
            </div>
            <div>
              <h2 className="font-poppins font-semibold text-md text-gray-900">
                Client Signature
              </h2>
              <div className="flex items-center gap-3">
                <p className="font-poppins font-medium text-[15px] text-gray-800">
                  Name:
                </p>
                <p className="font-poppins text-sm text-gray-600 font-medium">
                  {agreement.clientName}
                </p>
              </div>

              <div className="flex flex-col items-start mb-2">
                <p className="font-poppins font-medium text-[15px] text-gray-800">
                  Signature:
                </p>
                {/* Download not Showing section start  */}
                <div className="flex items-center gap-3 mt-2 exclude-from-pdf">
                  <button
                    className="bg-bgDataNew text-white text-[15px] px-3 p-1 rounded hover:bg-[#cb6f2ad9]"
                    onClick={() => handleButtonClientSignature(index)}
                  >
                    Sign
                  </button>
                  <button
                    className="bg-red-700 text-white text-[15px] px-3 p-1 rounded hover:bg-red-900"
                    onClick={() => handleButtonClickSignature(index)}
                  >
                    SignImage
                  </button>
                </div>
                {/* Download not Showing section end  */}
                <input
                  type="file"
                  accept="image/*"
                  ref={hiddenFileInputSignature}
                  onChange={handleFileChangePhoto}
                  className="hidden" // Hide the file input
                />
              </div>

              {/* show signature Start */}
              {agreement.clientSignature && (
                <img
                  src={agreement.clientSignature}
                  alt="Client Signature"
                  className="bg-[#fe6c00] rounded-[5px] py-2 px-2 w-[120px] h-[100px] object-contain"
                />
              )}
              {/* Show signature End */}

              <div className="flex items-center gap-3">
                <p className="font-poppins font-medium text-[15px] text-gray-800">
                  Date:
                </p>
                {/* Editable Text Date */}
                <p className="font-poppins text-sm text-gray-600 font-medium">
                  {agreement.clientDate || "Present Date"}
                </p>
              </div>
            </div>
          </div>
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
          onClick={generateAgreementPDF}
        >
          Download
        </button>
      </div>
    </div>
  );
};

export default AgreementShowData;
