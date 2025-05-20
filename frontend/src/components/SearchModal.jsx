import React from "react";
import { useNavigate } from "react-router-dom";

const SearchModal = ({ results, show, onClose }) => {
  const navigate = useNavigate();
  if (!show) return null;

  return (
    <div className="absolute left-0 right-0 mt-2 z-50 w-full max-w-xl bg-black/60 border border-cyan-500 text-white rounded-xl backdrop-blur-md shadow-lg max-h-96 overflow-y-auto">
      <button
        className="absolute top-2 right-4 text-cyan-400 hover:text-white text-lg"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>

      {results.length === 0 ? (
        <div className="p-4 text-center text-cyan-200">No results found.</div>
      ) : (
        <ul className="divide-y divide-gray-700">
          {results.map((result) => (
            <li
              key={result._id}
              className="p-4 hover:bg-cyan-700/30 transition cursor-pointer"
              onClick={() => {
                onClose();
                navigate(`/entry/${result.type}/${result._id}`);
              }}
            >
              <div className="font-semibold text-cyan-300">{result.title}</div>
              <div className="text-sm text-gray-300 mt-1">{result.summary}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchModal;
