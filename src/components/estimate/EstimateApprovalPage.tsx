import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_CONFIG } from '../../utils/config';

interface EstimateData {
  estimateNumber: string;
  customer: string;
  customerEmail: string;
  lineItems: Array<{ name: string; quantity: number; price: number }>;
  subtotal: number;
  tax: number;
  total: number;
  date?: string;
  validUntil?: string;
  notes?: string;
  businessName: string;
  logo?: string;
  brandColor?: string;
  accentColor?: string;
  status: string;
  expiresAt: string;
}

type PageState = 'loading' | 'ready' | 'approved' | 'rejected' | 'expired' | 'not_found' | 'error' | 'submitting' | 'done';

export function EstimateApprovalPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<PageState>('loading');
  const [data, setData] = useState<EstimateData | null>(null);
  const [error, setError] = useState('');
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionResult, setActionResult] = useState<'approved' | 'rejected' | null>(null);

  useEffect(() => {
    if (!token) {
      setState('not_found');
      return;
    }

    fetch(`${API_CONFIG.baseUrl}/estimate/${token}`)
      .then(async (res) => {
        if (res.status === 404) {
          setState('not_found');
          return;
        }
        if (!res.ok) throw new Error('Failed to load estimate');

        const json = await res.json();
        setData(json);

        if (json.status === 'approved') {
          setState('approved');
        } else if (json.status === 'rejected') {
          setState('rejected');
        } else if (json.status === 'converted') {
          setState('approved');
        } else if (new Date(json.expiresAt) <= new Date()) {
          setState('expired');
        } else {
          setState('ready');
        }
      })
      .catch((err) => {
        console.error('Estimate page error:', err);
        setError('Something went wrong. Please try again later.');
        setState('error');
      });
  }, [token]);

  const handleApprove = async () => {
    if (!token) return;
    setState('submitting');
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/estimate/${token}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to approve estimate');
      }

      setActionResult('approved');
      setState('done');
    } catch (err: any) {
      console.error('Error approving estimate:', err);
      setError(err.message || 'Failed to approve estimate');
      setState('error');
    }
  };

  const handleReject = async () => {
    if (!token) return;
    setState('submitting');
    try {
      const res = await fetch(`${API_CONFIG.baseUrl}/estimate/${token}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason || undefined }),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || 'Failed to reject estimate');
      }

      setActionResult('rejected');
      setState('done');
    } catch (err: any) {
      console.error('Error rejecting estimate:', err);
      setError(err.message || 'Failed to reject estimate');
      setState('error');
    }
  };

  const brandColor = data?.brandColor || '#1E3A8A';
  const accentColor = data?.accentColor || '#14B8A6';

  // Loading state
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading estimate...</p>
        </div>
      </div>
    );
  }

  // Not found
  if (state === 'not_found') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Estimate Not Found</h1>
          <p className="text-gray-600">This estimate link is invalid or has been removed.</p>
        </div>
      </div>
    );
  }

  // Expired
  if (state === 'expired') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Estimate Expired</h1>
          <p className="text-gray-600">This estimate link has expired. Please contact the business for a new estimate.</p>
        </div>
      </div>
    );
  }

  // Error
  if (state === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600">{error || 'Please try again later.'}</p>
        </div>
      </div>
    );
  }

  // Already approved
  if (state === 'approved') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Estimate Approved</h1>
          <p className="text-gray-600">This estimate has already been approved. The business has been notified.</p>
        </div>
      </div>
    );
  }

  // Already rejected
  if (state === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Estimate Declined</h1>
          <p className="text-gray-600">This estimate has been declined. The business has been notified.</p>
        </div>
      </div>
    );
  }

  // Action completed
  if (state === 'done') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          {actionResult === 'approved' ? (
            <>
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Estimate Approved!</h1>
              <p className="text-gray-600">Thank you! {data?.businessName} has been notified of your approval.</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Estimate Declined</h1>
              <p className="text-gray-600">{data?.businessName} has been notified of your decision.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // Submitting
  if (state === 'submitting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Processing...</p>
        </div>
      </div>
    );
  }

  // Ready — show estimate for approval
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Business Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div
            className="p-6 text-white"
            style={{ background: `linear-gradient(135deg, ${brandColor}, ${accentColor})` }}
          >
            <div className="flex items-center gap-4">
              {data?.logo && (
                <img src={data.logo} alt={data.businessName} className="w-14 h-14 rounded-full object-cover border-2 border-white/30" />
              )}
              <div>
                <h1 className="text-xl font-bold">{data?.businessName}</h1>
                <p className="text-sm opacity-80">Estimate for your review</p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Estimate Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <p className="text-sm text-gray-500">Estimate Number</p>
                <p className="text-lg font-mono font-semibold text-gray-900">{data?.estimateNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Date</p>
                <p className="text-sm text-gray-900">
                  {data?.date ? new Date(data.date).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            {/* Customer */}
            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500 mb-1">Prepared for</p>
              <p className="text-gray-900 font-medium">{data?.customer}</p>
              {data?.customerEmail && (
                <p className="text-sm text-gray-600">{data.customerEmail}</p>
              )}
            </div>

            {/* Valid Until */}
            {data?.validUntil && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="text-sm text-amber-800">
                  This estimate is valid until <strong>{new Date(data.validUntil).toLocaleDateString()}</strong>
                </p>
              </div>
            )}

            {/* Line Items */}
            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">Items</h3>
              <div className="space-y-3">
                {data?.lineItems?.map((item, index) => (
                  <div key={index} className="flex justify-between items-start pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <p className="text-sm text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="text-sm font-mono text-gray-900 ml-4">
                      ${(item.quantity * item.price).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="border-t-2 border-gray-300 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-gray-900">Estimated Total</span>
                <span className="text-2xl font-bold font-mono text-gray-900">
                  ${(data?.total || 0).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Notes */}
            {data?.notes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-1">Notes / Terms</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.notes}</p>
              </div>
            )}

            {/* Reject Reason */}
            {showRejectReason && (
              <div className="border-t border-gray-200 pt-4 space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Reason for declining (optional)
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Let the business know why you're declining..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none min-h-[80px]"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowRejectReason(false); setRejectReason(''); }}
                    className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReject}
                    className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    Confirm Decline
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!showRejectReason && (
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  onClick={handleApprove}
                  className="flex-1 px-6 py-3 text-white rounded-lg text-sm font-medium transition-colors"
                  style={{ backgroundColor: '#16a34a' }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#15803d')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#16a34a')}
                >
                  ✓ Approve Estimate
                </button>
                <button
                  onClick={() => setShowRejectReason(true)}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  ✕ Decline Estimate
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Powered by BilltUp
        </p>
      </div>
    </div>
  );
}
