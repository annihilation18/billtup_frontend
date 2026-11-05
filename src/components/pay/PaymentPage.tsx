import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_CONFIG } from '../../utils/config';
import { formatAmount } from "../../utils/money";
import { DEFAULT_FEE_RATES, TIP_PERCENTS, feesWithTip, parseCustomTip, tipFromPercent, type FeeRates } from '../../utils/tips';

interface PaymentData {
  invoiceNumber: string;
  customer: string;
  lineItems: Array<{ name: string; quantity: number; price: number; notes?: string; description?: string }>;
  subtotal: number;
  discountAmount?: number;
  discountLabel?: string;
  discountType?: string;
  discountValue?: number;
  tax: number;
  total: number;
  date?: string;
  businessName: string;
  logo?: string;
  brandColor?: string;
  accentColor?: string;
  provider?: string;
  status: string;
  expiresAt: string;
  fees?: {
    processingFee: number;
    totalCharge: number;
  };
  paymentType?: 'deposit' | 'balance' | 'full';
  invoiceTotal?: number;
  chargeAmount?: number;
  /** The business allows an optional tip on this payment (never for deposits). */
  allowTip?: boolean;
  /** Rates for working out the processing fee again when a tip is added. */
  feeRates?: FeeRates;
}

/** No tip, a percentage of the amount due, or a custom dollar amount. */
type TipChoice = null | number | 'custom';

type PageState = 'loading' | 'ready' | 'paid' | 'expired' | 'not_found' | 'error' | 'redirecting' | 'deposit_already_paid';

export function PaymentPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<PageState>('loading');
  const [data, setData] = useState<PaymentData | null>(null);
  const [error, setError] = useState('');
  // Tips are low-pressure: hidden behind "Add a tip", nothing pre-selected
  const [showTipOptions, setShowTipOptions] = useState(false);
  const [tipChoice, setTipChoice] = useState<TipChoice>(null);
  const [customTip, setCustomTip] = useState('');

  useEffect(() => {
    if (!token) {
      setState('not_found');
      return;
    }

    fetch(`${API_CONFIG.baseUrl}/pay/${token}`)
      .then(async (res) => {
        if (res.status === 404) {
          setState('not_found');
          return;
        }
        if (!res.ok) throw new Error('Failed to load payment page');

        const json = await res.json();
        setData(json);

        if (json.status === 'paid') {
          setState('paid');
        } else if (json.status === 'deposit_paid' && json.paymentType === 'deposit') {
          setState('deposit_already_paid');
        } else if (new Date(json.expiresAt) <= new Date()) {
          setState('expired');
        } else {
          setState('ready');
        }
      })
      .catch((err) => {
        console.error('Payment page error:', err);
        setError('Something went wrong. Please try again later.');
        setState('error');
      });
  }, [token]);

  const handlePay = async () => {
    if (!token || !data) return;
    if (customTipInvalid) return;
    setError('');
    setState('redirecting');

    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/pay/${token}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tipAmount > 0 ? { tipAmount } : {}),
      });

      const json = await res.json();

      if (!res.ok) {
        if (json.error?.includes('already been paid')) {
          setState('paid');
          return;
        }
        throw new Error(json.error || 'Failed to create checkout session');
      }

      if (json.checkoutUrl) {
        window.location.href = json.checkoutUrl;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout');
      setState('ready');
    }
  };

  const brandColor = data?.brandColor || '#1E3A8A';
  const accentColor = data?.accentColor || '#14B8A6';

  // Tip (optional): a percentage of, or custom amount up to, the amount being paid
  const chargeAmount = data?.chargeAmount ?? data?.total ?? 0;
  const tipsOffered = data?.allowTip === true && data?.paymentType !== 'deposit';
  const customTipResult = tipChoice === 'custom' ? parseCustomTip(customTip, chargeAmount) : null;
  const customTipInvalid = tipsOffered && customTipResult !== null && !customTipResult.ok;
  const tipAmount = !tipsOffered || tipChoice === null
    ? 0
    : tipChoice === 'custom'
      ? (customTipResult?.ok ? customTipResult.tip : 0)
      : tipFromPercent(chargeAmount, tipChoice);
  const tipFees = tipAmount > 0 ? feesWithTip(chargeAmount, tipAmount, data?.feeRates ?? DEFAULT_FEE_RATES) : null;
  const processingFee = tipFees ? tipFees.processingFee : data?.fees?.processingFee;
  const amountDue = tipFees ? tipFees.totalCharge : (data?.fees?.totalCharge ?? data?.chargeAmount ?? data?.total ?? 0);

  const removeTip = () => {
    setTipChoice(null);
    setCustomTip('');
    setShowTipOptions(false);
  };

  // Loading state
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-12 w-12 rounded-full bg-gray-200 mx-auto mb-4" />
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto mb-2" />
          <div className="h-4 w-32 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  // Not found
  if (state === 'not_found') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">&#128533;</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Link Not Found</h1>
          <p className="text-gray-500">This payment link doesn't exist or has been revoked.</p>
        </div>
      </div>
    );
  }

  // Expired
  if (state === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">&#9203;</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Link Expired</h1>
          <p className="text-gray-500">This payment link has expired. Please contact the business for a new one.</p>
        </div>
      </div>
    );
  }

  // Error
  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">&#9888;&#65039;</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Something Went Wrong</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  // Already paid
  if (state === 'paid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
            <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Already Paid</h1>
          <p className="text-gray-500">This invoice has already been paid. No further action is needed.</p>
          {data && (
            <p className="text-sm text-gray-400 mt-4">Invoice {data.invoiceNumber} - {data.businessName}</p>
          )}
        </div>
      </div>
    );
  }

  // Deposit already paid (customer clicked a deposit link but deposit was already collected)
  if (state === 'deposit_already_paid') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: `${accentColor}20` }}>
            <svg className="w-8 h-8" style={{ color: accentColor }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Deposit Already Paid</h1>
          <p className="text-gray-500">The deposit for this invoice has already been received. The business will contact you about the remaining balance.</p>
          {data && (
            <p className="text-sm text-gray-400 mt-4">Invoice {data.invoiceNumber} - {data.businessName}</p>
          )}
        </div>
      </div>
    );
  }

  // Ready to pay (or redirecting)
  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div
          className="rounded-t-2xl p-8 text-center"
          style={{ background: `linear-gradient(135deg, ${brandColor}, ${accentColor})` }}
        >
          {data.logo && (
            <img
              src={data.logo}
              alt={data.businessName}
              className="max-h-14 max-w-[180px] mx-auto mb-3 rounded-xl border-2 border-white/30 shadow-md"
            />
          )}
          <h1 className="text-white text-xl font-bold">{data.businessName}</h1>
        </div>

        {/* Invoice Details */}
        <div className="bg-white border-x border-gray-200">
          {/* Amount Due */}
          <div className="p-6 text-center border-b border-gray-200 bg-gray-50">
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">
              {data.paymentType === 'deposit' ? 'Deposit Due' : data.paymentType === 'balance' ? 'Balance Due' : 'Amount Due'}
            </p>
            <p className="text-4xl font-bold" style={{ color: brandColor }}>
              ${formatAmount(amountDue)}
            </p>
            {data.paymentType === 'deposit' && data.invoiceTotal && (
              <p className="text-sm text-gray-400 mt-1">of ${formatAmount(data.invoiceTotal)} total</p>
            )}
            {data.paymentType === 'balance' && data.invoiceTotal && (
              <p className="text-sm text-gray-400 mt-1">remaining balance of ${formatAmount(data.invoiceTotal)} invoice</p>
            )}
          </div>

          {/* Invoice Info */}
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Invoice</span>
                <span className="font-medium text-gray-900">{data.invoiceNumber}</span>
              </div>
              {data.date && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-900">{data.date}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Customer</span>
                <span className="font-medium text-gray-900">{data.customer}</span>
              </div>
            </div>

            {/* Line Items */}
            {data.lineItems.length > 0 && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-xs uppercase tracking-wide text-gray-500 mb-3">Items</p>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-500 text-xs uppercase tracking-wide">
                      <td className="pb-2">Description</td>
                      <td className="pb-2 text-center">Qty</td>
                      <td className="pb-2 text-right">Amount</td>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lineItems.map((item, i) => (
                      <tr key={i} className="border-t border-gray-100">
                        <td className="py-2 text-gray-900">
                          {item.name}
                          {(item.notes || item.description) && (
                            <div className="text-xs text-gray-500 mt-0.5">{item.notes || item.description}</div>
                          )}
                        </td>
                        <td className="py-2 text-center text-gray-500">{item.quantity}</td>
                        <td className="py-2 text-right font-medium text-gray-900">
                          ${formatAmount((item.quantity * item.price))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">${formatAmount(data.subtotal)}</span>
                  </div>
                  {data.discountAmount != null && data.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">
                        Discount{data.discountLabel ? ` (${data.discountLabel})` : data.discountType === 'percent' && data.discountValue ? ` (${data.discountValue}%)` : ''}
                      </span>
                      <span className="font-medium text-green-600">-${formatAmount(data.discountAmount)}</span>
                    </div>
                  )}
                  {data.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="font-medium">${formatAmount(data.tax)}</span>
                    </div>
                  )}
                  {tipAmount > 0 && (
                    <div className="flex justify-between text-sm" data-testid="tip-line">
                      <span className="text-gray-500">Tip</span>
                      <span className="font-medium">${formatAmount(tipAmount)}</span>
                    </div>
                  )}
                  {processingFee != null && processingFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Processing Fee</span>
                      <span className="font-medium">${formatAmount(processingFee)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold pt-2 border-t-2 border-gray-200">
                    <span className="text-gray-900">
                      {data.paymentType === 'deposit' ? 'Deposit Due' : data.paymentType === 'balance' ? 'Balance Due' : 'Total Due'}
                    </span>
                    <span style={{ color: brandColor }}>${formatAmount(amountDue)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pay Button */}
        <div className="bg-white border-x border-gray-200 px-6 pb-6">
          {error && state === 'ready' && (
            <p role="alert" className="text-sm text-red-600 text-center mb-3">{error}</p>
          )}
          <button
            onClick={handlePay}
            disabled={state === 'redirecting' || customTipInvalid}
            className="w-full text-white font-bold py-4 px-8 rounded-lg text-lg transition-all hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: `linear-gradient(135deg, ${brandColor}, ${accentColor})` }}
          >
            {state === 'redirecting' ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Redirecting to payment...
              </span>
            ) : (
              data.paymentType === 'deposit'
                ? `Pay Deposit $${formatAmount(amountDue)}`
                : data.paymentType === 'balance'
                  ? `Pay Balance $${formatAmount(amountDue)}`
                  : `Pay $${formatAmount(amountDue)}`
            )}
          </button>

          {/* Optional tip: a quiet secondary button; the choices appear only when asked for */}
          {tipsOffered && state === 'ready' && !showTipOptions && (
            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => setShowTipOptions(true)}
                className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700"
              >
                Add a tip
              </button>
            </div>
          )}
          {tipsOffered && showTipOptions && (
            <div className="mt-4 rounded-lg border border-gray-200 p-4" role="group" aria-label="Tip (optional)">
              <p className="text-sm text-gray-600 mb-3">Tip (optional)</p>
              <div className="grid grid-cols-4 gap-2">
                {TIP_PERCENTS.map((pct) => {
                  const selected = tipChoice === pct;
                  return (
                    <button
                      key={pct}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setTipChoice(pct)}
                      disabled={state === 'redirecting'}
                      className={`rounded-md border px-2 py-2 text-sm transition-colors ${selected ? 'border-gray-800 bg-gray-100 text-gray-900' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}
                    >
                      <span className="block font-medium">{pct}%</span>
                      <span className="block text-xs text-gray-500">${formatAmount(tipFromPercent(chargeAmount, pct))}</span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  aria-pressed={tipChoice === 'custom'}
                  onClick={() => setTipChoice('custom')}
                  disabled={state === 'redirecting'}
                  className={`rounded-md border px-2 py-2 text-sm transition-colors ${tipChoice === 'custom' ? 'border-gray-800 bg-gray-100 text-gray-900' : 'border-gray-200 text-gray-700 hover:border-gray-400'}`}
                >
                  <span className="block font-medium">Custom</span>
                </button>
              </div>
              {tipChoice === 'custom' && (
                <div className="mt-3">
                  <div className="flex items-center rounded-md border border-gray-300 px-3 focus-within:border-[#1E3A8A]">
                    <span className="text-gray-500 text-sm">$</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      aria-label="Custom tip amount"
                      placeholder="0.00"
                      value={customTip}
                      onChange={(e) => setCustomTip(e.target.value)}
                      disabled={state === 'redirecting'}
                      className="w-full py-2 ml-2 text-sm outline-none"
                    />
                  </div>
                  {customTipResult && !customTipResult.ok && (
                    <p className="text-xs text-red-600 mt-1">{customTipResult.error}</p>
                  )}
                </div>
              )}
              <div className="mt-3 text-center">
                <button
                  type="button"
                  onClick={removeTip}
                  disabled={state === 'redirecting'}
                  className="text-sm text-gray-500 underline underline-offset-2 hover:text-gray-700"
                >
                  No tip
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 rounded-b-2xl border border-gray-200 border-t-0 p-4 text-center">
          <p className="text-xs text-gray-400">
            Secure payment powered by {data.provider === 'square' ? 'Square' : 'Stripe'}
          </p>
          <p className="text-xs text-gray-300 mt-1">Powered by BilltUp Invoicing</p>
        </div>
      </div>
    </div>
  );
}
