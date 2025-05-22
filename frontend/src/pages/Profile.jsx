import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-screen-xl mx-auto text-white">
      <div className="flex-1 space-y-8">
        <h1 className="text-4xl font-bold text-violet-300 drop-shadow-lg mb-6">Profile</h1>
        <section>
          <details open className="group bg-gray-900/60 backdrop-blur-md border border-violet-500 rounded-lg shadow-xl">
            <summary className="cursor-pointer px-6 py-4 text-xl font-semibold text-violet-400 group-open:rounded-b-none hover:text-violet-300">
              User Information
            </summary>
            <div className="px-6 py-4 space-y-2">
              <p>
                <span className="font-semibold text-cyan-300">Username:</span>{" "}
                <span className="text-gray-200">{user.username}</span>
              </p>
              <p>
                <span className="font-semibold text-cyan-300">Email:</span>{" "}
                <span className="text-gray-200">{user.email}</span>
              </p>
              <p>
                <span className="font-semibold text-cyan-300">Role:</span>{" "}
                <span className="text-gray-200">{user.role}</span>
              </p>
              <p>
                <span className="font-semibold text-cyan-300">User ID:</span>{" "}
                <span className="text-gray-200">{user.id}</span>
              </p>
            </div>
          </details>
        </section>
      </div>
    </div>
  );
};

export default Profile;