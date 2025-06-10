import React, { useState } from "react";
import { API_BASE } from "../config";

const Contact = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title, summary, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to send message.");
      } else {
        setSuccess("Your message has been sent! We'll get back to you soon.");
        setTitle("");
        setSummary("");
        setMessage("");
      }
    } catch {
      setError("Network error.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900/70 rounded-lg shadow-lg mt-10 text-white">
      <h1 className="text-3xl font-bold text-violet-300 mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-violet-700 text-white"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            maxLength={100}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Summary</label>
          <input
            className="w-full p-2 rounded bg-gray-800 border border-violet-700 text-white"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            required
            maxLength={150}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <textarea
            className="w-full p-2 rounded bg-gray-800 border border-violet-700 text-white"
            value={message}
            onChange={e => setMessage(e.target.value)}
            required
            rows={5}
            maxLength={2000}
          />
        </div>
        {/* Emoji picker can be added here */}
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded text-white font-semibold"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
        {success && <div className="text-green-400 mt-2">{success}</div>}
        {error && <div className="text-red-400 mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default Contact;