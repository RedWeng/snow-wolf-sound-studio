/**
 * Email Preview Test Page
 * View email templates without sending
 */

'use client';

import { useState } from 'react';
import { 
  RegistrationConfirmationEmail,
  PaymentPendingNotification,
  RegistrationSuccessEmail,
  type OrderDetails 
} from '@/lib/email/templates';

export default function TestEmailPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<'confirmation' | 'pending' | 'success'>('confirmation');
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  // Mock order data
  const mockOrder: OrderDetails = {
    orderNumber: 'SW1738000000001',
    parentName: '王小明',
    parentEmail: 'parent@example.com',
    parentPhone: '0912-345-678',
    children: [
      { name: '小華', age: 8 },
      { name: '小美', age: 6 },
    ],
    sessions: [
      {
        title: '聲音探索課程',
        date: '2024/02/15',
        time: '14:00-16:00',
        childName: '小華',
        price: 1500,
      },
      {
        title: '錄音體驗課程',
        date: '2024/02/16',
        time: '10:00-12:00',
        childName: '小美',
        price: 1500,
      },
    ],
    totalAmount: 3000,
    paymentDeadline: '2024/01/30',
  };

  const getTemplate = () => {
    switch (selectedTemplate) {
      case 'confirmation':
        return RegistrationConfirmationEmail(mockOrder);
      case 'pending':
        return PaymentPendingNotification(mockOrder);
      case 'success':
        return RegistrationSuccessEmail(mockOrder);
    }
  };

  const template = getTemplate();

  const handleSendTestEmail = async () => {
    setIsSending(true);
    setSendResult(null);

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template: selectedTemplate,
          order: mockOrder,
        }),
      });

      const data = await response.json();
      setSendResult(data);
    } catch (error) {
      setSendResult({
        success: false,
        message: '發送失敗：' + (error as Error).message,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Email 模板預覽</h1>

        {/* Template Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">選擇模板</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setSelectedTemplate('confirmation')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedTemplate === 'confirmation'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              報名確認信（給家長）
            </button>
            <button
              onClick={() => setSelectedTemplate('pending')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedTemplate === 'pending'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              付款待確認（給管理員）
            </button>
            <button
              onClick={() => setSelectedTemplate('success')}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedTemplate === 'success'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              報名成功（給家長）
            </button>
          </div>
        </div>

        {/* Email Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Email 資訊</h2>
          <div className="space-y-2">
            <p><strong>主旨：</strong>{template.subject}</p>
            <p><strong>收件者：</strong>
              {selectedTemplate === 'pending' 
                ? 'molodyschool@gmail.com（管理員）' 
                : 'parent@example.com（家長）'}
            </p>
          </div>
          
          {/* Send Test Email Button */}
          <div className="mt-6">
            <button
              onClick={handleSendTestEmail}
              disabled={isSending}
              className={`px-6 py-3 rounded-lg font-medium transition-all ${
                isSending
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-purple-500 text-white hover:bg-purple-600'
              }`}
            >
              {isSending ? '發送中...' : '🚀 發送測試 Email'}
            </button>
            
            {sendResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                sendResult.success 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                <p className="font-semibold">
                  {sendResult.success ? '✅ 發送成功！' : '❌ 發送失敗'}
                </p>
                <p className="text-sm mt-1">{sendResult.message}</p>
              </div>
            )}
          </div>
        </div>

        {/* Email Preview */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Email 預覽</h2>
          <div 
            className="border-2 border-gray-200 rounded-lg p-4 bg-gray-50"
            dangerouslySetInnerHTML={{ __html: template.html }}
          />
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">💡 測試說明</h3>
          <ul className="text-blue-800 space-y-2">
            <li>• 這是 Email 模板的預覽，不會真正發送</li>
            <li>• 要真正發送 Email，需要設定 Resend API Key</li>
            <li>• 目前系統在「模擬模式」，會在 Console 顯示 Email 內容</li>
            <li>• 完成報名後，請檢查瀏覽器 Console（F12）查看 Email 資訊</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
