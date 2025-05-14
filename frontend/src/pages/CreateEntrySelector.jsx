// src/pages/CreateEntrySelector.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { API_BASE } from '../config';

const CreateEntrySelector = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState([]);

  useEffect(() => {
    // Fetch categories for dynamic selector
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(data => {
        const cats = data.map(c => ({
          label: c.name.charAt(0).toUpperCase() + c.name.slice(1),
          path: `/create-entry/${c.name}`
        }));
        setTypes([
          { label: 'News', path: '/create-entry/news' },
          ...cats
        ]);
      })
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-4">Select Entry Type</h1>
      <div className="grid grid-cols-1 gap-4">
        {types.map((t) => (
          <button
            key={t.path}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={() => navigate(t.path)}
          >
            Create {t.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CreateEntrySelector;
