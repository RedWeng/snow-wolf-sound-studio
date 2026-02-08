/**
 * Payment Proof Upload Page
 * Accessed via email link
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function PaymentProofPage() {
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;
  
  const [paymentMethod, setPaymentMethod] = useState<'jkopay' | 'bank_transfer' | 'line_pay' | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [transferCode, setTransferCode] = useState('');
  const [uploading, setUploading] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    // TODO: Fetch order details from API
    // For now, use mock data
    setOrderDetails({
      orderNumber,
      parentName: '王小明',
      totalAmount: 3000,
    });
  }, [orderNumber]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPaymentProof(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      // Upload file and submit payment proof
      const formData = new FormData();
      if (paymentProof) {
        formData.append('file', paymentProof);
      }
      formData.append('orderNumber', orderNumber);
      formData.append('paymentMethod', paymentMethod || 'bank_transfer');
      formData.append('transferCode', transferCode);

      const response = await fetch('/api/payment-proof', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        alert('付款證明已上傳！我們會盡快確認您的付款。');
        router.push(`/orders/${orderNumber}`);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      alert('上傳失敗，請稍後再試。');
    } finally {
      setUploading(false);
    }
  };

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-midnight to-black flex items-center justify-center">
        <div className="text-white">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-navy via-brand-midnight to-black">
      {/* Header */}
      <header className="bg-black/40 backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-2xl font-heading text-white">Snow Wolf</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <div className="text-center mb-8">
              <div className="text-6xl mb-4">💳</div>
              <h2 className="text-3xl font-heading text-white mb-2">
                上傳付款證明
              </h2>
              <p className="text-white/70">
                訂單編號：{orderNumber}
              </p>
            </div>

            <div className="bg-white/5 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">訂單資訊</h3>
              <div className="space-y-2 text-white/80">
                <p>家長姓名：{orderDetails.parentName}</p>
                <p className="text-2xl font-bold text-accent-aurora">
                  總金額：NT$ {orderDetails.totalAmount.toLocaleString()}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Method Selection */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-3">
                  付款方式
                </label>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('jkopay')}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === 'jkopay'
                        ? 'bg-accent-aurora/20 border-accent-aurora'
                        : 'bg-white/5 border-white/20 hover:border-accent-moon/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💳</span>
                      <span className="text-white font-semibold">街口支付</span>
                      {paymentMethod === 'jkopay' && (
                        <span className="ml-auto text-accent-aurora">✓</span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === 'bank_transfer'
                        ? 'bg-accent-aurora/20 border-accent-aurora'
                        : 'bg-white/5 border-white/20 hover:border-accent-moon/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🏦</span>
                      <span className="text-white font-semibold">銀行轉帳 / ATM</span>
                      {paymentMethod === 'bank_transfer' && (
                        <span className="ml-auto text-accent-aurora">✓</span>
                      )}
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('line_pay')}
                    className={`p-4 rounded-xl border-2 transition-all text-left ${
                      paymentMethod === 'line_pay'
                        ? 'bg-accent-aurora/20 border-accent-aurora'
                        : 'bg-white/5 border-white/20 hover:border-accent-moon/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">💚</span>
                      <span className="text-white font-semibold">LINE Pay</span>
                      {paymentMethod === 'line_pay' && (
                        <span className="ml-auto text-accent-aurora">✓</span>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* Upload Payment Proof */}
              {paymentMethod && (
                <div className="animate-fade-in">
                  <label className="block text-white/80 text-sm font-medium mb-3">
                    上傳付款截圖
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-aurora file:text-brand-navy file:font-semibold hover:file:bg-accent-moon transition-all"
                  />
                  {paymentProof && (
                    <p className="mt-2 text-sm text-accent-aurora">
                      ✓ {paymentProof.name}
                    </p>
                  )}

                  {paymentMethod === 'bank_transfer' && (
                    <>
                      <div className="text-center text-white/60 text-sm my-4">或</div>
                      <div>
                        <label className="block text-white/80 text-sm font-medium mb-2">
                          輸入轉帳帳號後五碼
                        </label>
                        <input
                          type="text"
                          maxLength={5}
                          value={transferCode}
                          onChange={(e) => setTransferCode(e.target.value)}
                          placeholder="12345"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora transition-all"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!paymentMethod || uploading || (!paymentProof && !transferCode)}
                className="w-full px-8 py-4 bg-gradient-to-r from-accent-moon to-accent-aurora text-brand-navy rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {uploading ? '上傳中...' : '✓ 確認送出'}
              </button>
            </form>

            <p className="text-center text-white/60 text-sm mt-6">
              我們會在確認付款後發送報名成功通知給您
            </p>
          </div>Kiro Power
        </div>
      </main>
    </div>
  );
}
