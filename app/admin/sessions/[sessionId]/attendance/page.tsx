/**
 * Session Attendance Management Page
 * 
 * 課程出席管理 - 老師確認學生出席並發放完成徽章
 */

'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui';
import { getBadgeBySessionIdAndType } from '@/lib/config/badges';
import { AdminNav } from '@/components/admin/AdminNav';
import { useAdminAuth } from '@/lib/hooks/useAdminAuth';
import { LoadingSpinner } from '@/components/ui/Loading';

// Mock data - 實際應從後端獲取
const mockAttendees = [
  {
    id: 'child-1',
    name: '小明',
    age: 8,
    parent_name: '王媽媽',
    order_number: 'ORD-2026-001',
    checked_in: false,
    registration_badge_earned: true,
    completion_badge_earned: false,
  },
  {
    id: 'child-2',
    name: '小華',
    age: 10,
    parent_name: '李爸爸',
    order_number: 'ORD-2026-002',
    checked_in: true,
    registration_badge_earned: true,
    completion_badge_earned: true,
  },
  {
    id: 'child-3',
    name: '小美',
    age: 9,
    parent_name: '陳媽媽',
    order_number: 'ORD-2026-003',
    checked_in: false,
    registration_badge_earned: true,
    completion_badge_earned: false,
  },
];

export default function SessionAttendancePage() {
  const { isChecking, isAuthorized } = useAdminAuth();
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  
  const [attendees, setAttendees] = useState(mockAttendees);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // 獲取課程對應的徽章
  const registrationBadge = getBadgeBySessionIdAndType(sessionId, 'registration');
  const completionBadge = getBadgeBySessionIdAndType(sessionId, 'completion');

  const handleCheckIn = (childId: string) => {
    setAttendees(prev => prev.map(attendee => 
      attendee.id === childId 
        ? { ...attendee, checked_in: true, completion_badge_earned: true }
        : attendee
    ));
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleUndoCheckIn = (childId: string) => {
    setAttendees(prev => prev.map(attendee => 
      attendee.id === childId 
        ? { ...attendee, checked_in: false, completion_badge_earned: false }
        : attendee
    ));
  };

  const checkedInCount = attendees.filter(a => a.checked_in).length;
  const totalCount = attendees.length;

  if (isChecking) {
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-blue-600 hover:text-blue-700 mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            課程出席管理
          </h1>
          <p className="text-gray-600">
            確認學生出席並發放完成徽章
          </p>
        </div>

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-green-700 font-medium">已確認出席並發放完成徽章！</span>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
            <div className="text-sm text-gray-600">總報名人數</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{checkedInCount}</div>
            <div className="text-sm text-gray-600">已出席</div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="text-3xl font-bold text-gray-600">{totalCount - checkedInCount}</div>
            <div className="text-sm text-gray-600">未出席</div>
          </div>
        </div>

        {/* Badge Info */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">本課程徽章</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registrationBadge && (
              <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
                <img src={registrationBadge.image_url} alt={registrationBadge.name_zh} className="w-16 h-16 object-contain" />
                <div>
                  <div className="text-gray-900 font-medium">{registrationBadge.name_zh}</div>
                  <div className="text-sm text-gray-600">報名徽章（已自動發放）</div>
                </div>
              </div>
            )}
            {completionBadge && (
              <div className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 border-2 border-green-200">
                <img src={completionBadge.image_url} alt={completionBadge.name_zh} className="w-16 h-16 object-contain" />
                <div>
                  <div className="text-green-700 font-medium">{completionBadge.name_zh}</div>
                  <div className="text-sm text-gray-600">完成徽章（需確認出席）</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Attendee List */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">學生姓名</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">年齡</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">家長</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">訂單編號</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">報名徽章</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">完成徽章</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attendees.map((attendee) => (
                  <tr key={attendee.id} className={attendee.checked_in ? 'bg-green-50' : ''}>
                    <td className="px-6 py-4 text-gray-900 font-medium">{attendee.name}</td>
                    <td className="px-6 py-4 text-gray-600">{attendee.age} 歲</td>
                    <td className="px-6 py-4 text-gray-600">{attendee.parent_name}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{attendee.order_number}</td>
                    <td className="px-6 py-4 text-center">
                      {attendee.registration_badge_earned ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {attendee.completion_badge_earned ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {!attendee.checked_in ? (
                        <Button
                          size="sm"
                          onClick={() => handleCheckIn(attendee.id)}
                        >
                          確認出席
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUndoCheckIn(attendee.id)}
                        >
                          取消出席
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
