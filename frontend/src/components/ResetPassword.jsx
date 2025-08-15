import { useState } from "react";
import { API_BASE } from "../config";

const ResetPassword = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMessage(data.error || "Something went wrong.");
    } else {
      setMessage("If this email is registered, a reset link has been sent.");
    }
  } catch (err) {
    console.error(err);
    setMessage("Failed to send reset request.");
  } finally {
    setLoading(false);
  }
};

  // Close modal on outside click
  const handleOutsideClick = (e) => {
    if (e.target.id === "resetPasswordBackdrop") {
      onClose();
    }
  };

  return (
    <div
      id="resetPasswordBackdrop"
      onClick={handleOutsideClick}
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50"
    >
      <div className="bg-gray-900 border border-indigo-500 rounded-2xl p-6 w-full max-w-md shadow-xl">
        <h2 className="text-2xl font-bold text-indigo-300 mb-4 text-center">
          Reset Password
        </h2>

        {message && (
          <p className="text-sm text-center mb-4 text-indigo-200">{message}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block">
            <span className="text-sm text-indigo-200">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full px-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your email"
            />
          </label>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
