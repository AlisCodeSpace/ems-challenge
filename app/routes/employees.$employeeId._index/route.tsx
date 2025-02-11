import { useLoaderData } from "react-router";
import EmployeeTable from "~/components/Employee/EmployeeTable";
import { getDB } from "~/db/getDB";

export async function loader({ params }: { params: { employeeId: string } }) {
  const db = await getDB();
  const employee = await db.get("SELECT * FROM employees WHERE id = ?", params.employeeId);

  if (!employee) {
    throw new Response("Employee Not Found", { status: 404 });
  }

  return { employee };
}

export default function EmployeePage() {
  const { employee } = useLoaderData() as { employee: any };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Details</h1>

      {/* Employee Details Table */}
      <EmployeeTable employee={employee}/>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <a
          href={`/employees/${employee.id}/edit`}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Edit Employee
        </a>
        <a
          href="/employees"
          className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Back to Employees
        </a>
      </div>

      <hr className="my-6" />

      {/* Navigation Links */}
      <ul className="flex gap-4">
        <li>
          <a 
            href="/employees" 
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Employees List
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
