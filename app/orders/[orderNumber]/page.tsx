/**
 * Order Detail Page
 * 
 * Displays complete order information including items, payment status,
 * and payment proof upload.
 * 
 * Requirements: 6.4, 6.5, 7.1, 7.3
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { LoadingSpinner } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';

const content = {
  zh: {
    title: '訂單詳情',
    orderNumber: '訂單編號',
    orderDate: '訂單日期',
    status: '訂單狀態',
    paymentMethod: '付款方式',
    paymentDeadline: '付款期限',
    daysLeft: '天',
    orderItems: '訂單項目',
    priceBreakdown: '價格明細',
    basePrice: '課程費用',
    discount: '優惠折扣',
    total: '總計',
    groupCode: '團體代碼',
    notes: '備註',
    noNotes: '無備註',
    uploadPaymentProof: '上傳付款證明',
    viewPaymentProof: '查看付款證明',
    backToOrders: '返回訂單列表',
    pending: '待付款',
    submitted: '已提交付款',
    confirmed: '已確認',
    cancelled: '已取消',
    bankTransfer: '銀行轉帳',
    linePay: 'LINE Pay',
    sessionTitle: '課程名稱',
    sessionDate: '課程日期',
    sessionTime: '課程時間',
    childName: '孩子姓名',
    price: '價格',
    notFound: '找不到此訂單',
  },
  en: {
    title: 'Order Details',
    orderNumber: 'Order Number',
    orderDate: 'Order Date',
    status: 'Status',
    paymentMethod: 'Payment Method',
    paymentDeadline: 'Payment Deadline',
    daysLeft: 'days',
    orderItems: 'Order Items',
    priceBreakdown: 'Price Breakdown',
    basePrice: 'Base Price',
    discount: 'Discount',
    total: 'Total',
    groupCode: 'Group Code',
    notes: 'Notes',
    noNotes: 'No notes',
    uploadPaymentProof: 'Upload Payment Proof',
    viewPaymentProof: 'View Payment Proof',
    backToOrders: 'Back to Orders',
    pending: 'Pending Payment',
    submitted: 'Payment Submitted',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    bankTransfer: 'Bank Transfer',
    linePay: 'LINE Pay',
    sessionTitle: 'Session',
    sessionDate: 'Date',
    sessionTime: 'Time',
    childName: 'Child',
    price: 'Price',
    notFound: 'Order not found',
  },
};

const statusColors = {
  pending_payment: 'bg-semantic-warning/10 text-semantic-warning border-semantic-warning/20',
  payment_submitted: 'bg-accent-aurora/10 text-accent-aurora border-accent-aurora/20',
  confirmed: 'bg-semantic-success/10 text-semantic-success border-semantic-success/20',
  cancelled: 'bg-semantic-error/10 text-semantic-error border-semantic-error/20',
};

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [order, setOrder] = useState<any>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);

  const t = content[language];
  const orderNumber = params.orderNumber as string;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=/orders/${orderNumber}`);
    }
  }, [isLoading, isAuthenticated, router, orderNumber]);

  useEffect(() => {
    if (user?.id && orderNumber) {
      loadOrderDetails();
    }
  }, [user, orderNumber]);

  const loadOrderDetails = async () => {
    try {
      setLoadingOrder(true);
      const response = await fetch(`/api/orders/${orderNumber}`);
      const data = await response.json();
      
      if (data.success) {
        setOrder(data.order);
      } else {
        console.error('Failed to load order:', data.error);
        setOrder(null);
      }
    } catch (error) {
      console.error('Failed to load order:', error);
      setOrder(null);
    } finally {
      setLoadingOrder(false);
    }
  };

  if (isLoading || !isAuthenticated || loadingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        {/* Animation Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/image2/雪狼男孩_天裂之時_里特與巨狼_無文字.png')`,
          }}
        />
        
        {/* Dark overlay to dim the background */}
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 text-center">
          <h1 className="text-3xl font-heading text-white mb-4">{t.notFound}</h1>
          <Button variant="primary" onClick={() => router.push('/orders')}>
            {t.backToOrders}
          </Button>
        </div>
      </div>
    );
  }

  const orderItems = order.items || [];
  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animation Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/image2/雪狼男孩_天裂之時_里特與巨狼_無文字.png')`,
        }}
      />
      
      {/* Dark overlay to dim the background */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-heading text-brand-navy">{t.title}</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push('/orders')}
              >
                ← {t.backToOrders}
              </Button>
              <button
                onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
                className="px-4 py-2 border-2 border-brand-frost rounded-lg text-brand-navy hover:bg-brand-frost transition-colors"
              >
                {language === 'zh' ? 'EN' : '中文'}
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info Card */}
            <div className="bg-white rounded-xl p-6 border border-brand-frost">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-brand-midnight/60 mb-1">{t.orderNumber}</div>
                  <div className="text-xl font-bold text-brand-navy">{order.order_number}</div>
                </div>
                <div>
                  <div className="text-sm text-brand-midnight/60 mb-1">{t.status}</div>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[order.status as keyof typeof statusColors]}`}>
                    {t[order.status as keyof typeof t]}
                  </span>
                </div>
                <div>
                  <div className="text-sm text-brand-midnight/60 mb-1">{t.orderDate}</div>
                  <div className="font-semibold text-brand-navy">
                    {new Date(order.created_at).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-brand-midnight/60 mb-1">{t.paymentMethod}</div>
                  <div className="font-semibold text-brand-navy">
                    {order.payment_method === 'bank_transfer' ? t.bankTransfer : t.linePay}
                  </div>
                </div>
              </div>

              {order.status === 'pending_payment' && (
                <div className="bg-semantic-warning/10 border border-semantic-warning/20 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-brand-midnight/60 mb-1">{t.paymentDeadline}</div>
                      <div className="font-semibold text-brand-navy">
                        {new Date(order.payment_deadline).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-semantic-warning">
                        {getDaysUntilDeadline(order.payment_deadline)}
                      </div>
                      <div className="text-sm text-brand-midnight/60">{t.daysLeft}</div>
                    </div>
                  </div>
                </div>
              )}

              {order.group_code && (
                <div className="mt-4 p-4 bg-accent-aurora/10 border border-accent-aurora/20 rounded-xl">
                  <div className="text-sm text-brand-midnight/60 mb-1">{t.groupCode}</div>
                  <div className="text-2xl font-bold text-brand-navy font-mono">{order.group_code}</div>
                </div>
              )}

              {order.notes && (
                <div className="mt-4">
                  <div className="text-sm text-brand-midnight/60 mb-1">{t.notes}</div>
                  <div className="text-brand-navy">{order.notes}</div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl p-6 border border-brand-frost">
              <h2 className="text-xl font-heading text-brand-navy mb-4">{t.orderItems}</h2>
              <div className="space-y-4">
                {orderItems.map((item: any) => (
                  <div key={item.id} className="p-4 bg-brand-frost/20 rounded-xl border border-brand-frost">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-brand-navy">
                        {item.session_title}
                      </h3>
                      <div className="text-lg font-bold text-brand-navy">
                        NT${item.price.toLocaleString()}
                      </div>
                    </div>
                    <div className="text-sm text-brand-midnight/70 space-y-1">
                      <div>📅 {new Date(item.session_date).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')}</div>
                      <div>⏰ {item.session_time}</div>
                      <div>👤 {t.childName}: {item.child_name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Breakdown */}
            <div className="bg-white rounded-xl p-6 border border-brand-frost">
              <h2 className="text-xl font-heading text-brand-navy mb-4">{t.priceBreakdown}</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-brand-midnight/70">
                  <span>{t.basePrice}</span>
                  <span>NT${order.total_amount.toLocaleString()}</span>
                </div>
                {order.discount_amount > 0 && (
                  <div className="flex justify-between text-semantic-success">
                    <span>{t.discount}</span>
                    <span>-NT${order.discount_amount.toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-3 border-t border-brand-frost">
                  <div className="flex justify-between text-xl font-bold text-brand-navy">
                    <span>{t.total}</span>
                    <span>NT${order.final_amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Actions */}
            {order.status === 'pending_payment' && (
              <Button
                variant="primary"
                className="w-full"
                onClick={() => router.push(`/payment-proof/${order.order_number}`)}
              >
                {t.uploadPaymentProof}
              </Button>
            )}

            {order.payment_proof_url && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => order.payment_proof_url && window.open(order.payment_proof_url, '_blank')}
              >
                {t.viewPaymentProof}
              </Button>
            )}
          </div>
        </div>
      </main>
      </div>
    </div>
  );
}
