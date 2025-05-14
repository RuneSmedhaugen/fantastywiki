// src/pages/EntryDetail.jsx
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_BASE } from '../config';

// import specialized article view components
import NewsView from '../articleviews/NewsView';
import EntityView from '../articleviews/EntityView';
import HumanView from '../articleviews/HumanView';
import GroupView from '../articleviews/GroupView';
import OrganizationView from '../articleviews/OrganizationView';
import PlanetView from '../articleviews/PlanetView';
import LocationView from '../articleviews/LocationView';
import ArtifactView from '../articleviews/ArtifactView';
import EventView from '../articleviews/EventView';
import SpeciesView from '../articleviews/SpeciesView';
import DimensionView from '../articleviews/DimensionView';

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

  // Choose the correct view component based on type
  const renderView = () => {
    const props = { entry };
    switch (type) {
      case 'news': return <NewsView {...props} />;
      case 'entity': return <EntityView {...props} />;
      case 'human': return <HumanView {...props} />;
      case 'group': return <GroupView {...props} />;
      case 'organization': return <OrganizationView {...props} />;
      case 'planet': return <PlanetView {...props} />;
      case 'location': return <LocationView {...props} />;
      case 'artifact': return <ArtifactView {...props} />;
      case 'event': return <EventView {...props} />;
      case 'species': return <SpeciesView {...props} />;
      case 'dimension': return <DimensionView {...props} />;
      default: return <p>Unsupported entry type: {type}</p>;
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {renderView()}
    </div>
  );
};

export default EntryDetail;
