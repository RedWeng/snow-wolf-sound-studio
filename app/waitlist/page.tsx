/**
 * Waitlist Page
 * 
 * Displays all waitlist entries for the logged-in parent.
 * Shows queue position and allows leaving waitlist.
 * 
 * Requirements: 9.2
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { mockWaitlistEntries } from '@/lib/mock-data/waitlist';
import { mockSessions } from '@/lib/mock-data/sessions';
import { LoadingSpinner } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';

const content = {
  zh: {
    title: '候補名單',
    myWaitlist: '我的候補',
    noWaitlist: '目前沒有候補項目',
    browseSession: '瀏覽課程',
    sessionTitle: '課程名稱',
    childName: '孩子姓名',
    queuePosition: '候補順位',
    status: '狀態',
    joinedDate: '加入日期',
    leaveWaitlist: '離開候補',
    confirmLeave: '確定要離開候補名單嗎？',
    waiting: '候補中',
    promoted: '已遞補',
    cancelled: '已取消',
    position: '第',
    positionSuffix: '位',
    backToDashboard: '返回儀表板',
    promotedNotice: '恭喜！您已成功遞補此課程',
    viewOrder: '查看訂單',
  },
  en: {
    title: 'Waitlist',
    myWaitlist: 'My Waitlist',
    noWaitlist: 'No waitlist entries',
    browseSession: 'Browse Sessions',
    sessionTitle: 'Session',
    childName: 'Child',
    queuePosition: 'Position',
    status: 'Status',
    joinedDate: 'Joined',
    leaveWaitlist: 'Leave Waitlist',
    confirmLeave: 'Are you sure you want to leave the waitlist?',
    waiting: 'Waiting',
    promoted: 'Promoted',
    cancelled: 'Cancelled',
    position: '#',
    positionSuffix: '',
    backToDashboard: 'Back to Dashboard',
    promotedNotice: 'Congratulations! You have been promoted for this session',
    viewOrder: 'View Order',
  },
};

const statusColors = {
  waiting: 'bg-semantic-warning/10 text-semantic-warning border-semantic-warning/20',
  promoted: 'bg-semantic-success/10 text-semantic-success border-semantic-success/20',
  cancelled: 'bg-semantic-error/10 text-semantic-error border-semantic-error/20',
};

export default function WaitlistPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [waitlistEntries, setWaitlistEntries] = useState<any[]>([]);

  const t = content[language];

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/waitlist');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      fetchWaitlistEntries();
    }
  }, [user]);

  const fetchWaitlistEntries = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/waitlist?parentId=${user.id}`);
      const result = await response.json();
      
      if (result.success && result.entries) {
        setWaitlistEntries(result.entries);
      } else {
        // Fallback to mock data for development
        const entries = mockWaitlistEntries.filter((e: any) => e.parent_id === user.id);
        setWaitlistEntries(entries);
      }
    } catch (error) {
      console.error('Failed to fetch waitlist:', error);
      // Fallback to mock data
      const entries = mockWaitlistEntries.filter((e: any) => e.parent_id === user.id);
      setWaitlistEntries(entries);
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const handleLeaveWaitlist = async (entryId: string) => {
    if (!confirm(t.confirmLeave)) return;

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'remove',
          entryId,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setWaitlistEntries(prev => prev.filter(e => e.id !== entryId));
      } else {
        alert(language === 'zh' ? '操作失敗，請稍後再試' : 'Operation failed, please try again');
      }
    } catch (error) {
      console.error('Failed to leave waitlist:', error);
      alert(language === 'zh' ? '操作失敗，請稍後再試' : 'Operation failed, please try again');
    }
  };

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
                ← {t.backToDashboard}
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
        <h2 className="text-2xl font-heading text-brand-navy mb-6">{t.myWaitlist}</h2>

        {waitlistEntries.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-brand-frost">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl text-brand-midnight/60 mb-6">{t.noWaitlist}</p>
            <Button
              variant="primary"
              onClick={() => router.push('/sessions')}
            >
              {t.browseSession}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {waitlistEntries.map((entry: any) => {
              const session = mockSessions.find((s: any) => s.id === entry.session_id);
              return (
                <div
                  key={entry.id}
                  className="bg-white rounded-xl p-6 border border-brand-frost hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-brand-navy">
                          {language === 'zh' ? session?.title_zh : session?.title_en}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${statusColors[entry.status as keyof typeof statusColors]}`}>
                          {t[entry.status as keyof typeof t]}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <div className="text-brand-midnight/60 mb-1">{t.queuePosition}</div>
                          <div className="font-semibold text-brand-navy">
                            {t.position}{entry.position}{t.positionSuffix}
                          </div>
                        </div>
                        <div>
                          <div className="text-brand-midnight/60 mb-1">{t.childName}</div>
                          <div className="font-semibold text-brand-navy">{entry.child_id}</div>
                        </div>
                        <div>
                          <div className="text-brand-midnight/60 mb-1">{t.joinedDate}</div>
                          <div className="font-semibold text-brand-navy">
                            {new Date(entry.created_at).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')}
                          </div>
                        </div>
                        <div>
                          <div className="text-brand-midnight/60 mb-1">{t.sessionTitle}</div>
                          <div className="font-semibold text-brand-navy">
                            {new Date(session?.date || '').toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')}
                          </div>
                        </div>
                      </div>

                      {entry.status === 'promoted' && (
                        <div className="mt-4 p-3 bg-semantic-success/10 border border-semantic-success/20 rounded-lg">
                          <p className="text-semantic-success font-semibold">
                            ✓ {t.promotedNotice}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {entry.status === 'waiting' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleLeaveWaitlist(entry.id)}
                        >
                          {t.leaveWaitlist}
                        </Button>
                      )}
                      {entry.status === 'promoted' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => router.push('/orders')}
                        >
                          {t.viewOrder}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      </div>
    </div>
  );
}
