// src/pages/EntryDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE } from '../config';
import DynamicEntryView from './DynamicEntryView';

const EntryDetail = () => {
  const { type, id } = useParams();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE}/entry/${type}/${id}`)
      .then(res => res.json())
      .then(data => setEntry(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [type, id]);

  return (
    <div className="p-6 max-w-5xl mx-auto text-white">
      {loading ? (
        <p className="text-center text-indigo-300">Loading entry...</p>
      ) : entry ? (
        <DynamicEntryView entry={entry} />
      ) : (
        <p className="text-center text-red-400">Entry not found.</p>
      )}
    </div>
  );
};

export default EntryDetail;
