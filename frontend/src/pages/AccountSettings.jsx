import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import WarningModal from '../components/WarningModal';
import { API_BASE } from '../config';

const AccountSettings = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const stored = localStorage.getItem('user');
    console.log("localStorage.getItem('user'):", stored);
    if (stored) {
      const u = JSON.parse(stored);
      console.log("Parsed user from localStorage:", u);
      setUser(u);
      setForm({ username: u.username, email: u.email, password: '' });
    } else {
      console.log("No user found in localStorage.");
    }
    setLoading(false); // <-- Set loading to false after checking
  }, []);

  useEffect(() => {
    console.log("Current user state:", user);
  }, [user]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!user) {
    console.log("User is null, redirecting to login.");
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/update-account`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to update account:', error);
        alert(error.error || 'Failed to update account');
        return;
      }

      const updatedUser = await res.json();
      console.log('Account updated:', updatedUser);

      // Update local storage and state
      localStorage.setItem('user', JSON.stringify({ ...user, ...form }));
      setUser({ ...user, ...form });
      alert('Account updated successfully!');
    } catch (err) {
      console.error('Error updating account:', err);
      alert('An error occurred while updating your account.');
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/delete-account`, {
        method: 'DELETE',
        headers: {
          credentials: 'include',
        },
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to delete account:', error);
        alert(error.error || 'Failed to delete account');
        return;
      }

      console.log('Account deleted');
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch (err) {
      console.error('Error deleting account:', err);
      alert('An error occurred while deleting your account.');
    }
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