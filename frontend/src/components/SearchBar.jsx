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
    <div className="flex items-center w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search entries..."
        className="w-full px-4 py-2 rounded-l-full bg-gray-100 focus:outline-none"
      />
      <button
        onClick={() => onSearch(query)}
        className="px-4 py-2 bg-indigo-600 text-white rounded-r-full hover:bg-indigo-700 transition"
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
