import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API_CONFIG } from '../../utils/config';

export function PaymentSuccessPage() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    invoiceNumber: string;
    total: number;
    businessName: string;
    brandColor?: string;
    accentColor?: string;
    fees?: { processingFee: number; totalCharge: number };
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    fetch(`${API_CONFIG.baseUrl}/pay/${token}`)
      .then(async (res) => {
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  const brandColor = data?.brandColor || '#1E3A8A';
  const accentColor = data?.accentColor || '#14B8A6';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-16 w-16 rounded-full bg-gray-200 mx-auto mb-4" />
          <div className="h-4 w-48 bg-gray-200 rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {/* Animated checkmark */}
        <div
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-[bounce_0.6s_ease-in-out]"
          style={{ backgroundColor: `${accentColor}20` }}
        >
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{ backgroundColor: accentColor }}
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful</h1>
        <p className="text-gray-500 mb-6">Thank you for your payment!</p>

        {data && (
          <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Amount Paid</span>
              <span className="font-bold" style={{ color: accentColor }}>
                ${(data.fees?.totalCharge ?? data.total).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Invoice</span>
              <span className="font-medium text-gray-900">{data.invoiceNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Business</span>
              <span className="font-medium text-gray-900">{data.businessName}</span>
            </div>
          </div>
        )}

        <p className="text-xs text-gray-400 mt-6">You can close this page now.</p>
      </div>
    </div>
  );
}
