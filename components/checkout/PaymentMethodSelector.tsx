/**
 * Payment Method Selector Component
 * Supports: JKO Pay, Bank Transfer, LINE Pay
 */

'use client';

import { useState } from 'react';
import { getFormattedBankInfo } from '@/lib/config/payment';

interface OrderItem {
  sessionId: string;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  childName: string;
  childAge: number;
  price: number;
}

interface PaymentMethodSelectorProps {
  totalAmount: number;
  orderNumber: string;
  orderItems: OrderItem[];
  discount?: number;
  onPaymentMethodChange: (method: 'jkopay' | 'bank_transfer' | 'line_pay' | null) => void;
  onPaymentProofUpload: (file: File) => void;
  onTransferCodeChange: (code: string) => void;
  language?: 'zh' | 'en';
}

export default function PaymentMethodSelector({
  totalAmount,
  orderNumber,
  orderItems,
  discount = 0,
  onPaymentMethodChange,
  onPaymentProofUpload,
  onTransferCodeChange,
  language = 'zh',
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<'jkopay' | 'bank_transfer' | 'line_pay' | null>(null);
  const [transferCode, setTransferCode] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const content = {
    zh: {
      selectMethod: '請選擇付款方式',
      jkoPay: '街口支付',
      jkoPayDesc: '點擊按鈕開啟街口 APP 付款',
      jkoPayButton: '使用街口支付',
      bankTransfer: '銀行轉帳 / ATM',
      bankTransferDesc: '轉帳後請上傳證明或輸入後五碼',
      linePay: 'LINE Pay',
      linePayDesc: '掃描 QR Code 使用 LINE Pay 付款',
      bankInfo: '銀行帳號資訊',
      bankName: '銀行',
      accountNumber: '帳號',
      accountName: '戶名',
      transferNote: '轉帳備註',
      pleaseNote: '請備註訂單編號',
      uploadProof: '上傳付款證明',
      or: '或',
      enterLastFive: '輸入轉帳帳號後五碼',
      scanQR: '掃描 QR Code 付款',
      afterPayment: '付款後請上傳截圖',
      courseDetails: '課程費用',
      subtotal: '小計',
      discount: '多人優惠',
      total: '總計',
      discountApplied: '已套用優惠',
    },
    en: {
      selectMethod: 'Select Payment Method',
      jkoPay: 'JKO Pay',
      jkoPayDesc: 'Click to open JKO Pay APP',
      jkoPayButton: 'Pay with JKO Pay',
      bankTransfer: 'Bank Transfer / ATM',
      bankTransferDesc: 'Upload proof or enter last 5 digits after transfer',
      linePay: 'LINE Pay',
      linePayDesc: 'Scan QR Code to pay with LINE Pay',
      bankInfo: 'Bank Account Information',
      bankName: 'Bank',
      accountNumber: 'Account Number',
      accountName: 'Account Name',
      transferNote: 'Transfer Note',
      pleaseNote: 'Please note order number',
      uploadProof: 'Upload Payment Proof',
      or: 'or',
      enterLastFive: 'Enter last 5 digits',
      scanQR: 'Scan QR Code',
      afterPayment: 'Upload screenshot after payment',
      courseDetails: 'Course Fees',
      subtotal: 'Subtotal',
      discount: 'Multi-person Discount',
      total: 'Total',
      discountApplied: 'Discount Applied',
    },
  };

  const t = content[language];
  
  // Get bank account information
  const bankInfo = getFormattedBankInfo(language);

  const handleMethodSelect = (method: 'jkopay' | 'bank_transfer' | 'line_pay') => {
    setSelectedMethod(method);
    onPaymentMethodChange(method);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFile(file);
      onPaymentProofUpload(file);
    }
  };

  const handleTransferCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setTransferCode(code);
    onTransferCodeChange(code);
  };

  const generateJkoPayLink = () => {
    // TODO: JKO Pay Integration
    // 1. Register for JKO Pay merchant account: https://www.jkopay.com/
    // 2. Get merchant ID and API credentials
    // 3. Implement JKO Pay API integration:
    //    - Create payment order via JKO Pay API
    //    - Get payment URL with order details
    //    - Handle payment callback/webhook
    // 4. Replace this placeholder with actual JKO Pay payment URL
    // Example format: https://payment.jkopay.com/pay?merchantId=XXX&orderId=XXX&amount=XXX&signature=XXX
    return `https://payment.jkopay.com/pay?amount=${totalAmount}&order=${orderNumber}`;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-heading text-white mb-4">{t.selectMethod}</h3>

      {/* Course Details Section */}
      <div className="p-6 bg-white/5 border border-white/20 rounded-xl space-y-4">
        <h4 className="text-lg font-bold text-white mb-4">{t.courseDetails}</h4>
        
        {/* Order Items List */}
        <div className="space-y-3">
          {orderItems.map((item, index) => (
            <div
              key={index}
              className="flex items-start justify-between gap-4 p-3 bg-white/5 rounded-lg"
            >
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold text-sm truncate">
                  {item.sessionTitle}
                </p>
                <p className="text-white/60 text-xs mt-1">
                  {item.childName} ({item.childAge} {language === 'zh' ? '歲' : 'yrs'})
                </p>
                <p className="text-white/50 text-xs">
                  {item.sessionDate} · {item.sessionTime}
                </p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-white font-bold">
                  NT$ {item.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t border-white/20 space-y-2">
          <div className="flex justify-between text-white/80">
            <span>{t.subtotal}</span>
            <span className="font-semibold">
              NT$ {(totalAmount + discount).toLocaleString()}
            </span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span className="flex items-center gap-2">
                <span>🎉</span>
                <span>{t.discount}</span>
              </span>
              <span className="font-semibold">
                -NT$ {discount.toLocaleString()}
              </span>
            </div>
          )}
          
          <div className="h-px bg-white/20 my-2" />
          
          <div className="flex justify-between text-xl font-bold">
            <span className="text-white">{t.total}</span>
            <span className="text-accent-aurora">
              NT$ {totalAmount.toLocaleString()}
            </span>
          </div>
          
          {discount > 0 && (
            <p className="text-xs text-green-400/80 text-right">
              ✓ {t.discountApplied}
            </p>
          )}
        </div>
      </div>

      {/* Payment Method Options */}
      <div className="grid grid-cols-1 gap-4">
        {/* JKO Pay */}
        <button
          type="button"
          onClick={() => handleMethodSelect('jkopay')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
            selectedMethod === 'jkopay'
              ? 'bg-accent-aurora/20 border-accent-aurora'
              : 'bg-white/5 border-white/20 hover:border-accent-moon/50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">💳</div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white">{t.jkoPay}</h4>
              <p className="text-sm text-white/60">{t.jkoPayDesc}</p>
            </div>
            {selectedMethod === 'jkopay' && (
              <div className="text-2xl text-accent-aurora">✓</div>
            )}
          </div>
        </button>

        {/* Bank Transfer */}
        <button
          type="button"
          onClick={() => handleMethodSelect('bank_transfer')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
            selectedMethod === 'bank_transfer'
              ? 'bg-accent-aurora/20 border-accent-aurora'
              : 'bg-white/5 border-white/20 hover:border-accent-moon/50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">🏦</div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white">{t.bankTransfer}</h4>
              <p className="text-sm text-white/60">{t.bankTransferDesc}</p>
            </div>
            {selectedMethod === 'bank_transfer' && (
              <div className="text-2xl text-accent-aurora">✓</div>
            )}
          </div>
        </button>

        {/* LINE Pay */}
        <button
          type="button"
          onClick={() => handleMethodSelect('line_pay')}
          className={`p-6 rounded-xl border-2 transition-all duration-300 text-left ${
            selectedMethod === 'line_pay'
              ? 'bg-accent-aurora/20 border-accent-aurora'
              : 'bg-white/5 border-white/20 hover:border-accent-moon/50'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">💚</div>
            <div className="flex-1">
              <h4 className="text-lg font-bold text-white">{t.linePay}</h4>
              <p className="text-sm text-white/60">{t.linePayDesc}</p>
            </div>
            {selectedMethod === 'line_pay' && (
              <div className="text-2xl text-accent-aurora">✓</div>
            )}
          </div>
        </button>
      </div>

      {/* Payment Details based on selected method */}
      {selectedMethod && (
        <div className="mt-6 p-6 bg-white/5 border border-white/20 rounded-xl animate-fade-in">
          {/* JKO Pay Details */}
          {selectedMethod === 'jkopay' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <span>💳</span>
                {t.jkoPay}
              </h4>
              <p className="text-white/70 text-sm">
                點擊下方按鈕將開啟街口支付，請完成付款後回到此頁面。
              </p>
              <a
                href={generateJkoPayLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full px-6 py-4 bg-gradient-to-r from-[#FF6B00] to-[#FF8C00] text-white rounded-xl font-bold text-center hover:scale-105 transition-all duration-300"
              >
                {t.jkoPayButton} (NT$ {totalAmount.toLocaleString()})
              </a>
              <div className="pt-4 border-t border-white/20">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  {t.uploadProof}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-aurora file:text-brand-navy file:font-semibold hover:file:bg-accent-moon transition-all"
                />
                {uploadedFile && (
                  <p className="mt-2 text-sm text-accent-aurora">
                    ✓ {uploadedFile.name}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Bank Transfer Details */}
          {selectedMethod === 'bank_transfer' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <span>🏦</span>
                {t.bankInfo}
              </h4>
              <div className="space-y-3 p-4 bg-white/5 rounded-lg border border-accent-aurora/30">
                <div className="flex justify-between items-start">
                  <span className="text-white/60">{t.bankName}:</span>
                  <span className="text-white font-semibold text-right">
                    {bankInfo.bankName}
                    {bankInfo.bankCode && (
                      <span className="text-white/60 text-sm ml-2">({bankInfo.bankCode})</span>
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-white/60">{t.accountNumber}:</span>
                  <span className="text-accent-aurora font-mono font-bold text-lg">
                    {bankInfo.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-white/60">{t.accountName}:</span>
                  <span className="text-white font-semibold text-right">{bankInfo.accountName}</span>
                </div>
                <div className="pt-3 border-t border-white/20">
                  <div className="flex items-start gap-2">
                    <span className="text-white/60 whitespace-nowrap">{t.transferNote}:</span>
                    <div className="flex-1">
                      <p className="text-accent-aurora font-bold">{orderNumber}</p>
                      <p className="text-xs text-white/50 mt-1">
                        {language === 'zh' 
                          ? '請務必填寫訂單編號，以便快速核對款項' 
                          : 'Please include order number for quick verification'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-accent-aurora/10 border border-accent-aurora/30 rounded-lg">
                <p className="text-sm text-white/80 flex items-start gap-2">
                  <span className="text-accent-aurora text-lg">💡</span>
                  <span>
                    {language === 'zh'
                      ? '完成轉帳後，請上傳付款證明或輸入轉帳帳號後五碼，我們將在 24 小時內確認您的付款。'
                      : 'After transfer, please upload payment proof or enter last 5 digits. We will confirm within 24 hours.'}
                  </span>
                </p>
              </div>

              <div className="space-y-3">
                <label className="block text-white/80 text-sm font-medium">
                  {t.uploadProof}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-aurora file:text-brand-navy file:font-semibold hover:file:bg-accent-moon transition-all"
                />
                {uploadedFile && (
                  <p className="mt-2 text-sm text-accent-aurora flex items-center gap-2">
                    <span>✓</span>
                    <span>{uploadedFile.name}</span>
                  </p>
                )}

                <div className="text-center text-white/60 text-sm">{t.or}</div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    {t.enterLastFive}
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    value={transferCode}
                    onChange={handleTransferCodeChange}
                    placeholder="12345"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora transition-all font-mono text-lg text-center"
                  />
                  <p className="mt-2 text-xs text-white/50 text-center">
                    {language === 'zh'
                      ? '請輸入您轉帳帳號的後五碼數字'
                      : 'Enter the last 5 digits of your account'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* LINE Pay Details */}
          {selectedMethod === 'line_pay' && (
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white flex items-center gap-2">
                <span>💚</span>
                {t.linePay}
              </h4>
              <div className="flex flex-col items-center space-y-4 p-6 bg-white/5 rounded-lg">
                <div className="w-48 h-48 bg-white rounded-xl flex items-center justify-center">
                  {/* TODO: Replace with actual LINE Pay QR Code */}
                  <div className="text-center">
                    <div className="text-6xl mb-2">📱</div>
                    <p className="text-sm text-gray-600">LINE Pay QR Code</p>
                  </div>
                </div>
                <p className="text-white/70 text-sm text-center">
                  {t.scanQR}
                </p>
                <p className="text-accent-aurora font-bold text-xl">
                  NT$ {totalAmount.toLocaleString()}
                </p>
              </div>

              <div className="pt-4 border-t border-white/20">
                <label className="block text-white/80 text-sm font-medium mb-2">
                  {t.afterPayment}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-accent-aurora file:text-brand-navy file:font-semibold hover:file:bg-accent-moon transition-all"
                />
                {uploadedFile && (
                  <p className="mt-2 text-sm text-accent-aurora">
                    ✓ {uploadedFile.name}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
