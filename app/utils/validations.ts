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
