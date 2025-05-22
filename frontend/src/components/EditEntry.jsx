import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const EditEntry = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [entry, setEntry] = useState(null);
  const [error, setError] = useState("");

  // Form state
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [fields, setFields] = useState([{ key: "", value: "" }]);
  const [sections, setSections] = useState([{ title: "", content: "" }]);

  // Fetch entry data on mount
  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch(`${API_BASE}/entry/${type}/${id}`);
        const data = await res.json();
        setEntry(data);
      } catch {
        setError("Failed to load entry.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [type, id]);

  // Prefill form state when entry is loaded
  useEffect(() => {
  if (entry) {
    console.log(entry);
    setTitle(entry.title || "");
    setSummary(entry.summary || "");
    const detailsArr = entry.details
      ? Object.entries(entry.details).map(([key, value]) => ({ key, value }))
      : [{ key: "", value: "" }];
    setFields(detailsArr.length ? detailsArr : [{ key: "", value: "" }]);
    setSections(entry.sections && entry.sections.length ? entry.sections : [{ title: "", content: "" }]);
  }
}, [entry]);

  // Handlers for fields and sections
  const handleFieldChange = (idx, field, value) => {
    setFields(fields.map((f, i) => (i === idx ? { ...f, [field]: value } : f)));
  };
  const handleAddField = () => setFields([...fields, { key: "", value: "" }]);
  const handleRemoveField = (idx) => setFields(fields.filter((_, i) => i !== idx));

  const handleSectionChange = (idx, field, value) => {
    setSections(sections.map((s, i) => (i === idx ? { ...s, [field]: value } : s)));
  };
  const handleAddSection = () => setSections([...sections, { title: "", content: "" }]);
  const handleRemoveSection = (idx) => setSections(sections.filter((_, i) => i !== idx));

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const details = {};
    fields.forEach((f) => {
      if (f.key) details[f.key] = f.value;
    });
    try {
      const res = await fetch(`${API_BASE}/entry/${type}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          summary,
          details,
          sections,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update entry.");
        return;
      }
      navigate(-1); // Go back or redirect as needed
    } catch {
      setError("Network error.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-screen-xl mx-auto text-white">
      {/* Main content */}
      <div className="flex-1 space-y-8">
        <h1 className="text-4xl font-bold text-violet-300 drop-shadow-lg">Edit Entry</h1>
        <form onSubmit={handleSubmit} className="space-y-6 bg-black/40 border border-violet-600 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <div>
            <label className="block text-sm font-medium text-violet-200">Title</label>
            <input
              name="title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="mt-1 block w-full p-2 border rounded bg-gray-900 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-violet-200">Summary</label>
            <input
              name="summary"
              value={summary}
              onChange={e => setSummary(e.target.value)}
              required
              className="mt-1 block w-full p-2 border rounded bg-gray-900 text-gray-100"
            />
          </div>
          {/* Info Details */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">Info Details</label>
            {fields.map((f, idx) => (
              <div key={idx} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Field name"
                  value={f.key}
                  onChange={e => handleFieldChange(idx, "key", e.target.value)}
                  className="flex-1 p-2 border rounded bg-gray-900 text-gray-100"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={f.value}
                  onChange={e => handleFieldChange(idx, "value", e.target.value)}
                  className="flex-1 p-2 border rounded bg-gray-900 text-gray-100"
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
          {/* Sections */}
          <div>
            <label className="block text-sm font-medium text-cyan-200 mb-2">Sections</label>
            {sections.map((s, idx) => (
              <details key={idx} open className="mb-4 bg-gray-900/50 backdrop-blur-sm border border-cyan-600 rounded-lg overflow-hidden">
                <summary className="px-4 py-3 text-lg font-semibold cursor-pointer text-cyan-300 hover:text-cyan-400 transition">
                  <input
                    type="text"
                    placeholder="Section title"
                    value={s.title}
                    onChange={e => handleSectionChange(idx, "title", e.target.value)}
                    className="bg-transparent text-cyan-200 font-semibold w-full outline-none"
                  />
                </summary>
                <div className="px-4 py-3 border-t border-cyan-700">
                  <textarea
                    placeholder="Section content"
                    value={s.content}
                    onChange={e => handleSectionChange(idx, "content", e.target.value)}
                    className="block w-full p-2 border rounded bg-gray-900 text-gray-100"
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
              </details>
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
              Save Changes
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
      {/* Sidebar (optional, for future use) */}
      {/* <aside className="w-full md:w-1/3 space-y-6"></aside> */}
    </div>
  );
};

export default EditEntry;