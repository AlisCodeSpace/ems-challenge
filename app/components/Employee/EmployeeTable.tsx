import React from "react";
import type { SingleEmployee } from "~/types/Employee";

interface EmployeeTableProps {
  employee: SingleEmployee;
}

export default function EmployeeTable({ employee }: EmployeeTableProps) {
  // Extracts the field names of the employee object
  const employeeKeys = Object.keys(employee) as (keyof SingleEmployee)[];
  
  console.log(employee.date_of_birth)
  return (
    <table className="min-w-full border border-gray-300 shadow-lg">
      {/* Maps of over the field names of the employee data and displays them in a table header */}
      <thead className="bg-gray-100">
        <tr>
        {employeeKeys.map((key) => (
            <th key={key} className="t-header">
            {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
            </th>
        ))}
        </tr>
      </thead>

      {/* Maps over the values corresponding to each field and displays them */}
      <tbody>  
        <tr className="hover:bg-gray-50">
          {employeeKeys.map((key) => (
            <td key={key} className="t-data">
              {key === 'end_date' ? employee[key] ?? "Still Working" : employee[key] ?? "N/A"}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
