export const MIN_WAGE = 15000; // Minimum salary allowed

/**
 * Validate if the given email is in a valid format.
 * @param email - The email address to validate.
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate if the given date of birth makes the employee at least 18 years old.
 * @param dateOfBirth - Employee's date of birth as a string (YYYY-MM-DD).
 */
export function isValidAge(dateOfBirth: string): boolean {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  const age = today.getFullYear() - dob.getFullYear();

  return age > 18 || (age === 18 && today >= new Date(dob.setFullYear(today.getFullYear())));
}

/**
 * Validate if a CV file has been uploaded and is a PDF.
 * @param file - The uploaded file.
 */
export function isCVUploaded(file: File | null): boolean {
  return file !== null && file.type === "application/pdf";
}

/**
 * Validate if the salary meets the minimum wage.
 * @param salary - The employee's salary.
 */
export function meetsMinimumWage(salary: number): boolean {
  return salary >= MIN_WAGE;
}

/**
 * Validate phone number format.
 * - Allows numbers, spaces, dashes, parentheses, and `+`.
 * - Must be between 7 to 15 digits long.
 * @param phoneNumber - The phone number to validate.
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  const phoneRegex = /^[+\d]?(?:[\d-.\s()]*)$/;
  return phoneRegex.test(phoneNumber) && phoneNumber.replace(/\D/g, "").length >= 7 && phoneNumber.replace(/\D/g, "").length <= 15;
}

/**
 * Validate that end date is not earlier than start date.
 * @param startDate - The start date (YYYY-MM-DD).
 * @param endDate - The end date (YYYY-MM-DD) or null.
 */
export function isValidDateRange(startDate: string, endDate: string | null): boolean {
  if (!endDate) return true; // If `end_date` is null, it's valid (still working)
  
  const start = new Date(startDate);
  const end = new Date(endDate);

  return end >= start; // Ensure `end_date` is after or equal to `start_date`
}

export function isValidDateTimeFormat(dateTime: string): boolean {
  // Regex for "YYYY-DD-MM HH:MM" format
  const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/;

  if (!dateTimeRegex.test(dateTime)) {
    return false; // Format does not match
  }

  // Convert to a valid Date object for further validation
  const [year, day, month, time] = dateTime.split(/[- ]/);
  const isoDate = `${year}-${month}-${day}T${time}:00`; // Convert to valid ISO format

  const date = new Date(isoDate);
  return !isNaN(date.getTime()); // ✅ Ensure it's a valid date
}



