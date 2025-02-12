interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder: string;
}

export default function SearchBar({ searchQuery, setSearchQuery, placeholder }: SearchBarProps) {
  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded"
      />
    </div>
  );
}
