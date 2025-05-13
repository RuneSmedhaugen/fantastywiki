// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [error, setError]       = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match!");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      // On success, redirect to login
      navigate("/login");
    } catch (err) {
      setError("Network error");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white">
      <form onSubmit={handleRegister} className="bg-gray-700 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Register</h2>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <label className="block mb-3">
          <span className="text-sm">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm">Confirm Password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors py-2 rounded font-semibold">
          Register
        </button>

        <p className="text-sm text-gray-300 mt-6 text-center">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-indigo-400 hover:underline cursor-pointer">
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
