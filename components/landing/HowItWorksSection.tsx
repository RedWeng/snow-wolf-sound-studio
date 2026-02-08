/**
 * How It Works Section Component
 * 
 * 3-step process visualization emphasizing speed:
 * - Browse Sessions (3 seconds to understand)
 * - Add to Cart (30 seconds to order)
 * - Complete Payment (3 minutes total)
 * 
 * Requirements: 15.3, 15.7
 */

'use client';

interface HowItWorksSectionProps {
  language?: 'zh' | 'en';
}

const content = {
  zh: {
    title: '如何運作',
    subtitle: '簡單三步驟，快速完成報名',
    steps: [
      {
        number: '01',
        title: '瀏覽課程',
        description: '3秒理解課程內容',
        detail: '清晰的課程卡片展示所有重要資訊',
        icon: '🔍',
      },
      {
        number: '02',
        title: '填寫資料',
        description: '30秒完成選課',
        detail: '側邊欄快速選擇孩子與課程',
        icon: '📝',
      },
      {
        number: '03',
        title: '完成報名',
        description: '3分鐘完成報名',
        detail: '簡單的結帳流程與付款說明',
        icon: '✅',
      },
    ],
  },
  en: {
    title: 'How It Works',
    subtitle: 'Three simple steps to complete registration',
    steps: [
      {
        number: '01',
        title: 'Browse Sessions',
        description: '3 seconds to understand',
        detail: 'Clear session cards with all important information',
        icon: '🔍',
      },
      {
        number: '02',
        title: 'Fill Information',
        description: '30 seconds to order',
        detail: 'Quick child and session selection in sidebar',
        icon: '📝',
      },
      {
        number: '03',
        title: 'Complete Registration',
        description: '3 minutes to complete',
        detail: 'Simple checkout flow with payment instructions',
        icon: '✅',
      },
    ],
  },
};

export function HowItWorksSection({ language = 'zh' }: HowItWorksSectionProps) {
  const t = content[language];

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-brand-slate to-brand-frost/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading text-brand-navy">
            {t.title}
          </h2>
          <p className="text-lg sm:text-xl text-brand-midnight/80">
            {t.subtitle}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {t.steps.map((step, index) => (
            <div
              key={step.number}
              className="relative group"
              style={{
                animation: `fade-in-up 0.6s ease-out ${index * 0.2}s both`,
              }}
            >
              {/* Card */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-brand-frost">
                {/* Step Number */}
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-moon to-accent-aurora flex items-center justify-center text-brand-navy font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                </div>

                {/* Icon */}
                <div className="text-6xl mb-6 mt-4 text-center group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                {/* Content */}
                <div className="space-y-3 text-center">
                  <h3 className="text-2xl font-heading text-brand-navy">
                    {step.title}
                  </h3>
                  <p className="text-accent-aurora font-semibold">
                    {step.description}
                  </p>
                  <p className="text-brand-midnight/70 text-sm">
                    {step.detail}
                  </p>
                </div>
              </div>

              {/* Connector Arrow (desktop only) */}
              {index < t.steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-6 lg:-right-8 -translate-y-1/2 text-accent-ice text-3xl">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
