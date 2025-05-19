import React from 'react';

const DynamicEntryView = ({ entry }) => {
  if (!entry) return <div>No entry found.</div>;

  // Flatten details if present
  const { title, summary, createdBy, createdAt, details = {}, sections = [], ...rest } = entry;
  // Merge details and any other fields not already handled
  const fields = { ...details, ...rest };

  // Format date
  let formattedDate = "Unknown Date";
  if (createdAt) {
    if (createdAt.$date) {
      formattedDate = new Date(createdAt.$date).toLocaleDateString();
    } else {
      formattedDate = new Date(createdAt).toLocaleDateString();
    }
  }

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      {summary && <p className="text-gray-700 text-lg">{summary}</p>}
      <div className="text-sm text-gray-500">
        {createdBy && <>Created by {createdBy} on {formattedDate}</>}
      </div>
      <div className="space-y-2 mt-4">
        {Object.entries(fields).map(([key, value]) => {
          // Skip fields already shown above
          if (["title", "summary", "createdBy", "createdAt", "_id", "indexId", "type", "sections"].includes(key)) return null;
          return (
            <p key={key}>
              <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {String(value)}
            </p>
          );
        })}
      </div>
      {/* Render dynamic sections */}
      {sections.length > 0 && (
        <div className="mt-6 space-y-4">
          {sections.map((section, idx) => (
            <details key={idx} className="bg-gray-50 rounded border p-3">
              <summary className="font-semibold cursor-pointer">{section.title || `Section ${idx + 1}`}</summary>
              <div className="mt-2 whitespace-pre-line">{section.content}</div>
            </details>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicEntryView;