// src/pages/Profile.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-2xl mt-8">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <div className="space-y-2">
        <p><span className="font-semibold">Username:</span> {user.username}</p>
        <p><span className="font-semibold">Email:</span> {user.email}</p>
        <p><span className="font-semibold">Role:</span> {user.role}</p>
        <p><span className="font-semibold">User ID:</span> {user.id}</p>
      </div>
    </div>
  );
};

export default Profile;