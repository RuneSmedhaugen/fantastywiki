// src/pages/AccountSettings.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import WarningModal from '../components/WarningModal';

const AccountSettings = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setForm({ username: u.username, email: u.email, password: '' });
    }
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    // TODO: call API to update account
    console.log('Saving', form);
  };

  const handleDelete = () => {
    // TODO: call API to delete account
    console.log('Account deleted');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl mt-8">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Username</label>
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            name="password"
            type="password"
            placeholder="New password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Save Changes
        </button>

        <button
          type="button"
          onClick={() => setShowWarning(true)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Delete Account
        </button>
      </form>

      <WarningModal
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        message="Are you sure you want to delete your account? This action cannot be undone."
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default AccountSettings;