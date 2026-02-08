/**
 * Login Page
 * 
 * OAuth authentication page with Google, LINE, and Facebook options.
 * Mock OAuth flow for development.
 * 
 * Requirements: 1.1, 1.2
 */

'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/context';
import { mockUsers } from '@/lib/mock-data/users';
import { LoadingSpinner } from '@/components/ui/Loading';

const content = {
  zh: {
    subtitle: '為孩子開啟聲音冒險之旅',
    loginWith: '使用以下方式登入',
    google: 'Google 登入',
    line: 'LINE 登入',
    facebook: 'Facebook 登入',
    loggingIn: '登入中...',
    error: '登入失敗，請稍後再試',
    demo: '示範模式',
    demoDesc: '使用測試帳號快速體驗',
    demoParent: '登入',
    // Email login/register
    emailLogin: '電子郵件快速註冊',
    emailLoginDesc: '輸入 Email 和密碼即可快速開始',
    email: '電子郵件',
    password: '密碼',
    loginButton: '開始使用',
    orDivider: '或',
    emailPlaceholder: '請輸入電子郵件',
    passwordPlaceholder: '請輸入密碼',
    fillAllFields: '請填寫所有欄位',
    autoRegisterHint: '首次使用將自動建立帳號',
  },
  en: {
    subtitle: 'Start Your Child\'s Sound Adventure',
    loginWith: 'Login with',
    google: 'Login with Google',
    line: 'Login with LINE',
    facebook: 'Login with Facebook',
    loggingIn: 'Logging in...',
    error: 'Login failed, please try again',
    demo: 'Demo Mode',
    demoDesc: 'Quick experience with test account',
    demoParent: 'Login',
    // Email login/register
    emailLogin: 'Quick Email Registration',
    emailLoginDesc: 'Enter email and password to get started',
    email: 'Email',
    password: 'Password',
    loginButton: 'Get Started',
    orDivider: 'OR',
    emailPlaceholder: 'Enter your email',
    passwordPlaceholder: 'Enter your password',
    fillAllFields: 'Please fill in all fields',
    autoRegisterHint: 'First-time users will be automatically registered',
  },
};

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const t = content[language];
  const redirectTo = searchParams.get('redirect') || '/sessions';

  const handleOAuthLogin = async (_provider: 'google' | 'line' | 'facebook') => {
    setIsLoading(true);
    setError('');

    try {
      // Simulate OAuth flow with delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Mock: Use first parent user
      const user = mockUsers.find(u => u.role === 'parent');
      if (user) {
        login(user);
        router.push(redirectTo);
      } else {
        setError(t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'parent' | 'admin') => {
    setIsLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const user = mockUsers.find(u => u.role === role);
      if (user) {
        login(user);
        router.push(role === 'admin' ? '/admin' : redirectTo);
      } else {
        setError(t.error);
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError(t.fillAllFields);
      return;
    }

    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock: Check if user exists
      let user = mockUsers.find(u => u.email === formData.email);
      
      if (!user) {
        // Auto-register: Create new user with minimal info
        const now = new Date().toISOString();
        user = {
          id: `user-${Date.now()}`,
          email: formData.email,
          full_name: formData.email.split('@')[0], // Temporary name
          phone: null, // Will be filled in onboarding
          language_preference: 'zh' as const,
          role: 'parent' as const,
          created_at: now,
          updated_at: now,
        };
        
        // Mark as new user needing onboarding
        localStorage.setItem('needs-onboarding', 'true');
      }

      if (user) {
        login(user);
        
        // Redirect to onboarding if new user, otherwise to intended page
        const needsOnboarding = localStorage.getItem('needs-onboarding') === 'true';
        if (needsOnboarding) {
          router.push('/onboarding');
        } else {
          router.push(redirectTo);
        }
      }
    } catch (err) {
      setError(t.error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy via-brand-midnight to-black">
        <div className="text-center">
          <LoadingSpinner size="lg" color="white" />
          <p className="mt-6 text-xl text-white">{t.loggingIn}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animation Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/image2/雪狼男孩_天裂之時_里特與巨狼_無文字.png')`,
        }}
      />
      
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-brand-navy/60 to-black/80" />
      
      {/* Ambient effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-moon/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-aurora/10 rounded-full blur-3xl" />

      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Language Switcher */}
          <div className="flex justify-end mb-6">
            <button
              onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
              className="px-4 py-2 bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-colors backdrop-blur-sm"
            >
              {language === 'zh' ? 'EN' : '中文'}
            </button>
          </div>

          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 shadow-2xl">
            {/* Header */}
            <div className="text-center mb-8">
              <p className="text-accent-moon text-lg drop-shadow-md">
                {t.subtitle}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 bg-semantic-error/20 border border-semantic-error/40 text-semantic-error text-center">
                {error}
              </div>
            )}

            {/* OAuth or Email Form */}
            {!showEmailForm ? (
              <>
                {/* OAuth Buttons */}
                <div className="space-y-4 mb-8">
                  <p className="text-white/80 text-sm text-center mb-4 font-medium">{t.loginWith}</p>
                  
                  <button
                    onClick={() => handleOAuthLogin('google')}
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-white hover:bg-gray-50 text-gray-800 font-semibold flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    {t.google}
                  </button>

                  <button
                    onClick={() => handleOAuthLogin('line')}
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-[#00B900] hover:bg-[#00A000] text-white font-semibold flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314"/>
                    </svg>
                    {t.line}
                  </button>

                  <button
                    onClick={() => handleOAuthLogin('facebook')}
                    disabled={isLoading}
                    className="w-full px-6 py-4 bg-[#1877F2] hover:bg-[#166FE5] text-white font-semibold flex items-center justify-center gap-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02]"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    {t.facebook}
                  </button>
                </div>

                {/* Divider */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/5 text-white/60">{t.orDivider}</span>
                  </div>
                </div>

                {/* Switch to Email Login */}
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full px-6 py-3 border border-white/30 text-white hover:bg-white/10 transition-colors font-medium"
                >
                  {t.emailLogin}
                </button>
              </>
            ) : (
              /* Email Login Form */
              <form onSubmit={handleEmailLogin} className="space-y-4 mb-8">
                <p className="text-white/70 text-sm text-center mb-4">{t.emailLoginDesc}</p>
                
                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t.email}</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder={t.emailPlaceholder}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-accent-aurora transition-colors"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">{t.password}</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder={t.passwordPlaceholder}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-accent-aurora transition-colors"
                    disabled={isLoading}
                  />
                </div>

                <p className="text-white/50 text-xs text-center">{t.autoRegisterHint}</p>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-accent-moon to-accent-aurora text-brand-navy font-bold hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {isLoading ? t.loggingIn : t.loginButton}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowEmailForm(false)}
                    className="text-white/60 hover:text-white text-sm transition-colors"
                  >
                    ← {t.loginWith}
                  </button>
                </div>
              </form>
            )}

            {/* Demo Mode */}
            <div className="pt-6 border-t border-white/10">
              <p className="text-white/80 text-sm text-center mb-3 font-medium">{t.demo}</p>
              <p className="text-white/60 text-xs text-center mb-4">{t.demoDesc}</p>
              <button
                onClick={() => handleDemoLogin('parent')}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-accent-moon/30 to-accent-aurora/30 hover:from-accent-moon/40 hover:to-accent-aurora/40 border border-accent-moon/40 text-white font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:scale-[1.02] backdrop-blur-sm"
              >
                {t.demoParent}
              </button>
            </div>

            {/* Important Information Notice */}
            <div className="mt-6 pt-6 border-t border-white/10 bg-gradient-to-r from-accent-aurora/20 to-accent-moon/20 border border-accent-aurora/40 p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-accent-aurora/30 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-aurora" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
                    <span>📍</span>
                    {language === 'zh' ? '重要資訊' : 'Important Information'}
                  </h3>
                  <div className="space-y-2 text-xs text-white/90">
                    <div className="flex items-start gap-2">
                      <span className="text-accent-moon mt-0.5">•</span>
                      <span>
                        {language === 'zh' 
                          ? '活動地點：D.D.BOX（台北兒童新樂園內2F劇場）' 
                          : 'Venue: D.D.BOX (2F Theater, Taipei Children\'s Amusement Park)'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-accent-moon mt-0.5">•</span>
                      <span>
                        {language === 'zh' 
                          ? '專業攝影師全程記錄，照片影片將授權社群分享' 
                          : 'Professional photography throughout, photos/videos authorized for social sharing'}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-accent-moon mt-0.5">•</span>
                      <span>
                        {language === 'zh' 
                          ? '退費政策：30天前全額退費，詳見' 
                          : 'Refund: 100% refund 30+ days before, see'}
                        {' '}
                        <a 
                          href="/refund-policy" 
                          target="_blank"
                          className="text-accent-aurora hover:text-white underline font-semibold transition-colors"
                        >
                          {language === 'zh' ? '完整政策' : 'full policy'}
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-navy via-brand-midnight to-black">
        <div className="text-center">
          <LoadingSpinner size="lg" color="white" />
          <p className="mt-6 text-xl text-white">載入中...</p>
        </div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  );
}
