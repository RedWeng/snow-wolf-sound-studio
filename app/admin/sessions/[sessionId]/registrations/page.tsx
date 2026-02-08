/**
 * Admin Session Registrations Page
 * 
 * View all registrations for a specific session
 * Shows parent info, child info, order status, and payment status
 */

'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockSessions } from '@/lib/mock-data/sessions';
import { mockOrders, mockOrderItems } from '@/lib/mock-data/orders';
import { mockUsers, mockChildren } from '@/lib/mock-data/users';
import { exportToCSV } from '@/lib/utils/csv-export';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/ui/Loading';
import type { Session, Order, OrderItem, User, Child } from '@/lib/types/database';

interface RegistrationData {
  orderItem: OrderItem;
  order: Order;
  parent: User;
  child: Child;
}

export default function SessionRegistrationsPage() {
  const { isChecking, isAuthorized } = useAdminAuth();
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [session, setSession] = useState<Session | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');

  useEffect(() => {
    // Find session
    const foundSession = mockSessions.find(s => s.id === sessionId);
    if (!foundSession) {
      router.push('/admin/sessions');
      return;
    }
    setSession(foundSession);

    // Find all order items for this session
    const sessionOrderItems = mockOrderItems.filter(item => item.session_id === sessionId);

    // Build registration data
    const regData: RegistrationData[] = sessionOrderItems.map(item => {
      const order = mockOrders.find(o => o.id === item.order_id)!;
      const parent = mockUsers.find(u => u.id === order.parent_id)!;
      const child = mockChildren.find(c => c.id === item.child_id)!;

      return {
        orderItem: item,
        order,
        parent,
        child,
      };
    });

    setRegistrations(regData);
    setLoading(false);
  }, [sessionId, router]);

  const filteredRegistrations = registrations.filter(reg => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'confirmed') return reg.order.status === 'confirmed';
    if (statusFilter === 'pending') return reg.order.status === 'pending_payment' || reg.order.status === 'payment_submitted';
    if (statusFilter === 'cancelled') return reg.order.status.includes('cancelled');
    return true;
  });

  const confirmedCount = registrations.filter(r => r.order.status === 'confirmed').length;
  const pendingCount = registrations.filter(r => 
    r.order.status === 'pending_payment' || r.order.status === 'payment_submitted'
  ).length;
  const cancelledCount = registrations.filter(r => r.order.status.includes('cancelled')).length;

  // CSV Export Function
  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) return;

    const headers = [
      '學員姓名',
      '學員年齡',
      '學員備註',
      '家長姓名',
      '家長Email',
      '家長電話',
      '訂單編號',
      '團體代碼',
      '報名時間',
      '訂單狀態',
      '付款方式',
    ];

    const rows = filteredRegistrations.map(reg => [
      reg.child.name,
      reg.child.age,
      reg.child.notes || '',
      reg.parent.full_name || '',
      reg.parent.email,
      reg.parent.phone || '',
      reg.order.order_number,
      reg.order.group_code || '',
      new Date(reg.orderItem.created_at).toLocaleString('zh-TW'),
      getStatusText(reg.order.status),
      getPaymentMethodText(reg.order.payment_method),
    ]);

    exportToCSV({
      filename: `${session?.title_zh}_報名名單`,
      headers,
      rows,
    });
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'confirmed': return '已確認';
      case 'payment_submitted': return '待審核';
      case 'pending_payment': return '待付款';
      case 'cancelled_manual': return '已取消(手動)';
      case 'cancelled_timeout': return '已取消(逾期)';
      default: return status;
    }
  };

  const getPaymentMethodText = (method: Order['payment_method']) => {
    if (!method) return '未選擇';
    return method === 'bank_transfer' ? '銀行轉帳' : 'LINE Pay';
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

  if (!session) {
    return null;
  }

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'confirmed':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">已確認</span>;
      case 'payment_submitted':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">待審核</span>;
      case 'pending_payment':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">待付款</span>;
      case 'cancelled_manual':
      case 'cancelled_timeout':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">已取消</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/admin/sessions"
            className="text-blue-600 hover:text-blue-700 flex items-center gap-2"
          >
            ← 返回課程列表
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{session.title_zh}</h1>
          <p className="text-gray-600 mt-1">{session.theme_zh}</p>
          <div className="flex gap-4 mt-3 text-sm text-gray-500">
            <span>📅 {new Date(session.date).toLocaleDateString('zh-TW')}</span>
            <span>🕐 {session.time}</span>
            <span>👥 容量: {session.capacity} 人</span>
            <span>💰 NT${session.price.toLocaleString()}</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">總報名人數</div>
            <div className="text-3xl font-bold text-gray-900">{registrations.length}</div>
            <div className="text-xs text-gray-500 mt-1">
              剩餘名額: {session.capacity - confirmedCount}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">已確認</div>
            <div className="text-3xl font-bold text-green-600">{confirmedCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">待處理</div>
            <div className="text-3xl font-bold text-yellow-600">{pendingCount}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">已取消</div>
            <div className="text-3xl font-bold text-red-600">{cancelledCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              全部 ({registrations.length})
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'confirmed'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              已確認 ({confirmedCount})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              待處理 ({pendingCount})
            </button>
            <button
              onClick={() => setStatusFilter('cancelled')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                statusFilter === 'cancelled'
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              已取消 ({cancelledCount})
            </button>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    學員資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    家長資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    訂單編號
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    報名時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    狀態
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      目前沒有報名資料
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.orderItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{reg.child.name}</div>
                          <div className="text-sm text-gray-500">{reg.child.age} 歲</div>
                          {reg.child.notes && (
                            <div className="text-xs text-gray-400 mt-1">備註: {reg.child.notes}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{reg.parent.full_name}</div>
                          <div className="text-sm text-gray-500">{reg.parent.email}</div>
                          <div className="text-sm text-gray-500">{reg.parent.phone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link
                          href={`/admin/orders?search=${reg.order.order_number}`}
                          className="text-blue-600 hover:text-blue-900 font-mono text-sm"
                        >
                          {reg.order.order_number}
                        </Link>
                        {reg.order.group_code && (
                          <div className="text-xs text-gray-500 mt-1">
                            團體: {reg.order.group_code}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(reg.orderItem.created_at).toLocaleDateString('zh-TW')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(reg.order.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/orders?search=${reg.order.order_number}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          查看訂單
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Export Button */}
        {filteredRegistrations.length > 0 && (
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              顯示 {filteredRegistrations.length} 筆報名資料
            </div>
            <button
              onClick={handleExportCSV}
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              📥 匯出 CSV
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
