import React from 'react';

const DynamicEntryView = ({ entry }) => {
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

  return (
    console.log("Rendering DynamicEntryView with entry:", entry),
    <div className="flex flex-col lg:flex-row gap-8 bg-black/40 border border-violet-600 backdrop-blur-md p-6 rounded-xl shadow-lg text-white">
      {/* Main content */}
      <div className="flex-1 space-y-8">
        <h1 className="text-4xl font-extrabold text-violet-300">{title}</h1>
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

      {/* Sidebar Fields (Info Card + Image) */}
      <aside className="w-full lg:w-1/3 bg-gray-950/50 border border-indigo-600 p-6 rounded-lg shadow-md backdrop-blur-md h-fit">
        {/* Entry Image (Wikipedia-style) */}
        {imageUrl && (
          <div className="mb-6">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto rounded border border-indigo-500 shadow-md"
            />
            <p className="text-xs text-center text-gray-400 mt-1">Image: {title}</p>
          </div>
        )}

        <h2 className="text-xl font-bold text-indigo-300 mb-4">Entry Info</h2>
        <ul className="space-y-3 text-sm text-gray-300">
          {Object.entries(fields).map(([key, value]) => {
            if (["title", "summary", "createdBy", "createdAt", "_id", "indexId", "type", "sections", "imageUrl"].includes(key))
              return null;
            return (
              <li key={key} className="flex justify-between border-b border-gray-700 pb-1">
                <span className="font-medium text-indigo-400">
                  {key.charAt(0).toUpperCase() + key.slice(1)}:
                </span>
                <span className="text-gray-300 text-right">{String(value)}</span>
              </li>
            );
          })}
        </ul>
      </aside>
    </div>
  );
};

export default DynamicEntryView;
