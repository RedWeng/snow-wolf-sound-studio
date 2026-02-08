'use client';

import { useState } from 'react';
import { PublicLayout, AuthenticatedLayout, AdminLayout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function LayoutShowcasePage() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [layoutType, setLayoutType] = useState<'public' | 'authenticated' | 'admin'>('public');

  // Mock user data
  const mockParentUser = {
    id: 'user-1',
    name: '王小明',
    email: 'parent1@example.com',
    avatar: undefined,
    role: 'parent' as const,
  };

  const mockAdminUser = {
    id: 'admin-1',
    name: '張經理',
    email: 'owner@snowwolfboy.com',
    avatar: undefined,
    role: 'owner' as const,
  };

  const handleLogin = () => {
    alert('Login clicked');
  };

  const handleLogout = () => {
    alert('Logout clicked');
  };

  const renderContent = () => (
    <div className="container-custom py-12">
      <h1 className="font-heading text-h1 text-brand-navy mb-8">
        Layout Showcase
      </h1>

      {/* Layout Type Selector */}
      <Card className="mb-8 p-6">
        <h2 className="font-heading text-h3 text-brand-navy mb-4">
          Select Layout Type
        </h2>
        <div className="flex flex-wrap gap-4">
          <Button
            variant={layoutType === 'public' ? 'primary' : 'secondary'}
            onClick={() => setLayoutType('public')}
          >
            Public Layout
          </Button>
          <Button
            variant={layoutType === 'authenticated' ? 'primary' : 'secondary'}
            onClick={() => setLayoutType('authenticated')}
          >
            Authenticated Layout
          </Button>
          <Button
            variant={layoutType === 'admin' ? 'primary' : 'secondary'}
            onClick={() => setLayoutType('admin')}
          >
            Admin Layout
          </Button>
        </div>
      </Card>

      {/* Content */}
      <Card className="p-8">
        <h2 className="font-heading text-h2 text-brand-navy mb-4">
          {language === 'zh' ? '頁面內容' : 'Page Content'}
        </h2>
        <p className="text-body text-brand-slate mb-4">
          {language === 'zh'
            ? '這是一個展示頁面，用於測試不同的佈局組件。您可以切換語言和佈局類型來查看不同的效果。'
            : 'This is a showcase page for testing different layout components. You can switch language and layout type to see different effects.'}
        </p>
        <p className="text-body text-brand-slate mb-4">
          {language === 'zh'
            ? '當前佈局類型：'
            : 'Current layout type: '}
          <strong>{layoutType}</strong>
        </p>
        <p className="text-body text-brand-slate">
          {language === 'zh'
            ? '當前語言：'
            : 'Current language: '}
          <strong>{language === 'zh' ? '繁體中文' : 'English'}</strong>
        </p>
      </Card>
    </div>
  );

  // Render based on layout type
  if (layoutType === 'public') {
    return (
      <PublicLayout
        language={language}
        onLanguageChange={setLanguage}
        onLogin={handleLogin}
      >
        {renderContent()}
      </PublicLayout>
    );
  }

  if (layoutType === 'authenticated') {
    return (
      <AuthenticatedLayout
        user={mockParentUser}
        language={language}
        onLanguageChange={setLanguage}
        onLogout={handleLogout}
      >
        {renderContent()}
      </AuthenticatedLayout>
    );
  }

  return (
    <AdminLayout
      user={mockAdminUser}
      language={language}
      onLanguageChange={setLanguage}
      onLogout={handleLogout}
    >
      {renderContent()}
    </AdminLayout>
  );
}
