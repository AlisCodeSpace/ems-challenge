import { useLoaderData } from "react-router";
import { useState } from "react";
import { getDB } from "~/db/getDB";
import Table from "~/components/Table";
import type { SingleEmployee } from "~/types/Employee";

export async function loader({ params }: { params: { employeeId: string } }) {
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", params.employeeId) as SingleEmployee;

  if (!employee) {
    throw new Response("Employee Not Found", { status: 404 });
  }

  return { employee };
}

export default function EmployeePage() {
  const { employee: initialEmployee } = useLoaderData() as { employee: SingleEmployee };
  const [employee, setEmployee] = useState(initialEmployee);

  {/* Handler for updating employee information */}
  const handleSave = async (updatedEmployee: SingleEmployee) => {
    {/* Sends a post request to an API I created to update the employee info */}
    const response = await fetch(`/employees/${employee.id}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEmployee),
    });

    {/* If the response is not ok, an error message is displayed */}
    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || "An error occurred while updating.");
      return { success: false };
    } 
    setEmployee(updatedEmployee); 
    return { success: true };
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>

      {/* Table to display single employee data */}
      <Table data={employee} onSave={handleSave} />

      <hr className="my-6" />

      {/* Navigation Buttons */}
      <ul className="flex gap-4">
        <li>
          <a
            href="/employees"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Back to Employees
          </a>
        </li>
        <li>
          <a
            href="/employees/new"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + New Employee
          </a>
        </li>
        <li>
          <a
            href="/timesheets/"
            className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            View Timesheets
          </a>
        </li>
      </ul>
    </div>
  );
}
