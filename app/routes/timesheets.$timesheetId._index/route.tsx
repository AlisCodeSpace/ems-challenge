import { useState } from "react";
import { useLoaderData } from "react-router";
import Table from "~/components/Table";
import { getDB } from "~/db/getDB";
import type { Employee, SingleEmployee } from "~/types/Employee";
import type { Timesheet } from "~/types/Timesheet";

export async function loader({ params }: { params: { timesheetId: string } }) {
  const db = await getDB();
  const timesheet = await db.get(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id WHERE timesheets.id = ?",
    params.timesheetId
  );

  if (!timesheet) {
    throw new Response("Timesheet Not Found", { status: 404 });
  }

  const employees = await db.all("SELECT id, full_name FROM employees")

  return { timesheet, employees };
}

export default function TimesheetPage() {
  const { timesheet: initialTimesheet, employees } = useLoaderData() as { timesheet: Timesheet; employees: Employee[] };
  const [timesheet, setTimesheet] = useState(initialTimesheet);

  const handleSave = async (updatedTimesheet: Timesheet) => {
    const response = await fetch(`/timesheets/${timesheet.id}/edit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedTimesheet),
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || "An error occurred while updating.");
      return;
    } 

    setTimesheet(updatedTimesheet)
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Timesheet Details</h1>

      <Table data={timesheet} onSave={handleSave} employees={employees}/>

      <hr className="my-6" />

      <ul className="flex gap-4">
        <li>
          <a 
            href="/timesheets" 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Timesheets List
          </a>
        </li>
        <li> 
          <a
            href="/timesheets/new"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            + New Timesheet
         </a>
        </li>
        <li>
          <a
            href="/employees"
            className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            View Employees
          </a>
        </li>
      </ul>
    </div>
  );
}
