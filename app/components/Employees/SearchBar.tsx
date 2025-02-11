import React from "react";

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function SearchBar({ searchQuery, setSearchQuery }: SearchBarProps) {
  return (
    <input
      type="text"
      placeholder="Search by name..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="border px-4 py-2 rounded w-full sm:w-1/3"
    />
  );
}
