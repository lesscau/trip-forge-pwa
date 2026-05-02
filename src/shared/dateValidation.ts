export function isValidDateRange(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) {
    return true;
  }

  return endDate >= startDate;
}
