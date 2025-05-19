import React from "react";
import { useNavigate } from "react-router-dom";

const SearchModal = ({ results, show, onClose }) => {
  const navigate = useNavigate();

  if (!show) return null;

  return (
    <div className="absolute left-0 right-0 mt-2 bg-white border rounded shadow-lg z-50 w-full max-h-96 overflow-y-auto">
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-700"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      {results.length === 0 ? (
        <div className="p-4 text-gray-500">No results found.</div>
      ) : (
        <ul>
          {results.map((result) => (
            <li
              key={result._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onClose();
                navigate(`/entry/${result.type}/${result._id}`);
              }}
            >
              <span className="font-semibold">{result.title}</span>
              <div className="text-sm text-gray-600">{result.summary}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchModal;