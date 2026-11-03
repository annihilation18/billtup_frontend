/**
 * An amount as shown after a "$": "12,015.76". Amounts were shown with toFixed(2), with no
 * thousands separator ("$12015.76", BACKLOG N.66). Not for input fields, which need plain numbers.
 */
export function formatAmount(value: number): string {
  return value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
