import { useLoaderData } from "react-router";
import { getDB } from "~/db/getDB";
import { useState } from "react";
import EmployeesTable from "~/components/Employees/EmployeesTable";

export async function loader() {
  const db = await getDB();
  const employees = await db.all("SELECT * FROM employees;");
  return { employees };
}

export default function EmployeesPage() {
  const { employees } = useLoaderData();

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Employees List</h1>

      {/* Employees Table with Search & Sorting */}
      <EmployeesTable employees={employees} />

      {/* Navigation Buttons */}
      <div className="mt-6">
        <a
          href="/employees/new"
          className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + New Employee
        </a>
        <a
          href="/timesheets/"
          className="inline-block bg-gray-500 text-white px-4 py-2 rounded ml-4 hover:bg-gray-600"
        >
          View Timesheets
        </a>
      </div>
    </div>
  );
}
