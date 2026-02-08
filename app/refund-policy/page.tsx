/**
 * Refund Policy Page
 * 
 * Displays detailed refund policy information for Snow Wolf activities
 */

'use client';

import { useLanguage } from '@/lib/context/LanguageContext';

export default function RefundPolicyPage() {
  const { language } = useLanguage();

  const content = {
    zh: {
      title: '退費政策',
      subtitle: '請仔細閱讀以下退費規定',
      venue: '活動地點',
      venueInfo: 'D.D.BOX（台北兒童新樂園內2F劇場）',
      photography: '活動記錄',
      photographyInfo: '活動會由專業攝影師全程記錄，照片及影片將授權用於社群媒體及活動分享，同時也會提供給家長作為紀念。',
      refundTitle: '退費標準',
      refund30Plus: '活動前30天以上',
      refund30PlusDetail: '全額退費，無需支付任何手續費',
      refund14to30: '活動前14-30天',
      refund14to30Detail: '退還90%費用（收取10%行政手續費）',
      refund7to13: '活動前7-13天',
      refund7to13Detail: '退還50%費用（已產生場地及人員預訂成本）',
      refund6orLess: '活動前6天內',
      refund6orLessDetail: '不予退費，但接受轉讓名額給其他家長',
      specialTitle: '特殊情況處理',
      medicalException: '醫療證明',
      medicalExceptionDetail: '如有醫療證明（如醫生診斷書），可保留名額至下一場次或轉讓他人，不受上述時間限制',
      organizerCancellation: '主辦方取消',
      organizerCancellationDetail: '如因不可抗力（如天災、疫情）或人數不足而取消活動，將全額退費或提供延期至下一場次的選項',
      processTitle: '退費流程',
      step1: '聯絡客服',
      step1Detail: '請透過電子郵件或電話聯絡我們的客服團隊',
      step2: '提供資訊',
      step2Detail: '提供訂單編號及退費原因（如有醫療證明請一併提供）',
      step3: '審核處理',
      step3Detail: '我們將在3個工作天內審核您的申請',
      step4: '退款完成',
      step4Detail: '審核通過後，退款將在7-14個工作天內退回原付款帳戶',
      contactTitle: '聯絡我們',
      contactInfo: '如有任何疑問，請隨時與我們聯繫：',
      email: '電子郵件',
      phone: '電話',
      backToHome: '返回首頁',
    },
    en: {
      title: 'Refund Policy',
      subtitle: 'Please read the following refund policy carefully',
      venue: 'Venue',
      venueInfo: 'D.D.BOX (2F Theater, Taipei Children\'s Amusement Park)',
      photography: 'Activity Recording',
      photographyInfo: 'Professional photographers will record the entire activity. Photos and videos will be authorized for social media and activity sharing, and will also be provided to parents as keepsakes.',
      refundTitle: 'Refund Standards',
      refund30Plus: '30+ Days Before Activity',
      refund30PlusDetail: '100% refund with no processing fee',
      refund14to30: '14-30 Days Before Activity',
      refund14to30Detail: '90% refund (10% administrative fee)',
      refund7to13: '7-13 Days Before Activity',
      refund7to13Detail: '50% refund (venue and staff booking costs incurred)',
      refund6orLess: 'Within 6 Days of Activity',
      refund6orLessDetail: 'No refund, but name transfer to other parents is accepted',
      specialTitle: 'Special Circumstances',
      medicalException: 'Medical Certificate',
      medicalExceptionDetail: 'With medical certificate (such as doctor\'s diagnosis), name can be preserved to next session or transferred to others, not subject to the above time restrictions',
      organizerCancellation: 'Organizer Cancellation',
      organizerCancellationDetail: 'In case of force majeure (such as natural disasters, epidemics) or insufficient participants, full refund or postponement to next session will be provided',
      processTitle: 'Refund Process',
      step1: 'Contact Customer Service',
      step1Detail: 'Please contact our customer service team via email or phone',
      step2: 'Provide Information',
      step2Detail: 'Provide order number and reason for refund (include medical certificate if applicable)',
      step3: 'Review Process',
      step3Detail: 'We will review your application within 3 business days',
      step4: 'Refund Completion',
      step4Detail: 'After approval, refund will be returned to original payment account within 7-14 business days',
      contactTitle: 'Contact Us',
      contactInfo: 'If you have any questions, please feel free to contact us:',
      email: 'Email',
      phone: 'Phone',
      backToHome: 'Back to Home',
    },
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-snow via-accent-ice/20 to-brand-snow">
      {/* Header */}
      <div className="bg-gradient-navy-frost border-b border-brand-frost">
        <div className="container-custom py-12">
          <h1 className="text-4xl md:text-5xl font-heading text-brand-snow mb-4">
            {t.title}
          </h1>
          <p className="text-lg text-brand-frost">
            {t.subtitle}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="container-custom py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Venue Information */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-brand-frost">
            <div className="flex items-start gap-4 mb-6">
              <div className="flex-shrink-0 w-12 h-12 bg-brand-navy/10 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-heading text-brand-navy mb-2">
                  📍 {t.venue}
                </h2>
                <p className="text-lg text-brand-midnight/80 font-semibold mb-4">
                  {t.venueInfo}
                </p>
                <div className="bg-accent-ice/20 rounded-lg p-4 border border-accent-ice/30">
                  <h3 className="text-base font-semibold text-brand-navy mb-2">
                    📸 {t.photography}
                  </h3>
                  <p className="text-brand-midnight/70 leading-relaxed">
                    {t.photographyInfo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Standards */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-brand-frost">
            <h2 className="text-2xl font-heading text-brand-navy mb-6">
              {t.refundTitle}
            </h2>
            <div className="space-y-4">
              {/* 30+ days */}
              <div className="flex items-start gap-3 p-4 bg-semantic-success/5 rounded-lg border border-semantic-success/20">
                <span className="text-semantic-success text-xl mt-0.5">✓</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-navy mb-1">{t.refund30Plus}</h3>
                  <p className="text-sm text-brand-midnight/70">{t.refund30PlusDetail}</p>
                </div>
              </div>

              {/* 14-30 days */}
              <div className="flex items-start gap-3 p-4 bg-semantic-success/5 rounded-lg border border-semantic-success/20">
                <span className="text-semantic-success text-xl mt-0.5">✓</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-navy mb-1">{t.refund14to30}</h3>
                  <p className="text-sm text-brand-midnight/70">{t.refund14to30Detail}</p>
                </div>
              </div>

              {/* 7-13 days */}
              <div className="flex items-start gap-3 p-4 bg-semantic-warning/5 rounded-lg border border-semantic-warning/20">
                <span className="text-semantic-warning text-xl mt-0.5">⚠</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-navy mb-1">{t.refund7to13}</h3>
                  <p className="text-sm text-brand-midnight/70">{t.refund7to13Detail}</p>
                </div>
              </div>

              {/* Within 6 days */}
              <div className="flex items-start gap-3 p-4 bg-semantic-error/5 rounded-lg border border-semantic-error/20">
                <span className="text-semantic-error text-xl mt-0.5">✕</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-navy mb-1">{t.refund6orLess}</h3>
                  <p className="text-sm text-brand-midnight/70">{t.refund6orLessDetail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Special Circumstances */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-brand-frost">
            <h2 className="text-2xl font-heading text-brand-navy mb-6">
              {t.specialTitle}
            </h2>
            <div className="space-y-4">
              {/* Medical Exception */}
              <div className="flex items-start gap-3 p-4 bg-accent-aurora/5 rounded-lg border border-accent-aurora/20">
                <span className="text-accent-aurora text-xl mt-0.5">ℹ</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-navy mb-1">{t.medicalException}</h3>
                  <p className="text-sm text-brand-midnight/70">{t.medicalExceptionDetail}</p>
                </div>
              </div>

              {/* Organizer Cancellation */}
              <div className="flex items-start gap-3 p-4 bg-accent-aurora/5 rounded-lg border border-accent-aurora/20">
                <span className="text-accent-aurora text-xl mt-0.5">ℹ</span>
                <div className="flex-1">
                  <h3 className="font-semibold text-brand-navy mb-1">{t.organizerCancellation}</h3>
                  <p className="text-sm text-brand-midnight/70">{t.organizerCancellationDetail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Process */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-brand-frost">
            <h2 className="text-2xl font-heading text-brand-navy mb-6">
              {t.processTitle}
            </h2>
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-navy text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-brand-navy mb-1">{t.step1}</h3>
                  <p className="text-sm text-brand-midnight/70">{t.step1Detail}</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-navy text-white rounded-full flex items-center justify-center font-bold">
                  2
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-brand-navy mb-1">{t.step2}</h3>
                  <p className="text-sm text-brand-midnight/70">{t.step2Detail}</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-navy text-white rounded-full flex items-center justify-center font-bold">
                  3
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-brand-navy mb-1">{t.step3}</h3>
                  <p className="text-sm text-brand-midnight/70">{t.step3Detail}</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-navy text-white rounded-full flex items-center justify-center font-bold">
                  4
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-brand-navy mb-1">{t.step4}</h3>
                  <p className="text-sm text-brand-midnight/70">{t.step4Detail}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gradient-to-r from-brand-navy to-brand-midnight rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-heading mb-4">
              {t.contactTitle}
            </h2>
            <p className="text-brand-frost mb-6">
              {t.contactInfo}
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <div className="text-sm text-brand-frost">{t.email}</div>
                  <a href="mailto:info@snowwolfboy.com" className="font-semibold hover:text-accent-aurora transition-colors">
                    info@snowwolfboy.com
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <div className="text-sm text-brand-frost">{t.phone}</div>
                  <a href="tel:+886912345678" className="font-semibold hover:text-accent-aurora transition-colors">
                    +886 912-345-678
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home Button */}
          <div className="text-center pt-4">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-8 py-3 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-midnight transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t.backToHome}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
