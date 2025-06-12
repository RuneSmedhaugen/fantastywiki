import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../config";

const HandleContact = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(null);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE}/tickets/${id}`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setTicket(data))
      .catch(() => setError("Failed to load ticket."));
  }, [id]);

  const handleReply = async e => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}/reply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: reply }),
      });
      if (!res.ok) {
        setError("Failed to send reply.");
      } else {
        setSuccess("Reply sent!");
        setReply("");
        // Reload ticket to show new message
        const updated = await fetch(`${API_BASE}/tickets/${id}`, { credentials: "include" }).then(r => r.json());
        setTicket(updated);
      }
    } catch {
      setError("Network error.");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      const res = await fetch(`${API_BASE}/tickets/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) navigate("/admincontact");
    } catch {
      setError("Failed to delete ticket.");
    }
  };

  if (!ticket) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 mt-10 bg-gray-900/70 rounded-lg shadow-lg text-white">
      <h1 className="text-2xl font-bold text-violet-300 mb-2">{ticket.title}</h1>
      <div className="text-gray-400 mb-4">{ticket.summary}</div>
      <div className="text-xs text-gray-500 mb-6">
        By {ticket.createdBy?.username || "Unknown"} • {new Date(ticket.createdAt).toLocaleString()}
      </div>
      <div className="mb-6">
        {ticket.messages.map((msg, idx) => (
          <div key={idx} className="mb-4">
            <div className="text-xs text-gray-400">
              {msg.sender.username} ({msg.sender.role}) • {new Date(msg.createdAt).toLocaleString()}
            </div>
            <div className="bg-gray-800 rounded p-3 text-white whitespace-pre-line">
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleReply} className="mb-4">
        <textarea
          className="w-full p-2 rounded bg-gray-800 border border-violet-700 text-white"
          value={reply}
          onChange={e => setReply(e.target.value)}
          rows={3}
          placeholder="Write a reply... (emojis supported!)"
          required
        />
        {/* Emoji picker can be added here */}
        <button
          type="submit"
          className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded text-white font-semibold mt-2"
        >
          Send Reply
        </button>
      </form>
      {success && <div className="text-green-400 mb-2">{success}</div>}
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {/* Show delete button for admins */}
      <button
        onClick={handleDelete}
        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-semibold"
      >
        Delete Ticket
      </button>
    </div>
  );
};

export default HandleContact;