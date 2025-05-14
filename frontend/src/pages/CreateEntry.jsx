import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

const CreateEntry = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    summary: '',
    details: { date: '' } // Include "date" in the initial details
  });
  const [fields, setFields] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetch category schema
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(data => {
        const category = data.find(c => c.name === type);
        if (category && category.fields) {
          setFields([...category.fields, { name: 'date', label: 'Date', type: 'date' }]); // Add "date" field
        } else {
          setFields([{ name: 'date', label: 'Date', type: 'date' }]); // Default to "date" field if no schema
        }
      })
      .catch(err => console.error('Failed loading category schema', err));
  }, [type]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title' || name === 'summary') {
      setForm({ ...form, [name]: value });
    } else {
      setForm({
        ...form,
        details: { ...form.details, [name]: value }
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      const payload = {
        type,
        title: form.title,
        summary: form.summary,
        details: form.details,
        createdBy: currentUser.username || 'unknown'
      };
      const res = await fetch(`${API_BASE}/entry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      if (!res.ok) {
        setError(result.error || 'Create failed');
        return;
      }
      navigate('/entries');
    } catch (err) {
      setError('Network error');
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded-xl">
      <h1 className="text-2xl font-bold mb-6">Create New {type.charAt(0).toUpperCase() + type.slice(1)}</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Title</label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Summary</label>
          <input
            name="summary"
            value={form.summary}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        {fields.map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700">{f.label}</label>
            {f.type === 'date' ? (
              <input
                type="date"
                name={f.name}
                value={form.details[f.name] || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            ) : (
              <input
                name={f.name}
                value={form.details[f.name] || ''}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border rounded"
              />
            )}
          </div>
        ))}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Create
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEntry;