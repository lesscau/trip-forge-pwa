export function formatDate(value: string, locale = "ru-RU"): string {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(value));
}

export function formatTripDateRange(
  startsOn?: string,
  endsOn?: string,
  locale = "ru-RU"
): string {
  if (!startsOn && !endsOn) {
    return "Dates not set";
  }

  if (startsOn && endsOn) {
    return `${formatDate(startsOn, locale)} - ${formatDate(endsOn, locale)}`;
  }

  return formatDate(startsOn ?? endsOn ?? "", locale);
}
