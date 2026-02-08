/**
 * Admin Registrations Management Page
 * 
 * View and manage all registrations across all sessions
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  session: Session;
}

export default function AdminRegistrationsPage() {
  const { isChecking, isAuthorized } = useAdminAuth();
  const [registrations, setRegistrations] = useState<RegistrationData[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'pending' | 'cancelled'>('all');
  const [sessionFilter, setSessionFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, [statusFilter, sessionFilter, searchQuery]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Build query parameters
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (sessionFilter !== 'all') params.append('session', sessionFilter);
      if (searchQuery) params.append('search', searchQuery);

      // Fetch registrations
      const regResponse = await fetch(`/api/admin/registrations?${params.toString()}`);
      const regData = await regResponse.json();

      if (!regData.success) {
        throw new Error(regData.error || 'Failed to load registrations');
      }

      setRegistrations(regData.registrations);

      // Fetch sessions for filter dropdown (only once)
      if (sessions.length === 0) {
        const sessionsResponse = await fetch('/api/sessions');
        const sessionsData = await sessionsResponse.json();
        if (sessionsData.success) {
          setSessions(sessionsData.sessions);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to load registrations:', error);
      alert('載入報名資料失敗，請重新整理頁面');
      setLoading(false);
    }
  };

  const filteredRegistrations = registrations; // Already filtered by API

  const confirmedCount = registrations.filter(r => r.order.status === 'confirmed').length;
  const pendingCount = registrations.filter(r => 
    r.order.status === 'pending_payment' || r.order.status === 'payment_submitted'
  ).length;
  const cancelledCount = registrations.filter(r => r.order.status.includes('cancelled')).length;

  const handleExportCSV = () => {
    if (filteredRegistrations.length === 0) {
      alert('沒有可匯出的資料');
      return;
    }

    const headers = [
      '課程名稱',
      '課程日期',
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
      reg.session.title_zh,
      new Date(reg.session.date).toLocaleDateString('zh-TW'),
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
      filename: `所有報名名單_${new Date().toLocaleDateString('zh-TW')}`,
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">總報名人數</div>
            <div className="text-3xl font-bold text-gray-900">{registrations.length}</div>
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
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                訂單狀態
              </label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setStatusFilter('confirmed')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === 'confirmed'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  已確認
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === 'pending'
                      ? 'bg-yellow-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  待處理
                </button>
                <button
                  onClick={() => setStatusFilter('cancelled')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    statusFilter === 'cancelled'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  已取消
                </button>
              </div>
            </div>

            {/* Session Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                篩選課程
              </label>
              <select
                value={sessionFilter}
                onChange={(e) => setSessionFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">全部課程</option>
                {sessions.map(session => (
                  <option key={session.id} value={session.id}>
                    {session.title_zh}
                  </option>
                ))}
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                搜尋
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋學員、家長、訂單編號..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="text-sm text-gray-600">
              顯示 {filteredRegistrations.length} 筆報名資料
            </div>
            {filteredRegistrations.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                📥 匯出 CSV
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    課程
                  </th>
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
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      目前沒有報名資料
                    </td>
                  </tr>
                ) : (
                  filteredRegistrations.map((reg) => (
                    <tr key={reg.orderItem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{reg.session.title_zh}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(reg.session.date).toLocaleDateString('zh-TW')} {reg.session.time}
                          </div>
                        </div>
                      </td>
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
                          href={`/admin/sessions/${reg.session.id}/registrations`}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          查看課程
                        </Link>
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
      </main>
    </div>
  );
}
