// src/components/InfoPanel.jsx
import React, { useState, useEffect } from 'react';
import { API_BASE } from '../config';

const InfoPanel = ({ entry }) => {
  const { type, details, title, summary, createdBy, createdAt } = entry;
  const formattedDate = createdAt ? new Date(createdAt).toLocaleDateString() : null;
  const [fieldsSchema, setFieldsSchema] = useState([]);

  useEffect(() => {
    // fetch category schema for dynamic fields
    fetch(`${API_BASE}/categories`)
      .then(res => res.json())
      .then(data => {
        const category = data.find(c => c.name === type);
        if (category && category.fields) {
          setFieldsSchema(category.fields);
        } else if (type === 'news') {
          setFieldsSchema([
            { name: 'date', label: 'Date', type: 'date' },
            { name: 'content', label: 'Content' }
          ]);
        } else {
          setFieldsSchema([]);
        }
      })
      .catch(console.error);
  }, [type]);

  return (
    <aside className="bg-gray-50 p-6 rounded-xl shadow-md space-y-4 w-full md:w-1/3">
      <h2 className="text-xl font-semibold">{title}</h2>
      {summary && <p className="text-gray-700">{summary}</p>}

      {fieldsSchema.map(field => (
        <div key={field.name} className="space-y-1">
          <span className="font-semibold">{field.label}:</span>{' '}
          {field.type === 'date' && details[field.name]
            ? new Date(details[field.name]).toLocaleDateString()
            : details[field.name]}
        </div>
      ))}

      <hr />
      <p className="text-sm text-gray-500">Created by {createdBy} on {formattedDate}</p>
    </aside>
  );
};

export default InfoPanel;
