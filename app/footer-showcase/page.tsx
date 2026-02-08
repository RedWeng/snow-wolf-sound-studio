'use client';

import { useState } from 'react';
import { Footer } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function FooterShowcasePage() {
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');

  return (
    <div className="min-h-screen flex flex-col bg-brand-snow">
      <main className="flex-1">
        <div className="container-custom py-12">
          <h1 className="font-heading text-h1 text-brand-navy mb-8">
            Footer Component Showcase
          </h1>

          <Card className="mb-8 p-6">
            <h2 className="font-heading text-h3 text-brand-navy mb-4">
              Language Selector
            </h2>
            <div className="flex gap-4">
              <Button
                variant={language === 'zh' ? 'primary' : 'secondary'}
                onClick={() => setLanguage('zh')}
              >
                繁體中文
              </Button>
              <Button
                variant={language === 'en' ? 'primary' : 'secondary'}
                onClick={() => setLanguage('en')}
              >
                English
              </Button>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="font-heading text-h2 text-brand-navy mb-4">
              Footer Features
            </h2>
            <ul className="list-disc list-inside space-y-2 text-body text-brand-slate">
              <li>Contact information and links</li>
              <li>Social media icons (Facebook, Instagram, LINE, YouTube)</li>
              <li>Responsive layout (mobile, tablet, desktop)</li>
              <li>Private booking inquiry link</li>
              <li>Bilingual support (Traditional Chinese / English)</li>
              <li>Cinematic Snow Wolf branding</li>
            </ul>
          </Card>

          <div className="h-96"></div>
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
}
