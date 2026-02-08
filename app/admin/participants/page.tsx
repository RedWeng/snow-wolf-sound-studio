/**
 * Admin Participants Management Page
 * 
 * View and manage all participants (children) and their history
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { exportToCSV } from '@/lib/utils/csv-export';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/ui/Loading';
import type { Child, Session } from '@/lib/types/database';

interface ParticipantWithHistory {
  child: Child;
  sessionsAttended: Array<{
    session: Session;
    attendedDate: string;
  }>;
  totalSessions: number;
}

export default function AdminParticipantsPage() {
  const { isChecking, isAuthorized } = useAdminAuth();
  const [participants, setParticipants] = useState<ParticipantWithHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [ageFilter, setAgeFilter] = useState<string>('all');

  useEffect(() => {
    loadParticipants();
  }, []);

  const loadParticipants = async () => {
    try {
      const response = await fetch('/api/admin/participants');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to load participants');
      }

      // Transform API data to match component interface
      const participantData: ParticipantWithHistory[] = data.participants.map((p: any) => ({
        child: p.child,
        sessionsAttended: (p.sessionsAttended || []).map((s: any) => ({
          session: {
            id: s.session_id,
            title_zh: s.session_title_zh,
            date: s.session_date,
            time: s.session_time,
          },
          attendedDate: s.attended_date,
        })),
        totalSessions: p.totalSessions,
      }));

      setParticipants(participantData);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load participants:', error);
      alert('載入參加者資料失敗，請重新整理頁面');
      setLoading(false);
    }
  };

  const filteredParticipants = participants.filter(p => {
    // Age filter
    if (ageFilter !== 'all') {
      const age = p.child.age;
      if (ageFilter === '5-7' && (age < 5 || age > 7)) return false;
      if (ageFilter === '8-10' && (age < 8 || age > 10)) return false;
      if (ageFilter === '11+' && age < 11) return false;
    }

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        p.child.name.toLowerCase().includes(query) ||
        p.child.notes?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  const totalParticipants = participants.length;
  const activeParticipants = participants.filter(p => p.totalSessions > 0).length;
  const totalSessionsAttended = participants.reduce((sum, p) => sum + p.totalSessions, 0);
  const avgSessionsPerChild = totalParticipants > 0 ? (totalSessionsAttended / totalParticipants).toFixed(1) : 0;

  const handleExportCSV = () => {
    if (filteredParticipants.length === 0) {
      alert('沒有可匯出的資料');
      return;
    }

    const headers = [
      '學員姓名',
      '年齡',
      '參加課程數',
      '最近參加課程',
      '最近參加日期',
      '備註',
    ];

    const rows = filteredParticipants.map(p => {
      const latestSession = p.sessionsAttended.length > 0 
        ? p.sessionsAttended[p.sessionsAttended.length - 1]
        : null;

      return [
        p.child.name,
        p.child.age,
        p.totalSessions,
        latestSession?.session.title_zh || '-',
        latestSession ? new Date(latestSession.attendedDate).toLocaleDateString('zh-TW') : '-',
        p.child.notes || '',
      ];
    });

    exportToCSV({
      filename: `參加者名單_${new Date().toLocaleDateString('zh-TW')}`,
      headers,
      rows,
    });
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
            <div className="text-sm text-gray-600 mb-1">總參加者</div>
            <div className="text-3xl font-bold text-gray-900">{totalParticipants}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">活躍參加者</div>
            <div className="text-3xl font-bold text-green-600">{activeParticipants}</div>
            <div className="text-xs text-gray-500 mt-1">至少參加過一次</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">總參加次數</div>
            <div className="text-3xl font-bold text-blue-600">{totalSessionsAttended}</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-sm text-gray-600 mb-1">平均參加次數</div>
            <div className="text-3xl font-bold text-purple-600">{avgSessionsPerChild}</div>
            <div className="text-xs text-gray-500 mt-1">每位學員</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Age Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                年齡篩選
              </label>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setAgeFilter('all')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    ageFilter === 'all'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  全部
                </button>
                <button
                  onClick={() => setAgeFilter('5-7')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    ageFilter === '5-7'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  5-7 歲
                </button>
                <button
                  onClick={() => setAgeFilter('8-10')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    ageFilter === '8-10'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  8-10 歲
                </button>
                <button
                  onClick={() => setAgeFilter('11+')}
                  className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                    ageFilter === '11+'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  11 歲以上
                </button>
              </div>
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
                placeholder="搜尋學員姓名..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Participants List */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="text-sm text-gray-600">
              顯示 {filteredParticipants.length} 位參加者
            </div>
            {filteredParticipants.length > 0 && (
              <button
                onClick={handleExportCSV}
                className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
              >
                📥 匯出 CSV
              </button>
            )}
          </div>

          <div className="divide-y divide-gray-200">
            {filteredParticipants.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                目前沒有參加者資料
              </div>
            ) : (
              filteredParticipants.map((participant) => (
                <div key={participant.child.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-gray-900">
                          {participant.child.name}
                        </h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                          {participant.child.age} 歲
                        </span>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                          參加 {participant.totalSessions} 次
                        </span>
                      </div>

                      {participant.child.notes && (
                        <p className="text-sm text-gray-600 mb-3">
                          備註: {participant.child.notes}
                        </p>
                      )}

                      {participant.sessionsAttended.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">
                            參加歷史:
                          </h4>
                          <div className="space-y-1">
                            {participant.sessionsAttended.slice(0, 3).map((attended, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                <Link
                                  href={`/admin/sessions/${attended.session.id}/registrations`}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  {attended.session.title_zh}
                                </Link>
                                <span className="text-gray-400">•</span>
                                <span>{new Date(attended.attendedDate).toLocaleDateString('zh-TW')}</span>
                              </div>
                            ))}
                            {participant.sessionsAttended.length > 3 && (
                              <p className="text-sm text-gray-500 ml-4">
                                還有 {participant.sessionsAttended.length - 3} 次參加記錄...
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {participant.sessionsAttended.length === 0 && (
                        <p className="text-sm text-gray-500">尚未參加任何課程</p>
                      )}
                    </div>

                    <div className="ml-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">
                          {participant.totalSessions}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
