import type { Timesheet } from "~/types/Timesheet";
import { formatDate } from "~/utils/helpers";

interface TimesheetsTableProps {
    timesheets: Timesheet[];
}

{/* Timesheet table displaying the timesheet data */}
export default function TimesheetsTable({ timesheets }: TimesheetsTableProps) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg">
          {/* Timesheet headers (field names) */}
          <thead className="bg-gray-100">
            <tr>
              <th className="t-header">Timesheet ID</th>
              <th className="t-header">Employee</th>
              <th className="t-header">Work Summary</th>
              <th className="t-header">Start Time</th>
              <th className="t-header">End Time</th>
              <th className="t-header">Actions</th>
            </tr>
          </thead>
          {/* Timesheet values */}
          <tbody>
            {timesheets.length > 0 ? (
              timesheets.map((timesheet) => (
                <tr key={timesheet.id} className="hover:bg-gray-50">
                  <td className="t-data">{timesheet.id}</td>
                  <td className="t-data">
                    {timesheet.full_name} (ID: {timesheet.employee_id})
                  </td>
                  <td className="t-data">
                    {timesheet.work_summary}
                  </td>
                  <td className="t-data">{formatDate(timesheet.start_time)}</td>
                  <td className="t-data">{formatDate(timesheet.end_time)}</td>
                  <td className="t-data">
                    <a
                      href={`/timesheets/${timesheet.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="t-data text-center text-gray-500">
                  No timesheets found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }