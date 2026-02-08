/**
 * Admin Dashboard Page
 * 
 * Overview of system metrics and recent activity
 * Requirements: 11.1, 13.2
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockSessions } from '@/lib/mock-data/sessions';
import { mockOrders } from '@/lib/mock-data/orders';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/ui/Loading';

interface DashboardMetrics {
  totalSessions: number;
  activeSessions: number;
  totalOrders: number;
  pendingPayments: number;
  confirmedOrders: number;
  totalRevenue: number;
  waitlistCount: number;
}

export default function AdminDashboardPage() {
  const { isChecking, isAuthorized } = useAdminAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalSessions: 0,
    activeSessions: 0,
    totalOrders: 0,
    pendingPayments: 0,
    confirmedOrders: 0,
    totalRevenue: 0,
    waitlistCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Calculate metrics from mock data
    const activeSessions = mockSessions.filter(s => s.status === 'active').length;
    const pendingOrders = mockOrders.filter(o => o.status === 'pending_payment').length;
    const confirmedOrders = mockOrders.filter(o => o.status === 'confirmed').length;
    const totalRevenue = mockOrders
      .filter(o => o.status === 'confirmed')
      .reduce((sum, o) => sum + o.final_amount, 0);

    setMetrics({
      totalSessions: mockSessions.length,
      activeSessions,
      totalOrders: mockOrders.length,
      pendingPayments: pendingOrders,
      confirmedOrders,
      totalRevenue,
      waitlistCount: 0, // TODO: Add waitlist data
    });
    setLoading(false);
  }, []);

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
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Sessions */}
          <Link href="/admin/sessions">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">總課程數</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {metrics.totalSessions}
                  </p>
                  <p className="text-sm text-green-600 mt-1">
                    {metrics.activeSessions} 進行中
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Pending Payments */}
          <Link href="/admin/orders?filter=pending">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">待確認付款</p>
                  <p className="text-3xl font-bold text-orange-600 mt-2">
                    {metrics.pendingPayments}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    需要處理
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Confirmed Orders */}
          <Link href="/admin/orders?filter=confirmed">
            <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">已確認訂單</p>
                  <p className="text-3xl font-bold text-green-600 mt-2">
                    {metrics.confirmedOrders}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    總訂單 {metrics.totalOrders}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>

          {/* Total Revenue */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">總營收</p>
                <p className="text-3xl font-bold text-purple-600 mt-2">
                  NT${(metrics.totalRevenue / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  已確認訂單
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">最近訂單</h2>
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700">
                查看全部 →
              </Link>
            </div>
            <div className="space-y-3">
              {mockOrders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{order.order_number}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString('zh-TW')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      NT${order.final_amount.toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending_payment' ? 'bg-orange-100 text-orange-800' :
                      order.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {order.status === 'pending_payment' ? '待付款' :
                       order.status === 'confirmed' ? '已確認' : '已取消'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">即將開始的課程</h2>
              <Link href="/admin/sessions" className="text-sm text-blue-600 hover:text-blue-700">
                查看全部 →
              </Link>
            </div>
            <div className="space-y-3">
              {mockSessions
                .filter(s => s.status === 'active')
                .slice(0, 5)
                .map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{session.title_zh}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.date).toLocaleDateString('zh-TW')} {session.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">
                        {session.capacity} 人
                      </p>
                      <p className="text-xs text-gray-500">
                        {session.duration_minutes} 分鐘
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">快速操作</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/sessions/new"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">新增課程</p>
                <p className="text-sm text-gray-500">建立新的活動課程</p>
              </div>
            </Link>

            <Link
              href="/admin/orders?filter=pending"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">處理付款</p>
                <p className="text-sm text-gray-500">確認待處理的付款</p>
              </div>
            </Link>

            <Link
              href="/admin/waitlist"
              className="flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors"
            >
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">候補名單</p>
                <p className="text-sm text-gray-500">管理課程候補</p>
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
