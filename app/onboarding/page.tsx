/**
 * Onboarding Flow - Premium Immersive Experience
 * 
 * Step 1: Welcome & Login (or Profile Completion for email users)
 * Step 2: Add Children
 * Step 3: Select Sessions for Each Child
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context';

interface Child {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  specialNeeds?: string;
  hasAttendedBefore: boolean;
}

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState<'welcome' | 'login' | 'profile' | 'family-count' | 'children' | 'complete'>('welcome');
  const [profileData, setProfileData] = useState({
    fullName: '',
    phone: '',
  });
  const [familyMemberCount, setFamilyMemberCount] = useState(1);
  const [children, setChildren] = useState<Child[]>([]);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const [newChildGender, setNewChildGender] = useState<'male' | 'female'>('male');
  const [newChildSpecialNeeds, setNewChildSpecialNeeds] = useState('');
  const [newChildHasAttendedBefore, setNewChildHasAttendedBefore] = useState(false);

  // Check if user needs to complete profile
  useEffect(() => {
    const needsOnboarding = localStorage.getItem('needs-onboarding') === 'true';
    if (needsOnboarding && user) {
      // Skip welcome/login and go straight to profile completion
      setStep('profile');
    }
  }, [user]);

  const handleProfileComplete = () => {
    if (!profileData.fullName || !profileData.phone) {
      return;
    }

    // Update user with complete profile
    updateUser({
      full_name: profileData.fullName,
      phone: profileData.phone,
    });

    // Clear the onboarding flag
    localStorage.removeItem('needs-onboarding');

    // Move to family count selection
    setStep('family-count');
  };

  const handleAddChild = () => {
    if (newChildName && newChildAge) {
      const newChild: Child = {
        id: Date.now().toString(),
        name: newChildName,
        age: parseInt(newChildAge),
        gender: newChildGender,
        specialNeeds: newChildSpecialNeeds || undefined,
        hasAttendedBefore: newChildHasAttendedBefore,
      };
      setChildren([...children, newChild]);
      // Reset form
      setNewChildName('');
      setNewChildAge('');
      setNewChildGender('male');
      setNewChildSpecialNeeds('');
      setNewChildHasAttendedBefore(false);
    }
  };

  const handleComplete = () => {
    // Save children to localStorage or state management
    localStorage.setItem('children', JSON.stringify(children));
    router.push('/sessions');
  };

  // Welcome Screen
  if (step === 'welcome') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animation Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/image2/雪狼男孩_天裂之時_里特與巨狼_無文字.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-brand-navy/60 to-black/80" />
        
        <div className="relative z-10 min-h-screen bg-gradient-to-br from-brand-navy/50 via-brand-midnight/50 to-black/50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full text-center space-y-12 animate-fade-in">
          {/* Welcome Message */}
          <div className="space-y-6">
            <h1 className="text-6xl font-heading text-white">Snow Wolf</h1>
            <h2 className="text-4xl font-heading text-white/90">
              歡迎來到聲音的世界
            </h2>
            <p className="text-xl text-white/60 leading-relaxed">
              讓我們一起為孩子創造難忘的錄音體驗
            </p>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => setStep('login')}
            className="px-12 py-6 bg-gradient-to-r from-accent-moon to-accent-aurora text-brand-navy rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
          >
            開始冒險
          </button>
        </div>
      </div>
      </div>
    );
  }

  // Login Screen
  if (step === 'login') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animation Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/image2/雪狼男孩_天裂之時_里特與巨狼_無文字.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-brand-navy/60 to-black/80" />
        
        <div className="relative z-10 min-h-screen bg-gradient-to-br from-brand-navy/50 via-brand-midnight/50 to-black/50 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-12 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-heading text-white">登入或註冊</h2>
            <p className="text-lg text-white/60">
              使用社群帳號快速登入
            </p>
          </div>

          {/* OAuth Buttons */}
          <div className="space-y-4">
            {/* Google */}
            <button
              onClick={() => setStep('children')}
              className="w-full px-8 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white font-semibold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              使用 Google 繼續
            </button>

            {/* LINE */}
            <button
              onClick={() => setStep('children')}
              className="w-full px-8 py-5 bg-[#06C755]/20 backdrop-blur-md border border-[#06C755]/40 rounded-2xl text-white font-semibold text-lg hover:bg-[#06C755]/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
              </svg>
              使用 LINE 繼續
            </button>

            {/* Facebook */}
            <button
              onClick={() => setStep('children')}
              className="w-full px-8 py-5 bg-[#1877F2]/20 backdrop-blur-md border border-[#1877F2]/40 rounded-2xl text-white font-semibold text-lg hover:bg-[#1877F2]/30 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-4"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              使用 Facebook 繼續
            </button>
          </div>

          {/* Privacy Note */}
          <p className="text-center text-sm text-white/40">
            登入即表示您同意我們的服務條款和隱私政策
          </p>
        </div>
      </div>
      </div>
    );
  }

  // Profile Completion Screen (for email-registered users)
  if (step === 'profile') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animation Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/image2/雪狼男孩_天裂之時_里特與巨狼_無文字.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-brand-navy/60 to-black/80" />
        
        <div className="relative z-10 min-h-screen bg-gradient-to-br from-brand-navy/50 via-brand-midnight/50 to-black/50 flex items-center justify-center p-4">
          <div className="max-w-md w-full space-y-12 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-heading text-white">歡迎加入聲音冒險之旅</h2>
            <p className="text-lg text-white/60 leading-relaxed">
              謝謝爸爸媽媽帶領孩子進入聲音的奇幻世界<br/>
              讓我們認識您，為孩子準備最棒的冒險體驗
            </p>
          </div>

          {/* Profile Form */}
          <div className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">姓名</label>
              <input
                type="text"
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                placeholder="請輸入您的姓名"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label className="text-white/80 text-sm font-medium">聯絡電話</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="請輸入您的手機號碼"
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300"
              />
            </div>

            {/* Continue Button */}
            <button
              onClick={handleProfileComplete}
              disabled={!profileData.fullName || !profileData.phone}
              className="w-full px-12 py-6 bg-gradient-to-r from-accent-moon to-accent-aurora text-brand-navy rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              繼續
            </button>
          </div>
        </div>
      </div>
      </div>
    );
  }

  // Family Count Selection Screen
  if (step === 'family-count') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animation Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/image2/雪狼男孩_天裂之時_里特與巨狼_無文字.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-brand-navy/60 to-black/80" />
        
        <div className="relative z-10 min-h-screen bg-gradient-to-br from-brand-navy/50 via-brand-midnight/50 to-black/50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-12 animate-fade-in">
            {/* Header */}
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-heading text-white">
                有幾位家庭成員或同行孩子要參加？
              </h2>
              <p className="text-lg text-white/60 leading-relaxed">
                包含孩子和大人（親子錄音需要）<br/>
                最多可以為 10 位成員報名
              </p>
            </div>

            {/* Number Selection */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((count) => (
                <button
                  key={count}
                  onClick={() => setFamilyMemberCount(count)}
                  className={`px-6 py-8 backdrop-blur-md border-2 rounded-2xl font-bold text-xl transition-all duration-300 ${
                    familyMemberCount === count
                      ? 'bg-gradient-to-br from-accent-moon/30 to-accent-aurora/30 border-accent-aurora text-white scale-105 shadow-2xl'
                      : 'bg-white/10 border-white/20 text-white/60 hover:bg-white/15 hover:border-white/30 hover:scale-105'
                  }`}
                >
                  <div className="text-4xl mb-2">
                    {count <= 5 ? ['👤', '👥', '👨‍👩‍👦', '👨‍👩‍👧‍👦', '👨‍👩‍👧‍👧'][count - 1] : '👨‍👩‍👧‍👧'}
                  </div>
                  {count} 位
                </button>
              ))}
            </div>

            {/* Continue Button */}
            <button
              onClick={() => setStep('children')}
              className="w-full px-12 py-6 bg-gradient-to-r from-accent-moon to-accent-aurora text-brand-navy rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
            >
              繼續填寫資料 ({familyMemberCount} 位成員)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Children Setup Screen
  if (step === 'children') {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Animation Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/image2/雪狼男孩_天裂之時_里特與巨狼_無文字.png')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-brand-navy/60 to-black/80" />
        
        <div className="relative z-10 min-h-screen bg-gradient-to-br from-brand-navy/50 via-brand-midnight/50 to-black/50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full space-y-12 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-heading text-white">
              請填寫每位成員的資料
            </h2>
            <p className="text-lg text-white/60">
              已選擇 {familyMemberCount} 位家庭成員 • 還需填寫 {familyMemberCount - children.length} 位
            </p>
          </div>

          {/* Children List */}
          {children.length > 0 && (
            <div className="space-y-4">
              {children.map((child, index) => (
                <div
                  key={child.id}
                  className="px-8 py-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-between group hover:bg-white/15 transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-accent-moon to-accent-aurora rounded-full flex items-center justify-center text-2xl font-bold text-brand-navy">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-white">{child.name}</h3>
                      <div className="space-y-1">
                        <p className="text-white/60">
                          {child.age} 歲 • {child.gender === 'male' ? '男' : '女'}
                        </p>
                        {child.specialNeeds && (
                          <p className="text-accent-aurora text-sm">⚠️ {child.specialNeeds}</p>
                        )}
                        {child.hasAttendedBefore && (
                          <p className="text-accent-moon text-sm">✓ 曾參加過超夢莉媽媽錄音派對</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setChildren(children.filter(c => c.id !== child.id))}
                    className="opacity-0 group-hover:opacity-100 px-4 py-2 text-white/60 hover:text-white transition-all duration-300"
                  >
                    移除
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Child Form */}
          {children.length < familyMemberCount && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">孩子的名字 *</label>
                  <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="例如：小明"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300"
                  />
                </div>

                {/* Age Input */}
                <div className="space-y-2">
                  <label className="text-white/80 text-sm font-medium">年齡 *</label>
                  <input
                    type="number"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    placeholder="例如：8"
                    min="0"
                    max="18"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Gender Selection */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">性別 *</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewChildGender('male')}
                    className={`px-6 py-4 backdrop-blur-md border rounded-xl font-semibold transition-all duration-300 ${
                      newChildGender === 'male'
                        ? 'bg-accent-aurora/30 border-accent-aurora text-white'
                        : 'bg-white/10 border-white/20 text-white/60 hover:bg-white/15'
                    }`}
                  >
                    👦 男
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewChildGender('female')}
                    className={`px-6 py-4 backdrop-blur-md border rounded-xl font-semibold transition-all duration-300 ${
                      newChildGender === 'female'
                        ? 'bg-accent-aurora/30 border-accent-aurora text-white'
                        : 'bg-white/10 border-white/20 text-white/60 hover:bg-white/15'
                    }`}
                  >
                    👧 女
                  </button>
                </div>
              </div>

              {/* Special Needs (Optional) */}
              <div className="space-y-2">
                <label className="text-white/80 text-sm font-medium">特殊狀況需要留意（選填）</label>
                <textarea
                  value={newChildSpecialNeeds}
                  onChange={(e) => setNewChildSpecialNeeds(e.target.value)}
                  placeholder="例如：閱讀障礙需要慢慢來，比較害羞需要老師引導等"
                  rows={3}
                  className="w-full px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300 resize-none"
                />
              </div>

              {/* Has Attended Before Checkbox */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={newChildHasAttendedBefore}
                      onChange={(e) => setNewChildHasAttendedBefore(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-6 h-6 bg-white/10 border-2 border-white/20 rounded peer-checked:bg-accent-aurora peer-checked:border-accent-aurora transition-all duration-300 flex items-center justify-center">
                      {newChildHasAttendedBefore && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                    曾參加過超夢莉媽媽錄音派對
                  </span>
                </label>
              </div>

              <button
                onClick={handleAddChild}
                disabled={!newChildName || !newChildAge}
                className="w-full px-8 py-5 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white font-semibold text-lg hover:bg-white/20 hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                + 新增成員
              </button>
            </div>
          )}

          {/* Continue Button */}
          {children.length === familyMemberCount && (
            <button
              onClick={handleComplete}
              className="w-full px-12 py-6 bg-gradient-to-r from-accent-moon to-accent-aurora text-brand-navy rounded-full font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-500"
            >
              開始選擇課程 ({children.length} 位成員)
            </button>
          )}
        </div>
      </div>
      </div>
    );
  }

  return null;
}
