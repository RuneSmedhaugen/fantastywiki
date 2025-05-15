import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const AdminPanel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

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
        <button className="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
          Delete Entries
        </button>
        <button className="w-full px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
          Edit Entry (Coming Soon)
        </button>
        <button className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
          Create New Entry (Coming Soon)
        </button>
      </div>
    </div>
  );
};

export default AdminPanel;