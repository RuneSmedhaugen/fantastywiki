import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config";

const AdminContact = () => {
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/tickets`, { credentials: "include" })
      .then(res => res.json())
      .then(data => setTickets(data))
      .catch(() => setError("Failed to load tickets."));
  }, []);

  const handleDelete = async id => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      const res = await fetch(`http://localhost:5000/tickets/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) setTickets(tickets.filter(t => t._id !== id));
    } catch {
      setError("Failed to delete ticket.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-gray-900/70 rounded-lg shadow-lg text-white">
      <h1 className="text-3xl font-bold text-violet-300 mb-6">Admin Contact Tickets</h1>
      {error && <div className="text-red-400 mb-4">{error}</div>}
      <div className="space-y-4">
        {tickets.length === 0 && <div>No tickets found.</div>}
        {tickets.map(ticket => (
          <div key={ticket._id} className="bg-gray-800 rounded p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-violet-700">
            <div>
              <div className="font-semibold text-violet-200">{ticket.title}</div>
              <div className="text-gray-400 text-sm">{ticket.summary}</div>
              <div className="text-xs text-gray-500 mt-1">
                By {ticket.createdBy?.username || "Unknown"} • {new Date(ticket.createdAt).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/handlecontact/${ticket._id}`}
                className="bg-cyan-600 hover:bg-cyan-700 px-3 py-1 rounded text-white text-xs font-semibold"
              >
                View Ticket
              </Link>
              <button
                onClick={() => handleDelete(ticket._id)}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white text-xs font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContact;