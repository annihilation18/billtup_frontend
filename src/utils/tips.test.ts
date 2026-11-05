import { describe, expect, it } from 'vitest';
import { DEFAULT_FEE_RATES, feesWithTip, parseCustomTip, sumTips, tipFromPercent } from './tips';

describe('feesWithTip (matches the server formula)', () => {
  it('no tip: fee 4.12, total 104.12 on 100', () => {
    expect(feesWithTip(100, 0, DEFAULT_FEE_RATES)).toEqual({ processingFee: 4.12, totalCharge: 104.12 });
  });

  it('15 tip on 100: fee 4.66, total 119.66', () => {
    expect(feesWithTip(100, 15, DEFAULT_FEE_RATES)).toEqual({ processingFee: 4.66, totalCharge: 119.66 });
  });

  it('uses the default rates when none are given', () => {
    expect(feesWithTip(100, 15)).toEqual({ processingFee: 4.66, totalCharge: 119.66 });
  });
});

describe('tipFromPercent', () => {
  it('rounds to whole cents', () => {
    expect(tipFromPercent(100, 15)).toBe(15);
    expect(tipFromPercent(33.33, 15)).toBe(5);
    expect(tipFromPercent(57.89, 20)).toBe(11.58);
  });
});

describe('parseCustomTip', () => {
  it('accepts empty as no tip', () => {
    expect(parseCustomTip('', 100)).toEqual({ ok: true, tip: 0 });
  });
  it('accepts dollars with up to 2 decimals', () => {
    expect(parseCustomTip('5', 100)).toEqual({ ok: true, tip: 5 });
    expect(parseCustomTip('$5.50', 100)).toEqual({ ok: true, tip: 5.5 });
    expect(parseCustomTip('100', 100)).toEqual({ ok: true, tip: 100 });
  });
  it('rejects more than 2 decimals, negatives, text and more than the amount due', () => {
    expect(parseCustomTip('5.555', 100).ok).toBe(false);
    expect(parseCustomTip('-1', 100).ok).toBe(false);
    expect(parseCustomTip('abc', 100).ok).toBe(false);
    expect(parseCustomTip('100.01', 100).ok).toBe(false);
  });
});

describe('sumTips', () => {
  it('adds recorded tips, ignoring missing and bad values', () => {
    expect(sumTips([{ tipAmount: 1.1 }, { tipAmount: 2.2 }, {}, { tipAmount: 'x' }, { tipAmount: -3 }])).toBe(3.3);
  });
});
