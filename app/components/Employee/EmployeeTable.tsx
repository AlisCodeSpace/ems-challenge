import React, { useState } from "react";
import type { SingleEmployee } from "~/types/Employee";

interface EmployeeTableProps {
  employee: SingleEmployee;
  onSave: (updatedEmployee: SingleEmployee) => void;
}

export default function EmployeeTable({ employee, onSave }: EmployeeTableProps) {
  const [editMode, setEditMode] = useState(false);
  const [updatedEmployee, setUpdatedEmployee] = useState<SingleEmployee>(employee);

  // Extracts the field names of the employee object
  const employeeKeys = Object.keys(employee) as (keyof SingleEmployee)[];

  // Track if changes are made
  const isModified = JSON.stringify(updatedEmployee) !== JSON.stringify(employee);

  const handleInputChange = (key: keyof SingleEmployee, value: string) => {
    setUpdatedEmployee((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col items-center">
      <table className="min-w-full border border-gray-300 shadow-lg">
        <thead className="bg-gray-100">
          <tr>
            {employeeKeys.map((key) => (
              <th key={key} className="t-header">
                {key.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <tr className="hover:bg-gray-50">
            {employeeKeys.map((key) => (
              <td key={key} className="t-data">
                {/* Read-Only Mode */}
                {!editMode || key === "id" ? (
                  key === "end_date" ? employee[key] ?? "Still Working" : employee[key] ?? "N/A"
                ) : (
                  // Editable Mode (Convert to Input Fields)
                  key.includes("date") ? (
                    <input
                      type="date"
                      className="border px-2 py-1 w-full"
                      value={typeof updatedEmployee[key] === "string" ? updatedEmployee[key].split("T")[0] : ""}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  ) : (
                    <input
                      type="text"
                      className="border px-2 py-1 w-full"
                      value={updatedEmployee[key] || ""}
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  )
                )}
              </td>
            ))}
          </tr>
        </tbody>
      </table>

      {/* Action Buttons */}
      {!editMode ? (
        <div className="w-full">
          <button
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
            onClick={() => setEditMode(true)}
          >
            Edit Employee
          </button>
        </div>
      ) : (
        <div className="flex w-full gap-4 mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
            onClick={() => {
              onSave(updatedEmployee);
              setEditMode(false);
            }}
            disabled={!isModified} // Disable Save if no changes
          >
            Update
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
            onClick={() => {
              setUpdatedEmployee(employee); // Revert changes
              setEditMode(false);
            }}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
