export function formatCurrency(amountInCents: number, locale = 'en-US', currency = 'USD'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amountInCents / 100);
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1)}…`;
}
