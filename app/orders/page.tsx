/**
 * Order History Page
 * 
 * Displays all orders for the logged-in parent with filtering options.
 * 
 * Requirements: 7.5
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { LoadingSpinner } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';

type OrderStatus = 'all' | 'pending_payment' | 'payment_submitted' | 'confirmed' | 'cancelled';

const content = {
  zh: {
    title: '訂單記錄',
    filters: '篩選',
    all: '全部',
    pending: '待付款',
    submitted: '已提交付款',
    confirmed: '已確認',
    cancelled: '已取消',
    noOrders: '目前沒有訂單',
    orderNumber: '訂單編號',
    date: '訂單日期',
    status: '狀態',
    amount: '金額',
    viewDetails: '查看詳情',
    payNow: '立即付款',
  },
  en: {
    title: 'Order History',
    filters: 'Filters',
    all: 'All',
    pending: 'Pending Payment',
    submitted: 'Payment Submitted',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    noOrders: 'No orders yet',
    orderNumber: 'Order Number',
    date: 'Order Date',
    status: 'Status',
    amount: 'Amount',
    viewDetails: 'View Details',
    payNow: 'Pay Now',
  },
};

const statusColors = {
  pending_payment: 'bg-semantic-warning/10 text-semantic-warning border-semantic-warning/20',
  payment_submitted: 'bg-accent-aurora/10 text-accent-aurora border-accent-aurora/20',
  confirmed: 'bg-semantic-success/10 text-semantic-success border-semantic-success/20',
  cancelled: 'bg-semantic-error/10 text-semantic-error border-semantic-error/20',
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [filter, setFilter] = useState<OrderStatus>('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const t = content[language];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/orders');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    }
  }, [user, filter]);

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      const response = await fetch(`/api/orders?userId=${user?.id}&status=${filter}`);
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        console.error('Failed to load orders:', data.error);
      }
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  if (isLoading || !isAuthenticated || loadingOrders) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
                onClick={() => router.push('/dashboard')}
              >
                ← {language === 'zh' ? '返回儀表板' : 'Back to Dashboard'}
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
        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {(['all', 'pending_payment', 'payment_submitted', 'confirmed', 'cancelled'] as OrderStatus[]).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  filter === status
                    ? 'bg-brand-navy text-white'
                    : 'bg-white border-2 border-brand-frost text-brand-navy hover:bg-brand-frost'
                }`}
              >
                {t[status as keyof typeof t]}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-brand-frost">
            <p className="text-xl text-brand-midnight/60">{t.noOrders}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div
                key={order.id}
                className="bg-white rounded-xl p-6 border border-brand-frost hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-brand-navy">
                        {order.order_number}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[order.status as keyof typeof statusColors]}`}>
                        {t[order.status as keyof typeof t]}
                      </span>
                    </div>
                    <div className="text-sm text-brand-midnight/70 space-y-1">
                      <div>📅 {new Date(order.created_at).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')}</div>
                      <div className="text-2xl font-bold text-brand-navy mt-2">
                        NT${order.final_amount.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => router.push(`/orders/${order.order_number}`)}
                    >
                      {t.viewDetails}
                    </Button>
                    {order.status === 'pending_payment' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => router.push(`/payment-proof/${order.order_number}`)}
                      >
                        {t.payNow}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
