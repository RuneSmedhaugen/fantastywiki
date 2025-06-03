import React from "react";
//Not a good fix for the imageUrl issue, but it works for now. will fix later
const SidePanel = ({ imageUrl, imageAlt, title, fields, children }) => {
  const normalizedUrl = imageUrl ? imageUrl.replace(/\\/g, '/') : null;
  const backend = "http://localhost:5000";
  const validUrl = backend + imageUrl;
  console.log("SidePanel imageUrl:", normalizedUrl, "validUrl:", validUrl);

  return (
    <aside className="w-full lg:w-1/3 bg-gray-950/50 border border-indigo-600 p-6 rounded-lg shadow-md backdrop-blur-md h-fit">
      {normalizedUrl && (
        <div className="mb-6">
          <img
            src={validUrl}
            alt={imageAlt || title || "Image"}
            className="w-full h-auto rounded border border-indigo-500 shadow-md"
          />
          <p className="text-xs text-center text-gray-400 mt-1">Image: {imageAlt || title}</p>
        </div>
      )}
      {title && <h2 className="text-xl font-bold text-indigo-300 mb-4">{title}</h2>}
      {fields && (
        <ul className="space-y-3 text-sm text-gray-300">
          {Object.entries(fields).map(([key, value]) => (
            <li key={key} className="flex justify-between border-b border-gray-700 pb-1">
              <span className="font-medium text-indigo-400">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </span>
              <span className="text-gray-300 text-right">{String(value)}</span>
            </li>
          ))}
        </ul>
      )}
      {children}
    </aside>
  );
};

export default SidePanel;