interface FilterProps {
  filterField: string;
  setFilterField: (field: string) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
  options: string[];
}

export default function Filter({
  filterField,
  setFilterField,
  filterValue,
  setFilterValue,
  options,
}: FilterProps) {
  return (
    <div className="flex items-center space-x-3">
      <label className="text-gray-700">Filter by:</label>
      <select
        value={filterField}
        onChange={(e) => setFilterField(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="job_title">Job Title</option>
        {/* Add more filter options here if needed */}
      </select>

      <select
        value={filterValue}
        onChange={(e) => setFilterValue(e.target.value)}
        className="border px-3 py-2 rounded"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
