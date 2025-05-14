import React from 'react';

const PlanetView = ({ entry }) => {
  const { title, summary, createdAt } = entry;
  const formattedDate = createdAt && createdAt.$date ? new Date(createdAt.$date).toLocaleDateString() : "Unknown Date";
  console.log("planet data:", entry);

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-gray-500">Created on {formattedDate}</p>
      </header>
      <section className="space-y-4">
        <p className="italic">{summary}</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Location:</strong> {entry.location}</li>
          <li><strong>Environment:</strong> {entry.environment}</li>
        </ul>
      </section>
    </article>
  );
};

export default PlanetView;