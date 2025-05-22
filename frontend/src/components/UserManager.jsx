import { useState, useEffect } from "react";
import { API_BASE } from "../config";

const UserManager = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [actionMsg, setActionMsg] = useState("");

  // Fetch all users on mount
  useEffect(() => {
    const fetchAll = async () => {
      setError("");
      try {
        const res = await fetch(`${API_BASE}/auth/admin/all-users`, {
          credentials: "include",
        });
        const data = await res.json();
        setResults(data);
      } catch {
        setError("Failed to load users.");
      }
    };
    fetchAll();
  }, []);

  // Search users
  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setSelected(null);
    setActionMsg("");
    if (!query.trim()) {
      // If query is empty, fetch all users
      try {
        const res = await fetch(`${API_BASE}/auth/admin/all-users`, {
          credentials: "include",
        });
        const data = await res.json();
        setResults(data);
      } catch {
        setError("Failed to load users.");
      }
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/auth/admin/search-users?q=${encodeURIComponent(query)}`, {
        credentials: "include",
      });
      const data = await res.json();
      setResults(data);
    } catch {
      setError("Failed to search users.");
    }
  };

  // When a user is selected, set the editable fields
  const handleSelect = (user) => {
    setSelected(user);
    setRole(user.role);
    setUsername(user.username);
    setEmail(user.email);
    setActionMsg("");
  };

  // Update user (superadmin only)
  const handleUpdateUser = async () => {
    setError("");
    setActionMsg("");
    try {
      const res = await fetch(`${API_BASE}/auth/admin/update-user/${selected._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update user.");
        return;
      }
      setActionMsg("User updated!");
      setSelected({ ...selected, username, email, role });
      setResults(results.map(u => u._id === selected._id ? { ...u, username, email, role } : u));
    } catch {
      setError("Failed to update user.");
    }
  };

  // Delete user (superadmin only)
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete user "${selected.username}"?`)) return;
    setError("");
    setActionMsg("");
    try {
      const res = await fetch(`${API_BASE}/auth/admin/delete-user/${selected._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to delete user.");
        return;
      }
      setActionMsg("User deleted.");
      setResults(results.filter(u => u._id !== selected._id));
      setSelected(null);
    } catch {
      setError("Failed to delete user.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 max-w-screen-xl mx-auto text-white">
      {/* Main content */}
      <div className="flex-1 space-y-8">
        <h2 className="text-3xl font-bold text-violet-300 drop-shadow-lg">User Management</h2>
        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search users by username or email"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 p-2 border rounded bg-gray-900 text-gray-100"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Search
          </button>
        </form>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {actionMsg && <div className="text-green-400 mb-2">{actionMsg}</div>}
        <section>
          <details open className="group bg-gray-900/60 backdrop-blur-md border border-violet-500 rounded-lg shadow-xl">
            <summary className="cursor-pointer px-6 py-4 text-xl font-semibold text-violet-400 group-open:rounded-b-none hover:text-violet-300">
              Search Results
            </summary>
            <div className="px-6 py-4 space-y-4">
              {results.length === 0 && <div className="text-gray-400">No users found.</div>}
              {results.map(user => (
                <div
                  key={user._id}
                  className={`bg-black/30 border border-indigo-600 p-4 rounded-lg shadow hover:shadow-violet-500/20 transition cursor-pointer flex justify-between items-center ${
                    selected && selected._id === user._id ? "ring-2 ring-violet-400" : ""
                  }`}
                  onClick={() => handleSelect(user)}
                >
                  <span>
                    <span className="text-lg font-semibold text-indigo-400">{user.username}</span>
                    <span className="ml-2 text-gray-400">({user.email})</span>
                  </span>
                  <span className="text-xs bg-gray-800 text-violet-200 px-2 py-1 rounded ml-4">{user.role}</span>
                </div>
              ))}
            </div>
          </details>
        </section>
      </div>
      {/* Sidebar for selected user */}
      <aside className="w-full md:w-1/3 space-y-6">
        {selected && (
          <details open className="group bg-gray-900/60 backdrop-blur-md border border-cyan-500 rounded-lg shadow-xl">
            <summary className="cursor-pointer px-6 py-4 text-xl font-semibold text-cyan-400 group-open:rounded-b-none hover:text-cyan-300">
              Edit User: <span className="text-white">{selected.username}</span>
            </summary>
            <div className="px-6 py-4 space-y-3">
              <div>
                <span className="font-semibold text-cyan-300">Username:</span>{" "}
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="ml-2 p-1 rounded bg-gray-800 text-cyan-200 border border-cyan-400"
                />
              </div>
              <div>
                <span className="font-semibold text-cyan-300">Email:</span>{" "}
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="ml-2 p-1 rounded bg-gray-800 text-cyan-200 border border-cyan-400"
                />
              </div>
              <div>
                <span className="font-semibold text-cyan-300">Role:</span>{" "}
                <select
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="ml-2 p-1 rounded bg-gray-800 text-cyan-200 border border-cyan-400"
                >
                  <option value="user">user</option>
                  <option value="admin">admin</option>
                  <option value="superadmin">superadmin</option>
                </select>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={handleUpdateUser}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                  type="button"
                >
                  Update User
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                  type="button"
                >
                  Delete User
                </button>
              </div>
            </div>
          </details>
        )}
      </aside>
    </div>
  );
};

export default UserManager;