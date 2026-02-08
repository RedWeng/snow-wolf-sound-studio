/**
 * Parent Dashboard Page
 * 
 * Main dashboard for parents showing upcoming sessions, pending payments,
 * and quick actions.
 * 
 * Requirements: 1.3, 7.5
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { mockChildren as mockChildrenData } from '@/lib/mock-data/children';
import { LoadingSpinner } from '@/components/ui/Loading';
import { Button } from '@/components/ui/Button';
import { ChildFormModal } from '@/components/profile/ChildFormModal';

interface Child {
  id: string;
  name: string;
  age: number;
  notes?: string;
}

const content = {
  zh: {
    welcome: '歡迎回來',
    upcomingSessions: '即將到來的課程',
    pendingPayments: '待付款訂單',
    myChildren: '我的孩子',
    quickActions: '快速操作',
    browseSessions: '瀏覽課程',
    viewOrders: '查看訂單',
    manageChildren: '管理孩子',
    noUpcoming: '目前沒有即將到來的課程',
    noPending: '沒有待付款訂單',
    noChildren: '尚未新增孩子資料',
    addChild: '新增孩子',
    editChild: '編輯',
    deleteChild: '刪除',
    confirmDelete: '確定要刪除這個孩子的資料嗎？',
    maxChildren: '最多只能新增 4 位孩子',
    paymentDeadline: '付款期限',
    daysLeft: '天',
    viewDetails: '查看詳情',
    payNow: '立即付款',
    years: '歲',
    sessionDate: '課程日期',
    orderNumber: '訂單編號',
    amount: '金額',
  },
  en: {
    welcome: 'Welcome Back',
    upcomingSessions: 'Upcoming Sessions',
    pendingPayments: 'Pending Payments',
    myChildren: 'My Children',
    quickActions: 'Quick Actions',
    browseSessions: 'Browse Sessions',
    viewOrders: 'View Orders',
    manageChildren: 'Manage Children',
    noUpcoming: 'No upcoming sessions',
    noPending: 'No pending payments',
    noChildren: 'No children added yet',
    addChild: 'Add Child',
    editChild: 'Edit',
    deleteChild: 'Delete',
    confirmDelete: 'Are you sure you want to delete this child?',
    maxChildren: 'Maximum 4 children allowed',
    paymentDeadline: 'Payment Deadline',
    daysLeft: 'days',
    viewDetails: 'View Details',
    payNow: 'Pay Now',
    years: 'years old',
    sessionDate: 'Session Date',
    orderNumber: 'Order Number',
    amount: 'Amount',
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [children, setChildren] = useState<Child[]>([]);
  const [isChildModalOpen, setIsChildModalOpen] = useState(false);
  const [editingChild, setEditingChild] = useState<Child | null>(null);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  const t = content[language];

  // Load dashboard data from API
  useEffect(() => {
    if (user?.id) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      const response = await fetch(`/api/dashboard/stats?userId=${user?.id}`);
      const data = await response.json();
      
      if (data.success) {
        setDashboardData(data);
      } else {
        console.error('Failed to load dashboard data:', data.error);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoadingData(false);
    }
  };

  // Load children from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('children');
    if (stored) {
      setChildren(JSON.parse(stored));
    } else {
      // Initialize with mock data
      const userChildren = mockChildrenData.filter((c: any) => c.parent_id === user?.id);
      setChildren(userChildren.map((c: any) => ({
        id: c.id,
        name: c.name,
        age: c.age,
        notes: c.notes || undefined,
      })));
    }
  }, [user]);

  // Save children to localStorage
  useEffect(() => {
    localStorage.setItem('children', JSON.stringify(children));
  }, [children]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?redirect=/dashboard');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Use dashboard data from API
  const upcomingSessions = dashboardData?.upcomingSessions || [];
  const pendingOrders = dashboardData?.pendingPayments || [];

  const handleAddChild = () => {
    if (children.length >= 4) {
      alert(t.maxChildren);
      return;
    }
    setEditingChild(null);
    setIsChildModalOpen(true);
  };

  const handleEditChild = (child: Child) => {
    setEditingChild(child);
    setIsChildModalOpen(true);
  };

  const handleDeleteChild = (childId: string) => {
    if (confirm(t.confirmDelete)) {
      setChildren(prev => prev.filter(c => c.id !== childId));
    }
  };

  const handleSaveChild = (childData: Omit<Child, 'id'> | Child) => {
    if ('id' in childData) {
      // Edit existing
      setChildren(prev => prev.map(c => c.id === childData.id ? childData : c));
    } else {
      // Add new
      const newChild: Child = {
        ...childData,
        id: `child-${Date.now()}`,
      };
      setChildren(prev => [...prev, newChild]);
    }
  };

  const getDaysUntilDeadline = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
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
            <div>
              <h1 className="text-3xl font-heading text-brand-navy">
                {t.welcome}, {user?.full_name || user?.email}!
              </h1>
            </div>
            <button
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="px-4 py-2 border-2 border-brand-frost rounded-lg text-brand-navy hover:bg-brand-frost transition-colors"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <section className="mb-8">
          <h2 className="text-2xl font-heading text-brand-navy mb-4">{t.quickActions}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="primary"
              onClick={() => router.push('/sessions')}
              className="w-full"
            >
              {t.browseSessions}
            </Button>
            <Button
              variant="secondary"
              onClick={() => router.push('/orders')}
              className="w-full"
            >
              {t.viewOrders}
            </Button>
            <Button
              variant="secondary"
              onClick={handleAddChild}
              className="w-full"
              disabled={children.length >= 4}
            >
              {t.addChild}
            </Button>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Sessions */}
          <section>
            <h2 className="text-2xl font-heading text-brand-navy mb-4">{t.upcomingSessions}</h2>
            <div className="space-y-4">
              {upcomingSessions.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-brand-frost">
                  <p className="text-brand-midnight/60">{t.noUpcoming}</p>
                </div>
              ) : (
                upcomingSessions.map((item: any, index: number) => (
                  <div key={index} className="bg-white rounded-xl p-6 border border-brand-frost hover:shadow-lg transition-shadow">
                    <h3 className="font-heading text-lg text-brand-navy mb-2">
                      {language === 'zh' ? item.title_zh : item.title_en}
                    </h3>
                    <div className="space-y-2 text-sm text-brand-midnight/70">
                      <div>📅 {new Date(item.date).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')}</div>
                      <div>⏰ {item.time}</div>
                      <div>👤 {item.child_name} ({item.child_age} {t.years})</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Pending Payments */}
          <section>
            <h2 className="text-2xl font-heading text-brand-navy mb-4">{t.pendingPayments}</h2>
            <div className="space-y-4">
              {pendingOrders.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center border border-brand-frost">
                  <p className="text-brand-midnight/60">{t.noPending}</p>
                </div>
              ) : (
                pendingOrders.map((order: any) => {
                  const daysLeft = getDaysUntilDeadline(order.payment_deadline);
                  return (
                    <div key={order.id} className="bg-white rounded-xl p-6 border border-brand-frost hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="text-sm text-brand-midnight/60 mb-1">{t.orderNumber}</div>
                          <div className="font-semibold text-brand-navy">{order.order_number}</div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          daysLeft <= 2 ? 'bg-semantic-error/10 text-semantic-error' : 'bg-semantic-warning/10 text-semantic-warning'
                        }`}>
                          {daysLeft} {t.daysLeft}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-brand-navy mb-4">
                        NT${(order.final_amount || order.total_amount).toLocaleString()}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => router.push(`/orders/${order.order_number}`)}
                          className="flex-1"
                        >
                          {t.viewDetails}
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => router.push(`/payment-proof/${order.order_number}`)}
                          className="flex-1"
                        >
                          {t.payNow}
                        </Button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        </div>

        {/* My Children */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-heading text-brand-navy">{t.myChildren}</h2>
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddChild}
              disabled={children.length >= 4}
            >
              {t.addChild}
            </Button>
          </div>
          
          {children.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-brand-frost">
              <p className="text-brand-midnight/60 mb-4">{t.noChildren}</p>
              <Button variant="primary" onClick={handleAddChild}>
                {t.addChild}
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {children.map(child => (
                <div key={child.id} className="bg-white rounded-xl p-6 border border-brand-frost hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-accent-aurora/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👤</span>
                    </div>
                  </div>
                  <h3 className="font-heading text-lg text-brand-navy mb-1">{child.name}</h3>
                  <p className="text-sm text-brand-midnight/70 mb-3">{child.age} {t.years}</p>
                  {child.notes && (
                    <p className="text-xs text-brand-midnight/60 mb-4 line-clamp-2">{child.notes}</p>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditChild(child)}
                      className="flex-1 px-3 py-2 text-sm border-2 border-brand-frost text-brand-navy rounded-lg hover:bg-brand-frost transition-colors"
                    >
                      {t.editChild}
                    </button>
                    <button
                      onClick={() => handleDeleteChild(child.id)}
                      className="flex-1 px-3 py-2 text-sm border-2 border-semantic-error/20 text-semantic-error rounded-lg hover:bg-semantic-error/10 transition-colors"
                    >
                      {t.deleteChild}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Child Form Modal */}
      <ChildFormModal
        isOpen={isChildModalOpen}
        onClose={() => {
          setIsChildModalOpen(false);
          setEditingChild(null);
        }}
        onSave={handleSaveChild}
        child={editingChild}
        language={language}
      />
      </div>
    </div>
  );
}
