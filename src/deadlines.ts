export function approvedCivilDay(approvedAt: string): string {
  return approvedAt.slice(0, 10);
}

export function isPastDeadline(approvedAt: string, deadlineDate: string): boolean {
  return approvedCivilDay(approvedAt) > deadlineDate;
}
