// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
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
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      navigate("/login");
    } catch (err) {
      setError("Network error");
      console.error(err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <form onSubmit={handleRegister} className="w-full max-w-md bg-black/50 backdrop-blur-md border border-violet-500 rounded-2xl p-8 shadow-xl">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-violet-300">Register</h2>

        {error && <p className="text-red-400 mb-4 text-center">{error}</p>}

        <label className="block mb-3">
          <span className="text-sm text-violet-200">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-violet-200">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm text-violet-200">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </label>

        <label className="block mb-5">
          <span className="text-sm text-violet-200">Confirm Password</span>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full mt-1 px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </label>

        <button type="submit" className="w-full bg-violet-600 hover:bg-violet-700 transition-colors py-2 rounded-lg font-semibold text-white shadow-md">
          Register
        </button>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-violet-400 hover:underline cursor-pointer">
            Login here
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;
