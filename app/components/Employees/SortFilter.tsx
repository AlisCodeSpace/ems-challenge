interface SortFilterProps {
  sortField: string;
  setSortField: (field: string) => void;
  sortOrder: "asc" | "desc";
  setSortOrder: (order: "asc" | "desc") => void;
}

export default function SortFilter({ sortField, setSortField, sortOrder, setSortOrder }: SortFilterProps) {
  return (
    <div className="flex items-center">
      <label className="mr-2 text-gray-700">Sort by:</label>
      <select
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="full_name">Full Name</option>
        <option value="email">Email</option>
        <option value="job_title">Job Title</option>
      </select>

      {/* Sort Order Toggle Button */}
      <button
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        className="ml-2 px-3 py-2 rounded bg-gray-300 hover:bg-gray-400"
      >
        {sortOrder === "asc" ? "🔼 Asc" : "🔽 Desc"}
      </button>
    </div>
  );
}
