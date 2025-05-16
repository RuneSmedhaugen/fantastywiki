import React from 'react';

const EntityView = ({ entry }) => {
  const { title, summary, createdBy, createdAt } = entry;
  const date = createdAt && createdAt.$date ? new Date(createdAt.$date).toLocaleDateString() : "Unknown Date";
  console.log("entity data:", entry);

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-gray-500">Created on {date} by {createdBy}</p>
      </header>
      <section className="space-y-4">
        <p className="italic">{summary}</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Category:</strong> {entry.category}</li>
          <li><strong>Risk Level:</strong> {entry.risk_level}</li>
          <li><strong>Goal:</strong> {entry.goal}</li>
          <li><strong>Origin:</strong> {entry.origin}</li>
          <li><strong>Fun Fact:</strong> {entry.fun_fact}</li>
          <li><strong>Detained:</strong> {entry.detained}</li>
        </ul>
      </section>
    </article>
  );
};

export default EntityView;