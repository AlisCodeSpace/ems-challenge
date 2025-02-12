import React from "react";
import type { Employee } from "~/types/Employee";

interface EmployeeFilterProps {
  employees: Employee[];
  selectedEmployee: string;
  setSelectedEmployee: (employeeId: string) => void;
}

{/* Component to filter timesheets by employee name */}
export default function EmployeeFilter({ employees, selectedEmployee, setSelectedEmployee }: EmployeeFilterProps) {
  return (
    <div className="mb-4 flex">
      <label className="block text-gray-700">Filter by:</label>
      <select
        value={selectedEmployee}
        onChange={(e) => setSelectedEmployee(e.target.value)}
        className="w-full p-2 border rounded"
      >
        <option value="">All Employees</option>
        {employees.map((employee) => (
          <option key={employee.id} value={employee.id}>
            {employee.full_name}
          </option>
        ))}
      </select>
    </div>
  );
}
