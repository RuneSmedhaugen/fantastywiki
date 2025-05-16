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

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!entry) return <p className="text-center mt-10">Entry not found.</p>;

  return (
  <div className="p-4 max-w-7xl mx-auto">
    <DynamicEntryView entry={entry} />
  </div>
  );
};

export default EntryDetail;
