/**
 * Session Detail Modal Component
 * 
 * Displays detailed information about a session when user clicks on a session card.
 * Shows full description, capacity status, pricing, and action buttons.
 * 
 * Requirements: 2.2, 2.3, 2.6
 */

'use client';

import React from 'react';
import { Session } from '@/lib/types/database';
import { Modal } from '@/components/ui/Modal';

interface SessionDetailModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (sessionId: string, roleId?: string | null) => void;
  onJoinWaitlist: (sessionId: string) => void;
  language?: 'zh' | 'en';
}

const content = {
  zh: {
    close: '關閉',
    addToCart: '為孩子報名',
    joinWaitlist: '加入候補',
    duration: '課程時長',
    minutes: '分鐘',
    capacity: '課程容量',
    spots: '個名額',
    ageRange: '適合年齡',
    years: '歲',
    price: '課程費用',
    available: '名額充足',
    limited: '名額有限',
    full: '已額滿',
    story: '故事簡介',
    description: '課程內容',
    venue: '活動地點',
    venueInfo: 'D.D.BOX（台北兒童新樂園內2F劇場）',
    photography: '活動記錄',
    photographyInfo: '活動會由專業攝影師全程記錄，照片及影片將授權用於社群媒體及活動分享，同時也會提供給家長作為紀念。',
    refundPolicy: '退費政策',
    refundPolicyToggle: '查看退費政策',
    refund30Plus: '活動前30天以上：全額退費',
    refund14to30: '活動前14-30天：退還90%（收取10%行政手續費）',
    refund7to13: '活動前7-13天：退還50%（已產生場地及人員預訂成本）',
    refund6orLess: '活動前6天內：不予退費，但接受轉讓名額',
    medicalException: '特殊情況：如有醫療證明，可保留名額至下一場次或轉讓他人',
    organizerCancellation: '主辦方取消：如因不可抗力或人數不足取消活動，將全額退費或提供延期選項',
  },
  en: {
    close: 'Close',
    addToCart: 'Register Child',
    joinWaitlist: 'Join Waitlist',
    duration: 'Duration',
    minutes: 'minutes',
    capacity: 'Capacity',
    spots: 'spots',
    ageRange: 'Age Range',
    years: 'years',
    price: 'Price',
    available: 'Available',
    limited: 'Limited',
    full: 'Full',
    story: 'Story',
    description: 'Description',
    venue: 'Venue',
    venueInfo: 'D.D.BOX (2F Theater, Taipei Children\'s Amusement Park)',
    photography: 'Activity Recording',
    photographyInfo: 'Professional photographers will record the entire activity. Photos and videos will be authorized for social media and activity sharing, and will also be provided to parents as keepsakes.',
    refundPolicy: 'Refund Policy',
    refundPolicyToggle: 'View Refund Policy',
    refund30Plus: '30+ days before: 100% refund',
    refund14to30: '14-30 days before: 90% refund (10% admin fee)',
    refund7to13: '7-13 days before: 50% refund (venue and staff booking costs incurred)',
    refund6orLess: 'Within 6 days: No refund, but name transfer accepted',
    medicalException: 'Special circumstances: With medical certificate, name can be preserved to next session or transferred',
    organizerCancellation: 'Organizer cancellation: Full refund or postponement option for force majeure or insufficient participants',
  },
};

function getAvailabilityStatus(capacity: number, registered: number): 'available' | 'limited' | 'full' {
  const remaining = capacity - registered;
  if (remaining === 0) return 'full';
  if (remaining <= 3) return 'limited';
  return 'available';
}

export function SessionDetailModal({
  session,
  isOpen,
  onClose,
  onAddToCart,
  onJoinWaitlist,
  language = 'zh',
}: SessionDetailModalProps) {
  const t = content[language];
  const [showRefundPolicy, setShowRefundPolicy] = React.useState(false);

  if (!session) return null;

  const title = language === 'zh' ? session.title_zh : session.title_en;
  const theme = language === 'zh' ? session.theme_zh : session.theme_en;
  const story = language === 'zh' ? session.story_zh : session.story_en;
  const description = language === 'zh' ? session.description_zh : session.description_en;

  // Mock registered count for demo
  const registeredCount = Math.floor(Math.random() * session.capacity);
  const status = getAvailabilityStatus(session.capacity, registeredCount);
  const isFull = status === 'full';
  const remaining = session.capacity - registeredCount;

  const statusColors = {
    available: 'bg-semantic-success/10 text-semantic-success border-semantic-success/20',
    limited: 'bg-semantic-warning/10 text-semantic-warning border-semantic-warning/20',
    full: 'bg-semantic-error/10 text-semantic-error border-semantic-error/20',
  };

  return (
    <Modal open={isOpen} onOpenChange={(open) => !open && onClose()} size="xl" showClose={false}>
      <div className="relative">
        {/* Hero Image Section */}
        <div className="relative h-64 sm:h-80 -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/80 via-brand-midnight/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-transparent to-transparent z-10" />
          
          {/* Placeholder - replace with actual image */}
          <div className="w-full h-full bg-gradient-to-br from-accent-ice to-accent-aurora" />
          
          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-20">
            <h2 className="text-3xl sm:text-4xl font-heading text-white mb-2">
              {title}
            </h2>
            <p className="text-accent-moon text-lg font-medium">
              {theme}
            </p>
          </div>

          {/* Availability Badge */}
          <div className="absolute top-4 right-4 z-20">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusColors[status]} backdrop-blur-sm`}>
              {t[status]}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          {/* Key Information Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Date & Time */}
            <div className="col-span-2 bg-brand-frost/20 rounded-xl p-4 border border-brand-frost">
              <div className="text-sm text-brand-midnight/60 mb-1">📅 {language === 'zh' ? '日期時間' : 'Date & Time'}</div>
              <div className="font-semibold text-brand-navy">
                {new Date(session.date).toLocaleDateString(language === 'zh' ? 'zh-TW' : 'en-US')}
                {session.day_of_week && ` (${session.day_of_week})`}
              </div>
              <div className="text-sm text-brand-midnight/80">
                ⏰ {session.time}
                {session.duration_minutes && (() => {
                  const [hours, minutes] = session.time.split(':').map(Number);
                  const endMinutes = hours * 60 + minutes + session.duration_minutes;
                  const endHours = Math.floor(endMinutes / 60);
                  const endMins = endMinutes % 60;
                  return `-${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
                })()}
              </div>
            </div>

            {/* Duration */}
            <div className="bg-brand-frost/20 rounded-xl p-4 border border-brand-frost">
              <div className="text-sm text-brand-midnight/60 mb-1">{t.duration}</div>
              <div className="font-semibold text-brand-navy">
                {session.duration_minutes}
              </div>
              <div className="text-sm text-brand-midnight/80">{t.minutes}</div>
            </div>

            {/* Age Range */}
            <div className="bg-brand-frost/20 rounded-xl p-4 border border-brand-frost">
              <div className="text-sm text-brand-midnight/60 mb-1">{t.ageRange}</div>
              <div className="font-semibold text-brand-navy">
                {session.age_min}-{session.age_max}
              </div>
              <div className="text-sm text-brand-midnight/80">{t.years}</div>
            </div>
          </div>

          {/* Capacity Status */}
          <div className="bg-gradient-to-r from-accent-aurora/10 to-accent-ice/10 rounded-xl p-4 border border-accent-aurora/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-brand-midnight/60 mb-1">{t.capacity}</div>
                <div className="font-semibold text-brand-navy">
                  {registeredCount} / {session.capacity} {t.spots}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-brand-navy">
                  {remaining}
                </div>
                <div className="text-sm text-brand-midnight/60">
                  {language === 'zh' ? '剩餘名額' : 'Remaining'}
                </div>
              </div>
            </div>
          </div>

          {/* Story Section */}
          {story && (
            <div>
              <h3 className="text-xl font-heading text-brand-navy mb-3">
                {t.story}
              </h3>
              <p className="text-brand-midnight/80 leading-relaxed">
                {story}
              </p>
            </div>
          )}

          {/* Description Section */}
          <div>
            <h3 className="text-xl font-heading text-brand-navy mb-3">
              {t.description}
            </h3>
            <p className="text-brand-midnight/80 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Venue Information */}
          <div className="bg-gradient-to-r from-accent-ice/20 to-accent-aurora/10 rounded-xl p-5 border border-accent-ice/30">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-brand-navy/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-heading text-brand-navy mb-2">
                  📍 {t.venue}
                </h3>
                <p className="text-brand-midnight/80 font-semibold mb-3">
                  {t.venueInfo}
                </p>
                <div className="bg-white/50 rounded-lg p-3 border border-brand-frost/50">
                  <h4 className="text-sm font-semibold text-brand-navy mb-1">
                    📸 {t.photography}
                  </h4>
                  <p className="text-sm text-brand-midnight/70 leading-relaxed">
                    {t.photographyInfo}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Refund Policy Section */}
          <div className="border border-brand-frost rounded-xl overflow-hidden">
            <button
              onClick={() => setShowRefundPolicy(!showRefundPolicy)}
              className="w-full flex items-center justify-between p-4 bg-brand-frost/10 hover:bg-brand-frost/20 transition-colors duration-200"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-brand-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="font-heading text-brand-navy font-semibold">
                  {t.refundPolicy}
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-brand-navy transition-transform duration-200 ${showRefundPolicy ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showRefundPolicy && (
              <div className="p-4 bg-white border-t border-brand-frost">
                <ul className="space-y-3">
                  <li className="flex items-start gap-2">
                    <span className="text-semantic-success mt-0.5">✓</span>
                    <span className="text-sm text-brand-midnight/80">{t.refund30Plus}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-semantic-success mt-0.5">✓</span>
                    <span className="text-sm text-brand-midnight/80">{t.refund14to30}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-semantic-warning mt-0.5">⚠</span>
                    <span className="text-sm text-brand-midnight/80">{t.refund7to13}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-semantic-error mt-0.5">✕</span>
                    <span className="text-sm text-brand-midnight/80">{t.refund6orLess}</span>
                  </li>
                  <li className="flex items-start gap-2 pt-2 border-t border-brand-frost">
                    <span className="text-accent-aurora mt-0.5">ℹ</span>
                    <span className="text-sm text-brand-midnight/80">{t.medicalException}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-accent-aurora mt-0.5">ℹ</span>
                    <span className="text-sm text-brand-midnight/80">{t.organizerCancellation}</span>
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* Price and Action Section */}
          <div className="pt-6 border-t border-brand-frost">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-sm text-brand-midnight/60 mb-1">{t.price}</div>
                <div className="text-4xl font-bold text-brand-navy">
                  NT${session.price.toLocaleString()}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-brand-frost text-brand-midnight rounded-lg font-semibold hover:bg-brand-frost/30 transition-colors duration-200 min-h-[44px]"
              >
                {t.close}
              </button>
              <button
                onClick={() => {
                  if (isFull) {
                    onJoinWaitlist(session.id);
                  } else {
                    onAddToCart(session.id, null);
                  }
                  onClose();
                }}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold transition-all duration-200 min-h-[44px] ${
                  isFull
                    ? 'bg-semantic-warning text-white hover:bg-semantic-warning/90'
                    : 'bg-brand-navy text-white hover:bg-brand-midnight hover:shadow-lg'
                }`}
              >
                {isFull ? t.joinWaitlist : t.addToCart}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
