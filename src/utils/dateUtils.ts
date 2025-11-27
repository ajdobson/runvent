// Set this to a specific date for testing, or null to use real date
// Format: new Date(year, month - 1, day) where month is 1-12
// Example: new Date(2024, 11, 15) for December 15, 2024
const TEST_DATE: Date | null = null; // Set to null to use real date

export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getCurrentDate(): Date {
  return TEST_DATE || new Date();
}

export function getDecemberDays(year: number): Date[] {
  const days: Date[] = [];
  for (let day = 1; day <= 31; day++) {
    days.push(new Date(year, 11, day)); // 11 = December (0-indexed)
  }
  return days;
}

export function isDateInPast(date: Date): boolean {
  const today = getCurrentDate();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
}

export function isDateToday(date: Date): boolean {
  const today = getCurrentDate();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

export function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month];
}

