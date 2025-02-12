import { useLoaderData, Form, useActionData, redirect } from "react-router";
import { getDB } from "~/db/getDB";
import InputField from "~/components/UI/InputField"; // ✅ Reusing InputField component
import { isValidDateRange } from "~/utils/validations";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT id, full_name FROM employees");
  return { employees };
}

import type { ActionFunction } from "react-router";
import { formatDate } from "~/utils/helpers";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  const employee_id = formData.get("employee_id") as number | null;
  const start_time = formData.get("start_time") as string | null;
  const end_time = formData.get("end_time") as string | null;
  const work_summary = formData.get("work_summary")

  const formattedStartTime = start_time ? formatDate(start_time) : ""
  const formattedEndTime = end_time ? formatDate(end_time) : ""

  if (!start_time || !end_time || !employee_id) {
    return { error: "All fields are required!" };
  }

  if (!isValidDateRange(start_time.toString(), end_time.toString())) {
    return { error: "End time cannot be earlier than start time" };
  }

  const db = await getDB();
  await db.run(
    "INSERT INTO timesheets (employee_id, start_time, end_time, work_summary) VALUES (?, ?, ?, ?)",
    [employee_id, formattedStartTime, formattedEndTime, work_summary]
  );

  return redirect("/timesheets");
};

export default function NewTimesheetPage() {
  const { employees } = useLoaderData() as { employees: { id: number; full_name: string }[] };
  const actionData = useActionData() as { error?: string };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-2xl text-center font-bold mb-4">Create New Timesheet</h1>
      
      {/* Timesheet Form */}
      <Form method="post" className="bg-gray-100 p-6 rounded shadow-md">
        {/* Employee Selection */}
        <div className="mb-4">
          <label htmlFor="employee_id" className="block text-gray-700">
            Select Employee
          </label>
          <select name="employee_id" id="employee_id" className="w-full p-2 border rounded" required>
            <option value="">-- Select an Employee --</option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Start Time */}
        <InputField label="Start Time" name="start_time" type="datetime-local" required />

        {/* End Time */}
        <InputField label="End Time" name="end_time" type="datetime-local" required />

        {/* Work Summary */}
        <InputField label="Work Summary" name="work_summary" type="text" />

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full cursor-pointer"
        >
          Create Timesheet
        </button>

        {actionData?.error && (
          <div className="bg-red-200 text-red-800 p-2 my-4 rounded">
            {actionData.error}
          </div>
        )}
      </Form>
      
      {/* Navigation Buttons */}
      <ul className="flex gap-4 mt-6">
        <li>
          <a href="/timesheets" className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back to Timesheets
          </a>
        </li>
        <li>
          <a href="/employees" className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View Employees
          </a>
        </li>
      </ul>
    </div>
  );
}
