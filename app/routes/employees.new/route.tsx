import { Form, useActionData, redirect, type ActionFunction } from "react-router";
import { getDB } from "~/db/getDB";

import fs from "fs";
import path from "path";
import InputField from "~/components/UI/InputField";
import { isCVUploaded, isValidAge, isValidDateRange, isValidEmail, isValidPhoneNumber, meetsMinimumWage, MIN_WAGE } from "~/utils/validations";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const full_name = formData.get("full_name") as string;
  const email = formData.get("email") as string;
  const job_title = formData.get("job_title") as string;
  const phone_number = formData.get("phone_number") as string;
  const department = formData.get("department") as string;
  const date_of_birth = formData.get("date_of_birth") as string;
  const salary = formData.get("salary") ? parseInt(formData.get("salary") as string) : null;
  const start_date = formData.get("start_date") as string;
  const end_date = formData.get("end_date") as string || null;
  const cvFile = formData.get("cv") as File;
  const idFile = formData.get("id_card") as File;

  if (!full_name || !email || !job_title || !department || salary === null || !start_date || !date_of_birth) {
    return { error: "All fields are required!" };
  }

  if (!isValidEmail(email)) {
    return { error: "Invalid email format. Example: user@example.com" };
  }

  if (!isValidPhoneNumber(phone_number)) {
    return { error: "Invalid phone number format. Use only numbers, +, -, or spaces."}
  }

  if (!isValidAge(date_of_birth)) {
    return { error: "Employee must be at least 18 years old." };
  }

  if (!isCVUploaded(cvFile)) {
    return { error: "A CV (PDF) is required." };
  }

  if (!meetsMinimumWage(salary)) {
    return { error: `Salary must be at least $${MIN_WAGE}.` };
  }

  if (!isValidDateRange(start_date, end_date)) {
    return { error: "End date cannot be earlier than start date." };
  }

  const cvUploadDir = path.join(process.cwd(), "app/files/cvs");
  const idUploadDir = path.join(process.cwd(), "app/files/ids");

  // Ensure directories exist
  if (!fs.existsSync(cvUploadDir)) fs.mkdirSync(cvUploadDir, { recursive: true });
  if (!fs.existsSync(idUploadDir)) fs.mkdirSync(idUploadDir, { recursive: true });

  // Save CV file (if provided)
  if (cvFile) {
    const cvFilePath = path.join(cvUploadDir, `${cvFile.name}`);
    fs.writeFileSync(cvFilePath, Buffer.from(await cvFile.arrayBuffer()));
  }

  // Save ID Card file (if provided)
  if (idFile) {
    const idFilePath = path.join(idUploadDir, `${idFile.name}`);
    fs.writeFileSync(idFilePath, Buffer.from(await idFile.arrayBuffer()));
  }

  const db = await getDB();
  await db.run(
    `INSERT INTO employees (full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [full_name, email, phone_number, date_of_birth, job_title, department, salary, start_date, end_date]
  );

  return redirect("/employees");
};

export default function NewEmployeePage() {
  const actionData = useActionData() as { error?: string };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-2xl text-center font-bold mb-4">Create New Employee</h1>

      <Form method="post" encType="multipart/form-data" className="bg-gray-100 p-6 rounded shadow-md">
        <InputField label="Full Name" name="full_name" required />
        <InputField label="Email" name="email" type="email" required />
        <InputField label="Phone Number" name="phone_number" type="tel" />
        <InputField label="Date of Birth" name="date_of_birth" type="date" required />
        <InputField label="Job Title" name="job_title" />
        <InputField label="Department" name="department" />
        <InputField label="Salary" name="salary" type="number" />
        <InputField label="Start Date" name="start_date" type="date" required />
        <InputField label="End Date" name="end_date" type="date" />

        {/* File Uploads */}
        <InputField label="Upload CV (PDF only)" name="cv" type="file" accept=".pdf" />
        <InputField label="Upload ID Card (Image only)" name="id_card" type="file" accept="image/*" />

        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full cursor-pointer">
          Create Employee
        </button>

        {actionData?.error && (
          <div className="bg-red-200 text-red-800 p-2 my-4 rounded">
            {actionData.error}
          </div>
        )}
      </Form>

      <ul className="flex gap-4 mt-6">
        <li>
          <a href="/employees" className="inline-block bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">
            Back to Employees
          </a>
        </li>
        <li>
          <a href="/timesheets" className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            View Timesheets
          </a>
        </li>
      </ul>
    </div>
  );
}
