// src/pages/CategoryEntries.jsx
import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { API_BASE } from '../config';

const CategoryEntries = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!category) return;
    setLoading(true);
    fetch(`${API_BASE}/entries`)
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(e => e.type === category);
        setEntries(filtered);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="max-w-5xl mx-auto p-6 text-white">
      <h1 className="text-4xl font-bold mb-6 capitalize text-violet-300 drop-shadow">
        {category} Entries
      </h1>

      {loading ? (
        <p className="text-center text-indigo-300">Loading...</p>
      ) : entries.length ? (
        <ul className="space-y-6">
          {entries.map(item => (
            <li key={item._id} className="p-5 bg-black/40 border border-indigo-500 rounded-xl shadow-md hover:shadow-indigo-600 transition">
              <Link
                to={`/entry/${item.type}/${item._id}`}
                className="text-2xl font-semibold text-indigo-300 hover:text-indigo-400 hover:underline"
              >
                {item.title}
              </Link>
              <p className="text-gray-300 mt-2 text-sm">{item.summary}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-400">No entries found for this category.</p>
      )}
    </div>
  );
};

export default CategoryEntries;
