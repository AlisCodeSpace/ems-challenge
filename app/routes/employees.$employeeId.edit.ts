import { redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";
import { isValidEmail, isValidPhoneNumber, meetsMinimumWage } from "~/utils/validations";

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

  const db = await getDB();
  await db.run(
    `UPDATE employees SET full_name = ?, email = ?, phone_number = ?, job_title = ?, department = ?, salary = ?, start_date = ?, end_date = ?, date_of_birth = ?
    WHERE id = ?`,
    [full_name, email, phone_number, job_title, department, salary, start_date, end_date, date_of_birth, employeeId]
  );

  return redirect(`/employees/${employeeId}`);
};
