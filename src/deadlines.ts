const CIVIL_DAY = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Sao_Paulo",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// Dia civil (YYYY-MM-DD) de um instante, em America/Sao_Paulo.
export function approvedCivilDay(approvedAt: string): string {
  return CIVIL_DAY.format(new Date(approvedAt));
}

// O último instante do dia do prazo ainda vale; só o dia seguinte expira.
export function isPastDeadline(approvedAt: string, deadlineDate: string): boolean {
  return approvedCivilDay(approvedAt) > deadlineDate;
}
