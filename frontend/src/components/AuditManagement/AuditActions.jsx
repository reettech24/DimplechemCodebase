import React from "react";

const AuditActions = ({ audit, completeReview, shareAuditDetails, generateNCForm }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => completeReview(audit.id)}
        disabled={audit.reviewed}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
      >
        Mark as Reviewed
      </button>
      <button
        onClick={() => shareAuditDetails(audit.id)}
        disabled={!audit.reviewed || audit.detailsShared}
        className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md disabled:bg-gray-400"
      >
        Share Audit Details
      </button>
      <button
        onClick={() => generateNCForm(audit.id)}
        disabled={!audit.detailsShared || audit.ncFormAttached}
        className="mt-2 px-4 py-2 bg-orange-500 text-white rounded-md disabled:bg-gray-400"
      >
        Attach NC Form
      </button>
      {audit.ncFormAttached && !audit.signed && (
        <p className="text-orange-600 mt-2">Client needs to sign the NC form.</p>
      )}
    </div>
  );
};

export default AuditActions;
