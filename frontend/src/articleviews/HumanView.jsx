import React from 'react';

const HumanView = ({ entry }) => {
  const { title, summary, createdBy, createdAt } = entry;
  const date = createdAt && createdAt.$date ? new Date(createdAt.$date).toLocaleDateString() : "Unknown Date";
  console.log("Human data:", entry);

  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-gray-500">Created on {date} by {createdBy}</p>
      </header>
      <section className="space-y-4">
        <p className="italic">{summary}</p>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Born:</strong> {entry.born}</li>
          {entry.died && <li><strong>Died:</strong> {entry.died}</li>}
          <li><strong>Role:</strong> {entry.role}</li>
          <li><strong>Personality:</strong> {entry.personality}</li>
          <li><strong>Fun Fact:</strong> {entry.fun_fact}</li>
        </ul>
      </section>
    </article>
  );
};

export default HumanView;