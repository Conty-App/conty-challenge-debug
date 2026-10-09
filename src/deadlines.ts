export function approvedCivilDay(approvedAt: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(approvedAt));

  const get = (type: string): string =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function isPastDeadline(
  approvedAt: string,
  deadlineDate: string,
): boolean {
  return approvedCivilDay(approvedAt) > deadlineDate;
}