import { useEffect, useState } from "react";
import { API_BASE } from "../config";

const EntryManager = ({ onEdit }) => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await fetch(`${API_BASE}/entries`);
        const data = await res.json();
        setEntries(data);
      } catch {
        setError("Failed to fetch entries.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntries();
  }, []);

  const handleDelete = async (entry) => {
    if (!window.confirm(`Delete "${entry.title}"?`)) return;
    try {
      const res = await fetch(
        `${API_BASE}/entry/${entry.type}/${entry._id}`,
        { method: "DELETE", credentials: "include" }
      );
      if (res.ok) {
        setEntries((prev) => prev.filter((e) => e._id !== entry._id));
      } else {
        setError("Failed to delete entry.");
      }
    } catch {
      setError("Failed to delete entry.");
    }
  };

  if (loading) return <div>Loading entries...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Manage Entries</h2>
      <ul className="divide-y divide-gray-700">
        {entries.map((entry) => (
          <li key={entry._id} className="flex items-center justify-between py-3">
            <div>
              <span className="font-semibold text-indigo-300">{entry.title}</span>
              <span className="ml-2 text-sm text-gray-400">({entry.type})</span>
            </div>
            <div className="space-x-2">
              <button
                className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                onClick={() => onEdit && onEdit(entry)}
              >
                Edit
              </button>
              <button
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                onClick={() => handleDelete(entry)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EntryManager;