import { redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { isValidDateRange, isValidDateTimeFormat } from "~/utils/validations";

export const action: ActionFunction = async ({ request, params }) => {
  const timesheetId = params.timesheetId; 
  const formData = await request.json();

  const { start_time, end_time, employee_id, work_summary } = formData;

  if (!start_time || !end_time || !employee_id) {
    console.error("Validation Failed: Missing Fields");
    return new Response(JSON.stringify({ error: "All fields are required!" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isValidDateTimeFormat(start_time) || !isValidDateTimeFormat(end_time)) {
    console.error("Validation Failed: Invalid Date-Time Format");
    return new Response(JSON.stringify({ error: "Invalid date format. Use YYYY-DD-MM HH:MM" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isValidDateRange(start_time, end_time)) {
    console.error("Validation Failed: Invalid Date Range");
    return new Response(JSON.stringify({ error: "End time cannot be earlier than start time" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = await getDB();

  try {
    await db.run(
      `UPDATE timesheets SET start_time = ?, end_time = ?, employee_id = ?, work_summary = ? WHERE id = ?`,
      [start_time, end_time, employee_id, work_summary, timesheetId]
    );

    return redirect(`/timesheets/${timesheetId}`);
  } catch (error) {
    console.error("Database Update Error:", error);
    return new Response(JSON.stringify({ error: "Database update failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
