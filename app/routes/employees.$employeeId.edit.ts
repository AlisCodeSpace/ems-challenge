import { redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { isValidDateRange, isValidEmail, isValidPhoneNumber, meetsMinimumWage } from "~/utils/validations";

export const action: ActionFunction = async ({ request, params }) => {
  const employeeId = params.employeeId;
  const formData = await request.json();

  const { full_name, email, phone_number, job_title, department, salary, start_date, end_date, date_of_birth } = formData;

  if (!full_name || !email || !job_title || !department || salary === null || !start_date || !date_of_birth) {
    return new Response(JSON.stringify({ error: "All fields are required!" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: "Invalid email format." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isValidPhoneNumber(phone_number)) {
    return new Response(JSON.stringify({ error: "Invalid phone number format." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!meetsMinimumWage(salary)) {
    return new Response(JSON.stringify({ error: "Salary must be above minimum wage." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!isValidDateRange(start_date, end_date)) {
    return new Response(JSON.stringify({ error: "End date cannot be earlier than start date" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = await getDB();

  try {
    await db.run(
      `UPDATE employees SET full_name = ?, email = ?, phone_number = ?, job_title = ?, department = ?, salary = ?, start_date = ?, end_date = ?, date_of_birth = ?
      WHERE id = ?`,
      [full_name, email, phone_number, job_title, department, salary, start_date, end_date, date_of_birth, employeeId]
    );

    return redirect(`/employees/${employeeId}`);
  } catch(error) {
    console.error("Database Update Error:", error);
    return new Response(JSON.stringify({ error: "Database update failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
