import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config";
import ResetPassword from "../components/ResetPassword";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showResetModal, setShowResetModal] = useState(false); // Modal toggle
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res) {
        setError("Network error");
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data));
      window.dispatchEvent(new Event("userChanged"));
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Request failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-black/50 backdrop-blur-md border border-indigo-500 rounded-2xl p-8 shadow-xl"
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-300">Login</h2>

        {error && (
          <p className={`mb-4 text-center ${error.toLowerCase().includes("verify") ? "text-yellow-400" : "text-red-400"}`}>
            {error}
          </p>
        )}

        <label className="block mb-4">
          <span className="text-sm text-indigo-200">Username</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm text-indigo-200">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mt-1 w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </label>

        {/* Forgot password button */}
        <div className="text-right mb-6">
          <button
            type="button"
            onClick={() => setShowResetModal(true)}
            className="text-sm text-indigo-400 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors py-2 rounded-lg font-semibold text-white shadow-md"
        >
          Login
        </button>

        <p className="text-sm text-gray-400 mt-6 text-center">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-indigo-400 hover:underline cursor-pointer"
          >
            Register here
          </span>
        </p>
      </form>

      {/* Reset Password Modal */}
      {showResetModal && (
        <ResetPassword onClose={() => setShowResetModal(false)} />
      )}
    </div>
  );
};

export default Login;
