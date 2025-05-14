// src/articleviews/NewsView.jsx
import React from 'react';

const NewsView = ({ entry }) => {
  const { title, summary, createdBy, createdAt } = entry;
  const date = new Date(entry.date || createdAt).toLocaleDateString();
  console.log("news data:", entry);
  return (
    <article className="space-y-6">
      <header>
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-gray-500">{date} • by {createdBy}</p>
      </header>
      <section className="prose max-w-none">
        <p>{summary}</p>
        <div>{entry.content}</div>
      </section>
    </article>
  );
};

export default NewsView;