import React, { useState } from "react";

import SortFilter from "./SortFilter";
import Filter from "./Filter";

import type { Employee } from "~/types/Employee";
import SearchBar from "../Searchbar";

interface EmployeesTableProps {
  employees: Employee[];
}

export default function EmployeesTable({ employees }: EmployeesTableProps) {
  // Search, Sorting, Filtering states
  const [searchQuery, setSearchQuery] = useState(""); 
  const [sortField, setSortField] = useState("full_name"); 
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterField, setFilterField] = useState("job_title"); 
  const [filterValue, setFilterValue] = useState(""); 

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5; 

  // Get unique job titles for filtering
  const jobTitles = Array.from(new Set(employees.map((e) => e.job_title)));

  // Function to filter, search, and sort employees dynamically
  const processedEmployees = [...employees]
    .filter((employee) => employee.full_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((employee) => (filterValue ? employee[filterField as keyof Employee] === filterValue : true))
    .sort((a, b) => {
      const valueA = a[sortField as keyof Employee]?.toString().toLowerCase() || "";
      const valueB = b[sortField as keyof Employee]?.toString().toLowerCase() || "";

      return sortOrder === "asc" ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

  // Pagination Logic
  const totalPages = Math.ceil(processedEmployees.length / employeesPerPage);
  const startIndex = (currentPage - 1) * employeesPerPage;
  const endIndex = startIndex + employeesPerPage;
  const paginatedEmployees = processedEmployees.slice(startIndex, endIndex);

  return (
    <div className="overflow-x-auto">
      {/* Search & Sort Controls */}
      <div className="mb-4 flex flex-col sm:flex-row items-center justify-between">
        {/* To search via employee name */}
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery}
          placeholder="Search by name..." 
        />

        {/* For sorting Acending or Descending */}
        <SortFilter 
          sortField={sortField} 
          setSortField={setSortField} 
          sortOrder={sortOrder} 
          setSortOrder={setSortOrder} 
        />

        {/* For filtering based on columns */}
        <Filter
          filterField={filterField}
          setFilterField={setFilterField}
          filterValue={filterValue}
          setFilterValue={setFilterValue}
          options={jobTitles}
        />
      </div>

      {/* Employees Table */}
      <table className="min-w-full border border-gray-300 shadow-lg">
        {/* Table Headers */}
        <thead className="bg-gray-100">
          <tr>
            <th className="t-header">ID</th>
            <th className="t-header">Full Name</th>
            <th className="t-header">Email</th>
            <th className="t-header">Job Title</th>
            <th className="t-header">Actions</th>
          </tr>
        </thead>

        {/* Table Values */}
        <tbody>
          {paginatedEmployees.length > 0 ? (
            paginatedEmployees.map((employee) => (
              <tr key={employee.id} className="hover:bg-gray-50">
                <td className="t-data">{employee.id}</td>
                <td className="t-data">{employee.full_name}</td>
                <td className="t-data">{employee.email}</td>
                <td className="t-data">{employee.job_title}</td>
                <td className="t-data">
                  <a
                    href={`/employees/${employee.id}`}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </a>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="t-data text-center text-gray-500">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ⏮ First
        </button>
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          ◀ Prev
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next ▶
        </button>
        <button
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Last ⏭ 
        </button>
      </div>
    </div>
  );
}
