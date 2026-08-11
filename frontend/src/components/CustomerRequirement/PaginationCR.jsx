import React from 'react'

const PaginationCR = ({currentPage, handlePageChange, totalPages}) => {
  return (
    <div className="bg-bgData rounded-[8px] shadow-md shadow-black/5 text-white px-4 py-3 flex justify-center items-center space-x-2">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className="bg-bgDataNew text-white px-3 py-1 rounded hover:bg-bgDataNew disabled:opacity-50"
          >
            Previous
          </button>

          {/* Page Number Buttons */}
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (number) =>
              number === 1 ||
              number === totalPages ||
              (number >= currentPage - 1 && number <= currentPage + 1) ? (
                <button
                  key={number}
                  onClick={() => handlePageChange(number)}
                  className={`px-3 py-1 rounded ${
                    number === currentPage
                      ? "bg-gray-500 text-white"
                      : "text-white hover:bg-gray-600"
                  }`}
                >
                  {number}
                </button>
              ) : number === currentPage - 2 || number === currentPage + 2 ? (
                <span key={number} className="px-2 text-gray-300">
                  ...
                </span>
              ) : null
          )}

          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className="bg-bgDataNew text-white px-3 py-1 rounded hover:bg-bgDataNew disabled:opacity-50"
          >
            Next
          </button>
        </div>
  )
}

export default PaginationCR;
