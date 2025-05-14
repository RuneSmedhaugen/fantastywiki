const SpeciesView = ({ entry }) => {
  const { title, summary, createdAt } = entry;
  const formattedDate = createdAt && createdAt.$date ? new Date(createdAt.$date).toLocaleDateString() : "Unknown Date";
  console.log("species data:", title, summary, entry);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      {summary && <p className="text-gray-700 text-lg">{summary}</p>}
      <div className="text-sm text-gray-500">Created on {formattedDate}</div>
      <div className="space-y-2 mt-4">
        <p><span className="font-semibold">Classification:</span> {entry.classification}</p>
        <p><span className="font-semibold">Traits:</span> {entry.traits}</p>
      </div>
    </div>
  );
};

export default SpeciesView;