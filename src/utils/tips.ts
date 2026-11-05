/**
 * Customer tips (app repo BACKLOG P2.0).
 *
 * A business can send an invoice with "Allow tip". The customer may then add an optional
 * tip on the pay page. The tip is never part of the invoice subtotal, tax or total; the
 * processing fee is worked out on the amount including the tip, with the same formula the
 * server uses (lambda/src/utils/fees.ts and routes/pay.ts).
 */

export interface FeeRates {
  platformPercent: number;
  platformFixed: number;
  processorPercent: number;
  processorFixed: number;
}

/** The server's rates, used if a pay page response has no feeRates. */
export const DEFAULT_FEE_RATES: FeeRates = {
  platformPercent: 0.6,
  platformFixed: 0.2,
  processorPercent: 2.9,
  processorFixed: 0.3,
};

/** The tip choices offered on the pay page, as percentages of the amount due. */
export const TIP_PERCENTS = [10, 15, 20] as const;

export function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * The customer-paid processing fee and total for an amount plus a tip:
 * base = amount + tip; total = (base * (1 + platform%) + platformFixed + processorFixed) / (1 - processor%);
 * fee = round2(total - base); the customer pays base + fee.
 */
export function feesWithTip(chargeAmount: number, tip: number, rates: FeeRates = DEFAULT_FEE_RATES) {
  const base = chargeAmount + tip;
  const total = (base * (1 + rates.platformPercent / 100) + rates.platformFixed + rates.processorFixed)
    / (1 - rates.processorPercent / 100);
  const processingFee = round2(total - base);
  return { processingFee, totalCharge: round2(base + processingFee) };
}

/** A percentage tip on the amount due, in whole cents. */
export function tipFromPercent(chargeAmount: number, percent: number): number {
  return round2((chargeAmount * percent) / 100);
}

/**
 * Checks a custom tip typed by the customer (dollars). Empty means no tip.
 * Valid: a number >= 0, at most the amount due, with at most 2 decimals.
 */
export function parseCustomTip(input: string, chargeAmount: number): { ok: true; tip: number } | { ok: false; error: string } {
  const text = input.trim().replace(/^\$/, '').replace(/,/g, '');
  if (text === '') return { ok: true, tip: 0 };
  if (!/^\d*(\.\d{0,2})?$/.test(text) || text === '.') {
    return { ok: false, error: 'Enter an amount like 5 or 5.50' };
  }
  const tip = Number(text);
  if (!Number.isFinite(tip) || tip < 0) return { ok: false, error: 'Enter an amount like 5 or 5.50' };
  if (round2(tip) > round2(chargeAmount)) return { ok: false, error: "A tip can't be more than the amount due" };
  return { ok: true, tip: round2(tip) };
}

/** A recorded tip (invoice or payment) as a safe non-negative number of dollars. */
export function recordedTip(value: unknown): number {
  const n = typeof value === 'number' ? value : parseFloat(String(value ?? ''));
  return Number.isFinite(n) && n > 0 ? round2(n) : 0;
}

/** The total of the tips recorded on these invoices. */
export function sumTips(invoices: Array<{ tipAmount?: unknown }>): number {
  return round2(invoices.reduce((sum, inv) => sum + recordedTip(inv?.tipAmount), 0));
}
