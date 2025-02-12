import { useLoaderData } from "react-router";
import { useState } from "react";
import { getDB } from "~/db/getDB";
import CalendarApp from "~/components/Timesheets/CalendarApp";
import TimesheetsTable from "~/components/Timesheets/TimesheetsTable";

import EmployeeFilter from "~/components/Timesheets/EmployeeFilter";

import type { Timesheet } from "~/types/Timesheet";
import type { Employee } from "~/types/Employee";
import type { CalendarEvent } from "~/types/Calendar";
import { formatToScheduleX } from "~/utils/helpers";
import SearchBar from "~/components/Searchbar";

export async function loader() {
  const db = await getDB();
  
  // Fetch timesheets along with employee details
  const timesheetsAndEmployees: Timesheet[] = await db.all(
    "SELECT timesheets.*, employees.full_name, employees.id AS employee_id FROM timesheets JOIN employees ON timesheets.employee_id = employees.id"
  );

  // Fetch all employees for the filter dropdown
  const employees: Employee[] = await db.all("SELECT id, full_name FROM employees");

  return { timesheetsAndEmployees, employees };
}

export default function TimesheetsPage() {
  const { timesheetsAndEmployees, employees } = useLoaderData() as { 
    timesheetsAndEmployees: Timesheet[];
    employees: Employee[];
  };

  const [view, setView] = useState<"table" | "calendar">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState("");

  // Filter by search query and selected employee
  const filteredTimesheets = timesheetsAndEmployees.filter((timesheet) => {
    const matchesSearch = timesheet.work_summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEmployee = selectedEmployee === "" || timesheet.employee_id.toString() === selectedEmployee;
    return matchesSearch && matchesEmployee;
  });

  // Convert timesheets data to Calendar format
  const calendarEvents: CalendarEvent[] = filteredTimesheets.map((timesheet) => ({
    id: timesheet.id.toString(),
    title: `Timesheet: ${timesheet.full_name}`,
    start: formatToScheduleX(timesheet.start_time),
    end: formatToScheduleX(timesheet.end_time),
  }));

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Timesheets</h1>

      {/* Search and Filter Components */}
      

      {/* Toggle View Buttons */}
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded ${view === "table" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => setView("table")}
          >
            Table View
          </button>
          <button
            className={`px-4 py-2 rounded ${view === "calendar" ? "bg-blue-500 text-white" : "bg-gray-300"}`}
            onClick={() => setView("calendar")}
          >
            Calendar View
          </button>
        </div>

        <div className="flex gap-8 items-center">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} placeholder="Search by work summary..."/>

          <EmployeeFilter 
            employees={employees} 
            selectedEmployee={selectedEmployee} 
            setSelectedEmployee={setSelectedEmployee} 
          />
        </div>
      </div>

      {/* Conditional Rendering Based on View */}
      {view === "table" ? (
        <TimesheetsTable timesheets={filteredTimesheets} />
      ) : (
        <CalendarApp events={calendarEvents} />
      )}

      {/* Navigation Links */}
      <ul className="flex gap-4 mt-6">
        <li>
          <a href="/timesheets/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            + New Timesheet
          </a>
        </li>
        <li>
          <a href="/employees" className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            View Employees
          </a>
        </li>
      </ul>
    </div>
  );
}
