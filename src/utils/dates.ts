/**
 * Formats a stored date for display. Date-only values ("2026-11-29", as due dates are stored) are
 * read as that calendar day in local time; new Date("2026-11-29") means midnight UTC, which is
 * the evening before in the Americas, so due dates showed a day early. Same as the app's
 * src/utils/dateFormatters.ts formatDateOnly.
 */
export function formatDateOnly(value: string | undefined | null, options?: Intl.DateTimeFormatOptions): string {
  if (!value) return '';
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  const date = m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3])) : new Date(value);
  return isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, options);
}
