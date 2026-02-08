/**
 * Admin Waitlist Management Page
 * 
 * View and manage waitlist entries
 * Requirements: 12.3
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockSessions } from '@/lib/mock-data/sessions';
import { mockWaitlistEntries } from '@/lib/mock-data/waitlist';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/ui/Loading';

interface WaitlistEntry {
  id: string;
  sessionId: string;
  sessionTitle: string;
  sessionDate: string;
  parentName: string;
  childName: string;
  childAge: number;
  status: 'waiting' | 'promoted' | 'cancelled';
  queuePosition: number;
  createdAt: string;
}

export default function AdminWaitlistPage() {
  const { isChecking, isAuthorized } = useAdminAuth();
  const [waitlistEntries, setWaitlistEntries] = useState<WaitlistEntry[]>([]);
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWaitlistEntries();
  }, []);

  const fetchWaitlistEntries = async () => {
    try {
      // In production, fetch all waitlist entries from API
      // For now, use mock data
      const entries = mockWaitlistEntries.map((entry, index) => {
        const session = mockSessions.find(s => s.id === entry.session_id);
        return {
          id: entry.id,
          sessionId: entry.session_id,
          sessionTitle: session?.title_zh || '未知課程',
          sessionDate: session?.date || '',
          parentName: '家長' + (index + 1),
          childName: '孩子' + (index + 1),
          childAge: 6 + (index % 6),
          status: entry.status as 'waiting' | 'promoted' | 'cancelled',
          queuePosition: index + 1,
          createdAt: entry.created_at,
        };
      });
      setWaitlistEntries(entries);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch waitlist:', error);
      setLoading(false);
    }
  };

  const filteredEntries = waitlistEntries.filter(entry => {
    if (selectedSession === 'all') return true;
    return entry.sessionId === selectedSession;
  });

  // Group by session
  const entriesBySession = filteredEntries.reduce((acc, entry) => {
    if (!acc[entry.sessionId]) {
      acc[entry.sessionId] = {
        sessionTitle: entry.sessionTitle,
        sessionDate: entry.sessionDate,
        entries: [],
      };
    }
    acc[entry.sessionId].entries.push(entry);
    return acc;
  }, {} as Record<string, { sessionTitle: string; sessionDate: string; entries: WaitlistEntry[] }>);

  const handlePromote = async (entryId: string) => {
    if (!confirm('確定要將此候補者升級為正式報名嗎？')) {
      return;
    }

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'promote',
          entryId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setWaitlistEntries(entries =>
          entries.map(entry =>
            entry.id === entryId
              ? { ...entry, status: 'promoted' as const }
              : entry
          )
        );
        alert('已成功升級！系統將發送通知給家長。');
      } else {
        alert('升級失敗：' + (result.error || '請稍後再試'));
      }
    } catch (error) {
      console.error('Failed to promote:', error);
      alert('升級失敗，請稍後再試。');
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
        {/* Session Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            篩選課程
          </label>
          <select
            value={selectedSession}
            onChange={(e) => setSelectedSession(e.target.value)}
            className="w-full md:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">全部課程 ({waitlistEntries.length})</option>
            {mockSessions.map(session => {
              const count = waitlistEntries.filter(e => e.sessionId === session.id).length;
              if (count === 0) return null;
              return (
                <option key={session.id} value={session.id}>
                  {session.title_zh} ({count})
                </option>
              );
            })}
          </select>
        </div>

        {/* Waitlist by Session */}
        {Object.keys(entriesBySession).length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center text-gray-500">
            目前沒有候補名單
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(entriesBySession).map(([sessionId, { sessionTitle, sessionDate, entries }]) => (
              <div key={sessionId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Session Header */}
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">{sessionTitle}</h2>
                      <p className="text-sm text-gray-600">
                        {new Date(sessionDate).toLocaleDateString('zh-TW')} • 候補人數: {entries.length}
                      </p>
                    </div>
                    <Link
                      href={`/admin/sessions/${sessionId}`}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      查看課程 →
                    </Link>
                  </div>
                </div>

                {/* Waitlist Entries */}
                <div className="divide-y divide-gray-200">
                  {entries.map((entry) => (
                    <div key={entry.id} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {/* Queue Position */}
                          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-lg font-bold text-blue-600">
                              #{entry.queuePosition}
                            </span>
                          </div>

                          {/* Info */}
                          <div>
                            <div className="font-medium text-gray-900">
                              {entry.parentName}
                            </div>
                            <div className="text-sm text-gray-600">
                              孩子: {entry.childName} ({entry.childAge} 歲)
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              加入時間: {new Date(entry.createdAt).toLocaleString('zh-TW')}
                            </div>
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            entry.status === 'waiting'
                              ? 'bg-yellow-100 text-yellow-800'
                              : entry.status === 'promoted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {entry.status === 'waiting' ? '等待中' :
                             entry.status === 'promoted' ? '已升級' : '已取消'}
                          </span>

                          {entry.status === 'waiting' && (
                            <button
                              onClick={() => handlePromote(entry.id)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              升級為正式報名
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
