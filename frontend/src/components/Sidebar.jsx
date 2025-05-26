import { useState } from "react";
import CategoryModal from "./CategoryModal";

const Sidebar = () => {
  const [isCategoryOpen, setCategoryOpen] = useState(false);

  return (
    <aside className="w-full md:w-60 bg-gray-950/60 backdrop-blur-md border border-indigo-700 text-white p-4 rounded-xl shadow-md h-fit sticky top-24">
      <h2 className="text-lg font-bold text-indigo-300 mb-4">Navigation</h2>
      <ul className="space-y-3 text-sm">
        <li>
          <button
            onClick={() => setCategoryOpen(true)}
            className="w-full text-left px-3 py-2 bg-indigo-700/30 hover:bg-indigo-600/40 rounded transition"
          >
            📂 Browse Categories
          </button>
        </li>
        <li>
          <button
            onClick={() => alert("Coming soon...")}
            className="w-full text-left px-3 py-2 bg-cyan-700/30 hover:bg-cyan-600/40 rounded transition"
          >
            🔍 Advanced Search
          </button>
        </li>
        <li>
          <button
            onClick={() => alert("Coming soon...")}
            className="w-full text-left px-3 py-2 bg-emerald-700/30 hover:bg-emerald-600/40 rounded transition"
          >
            📁 Saved Entries
          </button>
        </li>
      </ul>

      {/* Modals */}
      <CategoryModal isOpen={isCategoryOpen} onClose={() => setCategoryOpen(false)} />
    </aside>
  );
};

export default Sidebar;
