const EventView = ({ entry }) => {
  const { title, summary, createdAt, createdBy } = entry;
  const formattedDate = createdAt && createdAt.$date ? new Date(createdAt.$date).toLocaleDateString() : "Unknown Date";
  console.log("event data:", entry);

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{title}</h1>
      {summary && <p className="text-gray-700 text-lg">{summary}</p>}
      <div className="text-sm text-gray-500">
        Created by {createdBy} on {formattedDate}
      </div>
      <div className="space-y-2 mt-4">
        <p><span className="font-semibold">Date:</span> {entry.date}</p>
        <p><span className="font-semibold">Description:</span> {entry.description}</p>
      </div>
    </div>
  );
};

export default EventView;