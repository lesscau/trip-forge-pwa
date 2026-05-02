export function formatTripDateRange(startsOn?: string, endsOn?: string): string {
  if (!startsOn && !endsOn) {
    return "Dates not set";
  }

  if (startsOn && endsOn) {
    return `${startsOn} - ${endsOn}`;
  }

  return startsOn ?? endsOn ?? "Dates not set";
}
