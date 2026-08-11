import React from 'react';
import AuditActions from "./AuditActions";

const AuditListShow = ({ audits, completeReview, shareAuditDetails, generateNCForm }) => {
  return (
    <div>
      {audits.length === 0 ? (
        <p>No Audits Available</p>
      ) : (
        <ul className="space-y-4">
          {audits.map((audit) => (
            <li key={audit.id} className="border p-4 rounded-md">
              <strong>Client:</strong> {audit.client} <br />
              <strong>Status:</strong> {audit.status} <br />
              <strong>Reviewed:</strong> {audit.reviewed ? "Yes" : "No"} <br />
              <strong>Details Shared:</strong> {audit.detailsShared ? "Yes" : "No"} <br />
              <strong>NC Form Attached:</strong> {audit.ncFormAttached ? "Yes" : "No"} <br />
              <strong>Signed:</strong> {audit.signed ? "Yes" : "No"} <br />
              <AuditActions
                audit={audit}
                completeReview={completeReview}
                shareAuditDetails={shareAuditDetails}
                generateNCForm={generateNCForm}
              />
            </li>
          ))}
        </ul>
      )}
    </div>

    
  )
}

export default AuditListShow
