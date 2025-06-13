import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import EntryManager from '../components/EntryManager';
import { API_BASE } from '../config';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEntryManager, setShowEntryManager] = useState(false);
  const [showDrafts, setShowDrafts] = useState(false);
  const [drafts, setDrafts] = useState([]);
  const [draftsLoading, setDraftsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const fetchDrafts = async () => {
    setDraftsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/drafts`, { credentials: "include" });
      const data = await res.json();
      setDrafts(data);
    } catch {
      setDrafts([]);
    }
    setDraftsLoading(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 mt-8 bg-white shadow-xl rounded-2xl">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <div className="space-y-4">
        <button
          className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          onClick={() => setShowEntryManager(true)}
        >
          Delete/Edit Entries
        </button>
        <button
          className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          onClick={() => navigate('/create-entry')}
        >
          Create New Entry
        </button>
        <button
          className="w-full px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700"
          onClick={() => navigate('/admincontact')}
        >
          View Contact Tickets
        </button>
        <button
          className="w-full px-4 py-2 bg-violet-600 text-white rounded hover:bg-violet-700"
          onClick={() => {
            setShowDrafts(true);
            fetchDrafts();
          }}
        >
          View All Drafts
        </button>
      </div>
      {showDrafts && (
        <div className="bg-gray-900 border border-violet-700 rounded-lg p-4 mt-4">
          <button
            className="mb-2 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600"
            onClick={() => setShowDrafts(false)}
          >
            &larr; Back
          </button>
          {draftsLoading ? (
            <div>Loading drafts...</div>
          ) : drafts.length === 0 ? (
            <div className="text-gray-400">No drafts found.</div>
          ) : (
            <ul>
              {drafts.map(draft => (
                <li key={draft._id} className="mb-2 flex items-center gap-2">
                  <span className="font-bold text-violet-300">{draft.title || "(Untitled)"}</span>
                  <span className="ml-2 text-xs text-gray-400">by {draft.authorId}</span>
                  <span className="ml-2 text-xs text-gray-400">{new Date(draft.updatedAt).toLocaleString()}</span>
                  <button
                    className="ml-4 px-2 py-1 bg-green-700 text-white rounded hover:bg-green-800"
                    onClick={() => {
                      if (draft.entryId) {
                        navigate(`/edit-entry/${draft.entryType || "entry"}/${draft.entryId}?draft=${draft._id}`);
                      } else {
                        navigate(`/create-entry/${draft.entryType || "entry"}?draft=${draft._id}`);
                      }
                    }}
                  >
                    Continue Editing
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {showEntryManager && (
        <div className="mt-8">
          <EntryManager onEdit={entry => navigate(`/edit-entry/${entry.type}/${entry._id}`)} />
          <button
            className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
            onClick={() => setShowEntryManager(false)}
          >
            Close Entry Manager
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;