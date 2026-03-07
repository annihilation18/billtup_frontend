import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_CONFIG } from '../../utils/config';

interface PaymentData {
  invoiceNumber: string;
  customer: string;
  lineItems: Array<{ name: string; quantity: number; price: number; notes?: string; description?: string }>;
  subtotal: number;
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
}

type PageState = 'loading' | 'ready' | 'paid' | 'expired' | 'not_found' | 'error' | 'redirecting';

export function PaymentPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<PageState>('loading');
  const [data, setData] = useState<PaymentData | null>(null);
  const [error, setError] = useState('');

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
    setState('redirecting');

    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/pay/${token}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
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
            <p className="text-xs uppercase tracking-wide text-gray-500 mb-1">Amount Due</p>
            <p className="text-4xl font-bold" style={{ color: brandColor }}>
              ${(data.fees?.totalCharge ?? data.total).toFixed(2)}
            </p>
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
                          ${(item.quantity * item.price).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium">${data.subtotal.toFixed(2)}</span>
                  </div>
                  {data.tax > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tax</span>
                      <span className="font-medium">${data.tax.toFixed(2)}</span>
                    </div>
                  )}
                  {data.fees && data.fees.processingFee > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Processing Fee</span>
                      <span className="font-medium">${data.fees.processingFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold pt-2 border-t-2 border-gray-200">
                    <span className="text-gray-900">Total Due</span>
                    <span style={{ color: brandColor }}>${(data.fees?.totalCharge ?? data.total).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pay Button */}
        <div className="bg-white border-x border-gray-200 px-6 pb-6">
          <button
            onClick={handlePay}
            disabled={state === 'redirecting'}
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
              `Pay $${(data.fees?.totalCharge ?? data.total).toFixed(2)}`
            )}
          </button>
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
