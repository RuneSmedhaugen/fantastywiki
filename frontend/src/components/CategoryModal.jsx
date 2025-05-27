import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { API_BASE } from "../config";

const CategoryModal = ({ isOpen, onClose }) => {
  const [categories, setCategories] = useState([]);

useEffect(() => {
  if (isOpen) {
    fetch(`${API_BASE}/categories`)
      .then((res) => res.json())
      .then((data) => {
        // 🔍 Handle either structure: objects or raw strings
        if (Array.isArray(data)) {
          if (typeof data[0] === "string") {
            setCategories(data); // simple string list
          } else if (typeof data[0] === "object" && data[0].name) {
            setCategories(data.map(c => c.name)); // extract from objects
          } else {
            console.warn("Unexpected category data shape:", data);
            setCategories([]);
          }
        }
      })
      .catch(console.error);
  }
}, [isOpen]);


  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-90"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-90"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-gray-900 border border-indigo-500 p-6 text-left shadow-xl transition-all text-white">
                <Dialog.Title className="text-xl font-bold text-indigo-300 mb-4">
                  Browse Categories
                </Dialog.Title>

                <ul className="space-y-3 text-sm">
                  {categories.map((cat) => (
                    <li key={cat}>
                      <Link
                        to={`/entries?category=${cat}`}
                        onClick={onClose}
                        className="block px-3 py-2 rounded hover:bg-indigo-700/30 transition"
                      >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </Link>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onClose}
                  className="mt-6 w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white"
                >
                  Close
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CategoryModal;
