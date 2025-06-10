import { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import EntryManager from '../components/EntryManager';
import UserManager from '../components/UserManager';

const SuperAdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEntryManager, setShowEntryManager] = useState(false);
  const [showUserManager, setShowUserManager] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'superadmin') return <Navigate to="/" replace />;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-screen-xl mx-auto text-white">
      <div className="flex-1 space-y-8">
        <h1 className="text-4xl font-bold text-violet-300 drop-shadow-lg">Super Admin Panel</h1>
        <div className="space-y-4">
          <button
            className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
            onClick={() => setShowEntryManager(true)}
          >
            Delete/Edit Entries
          </button>
          <button
            className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            onClick={() => navigate('/create-entry')}
          >
            Create New Entry
          </button>
          <button
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            onClick={() => setShowUserManager(true)}
          >
            Edit Users
          </button>
          <button
            className="w-full px-4 py-2 bg-cyan-600 text-white rounded hover:bg-cyan-700 transition"
            onClick={() => navigate('/admincontact')}
          >
            View Contact Tickets
          </button>
        </div>
        {showEntryManager && (
          <div className="mt-8">
            <EntryManager onEdit={entry => navigate(`/edit-entry/${entry.type}/${entry._id}`)} />
            <button
              className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              onClick={() => setShowEntryManager(false)}
            >
              Close Entry Manager
            </button>
          </div>
        )}
        {showUserManager && (
          <div className="mt-8">
            <UserManager />
            <button
              className="mt-4 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
              onClick={() => setShowUserManager(false)}
            >
              Close User Manager
            </button>
          </div>
        )}
      </div>
      {/* Optionally, add a sidebar or info panel here if needed */}
    </div>
  );
};

export default SuperAdminPanel;