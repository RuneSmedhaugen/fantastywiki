import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { API_BASE } from "../config";

const UserTicketsModal = ({ isOpen, onClose, onBack }) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const backBtnRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetch(`${API_BASE}/tickets/user`, { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        setTickets(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && backBtnRef.current) {
      backBtnRef.current.focus();
    }
  }, [isOpen]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen px-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-gray-900 rounded-xl shadow-xl max-w-lg w-full p-6 z-30">
              <Dialog.Title className="text-xl font-bold text-violet-300 mb-4">
                My Support Tickets
              </Dialog.Title>
              <button
                ref={backBtnRef}
                className="mb-4 px-3 py-1 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                onClick={onBack}
              >
                &larr; Back to Settings
              </button>
              {loading ? (
                <div className="text-gray-300">Loading...</div>
              ) : tickets.length === 0 ? (
                <div className="text-gray-400">No tickets found.</div>
              ) : (
                <ul className="space-y-4">
                  {tickets.map(ticket => (
                    <li key={ticket._id} className="bg-gray-800 rounded p-4 border border-violet-700">
                      <div className="font-semibold text-violet-200">{ticket.title}</div>
                      <div className="text-gray-400 text-sm">{ticket.summary}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        Created {new Date(ticket.createdAt).toLocaleString()}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default UserTicketsModal;