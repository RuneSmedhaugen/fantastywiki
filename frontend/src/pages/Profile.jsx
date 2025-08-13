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

  const profilePictureUrl = user?.profilePicture
    ? user.profilePicture.startsWith("/")
      ? `http://localhost:5000${user.profilePicture}`
      : user.profilePicture
    : null;

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-screen-xl mx-auto text-white">
      <div className="flex-1 space-y-8">
        <h1 className="text-4xl font-bold text-violet-300 drop-shadow-lg mb-6">Profile</h1>
        <section>
          <details open className="group bg-gray-900/60 backdrop-blur-md border border-violet-500 rounded-lg shadow-xl">
            <summary className="cursor-pointer px-6 py-4 text-xl font-semibold text-violet-400 group-open:rounded-b-none hover:text-violet-300">
              User Information
            </summary>
            <div className="px-6 py-4 space-y-4 flex flex-col md:flex-row md:items-center">
              <div className="flex-shrink-0 flex items-center justify-center mb-4 md:mb-0 md:mr-8">
                <span className="inline-block h-24 w-24 rounded-full bg-gray-800 border-4 border-violet-500 overflow-hidden shadow-lg">
                  {profilePictureUrl ? (
                    <img
                      src={profilePictureUrl}
                      alt="Profile"
                      className="object-cover h-full w-full"
                    />
                  ) : (
                    <span className="flex items-center justify-center h-full w-full text-4xl text-violet-300">
                      {user.username ? user.username[0].toUpperCase() : "?"}
                    </span>
                  )}
                </span>
              </div>
              <div className="space-y-2">
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
              </div>
            </div>
          </details>
        </section>
      </div>
    </div>
  );
};

export default Profile;
