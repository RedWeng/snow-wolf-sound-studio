/**
 * Sessions Page - Member Only
 * 
 * Immersive course selection experience
 * No prices shown until checkout
 * Select which child(ren) for each course
 */

'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { mockSessions } from '@/lib/mock-data/sessions';
import { CartSidebar } from '@/components/cart/CartSidebar';
import { CharacterRoleSelector } from '@/components/session/CharacterRoleSelector';
import { AddonSelector } from '@/components/session/AddonSelector';
import { PrivateBookingModal } from '@/components/inquiry/PrivateBookingModal';
import { useAuth } from '@/lib/context/AuthContext';
import { useCart } from '@/lib/context/CartContext';
import { Toast } from '@/components/ui/Toast';

interface Child {
  id: string;
  name: string;
  age: number;
}

interface SessionSelection {
  sessionId: string;
  childIds: string[];
}

export default function SessionsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items: cartItems, addItem, removeItem } = useCart();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [children, setChildren] = useState<Child[]>([]);
  const [selections, setSelections] = useState<SessionSelection[]>([]);
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const [hoveredSession, setHoveredSession] = useState<string | null>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});
  
  // Sessions state - will be loaded from API
  const [sessions, setSessions] = useState<typeof mockSessions>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  
  // All sessions including cancelled (for display purposes)
  const allSessions = sessions;
  
  // Modal and Sidebar states
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Role selection state - maps sessionId -> childId -> roleId
  const [sessionRoleSelections, setSessionRoleSelections] = useState<Record<string, Record<string, string | null>>>({});
  
  // Track which child is currently selecting a role
  const [activeChildForRole, setActiveChildForRole] = useState<Record<string, string | null>>({});
  
  // Addon selection state - maps sessionId -> Set of addonIds
  const [sessionAddonSelections, setSessionAddonSelections] = useState<Record<string, Set<string>>>({});
  
  // Toast notification state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'warning' | 'info' } | null>(null);
  
  // Private booking modal state
  const [isPrivateBookingModalOpen, setIsPrivateBookingModalOpen] = useState(false);

  // Load sessions from API
  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch('/api/sessions?status=all');
      
      if (!response.ok) {
        throw new Error('無法載入課程列表');
      }

      const data = await response.json();
      setSessions(data.sessions || mockSessions);
    } catch (err) {
      console.error('Error loading sessions from API, using mock data:', err);
      // Fallback to mock data if API fails
      setSessions(mockSessions);
    } finally {
      setSessionsLoading(false);
    }
  };

  // Load children from localStorage
  useEffect(() => {
    const storedChildren = localStorage.getItem('children');
    if (storedChildren) {
      setChildren(JSON.parse(storedChildren));
    }
  }, []);

  const content = {
    zh: {
      heroTitle: 'Recording Party · Animation Edition',
      heroSubtitle: '選定孩子的冒險旅程',
      title: '探索聲音冒險',
      subtitle: '為孩子選擇最適合的課程',
      selectChild: '選擇參加的孩子',
      register: '選擇孩子',
      completeRegistration: '完成報名',
      duration: '分鐘',
      ages: '歲',
      ageRange: '適合',
      sessionsSelected: '已選擇',
      courses: '堂課程',
      childrenCount: '位孩子',
      noChildren: '尚未新增孩子',
      addChildren: '請先新增孩子資料',
    },
    en: {
      heroTitle: 'Recording Party · Animation Edition',
      heroSubtitle: 'Choose Your Child\'s Adventure Journey',
      title: 'Explore Sound Adventures',
      subtitle: 'Choose the perfect course for your child',
      selectChild: 'Select participating children',
      register: 'Select Children',
      completeRegistration: 'Complete Registration',
      duration: 'min',
      ages: 'years',
      ageRange: 'Ages',
      sessionsSelected: 'Selected',
      courses: 'courses',
      childrenCount: 'children',
      noChildren: 'No children added',
      addChildren: 'Please add children first',
    },
  };

  const t = content[language];

  const handleSessionClick = (sessionId: string) => {
    if (expandedSession === sessionId) {
      setExpandedSession(null);
    } else {
      setExpandedSession(sessionId);
    }
  };

  const handleChildToggle = (sessionId: string, childId: string) => {
    // Get session to check capacity
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Get child to check age
    const child = children.find(c => c.id === childId);
    if (!child) return;

    // Check age mismatch and show friendly warning
    if (session.age_min && session.age_max) {
      const childAge = child.age;
      const isYoungKidsSession = session.age_max <= 7; // 5-7歲小小孩場
      const isOlderKidsSession = session.age_min >= 8; // 8-12歲大小孩場
      
      // If child is too young for older kids session
      if (isOlderKidsSession && childAge < 8) {
        setToast({
          message: language === 'zh'
            ? `貼心提醒：此場次建議 ${session.age_min}-${session.age_max} 歲孩子參加，您選擇的孩子年齡為 ${childAge} 歲，建議選擇小小孩場次。`
            : `Friendly Reminder: This session is recommended for ages ${session.age_min}-${session.age_max}. Your child is ${childAge} years old. We suggest selecting a younger kids session.`,
          type: 'warning'
        });
        // Still allow selection but warn
      }
      
      // If child is too old for young kids session
      if (isYoungKidsSession && childAge >= 8) {
        setToast({
          message: language === 'zh'
            ? `貼心提醒：此場次建議 ${session.age_min}-${session.age_max} 歲孩子參加，您選擇的孩子年齡為 ${childAge} 歲，建議選擇大小孩場次。`
            : `Friendly Reminder: This session is recommended for ages ${session.age_min}-${session.age_max}. Your child is ${childAge} years old. We suggest selecting an older kids session.`,
          type: 'warning'
        });
        // Still allow selection but warn
      }
    }

    setSelections(prev => {
      const existing = prev.find(s => s.sessionId === sessionId);
      
      if (existing) {
        if (existing.childIds.includes(childId)) {
          // Remove child from this session - always allowed
          const newChildIds = existing.childIds.filter(id => id !== childId);
          if (newChildIds.length === 0) {
            // Remove session entirely if no children selected
            return prev.filter(s => s.sessionId !== sessionId);
          }
          return prev.map(s => 
            s.sessionId === sessionId 
              ? { ...s, childIds: newChildIds }
              : s
          );
        } else {
          // CRITICAL: Check remaining capacity before adding
          const currentRegistrations = session.current_registrations || 0;
          const capacity = session.capacity;
          const remaining = capacity - currentRegistrations;
          const currentlySelected = existing.childIds.length;
          
          // Block if no remaining spots
          if (remaining <= currentlySelected) {
            // Show toast to user
            setToast({
              message: language === 'zh' 
                ? `此場次剩餘名額不足！目前剩餘 ${remaining} 個名額，您已選擇 ${currentlySelected} 位孩子。` 
                : `Not enough spots remaining! Only ${remaining} spot(s) left, you have selected ${currentlySelected} child(ren).`,
              type: 'warning'
            });
            return prev;
          }
          
          // Add child to this session
          return prev.map(s => 
            s.sessionId === sessionId 
              ? { ...s, childIds: [...s.childIds, childId] }
              : s
          );
        }
      } else {
        // CRITICAL: Check remaining capacity before creating new selection
        const currentRegistrations = session.current_registrations || 0;
        const capacity = session.capacity;
        const remaining = capacity - currentRegistrations;
        
        // Block if no remaining spots
        if (remaining <= 0) {
          setToast({
            message: language === 'zh' 
              ? '此場次名額已滿！' 
              : 'This session is fully booked!',
            type: 'error'
          });
          return prev;
        }
        
        // Create new selection for this session
        return [...prev, { sessionId, childIds: [childId] }];
      }
    });
  };

  const getSessionSelection = (sessionId: string) => {
    return selections.find(s => s.sessionId === sessionId);
  };

  const getTotalSelections = () => {
    return selections.reduce((total, s) => total + s.childIds.length, 0);
  };

  const handleCompleteRegistration = () => {
    // Save selections to localStorage
    localStorage.setItem('selections', JSON.stringify(selections));
    // Navigate to checkout page with selections
    router.push('/checkout');
  };

  const handleAddToCart = (sessionId: string) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    // Check if session has roles
    const hasRoles = session.roles && session.roles.length > 0;

    // Add all selected children for this session
    const childIdsToAdd = getSessionSelection(sessionId)?.childIds || [];

    childIdsToAdd.forEach(cId => {
      const child = children.find(c => c.id === cId);
      if (!child) return;

      // Get the role for this specific child from per-child selections (if already selected)
      const childRoleId = sessionRoleSelections[sessionId]?.[cId] || null;

      addItem({
        sessionId: session.id,
        sessionTitle: language === 'zh' ? session.title_zh : session.title_en,
        sessionDate: new Date(session.date).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US'),
        sessionTime: session.time,
        price: session.price,
        childId: child.id,
        childName: child.name,
        childAge: child.age,
        roleId: childRoleId,
        needsRoleSelection: hasRoles && !childRoleId, // Mark if needs role selection in checkout
        type: 'individual',
      });
    });

    // CRITICAL: Add addon items if selected
    const selectedAddons = sessionAddonSelections[sessionId];
    if (selectedAddons && selectedAddons.size > 0) {
      selectedAddons.forEach(addonId => {
        // Import addon config
        const { getAddonById } = require('@/lib/config/addons');
        const addon = getAddonById(addonId);
        
        if (addon) {
          addItem({
            sessionId: session.id,
            sessionTitle: `${language === 'zh' ? '【加購】' : '[Add-on] '}${language === 'zh' ? addon.name_zh : addon.name_en}`,
            sessionDate: new Date(session.date).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US'),
            sessionTime: session.time,
            price: addon.price,
            childId: `addon-${sessionId}`,
            childName: language === 'zh' ? '加購項目' : 'Add-on Item',
            childAge: 0,
            roleId: null,
            type: 'addon',
            isAddon: true,
            addonName: language === 'zh' ? addon.name_zh : addon.name_en,
          });
        }
      });
    }

    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (itemId: string) => {
    removeItem(itemId);
  };

  const handleAddonToggle = (sessionId: string, addonId: string, selected: boolean) => {
    setSessionAddonSelections(prev => {
      const sessionAddons = new Set(prev[sessionId] || []);
      if (selected) {
        sessionAddons.add(addonId);
      } else {
        sessionAddons.delete(addonId);
      }
      return {
        ...prev,
        [sessionId]: sessionAddons
      };
    });
  };

  const handleCheckout = () => {
    // CartContext already saves to localStorage, just navigate
    router.push('/checkout');
  };

  const handleCardMouseEnter = (sessionId: string) => {
    setHoveredSession(sessionId);
    const video = videoRefs.current[sessionId];
    if (video) {
      video.currentTime = 0;
      video.play().catch(err => console.log('Video play failed:', err));
    }
  };

  const handleCardMouseLeave = (sessionId: string) => {
    setHoveredSession(null);
    const video = videoRefs.current[sessionId];
    if (video) {
      video.pause();
      video.currentTime = 0;
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

      {/* Ambient light spots */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl" />

      {/* Snowfall Effect */}
      <div className="snowfall-container absolute inset-0 pointer-events-none z-10">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="snowflake"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 10}s`,
              opacity: Math.random() * 0.6 + 0.4,
            }}
          >
            ❄
          </div>
        ))}
      </div>

      {/* Content wrapper */}
      <div className="relative z-20">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-metal-steel/40 backdrop-blur-md border-b border-metal-structure-silver/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Cart Icon */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative group px-4 py-2.5 bg-gradient-to-r from-metal-cold-blue/20 to-metal-ice-blue/20 border-2 border-metal-structure-silver/50 rounded-full text-metal-soft-white font-semibold hover:from-metal-cold-blue/30 hover:to-metal-ice-blue/30 hover:border-metal-soft-white/70 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-metal-cold-blue/20"
          >
            <span className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartItems.length > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-metal-ancient-gold to-metal-warm-gold text-brand-navy rounded-full flex items-center justify-center text-xs font-bold shadow-lg shadow-metal-ancient-gold/50">
                  {cartItems.length}
                </span>
              )}
            </span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="group relative px-6 py-2.5 bg-gradient-to-r from-metal-cold-blue/20 to-metal-ice-blue/20 border-2 border-metal-structure-silver/50 rounded-full text-metal-soft-white font-semibold hover:from-metal-cold-blue/30 hover:to-metal-ice-blue/30 hover:border-metal-soft-white/70 transition-all duration-300 backdrop-blur-sm shadow-lg shadow-metal-cold-blue/20"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-sm">{language === 'zh' ? '中文' : 'EN'}</span>
              <span className="text-xs opacity-60">|</span>
              <span className="text-sm opacity-60">{language === 'zh' ? 'EN' : '中文'}</span>
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32">
        {/* Hero Banner with Video */}
        <div className="relative w-full h-[500px] overflow-hidden mb-16">
          {/* Video Background */}
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src="/video/課程資訊HERO圖動畫.mp4" type="video/mp4" />
          </video>
          
          {/* Fallback Image */}
          <img 
            src="https://res.cloudinary.com/dp31h1t3v/image/upload/v1770546855/snow-wolf/image2/yauych2msulvecohxune.png"
            alt="課程資訊"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ display: 'none' }}
            onError={(e) => { e.currentTarget.style.display = 'block'; }}
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
          
          {/* Content Overlay (Optional) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-heading text-white mb-4 drop-shadow-2xl">
                {t.heroTitle}
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl text-white/90 drop-shadow-lg">
                {t.heroSubtitle}
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Global Unlock Rewards Progress Bar - RPG Style - Only show when > 50% */}
          {(() => {
            const activeSessions = sessions.filter(s => s.status === 'active');
            const totalCapacity = activeSessions.reduce((sum, s) => sum + s.capacity, 0);
            const totalRegistrations = activeSessions.reduce((sum, s) => sum + (s.current_registrations || 0), 0);
            const percentage = totalCapacity > 0 ? (totalRegistrations / totalCapacity) * 100 : 0;
            
            // Only show if percentage > 50%
            if (percentage <= 50) return null;
            
            return (
              <div className="mb-12">
                <div className="relative overflow-hidden bg-gradient-to-br from-metal-steel/95 via-metal-alloy-green/98 to-black/95 backdrop-blur-2xl border-2 border-metal-structure-silver/40 rounded-2xl p-6 shadow-2xl shadow-metal-cold-blue/20">
                  {/* Glow Effect - Metal tone */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-metal-cold-blue/20 via-metal-ice-blue/20 to-metal-cold-blue/20 rounded-2xl blur-xl opacity-50" />
                  
                  <div className="relative z-10 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-metal-soft-white">
                        {language === 'zh' ? '冒險隊伍集結中' : 'Adventure Team Assembling'}
                      </h3>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="relative">
                      {/* Background Track - Metal tone */}
                      <div className="h-12 bg-gradient-to-r from-metal-dark-alloy/80 via-metal-steel/80 to-metal-dark-alloy/80 rounded-full overflow-hidden border-2 border-metal-structure-silver/50 shadow-inner">
                        {/* Progress Fill - Metal gradient */}
                        <div 
                          className="h-full bg-gradient-to-r from-metal-cold-blue via-metal-ice-blue to-metal-cold-blue transition-all duration-1000 ease-out relative overflow-hidden"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        >
                          {/* Shimmer Effect - Metal shine */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-metal-soft-white/30 to-transparent animate-shimmer" />
                          {/* Metal texture overlay */}
                          <div className="absolute inset-0 bg-gradient-to-b from-metal-pearl-white/10 via-transparent to-black/20" />
                        </div>
                      </div>

                      {/* Milestone Markers */}
                      {/* 60% Milestone - Snacks */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                        style={{ left: '60%' }}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-4 transition-all duration-500 ${
                          percentage >= 60 
                            ? 'border-metal-cold-blue/80 shadow-lg shadow-metal-cold-blue/50 animate-bounce bg-gradient-to-br from-metal-steel to-metal-alloy-green' 
                            : 'border-metal-structure-silver/60 bg-gradient-to-br from-metal-dark-alloy to-metal-steel'
                        }`}>
                          <img 
                            src="/image2/麵包_RPG風格.png" 
                            alt="Snacks"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="mt-2 text-center">
                          <div className="text-xs font-bold text-metal-cold-blue whitespace-nowrap">60%</div>
                          <div className="text-xs text-metal-structure-silver whitespace-nowrap">
                            {language === 'zh' ? '美味點心' : 'Snacks'}
                          </div>
                        </div>
                      </div>

                      {/* 85% Milestone - Gift */}
                      <div 
                        className="absolute top-1/2 -translate-y-1/2 flex flex-col items-center"
                        style={{ left: '85%' }}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center overflow-hidden border-4 transition-all duration-500 relative ${
                          percentage >= 85 
                            ? 'border-metal-ancient-gold/80 shadow-lg shadow-metal-ancient-gold/50 animate-bounce bg-gradient-to-br from-metal-steel to-metal-alloy-green' 
                            : 'border-metal-structure-silver/60 bg-gradient-to-br from-metal-dark-alloy to-metal-steel'
                        }`}>
                          <video 
                            autoPlay
                            muted
                            loop
                            playsInline
                            className="w-full h-full object-cover"
                          >
                            <source src="/image2/神秘禮物.mp4" type="video/mp4" />
                          </video>
                        </div>
                        <div className="mt-2 text-center">
                          <div className="text-xs font-bold text-metal-ancient-gold whitespace-nowrap">85%</div>
                          <div className="text-xs text-metal-structure-silver whitespace-nowrap">
                            {language === 'zh' ? '小禮物' : 'Gift'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Status Message */}
                    <div className="text-center">
                      <p className="text-sm text-metal-soft-white">
                        {(() => {
                          if (percentage >= 85) {
                            return language === 'zh' 
                              ? '🎉 恭喜！所有獎勵已解鎖！報名即可獲得美味點心和小禮物！' 
                              : '🎉 Congratulations! All rewards unlocked! Get snacks and gift with registration!';
                          } else if (percentage >= 60) {
                            return language === 'zh' 
                              ? `✨ 已解鎖美味點心！還差 ${Math.ceil(85 - percentage)}% 即可解鎖小禮物！` 
                              : `✨ Snacks unlocked! ${Math.ceil(85 - percentage)}% more to unlock gift!`;
                          } else {
                            return language === 'zh' 
                              ? `🚀 還差 ${Math.ceil(60 - percentage)}% 即可解鎖美味點心！` 
                              : `🚀 ${Math.ceil(60 - percentage)}% more to unlock snacks!`;
                          }
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Page Header */}
          <div className="text-center mb-16">
            {children.length > 0 && (
              <p className="text-lg text-white/50">
                {children.length} {t.childrenCount}
              </p>
            )}
          </div>

          {/* No Children Warning */}
          {children.length === 0 && (
            <div className="max-w-md mx-auto text-center py-12 px-8 mb-12 bg-white/10 backdrop-blur-md border border-gray-300/40 rounded-2xl">
              <p className="text-xl text-white mb-4">{t.noChildren}</p>
              <p className="text-white/60 mb-6">{t.addChildren}</p>
              <button
                onClick={() => router.push('/onboarding')}
                className="px-8 py-3 bg-gradient-to-r from-accent-moon to-accent-aurora text-brand-navy rounded-full font-bold hover:shadow-xl transition-all duration-300"
              >
                {language === 'zh' ? '新增孩子資料' : 'Add Child Profile'}
              </button>
            </div>
          )}

          {/* Sessions Grid - Cinematic Card Style - Always show courses */}
          {sessionsLoading ? (
            <div className="col-span-full flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-metal-cold-blue"></div>
                <p className="mt-4 text-white/70">{language === 'zh' ? '載入課程中...' : 'Loading sessions...'}</p>
              </div>
            </div>
          ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
              {allSessions.map((session, index) => {
                const title = language === 'zh' ? session.title_zh : session.title_en;
                const theme = language === 'zh' ? session.theme_zh : session.theme_en;
                const story = language === 'zh' ? session.story_zh : session.story_en;
                const selection = getSessionSelection(session.id);
                const isExpanded = expandedSession === session.id;
                const selectedCount = selection?.childIds.length || 0;
                const hasRoles = session.roles && session.roles.length > 0;
                const isCancelled = session.status === 'cancelled';
                const isPrivateBooking = isCancelled && session.title_zh.includes('包場');

                // Determine card color scheme based on age range
                const isYoungKids = !!(session.age_max && session.age_max <= 7); // 5-7歲小小孩

                // 🔧 調整3: 統一卡片結構 - 同一套 token
                // 圓角: 16px (兩邊一樣)
                // 陰影: 同一層級 (讓它們是同系列，只是不同故事)
                const cardColors = isYoungKids ? {
                  // 日光宇宙 - Quiet, slow, airy like morning fog
                  background: 'from-daylight-card-bg to-daylight-card-gradient',
                  border: isCancelled 
                    ? 'border-neutral-divider' 
                    : selectedCount > 0
                      ? 'border-daylight-button-border shadow-[0_12px_24px_rgba(0,0,0,0.12)]'
                      : 'border-daylight-card-gradient hover:border-daylight-button-border',
                  hoverShadow: 'hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]', // 統一陰影層級
                  titleText: 'text-daylight-title',
                  bodyText: 'text-daylight-body',
                  tagBg: 'bg-daylight-tag-bg',
                  tagText: 'text-daylight-tag-text',
                  buttonBg: 'bg-daylight-button-bg', // 中亮度霧藍綠
                  buttonBorder: 'border-daylight-button-border',
                  buttonText: 'text-daylight-button-text',
                  buttonHover: 'hover:bg-daylight-card-gradient',
                } : {
                  // 雷電宇宙 - Power, crisis, determination like storm sky
                  background: 'from-storm-card-bg to-storm-card-gradient',
                  border: isCancelled 
                    ? 'border-neutral-divider' 
                    : selectedCount > 0
                      ? 'border-storm-button-bg shadow-[0_12px_24px_rgba(47,107,255,0.25)]'
                      : 'border-storm-card-gradient hover:border-storm-tag-bg',
                  hoverShadow: 'hover:shadow-[0_12px_24px_rgba(0,0,0,0.12)]', // 統一陰影層級
                  titleText: 'text-storm-title',
                  bodyText: 'text-storm-body',
                  tagBg: 'bg-storm-tag-bg',
                  tagText: 'text-storm-tag-text',
                  buttonBg: 'bg-storm-button-bg', // 中亮度雷電藍
                  buttonBorder: 'border-storm-button-bg',
                  buttonText: 'text-storm-button-text',
                  buttonHover: 'hover:bg-storm-button-hover',
                };

                return (
                  <div
                    key={session.id}
                    className={`group relative ${
                      selectedCount > 0 ? 'scale-[1.02]' : ''
                    } ${isCancelled ? 'opacity-60' : ''}`}
                    style={{
                      animation: `fade-in-up 0.6s ease-out ${index * 0.15}s both`,
                    }}
                    onMouseEnter={() => !isCancelled && handleCardMouseEnter(session.id)}
                    onMouseLeave={() => !isCancelled && handleCardMouseLeave(session.id)}
                  >
                    {/* Private Booking Badge */}
                    {isPrivateBooking && (
                      <div className="absolute -top-4 -right-4 z-30">
                        <div className="relative">
                          <div className="absolute inset-0 bg-gray-500 rounded-full blur-xl opacity-50" />
                          <div className="relative px-6 py-3 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center border-4 border-brand-navy shadow-2xl">
                            <span className="text-sm font-bold text-white">{language === 'zh' ? '已包場' : 'Private'}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Card Container - 統一結構: 圓角16px, 同一陰影層級 */}
                    <div
                      className={`relative bg-gradient-to-br ${cardColors.background} border ${cardColors.border} rounded-2xl overflow-hidden transition-all duration-300 ${
                        isCancelled 
                          ? 'cursor-not-allowed opacity-60'
                          : `${cardColors.hoverShadow}`
                      }`}
                    >
                      {/* Removed: Holographic Shine - UI should not perform */}
                      {/* Removed: Glow Effect - Let images be the main character */}

                      {/* Horizontal Layout: Image Left, Content Right */}
                      <div className="flex flex-col">
                        {/* Card Header - Image Area (Top) */}
                        <div className="relative w-full h-96 overflow-hidden">
                          {/* Minimal gradient overlay - let image breathe */}
                          <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 z-10`} />
                          
                          {/* Video Element (if available) */}
                          {session.video_url && (
                            <video
                              ref={(el) => { videoRefs.current[session.id] = el; }}
                              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                                hoveredSession === session.id ? 'opacity-100' : 'opacity-0'
                              }`}
                              muted
                              loop
                              playsInline
                              preload="metadata"
                            >
                              <source src={session.video_url} type="video/mp4" />
                            </video>
                          )}
                          
                          {/* Static Image (poster/fallback) */}
                          <img 
                            src={session.image_url || '/image2/HERO圖.png'} 
                            alt={language === 'zh' ? session.title_zh : session.title_en}
                            className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-1000 ${
                              hoveredSession === session.id && session.video_url ? 'opacity-0' : 'opacity-100'
                            }`}
                          />
                          
                          {/* Removed: Sparkle Effect - UI should not perform */}
                          {/* Removed: Corner Decoration - Let image be the hero */}
                        </div>

                        {/* Card Body (Bottom) */}
                        <div className="w-full p-6 space-y-4 flex flex-col justify-between">
                          {/* Title Section */}
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <h3 className={`text-2xl font-heading ${cardColors.titleText} leading-tight`}>
                                {title}
                              </h3>
                              <p className={`text-sm font-bold tracking-wider uppercase ${cardColors.bodyText}`}>
                                {theme}
                              </p>
                              {story && (
                                <p className={`${cardColors.bodyText} text-base leading-relaxed italic pt-2`}>
                                  {story}
                                </p>
                              )}
                            </div>

                            {/* Stats Bar */}
                            <div className="flex items-center gap-2 flex-wrap">
                              {/* Age Range Badge */}
                              {session.age_min && session.age_max && (
                                <div className={`flex items-center gap-2 px-4 py-2 ${cardColors.tagBg} border ${cardColors.buttonBorder} rounded-full`}>
                                  <span className={`text-sm font-bold ${cardColors.tagText}`}>
                                    {session.age_min}-{session.age_max} {t.ages}
                                  </span>
                                </div>
                              )}
                              
                              {/* Duration Badge */}
                              <div className={`flex items-center gap-2 px-4 py-2 ${cardColors.tagBg} border ${cardColors.buttonBorder} rounded-full`}>
                                <span className={`text-sm font-bold ${cardColors.tagText}`}>
                                  {session.duration_minutes} {t.duration}
                                </span>
                              </div>

                              {/* Character Role Badge - Shows if session has roles */}
                              {hasRoles && (
                                <div className={`flex items-center gap-2 px-4 py-2 ${cardColors.tagBg} border ${cardColors.buttonBorder} rounded-full`}>
                                  <svg className={`w-4 h-4 ${cardColors.tagText}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                  </svg>
                                  <span className={`text-sm font-bold ${cardColors.tagText}`}>
                                    {language === 'zh' ? '需選角色' : 'Role Required'}
                                  </span>
                                </div>
                              )}
                              
                              {/* Tags */}
                              {session.tags && session.tags.map((tag, tagIndex) => (
                                <div 
                                  key={tagIndex}
                                  className={`flex items-center gap-1 px-3 py-1.5 ${cardColors.tagBg} border ${cardColors.buttonBorder} rounded-full`}
                                >
                                  <span className={`text-xs font-bold ${cardColors.tagText}`}>
                                    {tag}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Session Details */}
                            <div className={`space-y-3 text-base ${cardColors.bodyText}`}>
                              {/* Date + Time in one line - 🔧 微調3: 統一高度 */}
                              <div className={`flex items-center gap-4 px-4 py-status-bar ${cardColors.tagBg} rounded-xl border ${cardColors.buttonBorder}`}>
                                <span className="font-semibold">
                                  {new Date(session.date).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')}
                                  {session.day_of_week && ` (${session.day_of_week})`}
                                  {' · '}
                                  {session.time}
                                  {session.duration_minutes && (() => {
                                    const [hours, minutes] = session.time.split(':').map(Number);
                                    const endMinutes = hours * 60 + minutes + session.duration_minutes;
                                    const endHours = Math.floor(endMinutes / 60);
                                    const endMins = endMinutes % 60;
                                    return `-${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
                                  })()}
                                </span>
                              </div>

                              {/* Venue - 地點資訊 */}
                              <div className={`flex items-center gap-2 px-4 py-status-bar ${cardColors.tagBg} rounded-xl border ${cardColors.buttonBorder}`}>
                                <svg className={`w-5 h-5 ${cardColors.tagText}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="font-semibold">
                                  {language === 'zh' ? session.venue_zh : session.venue_en}
                                </span>
                              </div>

                              {/* Adventure Status - Gamified registration status */}
                              {!isCancelled && session.capacity > 0 && session.current_registrations !== undefined && (() => {
                                const remaining = session.capacity - session.current_registrations;
                                const fillRate = (session.current_registrations / session.capacity) * 100;
                                const isOverCapacity = session.current_registrations > session.capacity;
                                const waitlistCount = Math.max(0, session.current_registrations - session.capacity);
                                const maxWaitlist = 4;
                                
                                // Waitlist status (over capacity, up to +4)
                                // 🔧 微調3: 統一高度
                                if (isOverCapacity && waitlistCount <= maxWaitlist) {
                                  return (
                                    <div className="relative overflow-hidden px-4 py-status-bar bg-gradient-to-r from-purple-500/30 to-indigo-500/30 border-2 border-purple-400/60 rounded-xl backdrop-blur-sm">
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                                      <div className="relative flex items-center gap-3">
                                        <span className="text-2xl">⏳</span>
                                        <div className="flex-1">
                                          <div className="font-bold text-purple-200">
                                            {language === 'zh' ? '預備冒險者等待中' : 'Waitlist Active'}
                                          </div>
                                          <div className="text-xs text-purple-300/80">
                                            {language === 'zh' 
                                              ? `候補第 ${waitlistCount} 位（免費登記，三天後可能遞補）` 
                                              : `Waitlist #${waitlistCount} (Free registration, may be called in 3 days)`}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                
                                // Full (exactly at capacity)
                                if (remaining === 0) {
                                  return (
                                    <div className="relative overflow-hidden px-4 py-3 bg-gradient-to-r from-gray-500/30 to-slate-500/30 border-2 border-gray-400/60 rounded-xl backdrop-blur-sm">
                                      <div className="relative flex items-center gap-3">
                                        <span className="text-2xl">🔒</span>
                                        <div className="flex-1">
                                          <div className="font-bold text-gray-200">
                                            {language === 'zh' ? '名額已滿' : 'Fully Booked'}
                                          </div>
                                          <div className="text-xs text-gray-300/80">
                                            {language === 'zh' ? '可加入候補名單' : 'Join waitlist available'}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                
                                // Last 2 spots - show exact remaining count
                                // 🔧 微調2: 改為暖杏色/淡琥珀 - 提醒不是警告
                                if (remaining > 0 && remaining <= 2) {
                                  return (
                                    <div className="relative overflow-hidden px-4 py-3 bg-status-warning-bg border-2 border-status-warning-border rounded-xl">
                                      <div className="relative flex items-center gap-3">
                                        <span className="text-2xl">💫</span>
                                        <span className="font-bold text-status-warning-text text-lg">
                                          {language === 'zh' 
                                            ? `剩下 ${remaining} 名冒險名額！` 
                                            : `Only ${remaining} spot${remaining > 1 ? 's' : ''} left!`}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }
                                
                                // Determine status based on fill rate
                                let statusConfig = {
                                  emoji: '🌟',
                                  text_zh: '冒險者集結中',
                                  text_en: 'Gathering Adventurers',
                                  bgColor: 'from-blue-500/20 to-cyan-500/20',
                                  borderColor: 'border-blue-400/50',
                                  textColor: 'text-blue-300',
                                  animation: '',
                                };

                                if (fillRate >= 80) {
                                  statusConfig = {
                                    emoji: '🔥',
                                    text_zh: '冒險人數即將額滿',
                                    text_en: 'Almost Full',
                                    bgColor: 'from-orange-500/20 to-yellow-500/20',
                                    borderColor: 'border-orange-400/50',
                                    textColor: 'text-orange-300',
                                    animation: 'animate-pulse',
                                  };
                                } else if (fillRate >= 60) {
                                  statusConfig = {
                                    emoji: '⚔️',
                                    text_zh: '確認冒險成行',
                                    text_en: 'Adventure Confirmed',
                                    bgColor: 'from-green-500/20 to-emerald-500/20',
                                    borderColor: 'border-green-400/50',
                                    textColor: 'text-green-300',
                                    animation: '',
                                  };
                                } else if (fillRate >= 30) {
                                  statusConfig = {
                                    emoji: '🗺️',
                                    text_zh: '已有來自各地的冒險者',
                                    text_en: 'Adventurers Joining',
                                    bgColor: 'from-purple-500/20 to-pink-500/20',
                                    borderColor: 'border-purple-400/50',
                                    textColor: 'text-purple-300',
                                    animation: '',
                                  };
                                }

                                return (
                                  <div className={`relative overflow-hidden px-4 py-3 bg-gradient-to-r ${statusConfig.bgColor} border-2 ${statusConfig.borderColor} rounded-xl backdrop-blur-sm ${statusConfig.animation}`}>
                                    {/* Shimmer effect for high urgency */}
                                    {fillRate >= 80 && (
                                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                                    )}
                                    
                                    <div className="relative flex items-center gap-3">
                                      <span className="text-2xl">{statusConfig.emoji}</span>
                                      <span className={`font-bold ${statusConfig.textColor}`}>
                                        {language === 'zh' ? statusConfig.text_zh : statusConfig.text_en}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          </div>

                          {/* Action Section */}
                          <div className="space-y-4">
                            {/* Divider */}
                            <div className="h-px bg-neutral-divider" />

                            {/* 🔧 調整4: 主 CTA 同一語言 - 膠囊型、中亮度、只差色相 */}
                            {/* Action Button */}
                            {isPrivateBooking ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsPrivateBookingModalOpen(true);
                                }}
                                className={`w-full px-6 py-4 rounded-full font-semibold text-base transition-all duration-200 ${cardColors.buttonBg} ${cardColors.buttonText} border ${cardColors.buttonBorder} ${cardColors.buttonHover}`}
                              >
                                <span className="flex items-center justify-center gap-2">
                                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>{language === 'zh' ? '我想了解包場資訊' : 'Learn About Private Booking'}</span>
                                </span>
                              </button>
                            ) : (
                              <button
                                onClick={() => !isCancelled && handleSessionClick(session.id)}
                                disabled={isCancelled}
                                className={`w-full px-6 py-4 rounded-full font-semibold text-base transition-all duration-200 ${
                                  isCancelled
                                    ? 'bg-neutral-disabled text-neutral-icon cursor-not-allowed'
                                    : selectedCount > 0
                                      ? `${cardColors.buttonBg} ${cardColors.buttonText} border-2 ${cardColors.buttonBorder}`
                                      : `${cardColors.tagBg} ${cardColors.tagText} border ${cardColors.buttonBorder} ${cardColors.buttonHover}`
                                }`}
                              >
                                <span className="flex items-center justify-center gap-2">
                                  {isCancelled ? (
                                    <span>{language === 'zh' ? '已包場' : 'Private Booking'}</span>
                                  ) : selectedCount > 0 ? (
                                    <>
                                      <span>{selectedCount} {t.childrenCount}</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>{t.register}</span>
                                    </>
                                  )}
                                </span>
                              </button>
                            )}

                            {/* Quick Actions - 加入購物車按鈕 */}
                            {!isPrivateBooking && selectedCount > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(session.id);
                                }}
                                className={`w-full px-4 py-3 rounded-full font-semibold transition-all duration-200 ${cardColors.buttonBg} ${cardColors.buttonText} border ${cardColors.buttonBorder} ${cardColors.buttonHover}`}
                              >
                                {language === 'zh' ? '加入冒險行列' : 'Join the Adventure'}
                              </button>
                            )}

                            {/* Child Selection Dropdown */}
                            {isExpanded && (
                              <div className="space-y-3 animate-fade-in">
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 ${
                                  isYoungKids 
                                    ? 'bg-daylight-tag-bg border-daylight-button-border' 
                                    : 'bg-gray-500/15 border-gray-400/50'
                                }`}>
                                  <p className={`text-base font-bold ${
                                    isYoungKids ? 'text-daylight-title' : 'text-white'
                                  }`}>{t.selectChild}</p>
                                </div>

                                {/* Discount Preview - Show current selection discount */}
                                {(() => {
                                  const currentSelectedCount = selection?.childIds.length || 0;
                                  
                                  // Calculate what discount tier they're at
                                  let discountTier: '0' | '300' | '400' = '0';
                                  let discountMessage = '';
                                  let nextTierMessage = '';
                                  
                                  if (currentSelectedCount >= 3) {
                                    discountTier = '400';
                                    discountMessage = language === 'zh' 
                                      ? `🎉 已享最高優惠！每位孩子折扣 $400` 
                                      : `🎉 Maximum discount! $400 off per child`;
                                  } else if (currentSelectedCount === 2) {
                                    discountTier = '300';
                                    discountMessage = language === 'zh' 
                                      ? `✨ 已享優惠！每位孩子折扣 $300` 
                                      : `✨ Discount applied! $300 off per child`;
                                    nextTierMessage = language === 'zh'
                                      ? `再選 1 位升級至 $400/位`
                                      : `Add 1 more for $400/child`;
                                  } else if (currentSelectedCount === 1) {
                                    discountMessage = language === 'zh' 
                                      ? `💡 再選 1 位即享 $300/位 優惠` 
                                      : `💡 Add 1 more for $300/child discount`;
                                  } else {
                                    discountMessage = language === 'zh' 
                                      ? `💰 選 2 位以上享優惠：2位 -$300/位，3位+ -$400/位` 
                                      : `💰 Discount for 2+: 2 kids -$300/child, 3+ -$400/child`;
                                  }
                                  
                                  // Color scheme based on discount tier AND session type (young kids vs older kids)
                                  // For young kids (light background), use dark text
                                  // For older kids (dark background), use light text
                                  let colorScheme = '';
                                  let textColor = '';
                                  
                                  if (isYoungKids) {
                                    // 小小孩場 - 淺色背景，需要深色文字
                                    if (discountTier === '400') {
                                      colorScheme = 'from-green-100 to-emerald-100 border-green-300';
                                      textColor = 'text-green-800';
                                    } else if (discountTier === '300') {
                                      colorScheme = 'from-blue-100 to-cyan-100 border-blue-300';
                                      textColor = 'text-blue-800';
                                    } else {
                                      colorScheme = 'from-purple-100 to-pink-100 border-purple-300';
                                      textColor = 'text-purple-800';
                                    }
                                  } else {
                                    // 大小孩場 - 深色背景，需要淺色文字
                                    if (discountTier === '400') {
                                      colorScheme = 'from-green-500/20 to-emerald-500/20 border-green-400/50';
                                      textColor = 'text-green-300';
                                    } else if (discountTier === '300') {
                                      colorScheme = 'from-blue-500/20 to-cyan-500/20 border-blue-400/50';
                                      textColor = 'text-blue-300';
                                    } else {
                                      colorScheme = 'from-purple-500/20 to-pink-500/20 border-purple-400/50';
                                      textColor = 'text-purple-300';
                                    }
                                  }
                                  
                                  return (
                                    <div className={`relative overflow-hidden px-4 py-3 bg-gradient-to-r ${colorScheme} border-2 rounded-xl backdrop-blur-sm`}>
                                      <div className="relative flex flex-col gap-1">
                                        <span className={`font-bold text-sm ${textColor}`}>
                                          {discountMessage}
                                        </span>
                                        {nextTierMessage && (
                                          <span className={`text-xs opacity-80 ${textColor}`}>
                                            {nextTierMessage}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })()}
                                
                                {children.map(child => {
                                  const isSelected = selection?.childIds.includes(child.id) || false;
                                  
                                  // CRITICAL: Calculate if this child can be added
                                  const currentRegistrations = session.current_registrations || 0;
                                  const capacity = session.capacity;
                                  const remaining = capacity - currentRegistrations;
                                  const currentlySelected = selection?.childIds.length || 0;
                                  
                                  // Disable if: not selected AND no remaining spots
                                  const cannotAdd = !isSelected && remaining <= currentlySelected;
                                  
                                  // Button colors based on session type (young kids vs older kids)
                                  const buttonColors = isYoungKids ? {
                                    // 小小孩場 - 淺色背景，深色文字
                                    unselected: 'bg-daylight-tag-bg border-2 border-daylight-button-border text-daylight-title hover:bg-daylight-button-bg hover:border-daylight-button-border',
                                    selected: 'bg-gradient-to-r from-accent-aurora/40 to-accent-moon/40 border-2 border-accent-aurora text-daylight-title shadow-xl shadow-accent-aurora/30',
                                    disabled: 'bg-gray-300/40 border-2 border-gray-400/40 text-gray-500 cursor-not-allowed opacity-50',
                                    checkboxBorder: 'border-daylight-button-border group-hover/child:scale-110',
                                    ageText: 'text-daylight-body',
                                  } : {
                                    // 大小孩場 - 深色背景，淺色文字
                                    unselected: 'bg-white/10 border-2 border-white/30 text-white/90 hover:bg-white/15 hover:border-accent-moon/60',
                                    selected: 'bg-gradient-to-r from-accent-aurora/40 to-accent-moon/40 border-2 border-accent-aurora text-white shadow-xl shadow-accent-aurora/30',
                                    disabled: 'bg-gray-500/20 border-2 border-gray-500/40 text-white/40 cursor-not-allowed opacity-50',
                                    checkboxBorder: 'border-white/50 group-hover/child:scale-110',
                                    ageText: 'text-white/70',
                                  };
                                  
                                  return (
                                    <button
                                      key={child.id}
                                      onClick={() => !cannotAdd && handleChildToggle(session.id, child.id)}
                                      disabled={cannotAdd}
                                      className={`w-full px-6 py-5 rounded-2xl text-left transition-all duration-300 flex items-center justify-between group/child ${
                                        cannotAdd
                                          ? buttonColors.disabled
                                          : isSelected
                                          ? buttonColors.selected
                                          : buttonColors.unselected
                                      }`}
                                    >
                                      <span className="flex items-center gap-5">
                                        <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-transform duration-300 ${
                                          isSelected ? 'bg-accent-aurora border-accent-aurora scale-110' : buttonColors.checkboxBorder
                                        }`}>
                                          {isSelected && <span className="w-3 h-3 bg-brand-navy rounded-full"></span>}
                                        </span>
                                        <div>
                                          <span className="font-bold text-xl block">{child.name}</span>
                                          <span className={`text-sm ${buttonColors.ageText}`}>{child.age} {t.ages}</span>
                                        </div>
                                      </span>
                                    </button>
                                  );
                                })}

                                {/* Character Role Selection - Only for sessions with roles */}
                                {session.roles && session.roles.length > 0 && selectedCount > 0 && (
                                  <div className="mt-6 pt-6 border-t border-white/20">
                                    {/* Instruction Header */}
                                    <div className="mb-4 p-4 bg-gradient-to-r from-accent-aurora/20 to-accent-moon/20 border-2 border-accent-aurora/50 rounded-xl">
                                      <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-accent-aurora/30 rounded-full flex items-center justify-center">
                                          <svg className="w-6 h-6 text-accent-aurora" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                          </svg>
                                        </div>
                                        <div className="flex-1">
                                          <h4 className="text-lg font-bold text-white mb-1">
                                            {language === 'zh' ? '🎭 為每位孩子選擇配音角色' : '🎭 Choose Voice Acting Role for Each Child'}
                                          </h4>
                                          <p className="text-sm text-white/80">
                                            {language === 'zh' 
                                              ? '此課程為雪狼男孩系列動畫配音，每位孩子需選擇一個角色進行配音演出' 
                                              : 'This is a Snow Wolf Boy animation voice acting session. Each child needs to select a character role'}
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Per-Child Role Selection */}
                                    <div className="space-y-6">
                                      {selection?.childIds.map(childId => {
                                        const child = children.find(c => c.id === childId);
                                        if (!child) return null;
                                        
                                        const childRoleId = sessionRoleSelections[session.id]?.[childId] || null;
                                        const isActiveChild = activeChildForRole[session.id] === childId;

                                        return (
                                          <div key={childId} className="space-y-3">
                                            {/* Child Header with Role Status */}
                                            <button
                                              onClick={() => {
                                                setActiveChildForRole(prev => ({
                                                  ...prev,
                                                  [session.id]: isActiveChild ? null : childId
                                                }));
                                              }}
                                              className="w-full flex items-center justify-between p-4 bg-white/10 border-2 border-white/30 rounded-xl hover:bg-white/15 hover:border-accent-moon/60 transition-all duration-300"
                                            >
                                              <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-accent-moon to-accent-aurora rounded-full flex items-center justify-center text-brand-navy font-bold text-lg">
                                                  {child.name.charAt(0)}
                                                </div>
                                                <div className="text-left">
                                                  <div className="font-bold text-white text-lg">{child.name}</div>
                                                  <div className="text-sm text-white/70">{child.age} {t.ages}</div>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                {childRoleId ? (
                                                  <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-aurora/30 border border-accent-aurora/60 rounded-full">
                                                    <svg className="w-4 h-4 text-accent-aurora" fill="currentColor" viewBox="0 0 20 20">
                                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <span className="text-sm font-semibold text-accent-aurora">
                                                      {session.roles?.find(r => r.id === childRoleId)?.[language === 'zh' ? 'name_zh' : 'name_en']}
                                                    </span>
                                                  </div>
                                                ) : (
                                                  <div className="px-3 py-1.5 bg-semantic-warning/30 border border-semantic-warning/60 rounded-full">
                                                    <span className="text-sm font-semibold text-semantic-warning">
                                                      {language === 'zh' ? '未選擇' : 'Not Selected'}
                                                    </span>
                                                  </div>
                                                )}
                                                <svg 
                                                  className={`w-5 h-5 text-white transition-transform duration-300 ${isActiveChild ? 'rotate-180' : ''}`}
                                                  fill="none" 
                                                  viewBox="0 0 24 24" 
                                                  stroke="currentColor"
                                                >
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                              </div>
                                            </button>

                                            {/* Role Selector for this Child */}
                                            {isActiveChild && (
                                              <div className="pl-4 animate-fade-in">
                                                <CharacterRoleSelector
                                                  session={session}
                                                  selectedRoleId={childRoleId}
                                                  onRoleSelect={(roleId) => {
                                                    setSessionRoleSelections(prev => ({
                                                      ...prev,
                                                      [session.id]: {
                                                        ...(prev[session.id] || {}),
                                                        [childId]: roleId
                                                      }
                                                    }));
                                                  }}
                                                  language={language}
                                                />
                                              </div>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>

                                    {/* Warning if any child hasn't selected a role */}
                                    {hasRoles && selection?.childIds.some(cId => !sessionRoleSelections[session.id]?.[cId]) && (
                                      <div className="mt-4 p-4 bg-semantic-warning/20 border-2 border-semantic-warning/50 rounded-xl">
                                        <p className="text-sm text-white font-semibold flex items-center gap-2">
                                          <svg className="w-5 h-5 text-semantic-warning flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                          </svg>
                                          <span>
                                            {language === 'zh' ? '⚠️ 請為每位孩子選擇角色，才能加入冒險行列' : '⚠️ Please select a role for each child before joining the adventure'}
                                          </span>
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}

                                {/* Addon Selector */}
                                {!isCancelled && (
                                  <div className="mt-6 pt-6 border-t border-white/20">
                                    <AddonSelector
                                      session={session}
                                      onAddonToggle={(addonId, selected) => handleAddonToggle(session.id, addonId, selected)}
                                      selectedAddons={sessionAddonSelections[session.id] || new Set()}
                                      language={language}
                                      isYoungKids={isYoungKids}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Decoration */}
                      <div className="absolute top-6 right-6 w-12 h-12 border-t-4 border-r-4 border-metal-cold-blue/60 rounded-tr-2xl" />
                      <div className="absolute bottom-6 right-6 w-12 h-12 border-b-4 border-r-4 border-metal-ancient-gold/60 rounded-br-2xl" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Floating Action Button */}
          {getTotalSelections() > 0 && (
            <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
              <button
                onClick={handleCompleteRegistration}
                className="px-12 py-6 bg-gradient-to-r from-metal-cold-blue to-metal-ice-blue text-white rounded-full font-bold text-xl shadow-2xl shadow-metal-cold-blue/50 hover:scale-110 hover:shadow-metal-cold-blue/70 transition-all duration-300 flex items-center gap-4 border-2 border-metal-soft-white/30"
              >
                <span>{t.completeRegistration}</span>
                <span className="px-3 py-1 bg-metal-steel/30 rounded-full text-sm border border-metal-soft-white/20">
                  {getTotalSelections()} {t.courses}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Full-width Banner Section */}
        <div className="relative w-full h-[800px] sm:h-[900px] md:h-[1000px] lg:h-[1100px] overflow-hidden mt-16">
          {/* Background Image */}
          <img 
            src="/image2/課程下面介紹.png"
            alt="Giving children a real place"
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          {/* Gradient Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
          
          {/* Text Content */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4 max-w-4xl">
              <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading text-white mb-4 drop-shadow-2xl leading-tight">
                Giving children a real place.
              </h2>
              <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading text-white drop-shadow-2xl">
                帶孩子到最真實的地方
              </p>
            </div>
          </div>
        </div>
      </main>
      </div> {/* Close content wrapper */}

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onReassignChild={(_itemId, _newChildId) => {
          // TODO: Implement child reassignment
        }}
        onCheckout={handleCheckout}
        language={language}
        userId={user?.id}
      />
      
      {/* Private Booking Modal */}
      <PrivateBookingModal
        isOpen={isPrivateBookingModalOpen}
        onClose={() => setIsPrivateBookingModalOpen(false)}
        language={language}
      />
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[9999]">
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}
    </div>
  );
}
