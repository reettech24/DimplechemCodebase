import React from "react";

const EventDetailModal = ({ isOpen, onClose, event }) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 p-2 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl"
        >
          ×
        </button>

        <h2 className="text-2xl font-semibold mb-4">{event.title}</h2>
        <p><span className="font-semibold">Start:</span> {new Date(event.start).toLocaleString()}</p>
        <p><span className="font-semibold">End:</span> {new Date(event.end).toLocaleString()}</p>
        {event.extendedProps.location && (
          <p><span className="font-semibold">Location:</span> {event.extendedProps.location}</p>
        )}
        {event.extendedProps.description && (
          <p className="mt-2"><span className="font-semibold">Description:</span> {event.extendedProps.description}</p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailModal;
