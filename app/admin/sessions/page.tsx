/**
 * Admin Sessions Management Page
 * 
 * View and manage all sessions
 * Requirements: 11.2, 11.3
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockSessions } from '@/lib/mock-data/sessions';
import type { Session } from '@/lib/types/database';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { AdminNav } from '@/components/admin/AdminNav';

export default function AdminSessionsPage() {
  const { isChecking, isAuthorized } = useAdminAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'cancelled' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthorized) {
      loadSessions();
    }
  }, [isAuthorized]);

  // 檢查中顯示載入畫面
  if (isChecking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">驗證中...</p>
        </div>
      </div>
    );
  }

  // 未授權不顯示內容
  if (!isAuthorized) {
    return null;
  }

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      
      if (!response.ok) {
        throw new Error('無法載入課程列表');
      }

      const data = await response.json();
      setSessions(data.sessions || []);
    } catch (err) {
      console.error('Error loading sessions:', err);
      // Fallback to mock data if API fails
      setSessions(mockSessions);
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicate = async (sessionId: string) => {
    if (!confirm('確定要複製這個課程嗎？')) return;

    setActionLoading(sessionId);
    try {
      const response = await fetch(`/api/sessions/${sessionId}/duplicate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('複製課程失敗');
      }

      // Reload sessions
      await loadSessions();
      alert('課程複製成功！');
    } catch (err) {
      console.error('Error duplicating session:', err);
      alert(err instanceof Error ? err.message : '複製課程時發生錯誤');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (sessionId: string) => {
    if (!confirm('確定要刪除這個課程嗎？此操作無法復原。')) return;

    setActionLoading(sessionId);
    try {
      const response = await fetch(`/api/sessions/${sessionId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('刪除課程失敗');
      }

      // Reload sessions
      await loadSessions();
      alert('課程已刪除');
    } catch (err) {
      console.error('Error deleting session:', err);
      alert(err instanceof Error ? err.message : '刪除課程時發生錯誤');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredSessions = sessions.filter(session => {
    // Filter by status
    if (filter !== 'all' && session.status !== filter) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        session.title_zh.toLowerCase().includes(query) ||
        session.title_en.toLowerCase().includes(query) ||
        session.theme_zh.toLowerCase().includes(query) ||
        session.theme_en.toLowerCase().includes(query)
      );
    }

    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">載入中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Navigation */}
      <AdminNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">課程管理</h1>
          <p className="text-gray-600 mt-1">管理所有活動課程</p>
        </div>
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                全部 ({sessions.length})
              </button>
              <button
                onClick={() => setFilter('active')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'active'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                進行中 ({sessions.filter(s => s.status === 'active').length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'completed'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                已完成 ({sessions.filter(s => s.status === 'completed').length})
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === 'cancelled'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                已取消 ({sessions.filter(s => s.status === 'cancelled').length})
              </button>
            </div>

            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜尋課程標題或主題..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    課程資訊
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    日期時間
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    容量
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    價格
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
                {filteredSessions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      {searchQuery ? '找不到符合的課程' : '目前沒有課程'}
                    </td>
                  </tr>
                ) : (
                  filteredSessions.map((session) => (
                    <tr key={session.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium text-gray-900">{session.title_zh}</div>
                          <div className="text-sm text-gray-500">{session.theme_zh}</div>
                          <div className="text-xs text-gray-400 mt-1">
                            {session.age_min && session.age_max && (
                              <span>{session.age_min}-{session.age_max} 歲</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(session.date).toLocaleDateString('zh-TW')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.time} ({session.duration_minutes} 分鐘)
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {session.capacity} 人
                        </div>
                        <div className="text-xs text-gray-500">
                          緩衝: {session.hidden_buffer}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          NT${session.price.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          session.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : session.status === 'completed'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {session.status === 'active' ? '進行中' :
                           session.status === 'completed' ? '已完成' : '已取消'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          href={`/admin/sessions/${session.id}/edit`}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          編輯
                        </Link>
                        <button
                          onClick={() => handleDuplicate(session.id)}
                          disabled={actionLoading === session.id}
                          className="text-green-600 hover:text-green-900 mr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading === session.id ? '處理中...' : '複製'}
                        </button>
                        <button
                          onClick={() => handleDelete(session.id)}
                          disabled={actionLoading === session.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          刪除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        {filteredSessions.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            顯示 {filteredSessions.length} 個課程
          </div>
        )}
      </main>
    </div>
  );
}
