import React from 'react';

const DynamicEntryView = ({ entry }) => {
  if (!entry) return <div>No entry found.</div>;

  // Flatten details if present
  const { title, summary, createdBy, createdAt, details = {}, ...rest } = entry;
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
          if (["title", "summary", "createdBy", "createdAt", "_id", "indexId", "type"].includes(key)) return null;
          return (
            <p key={key}>
              <span className="font-semibold">{key.charAt(0).toUpperCase() + key.slice(1)}:</span> {String(value)}
            </p>
          );
        })}
      </div>
    </div>
  );
};

export default DynamicEntryView;