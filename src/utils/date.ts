function formatMonth(value?: string): string {
  if (!value) return '';
  return /^\d{4}-\d{2}$/.test(value) ? value.replace('-', '.') : value;
}

export function formatDateRange(startDate?: string, endDate?: string, current = false): string {
  const start = formatMonth(startDate);
  const end = current ? '至今' : formatMonth(endDate);
  if (!start) return end;
  if (!end) return start;
  return `${start} – ${end}`;
}
