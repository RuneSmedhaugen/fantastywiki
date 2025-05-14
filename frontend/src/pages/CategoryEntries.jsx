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
    <>
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        <h1 className="text-3xl font-bold capitalize">{category} Entries</h1>
        {loading ? (
          <p>Loading...</p>
        ) : entries.length ? (
          <ul className="space-y-3">
            {entries.map(item => (
              <li key={item._id} className="p-4 bg-white shadow rounded-lg">
                <Link to={`/entry/${item.type}/${item._id}`} className="text-lg font-medium text-blue-600 hover:underline">
                  {item.title}
                </Link>
                <p className="text-sm text-gray-600 mt-1">{item.summary}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No entries found for this category.</p>
        )}
      </div>
    </>
  );
};

export default CategoryEntries;
