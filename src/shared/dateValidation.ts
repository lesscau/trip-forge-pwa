export function isValidDateRange(startDate: string, endDate: string): boolean {
  if (!startDate || !endDate) {
    return true;
  }

  return endDate >= startDate;
}

export function isDateWithinRange(
  date: string,
  startDate: string,
  endDate: string
): boolean {
  if (!date || !startDate || !endDate) {
    return true;
  }

  return startDate <= date && date <= endDate;
}
