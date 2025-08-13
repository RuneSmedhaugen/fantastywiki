import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import WarningModal from '../components/WarningModal';
import { API_BASE } from '../config';

const AccountSettings = () => {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", profilePicture: "" });
  const [imageFile, setImageFile] = useState(null);
  const [showWarning, setShowWarning] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setForm({ username: u.username, email: u.email, password: '', profilePicture: JSON.parse(stored).profilePicture || "", });
    }
    setLoading(false);
  }, []);

   // Upload profile picture file
  useEffect(() => {
    if (imageFile) {
      const upload = async () => {
        const formData = new FormData();
        formData.append("image", imageFile);
        const res = await fetch(`${API_BASE}/auth/upload-profile-picture`, {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        if (res.ok && data.imageUrl) {
          setForm((prev) => ({ ...prev, profilePicture: data.imageUrl }));
          setUser((prev) => ({ ...prev, profilePicture: data.imageUrl }));
          localStorage.setItem("user", JSON.stringify({ ...user, profilePicture: data.imageUrl }));
        } else {
          alert(data.error || "Failed to upload image");
        }
        setImageFile(null);
      };
      upload();
    }
    // eslint-disable-next-line
  }, [imageFile]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSave = async (e) => {
  e.preventDefault();

  // Find only changed fields
  const updatedFields = {};
  Object.keys(form).forEach((key) => {
    // If field has changed and isn't empty
    if (form[key] !== user[key] && form[key] !== "") {
      updatedFields[key] = form[key];
    }
  });

  // If nothing changed, skip request
  if (Object.keys(updatedFields).length === 0) {
    alert("No changes to save.");
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/auth/update-account`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(updatedFields),
    });

    if (!res.ok) {
      const error = await res.json();
      alert(error.error || 'Failed to update account');
      return;
    }

    // Merge changes into user state + localStorage
    const newUser = { ...user, ...updatedFields };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);

    alert('Account updated successfully!');
  } catch {
    alert('An error occurred while updating your account.');
  }
};

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/delete-account`, {
        method: 'DELETE',
        headers: {
        },
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        alert(error.error || 'Failed to delete account');
        return;
      }

      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } catch {
      alert('An error occurred while deleting your account.');
    }
  };


  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-screen-xl mx-auto text-white">
      <div className="flex-1 space-y-8">
        <h1 className="text-4xl font-bold text-violet-300 drop-shadow-lg mb-6">Account Settings</h1>
        <form onSubmit={handleSave} className="space-y-6 bg-black/40 border border-violet-600 backdrop-blur-md p-6 rounded-xl shadow-lg">
          <div>
            <label className="block text-sm font-medium text-violet-200">Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded bg-gray-900 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-violet-200">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded bg-gray-900 text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-violet-200">Password</label>
            <input
              name="password"
              type="password"
              placeholder="New password"
              value={form.password}
              onChange={handleChange}
              className="mt-1 block w-full p-2 border rounded bg-gray-900 text-gray-100"
            />
          </div>
            <label className="block mb-2">
    Profile Picture (upload)
    <input
      type="file"
      accept="image/*"
      onChange={e => setImageFile(e.target.files[0])}
      className="block w-full"
    />
  </label>
  <label className="block mb-2">
    Or use image URL
    <input
      type="text"
      name="profilePicture"
      value={form.profilePicture}
      onChange={handleChange}
      className="block w-full p-2 border rounded"
    />
  </label>
  {form.profilePicture && (
    <img
      src={form.profilePicture.startsWith("/") ? `http://localhost:5000${form.profilePicture}` : form.profilePicture}
      alt="Profile"
      className="w-24 h-24 rounded-full border mb-2"
    />
  )}
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
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
    </div>
  );
};

export default AccountSettings;