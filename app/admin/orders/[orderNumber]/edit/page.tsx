/**
 * Admin Order Edit Page
 * 
 * Edit order details, cancel order, or change sessions
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockOrders, mockOrderItems } from '@/lib/mock-data/orders';
import { mockSessions } from '@/lib/mock-data/sessions';
import { mockUsers, mockChildren } from '@/lib/mock-data/users';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/ui/Loading';
import type { Order, OrderItem, Session, User, Child } from '@/lib/types/database';

interface OrderWithDetails {
  order: Order;
  items: Array<{
    item: OrderItem;
    session: Session;
    child: Child;
  }>;
  parent: User;
}

export default function EditOrderPage() {
  const { isChecking, isAuthorized } = useAdminAuth();
  const params = useParams();
  const router = useRouter();
  const orderNumber = params.orderNumber as string;

  const [orderData, setOrderData] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  useEffect(() => {
    // Find order
    const order = mockOrders.find(o => o.order_number === orderNumber);
    if (!order) {
      router.push('/admin/orders');
      return;
    }

    // Find order items
    const items = mockOrderItems
      .filter(item => item.order_id === order.id)
      .map(item => ({
        item,
        session: mockSessions.find(s => s.id === item.session_id)!,
        child: mockChildren.find(c => c.id === item.child_id)!,
      }));

    // Find parent
    const parent = mockUsers.find(u => u.id === order.parent_id)!;

    setOrderData({ order, items, parent });
    setLoading(false);
  }, [orderNumber, router]);

  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      alert('請輸入取消原因');
      return;
    }

    setSaving(true);
    try {
      // TODO: Call API to cancel order
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('訂單已取消！系統將自動通知家長並處理退款。');
      router.push('/admin/orders');
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('取消失敗，請稍後再試');
    } finally {
      setSaving(false);
      setShowCancelModal(false);
    }
  };

  const handleChangeSession = async (_itemId: string, _newSessionId: string) => {
    if (!confirm('確定要更換課程嗎？系統將通知家長此變更。')) {
      return;
    }

    setSaving(true);
    try {
      // TODO: Call API to change session
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('課程已更換！通知已發送給家長。');
      window.location.reload();
    } catch (error) {
      console.error('Failed to change session:', error);
      alert('更換失敗，請稍後再試');
    } finally {
      setSaving(false);
    }
  };

  if (isChecking || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  if (!orderData) return null;

  const { order, items, parent } = orderData;

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">已確認</span>;
      case 'payment_submitted':
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">待審核</span>;
      case 'pending_payment':
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">待付款</span>;
      case 'cancelled_manual':
      case 'cancelled_timeout':
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">已取消</span>;
      default:
        return <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const isCancelled = order.status.includes('cancelled');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/admin/orders"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← 返回訂單列表
          </Link>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">訂單編輯</h1>
            <p className="text-gray-600 mt-1">{order.order_number}</p>
          </div>
          {getStatusBadge(order.status)}
        </div>

        {/* Parent Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">家長資訊</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="text-sm text-gray-600">姓名</div>
              <div className="font-medium text-gray-900">{parent.full_name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Email</div>
              <div className="font-medium text-gray-900">{parent.email}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">電話</div>
              <div className="font-medium text-gray-900">{parent.phone}</div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">報名課程</h2>
          <div className="space-y-4">
            {items.map(({ item, session, child }) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{session.title_zh}</h3>
                    <p className="text-sm text-gray-600 mt-1">{session.theme_zh}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      <span>📅 {new Date(session.date).toLocaleDateString('zh-TW')}</span>
                      <span>🕐 {session.time}</span>
                      <span>👤 {child.name} ({child.age}歲)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      NT${item.price.toLocaleString()}
                    </div>
                  </div>
                </div>

                {!isCancelled && (
                  <div className="flex gap-3 pt-4 border-t border-gray-200">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleChangeSession(item.id, e.target.value);
                        }
                      }}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      disabled={saving}
                    >
                      <option value="">更換課程...</option>
                      {mockSessions
                        .filter(s => s.status === 'active' && s.id !== session.id)
                        .map(s => (
                          <option key={s.id} value={s.id}>
                            {s.title_zh} - {new Date(s.date).toLocaleDateString('zh-TW')} {s.time}
                          </option>
                        ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">付款資訊</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">付款方式</div>
              <div className="font-medium text-gray-900">
                {order.payment_method === 'bank_transfer' ? '銀行轉帳' : 
                 order.payment_method === 'line_pay' ? 'LINE Pay' : '未選擇'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">付款期限</div>
              <div className="font-medium text-gray-900">
                {new Date(order.payment_deadline).toLocaleString('zh-TW')}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">總金額</div>
              <div className="text-2xl font-bold text-gray-900">
                NT${order.final_amount.toLocaleString()}
              </div>
              {order.discount_amount > 0 && (
                <div className="text-sm text-green-600">
                  已折扣 NT${order.discount_amount.toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {!isCancelled && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">訂單操作</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors"
                disabled={saving}
              >
                取消訂單
              </button>
              <Link
                href={`/admin/orders?search=${order.order_number}`}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                返回訂單詳情
              </Link>
            </div>
          </div>
        )}
      </main>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">取消訂單</h3>
            <p className="text-gray-600 mb-4">
              取消後將自動通知家長，並根據取消時間計算退款金額。
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                取消原因 *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="請輸入取消原因，將會通知給家長..."
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
                disabled={saving}
              >
                返回
              </button>
              <button
                onClick={handleCancelOrder}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={saving || !cancelReason.trim()}
              >
                {saving ? '處理中...' : '確認取消'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
