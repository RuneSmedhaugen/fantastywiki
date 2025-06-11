import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SidePanel from '../components/SidePanel';

const DynamicEntryView = ({ entry }) => {
  const navigate = useNavigate();
  const { type, id } = useParams();

  // Get user from localStorage (or context if you use that)
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  if (!entry) return <div className="text-center text-gray-400">No entry found.</div>;

  const {
    title,
    summary,
    createdBy,
    createdAt,
    imageUrl,
    details = {},
    sections = [],
    ...rest
  } = entry;

  const fields = { ...details, ...rest };

  let formattedDate = "Unknown Date";
  if (createdAt) {
    if (createdAt.$date) {
      formattedDate = new Date(createdAt.$date).toLocaleDateString();
    } else {
      formattedDate = new Date(createdAt).toLocaleDateString();
    }
  }

  // Filter out meta fields for the info panel
  const infoFields = Object.fromEntries(
    Object.entries(fields).filter(
      ([key]) =>
        !["title", "summary", "createdBy", "createdAt", "_id", "indexId", "type", "sections", "imageUrl"].includes(key)
    )
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-black/40 border border-violet-600 backdrop-blur-md p-6 rounded-xl shadow-lg text-white">
      {/* Main content */}
      <div className="flex-1 space-y-8">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-extrabold text-violet-300">{title}</h1>
          {user && (user.role === "admin" || user.role === "superadmin") && (
            <button
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-base"
              onClick={() => navigate(`/edit-entry/${type || entry.type}/${id || entry._id}`)}
            >
              Edit
            </button>
          )}
        </div>
        {summary && <p className="text-gray-300 text-lg">{summary}</p>}

        <div className="text-sm text-gray-400">
          {createdBy && (
            <>
              Created by <span className="text-indigo-400">{createdBy}</span> on {formattedDate}
            </>
          )}
        </div>

        {sections.length > 0 && (
          <div className="space-y-4 mt-6">
            {sections.map((section, idx) => (
              <details
                key={idx}
                className="bg-gray-900/50 backdrop-blur-sm border border-cyan-600 rounded-lg overflow-hidden"
              >
                <summary className="px-4 py-3 text-lg font-semibold cursor-pointer text-cyan-300 hover:text-cyan-400 transition">
                  {section.title || `Section ${idx + 1}`}
                </summary>
                <div className="px-4 py-3 text-gray-300 whitespace-pre-line border-t border-cyan-700">
                  {section.content}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar using SidePanel */}
      <SidePanel
        imageUrl={imageUrl}
        imageAlt={title}
        title="Entry Info"
        fields={infoFields}
      />
    </div>
  );
};

export default DynamicEntryView;