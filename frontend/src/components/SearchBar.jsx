// src/components/SearchBar.jsx
import { useState } from 'react';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onSearch(query);
    }
  };

  return (
    <div className="flex w-full bg-gray-800 border border-gray-600 rounded-full overflow-hidden shadow">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search the ARC..."
        className="flex-grow px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
      />
      <button
        onClick={() => onSearch(query)}
        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white transition"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
