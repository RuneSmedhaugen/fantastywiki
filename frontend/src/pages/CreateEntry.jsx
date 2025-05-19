import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE } from '../config';

const CreateEntry = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState([{ key: '', value: '' }]);
  const [sections, setSections] = useState([
    { title: '', content: '' }
  ]);
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');

  // Info details handlers (as before)
  const handleFieldChange = (idx, field, value) => {
    const updated = fields.map((f, i) =>
      i === idx ? { ...f, [field]: value } : f
    );
    setFields(updated);
  };
  const handleAddField = () => setFields([...fields, { key: '', value: '' }]);
  const handleRemoveField = (idx) => setFields(fields.filter((_, i) => i !== idx));

  // Section handlers
  const handleSectionChange = (idx, field, value) => {
    const updated = sections.map((s, i) =>
      i === idx ? { ...s, [field]: value } : s
    );
    setSections(updated);
  };
  const handleAddSection = () => setSections([...sections, { title: '', content: '' }]);
  const handleRemoveSection = (idx) => setSections(sections.filter((_, i) => i !== idx));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const details = {};
    fields.forEach(f => {
      if (f.key) details[f.key] = f.value;
    });

    // Only include sections with a title or content
    const filteredSections = sections.filter(s => s.title || s.content);

    try {
      const currentUser = JSON.parse(localStorage.getItem('user')) || {};
      const payload = {
        type,
        title,
        summary,
        details,
        sections: filteredSections,
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
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Summary</label>
          <input
            name="summary"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            required
            className="mt-1 block w-full p-2 border rounded"
          />
        </div>
        {/* Info Details */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Info Details</label>
          {fields.map((f, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Field name"
                value={f.key}
                onChange={e => handleFieldChange(idx, 'key', e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Value"
                value={f.value}
                onChange={e => handleFieldChange(idx, 'value', e.target.value)}
                className="flex-1 p-2 border rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveField(idx)}
                className="px-2 py-1 bg-red-500 text-white rounded"
                disabled={fields.length === 1}
                title="Remove field"
              >
                −
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddField}
            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
          >
            + Add Field
          </button>
        </div>
        {/* Dynamic Sections */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sections</label>
          {sections.map((s, idx) => (
            <div key={idx} className="mb-4 border rounded p-3 bg-gray-50">
              <input
                type="text"
                placeholder="Section title (e.g. Early Life)"
                value={s.title}
                onChange={e => handleSectionChange(idx, 'title', e.target.value)}
                className="block w-full mb-2 p-2 border rounded"
              />
              <textarea
                placeholder="Section content"
                value={s.content}
                onChange={e => handleSectionChange(idx, 'content', e.target.value)}
                className="block w-full p-2 border rounded"
                rows={4}
              />
              <button
                type="button"
                onClick={() => handleRemoveSection(idx)}
                className="mt-2 px-3 py-1 bg-red-500 text-white rounded"
                disabled={sections.length === 1}
                title="Remove section"
              >
                − Remove Section
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSection}
            className="mt-2 px-4 py-1 bg-blue-500 text-white rounded"
          >
            + Add Section
          </button>
        </div>
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