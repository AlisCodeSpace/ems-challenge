import { useState } from "react";
import type { Employee, SingleEmployee } from "~/types/Employee";
import type { Timesheet } from "~/types/Timesheet";

type TableData = SingleEmployee | Timesheet;

interface TableProps<T extends TableData> {
  data: T;
  onSave: (updatedData: T) => void;
  employees?: Employee[]; // List of employees for dropdown in timesheet editing
}

// This is a reusable TABLE component which will be used in Employee and Timesheet pages.
export default function Table<T extends TableData>({ data, onSave, employees }: TableProps<T>) {
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState<T>(data); // State to update Employee or Timesheet data for real-time updates.

  // Extracts the field names of the object dynamically
  const dataKeys = Object.keys(data) as (keyof T)[];

  // Track if changes are made to disable/enable SAVE button (reduce unnecessary requests)
  const isModified = JSON.stringify(updatedData) !== JSON.stringify(data);

  const handleInputChange = (key: keyof T, value: string | number) => {
    setUpdatedData((prev) => ({ ...prev, [key]: value }));
  };

  // Function to check if a key is a date field
  const isDateField = (key: keyof T) => {
    const value = updatedData[key];
    return typeof value === "string" && key.toString().toLowerCase().includes("date");
  };

  return (
    <div className="flex flex-col items-center">
      <table className="min-w-full border border-gray-300 shadow-lg">
        {/* Maps over the field names of our data (Employee or Timesheet) */}
        <thead className="bg-gray-100">
          <tr>
            {dataKeys.map((key) => (
              <th key={String(key)} className="t-header">
                {String(key).replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        
        {/* Maps over the values of the above fields */}
        <tbody>
          <tr className="hover:bg-gray-50">
            {dataKeys.map((key) => (
              <td key={String(key)} className="t-data">
                {/* Read-Only Mode */}
                {!editMode || key === "id" || key === "employee_id" ? (
                  key === "end_date" && updatedData[key] === null
                    ? "Still Working"
                    : String(updatedData[key] ?? "N/A")
                ) : key === "full_name" && employees ? (
                  // If editing full_name, show a dropdown of employees
                  <select
                    className="border px-2 py-1 w-full"
                    value={updatedData[key] as string}
                    onChange={(e) => {
                      const selectedEmployee = employees.find(emp => emp.full_name === e.target.value);
                      if (selectedEmployee) {
                        setUpdatedData((prev) => ({
                          ...prev,
                          full_name: selectedEmployee.full_name,
                          employee_id: selectedEmployee.id
                        }));
                      }
                    }}
                  >
                    {employees.map((employee) => (
                      <option key={employee.id} value={employee.full_name}>
                        {employee.full_name}
                      </option>
                    ))}
                  </select>
                ) : isDateField(key) ? (
                  // Date Field
                  <input
                    type="date"
                    className="border px-2 py-1 w-full"
                    value={typeof updatedData[key] === "string" ? updatedData[key].split("T")[0] : ""}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
                ) : typeof updatedData[key] === "number" ? (
                  // Number Field
                  <input
                    type="number"
                    className="border px-2 py-1 w-full"
                    value={updatedData[key] || 0}
                    onChange={(e) => handleInputChange(key, parseFloat(e.target.value))}
                  />
                ) : (
                  // Default Text Field
                  <input
                    type="text"
                    className="border px-2 py-1 w-full"
                    value={String(updatedData[key] || "")}
                    onChange={(e) => handleInputChange(key, e.target.value)}
                  />
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
            Edit
          </button>
        </div>
      ) : (
        <div className="flex w-full gap-4 mt-4">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 cursor-pointer"
            onClick={() => {
              onSave(updatedData);
              setEditMode(false);
            }}
            disabled={!isModified} // Disable Save if no changes
          >
            Update
          </button>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer"
            onClick={() => {
              setUpdatedData(data); // Revert changes on cancel
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
