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
        setTypes(cats);
      })
      .catch(err => console.error('Failed to load categories', err));
  }, []);

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-screen-xl mx-auto text-white">
      <div className="flex-1 space-y-8">
        <h1 className="text-4xl font-bold text-violet-300 drop-shadow-lg">Select Entry Type</h1>
        <section>
          <details open className="group bg-gray-900/60 backdrop-blur-md border border-violet-500 rounded-lg shadow-xl">
            <summary className="cursor-pointer px-6 py-4 text-xl font-semibold text-violet-400 group-open:rounded-b-none hover:text-violet-300">
              Available Entry Types
            </summary>
            <div className="px-6 py-4 grid grid-cols-1 gap-4">
              {types.map((t) => (
                <button
                  key={t.path}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow"
                  onClick={() => navigate(t.path)}
                >
                  Create {t.label}
                </button>
              ))}
            </div>
          </details>
        </section>
      </div>
    </div>
  );
};

export default CreateEntrySelector;