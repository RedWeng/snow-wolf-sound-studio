/**
 * Admin Orders Management Page
 * Simple interface to confirm payments with CSV export
 */

'use client';

import { useState, useEffect } from 'react';
import { exportToCSV } from '@/lib/utils/csv-export';
import { LoadingSpinner } from '@/components/ui/Loading';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';

interface Order {
  id: string;
  orderNumber: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentProof?: string;
  transferCode?: string;
  createdAt: string;
  sessions: Array<{
    title: string;
    childName: string;
  }>;
}

export default function AdminOrdersPage() {
  const { isChecking, isAuthorized } = useAdminAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed'>('pending');
  const [loading, setLoading] = useState(true);
  const [cancellingOrder, setCancellingOrder] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    // TODO: Fetch orders from API
    // Mock data for now
    setOrders([
      {
        id: '1',
        orderNumber: 'SW1738000000001',
        parentName: '王小明',
        parentEmail: 'parent@example.com',
        parentPhone: '0912-345-678',
        totalAmount: 3000,
        status: 'pending',
        paymentProof: '/uploads/payment-proof-1.jpg',
        createdAt: '2024-01-27T10:30:00',
        sessions: [
          { title: '聲音探索課程', childName: '小華' },
        ],
      },
    ]);
    setLoading(false);
  }, []);

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.status === filter;
  });

  const handleConfirmPayment = async (orderNumber: string) => {
    if (!confirm('確認此訂單已付款？系統將自動發送報名成功通知給家長。')) {
      return;
    }

    try {
      // TODO: Call API to confirm payment
      // This will trigger sending success email to parent
      
      setOrders(orders.map(order => 
        order.orderNumber === orderNumber 
          ? { ...order, status: 'confirmed' as const }
          : order
      ));

      alert('付款已確認！報名成功通知已發送給家長。');
    } catch (error) {
      console.error('Failed to confirm payment:', error);
      alert('確認失敗，請稍後再試。');
    }
  };

  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('沒有可匯出的訂單資料');
      return;
    }

    const headers = [
      '訂單編號',
      '家長姓名',
      '家長電話',
      '家長Email',
      '報名課程',
      '學員姓名',
      '總金額',
      '訂單狀態',
      '建立時間',
      '轉帳後五碼',
    ];

    const rows = filteredOrders.map(order => [
      order.orderNumber,
      order.parentName,
      order.parentPhone,
      order.parentEmail,
      order.sessions.map(s => s.title).join('; '),
      order.sessions.map(s => s.childName).join('; '),
      order.totalAmount,
      order.status === 'pending' ? '待確認' : order.status === 'confirmed' ? '已確認' : '已取消',
      new Date(order.createdAt).toLocaleString('zh-TW'),
      order.transferCode || '',
    ]);

    exportToCSV({
      filename: `訂單列表_${filter === 'all' ? '全部' : filter === 'pending' ? '待確認' : '已確認'}`,
      headers,
      rows,
    });
  };

  const handleCancelOrder = async (orderNumber: string) => {
    if (!cancelReason.trim()) {
      alert('請輸入取消原因');
      return;
    }

    try {
      // TODO: Call API to cancel order
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setOrders(orders.map(order => 
        order.orderNumber === orderNumber 
          ? { ...order, status: 'cancelled' as const }
          : order
      ));

      alert('訂單已取消！系統將自動通知家長並處理退款。');
      setCancellingOrder(null);
      setCancelReason('');
    } catch (error) {
      console.error('Failed to cancel order:', error);
      alert('取消失敗，請稍後再試');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs and Export Button */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'pending'
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                待確認 ({orders.filter(o => o.status === 'pending').length})
              </button>
              <button
                onClick={() => setFilter('confirmed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'confirmed'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                已確認 ({orders.filter(o => o.status === 'confirmed').length})
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部 ({orders.length})
              </button>
            </div>
            
            {filteredOrders.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                📥 匯出 CSV
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center text-gray-500">
              目前沒有訂單
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleString('zh-TW')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'pending'
                      ? 'bg-orange-100 text-orange-800'
                      : order.status === 'confirmed'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {order.status === 'pending' ? '待確認' : order.status === 'confirmed' ? '已確認' : '已取消'}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">家長資訊</h4>
                    <p className="text-sm text-gray-600">姓名：{order.parentName}</p>
                    <p className="text-sm text-gray-600">電話：{order.parentPhone}</p>
                    <p className="text-sm text-gray-600">Email：{order.parentEmail}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">報名課程</h4>
                    {order.sessions.map((session, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        • {session.title} - {session.childName}
                      </p>
                    ))}
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      總金額：NT$ {order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {order.paymentProof && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">付款證明</h4>
                    <img 
                      src={order.paymentProof} 
                      alt="付款證明" 
                      className="max-w-xs border-2 border-gray-200 rounded-lg"
                    />
                  </div>
                )}

                {order.transferCode && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">轉帳後五碼</h4>
                    <p className="text-lg font-mono font-bold text-gray-900">
                      {order.transferCode}
                    </p>
                  </div>
                )}

                {order.status === 'pending' && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleConfirmPayment(order.orderNumber)}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      ✓ 確認付款並通知家長
                    </button>
                    <button
                      onClick={() => setCancellingOrder(order.orderNumber)}
                      className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                    >
                      取消訂單
                    </button>
                  </div>
                )}

                {order.status === 'confirmed' && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setCancellingOrder(order.orderNumber)}
                      className="px-6 py-3 bg-red-100 text-red-700 rounded-lg font-medium hover:bg-red-200 transition-colors"
                    >
                      取消訂單
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* Cancel Order Modal */}
      {cancellingOrder && (
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
                autoFocus
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setCancellingOrder(null);
                  setCancelReason('');
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                返回
              </button>
              <button
                onClick={() => handleCancelOrder(cancellingOrder)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                disabled={!cancelReason.trim()}
              >
                確認取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
