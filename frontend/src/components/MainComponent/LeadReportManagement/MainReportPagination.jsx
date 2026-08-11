import React from 'react';

const MainReportPagination = ({ totalPages, handlePageChange, currentPage }) => {
  return (
    <div className="bg-bgData rounded-[8px] shadow-md text-white px-4 py-3 flex justify-center items-center space-x-2">
      {/* Previous Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => handlePageChange(currentPage - 1)}
        className="bg-bgDataNew text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
        aria-label="Previous Page"
      >
        Previous
      </button>

      {/* Page Numbers */}
      {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) =>
        number === 1 || number === totalPages || (number >= currentPage - 1 && number <= currentPage + 1) ? (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={`px-3 py-1 rounded ${
              number === currentPage
                ? "bg-gray-500 text-white"
                : "text-white hover:bg-gray-600"
            }`}
            aria-label={`Go to page ${number}`}
          >
            {number}
          </button>
        ) : number === currentPage - 2 || number === currentPage + 2 ? (
          <span key={number} className="px-2 text-gray-300">
            ...
          </span>
        ) : null
      )}

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => handlePageChange(currentPage + 1)}
        className="bg-bgDataNew text-white px-3 py-1 rounded hover:bg-gray-600 disabled:opacity-50"
        aria-label="Next Page"
      >
        Next
      </button>
    </div>
  );
};

export default MainReportPagination;