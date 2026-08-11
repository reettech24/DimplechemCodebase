import React from "react";
import AuditActions from "./AuditActions";

const AuditListShowData = ({
  audit,
  completeReview,
  shareAuditDetails,
  generateNCForm,
}) => {
  return (
    <div>
      <div className="bg-white md:h-[380px] py-5 flex flex-col justify-center shadow-lg p-6 rounded-lg">
        {/* Header */}
        <header className="flex justify-center items-center border-b pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Audit Report For {audit.client}
          </h1>
        </header>

        <div className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900 mb-3">
            Dear John Doe,
            <br />
            &nbsp; &nbsp;I have shared the Report with some Details.
          </h2>
          <div className="ml-3 flex flex-col items-start w-full gap-2">
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Company Name:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {audit.client}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Date:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {audit.date}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Status:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {audit.status}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Reviewed:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {audit.reviewed ? "Yes" : "No"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Details Shared:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {audit.detailsShared ? "Yes" : "No"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                NC Form Attached:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {audit.ncFormAttached ? "Yes" : "No"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Signed:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {audit.signed ? "Yes Digital Signature" : "No"}
              </p>
            </div>
            {audit.digitalSignature && (
              <img
                src={audit.digitalSignature}
                alt="digitalSignature"
                className="bg-[#fe6c00] rounded-[5px] py-2 px-2 w-[120px] h-[100px] object-contain"
              />
            )}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900">
            Executive Summary:
          </h2>
          <p className="font-poppins font-medium text-[15px] text-gray-800 text-justify">
            The audit for {audit.client} was conducted on {audit.date} to assess
            compliance with company policies and industry standards. The review
            focused on financial transactions, data security, and process
            efficiency.
          </p>
        </div>

        {/* Key Points */}
        <section className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900">
            Key Findings:
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>
              <strong>Financial Compliance:</strong> No discrepancies found in
              financial records.
            </li>
            <li>
              <strong>Data Security:</strong> Security protocols were in place,
              but minor vulnerabilities were noted.
            </li>
            <li>
              <strong>Operational Efficiency:</strong> A few processes require
              optimization for better productivity.
            </li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900">
            {" "}
            Recommendations:
          </h2>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>
              Implement two-factor authentication (2FA) for all sensitive
              systems.
            </li>
            <li>
              Conduct quarterly training sessions for employees on compliance
              requirements.
            </li>
            <li>
              Automate backup and security log tracking for better monitoring.
            </li>
          </ul>
        </section>

        <div className="mb-6">
          <h2 className="font-poppins font-semibold text-md text-gray-900">
            Conclusion:
          </h2>
          <p className="flex items-center font-poppins font-medium text-[15px] text-gray-800 text-justify">
            The audit was successfully completed, and the client has been
            informed about the areas that require improvement. The NC Form
            {audit.ncFormAttached ? "has been" : "yet to be"} shared with the
            client for review and digital signature.
          </p>
        </div>

        {/* Footer */}
        <footer className="mt-6 text-center text-sm text-gray-500">
          <h2 className="flex items-start font-poppins font-bold text-lg text-gray-900 mb-2">
            Signatures :
          </h2>
          {/* <div className="flex items-start justify-start"> */}
          <div>
            <h2 className="flex items-start font-poppins font-semibold text-md text-gray-900">
              Best regards,
            </h2>
            <div className="flex items-center gap-3">
              <p className="font-poppins font-medium text-[15px] text-gray-800">
                Name:
              </p>
              <p className="font-poppins text-sm text-gray-600 font-medium">
                {audit.client}
              </p>
            </div>
            <div className="flex flex-col items-start gap-2">
              <p className="font-poppins font-medium text-[15px] text-gray-800 mb-2">
                Signature:
              </p>

              {audit.digitalSignature && (
                <img
                  src={audit.digitalSignature}
                  alt="digitalSignature"
                  className="bg-[#fe6c00] rounded-[5px] py-2 px-2 w-[120px] h-[100px] object-contain"
                />
              )}
            </div>
          </div>
          {/* </div> */}
        </footer>
      </div>
      <div className="flex items-end justify-center gap-2">
        <AuditActions
          audit={audit}
          completeReview={completeReview}
          shareAuditDetails={shareAuditDetails}
          generateNCForm={generateNCForm}
        />
      </div>
    </div>
  );
};

export default AuditListShowData;
