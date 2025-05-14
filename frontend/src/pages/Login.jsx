// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        credentials: "include",          // <–– send/receive cookies
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Preflight or network-level failure
      if (!res) {
        setError("Network error");
        return;
      }

      // If CORS preflight fails, it never reaches here
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Store user info (the cookie is stored automatically)
      localStorage.setItem("user", JSON.stringify(data));
      navigate("/");

    } catch (err) {
      console.error(err);
      setError("Request failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <form onSubmit={handleSubmit}
            className="bg-gray-700 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <label className="block mb-3">
          <span className="text-sm">Username</span>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <label className="block mb-6">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <button type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors py-2 rounded font-semibold">
          Login
        </button>

        <p className="text-sm text-gray-300 mt-6 text-center">
          Don&apos;t have an account?{" "}
          <span onClick={() => navigate("/register")}
                className="text-indigo-400 hover:underline cursor-pointer">
            Create one here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
