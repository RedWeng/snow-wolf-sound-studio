/**
 * Private Booking Inquiry Modal
 * 
 * Modal for submitting private booking inquiries.
 * Includes contact form and special requirements.
 * 
 * Requirements: 14.2
 */

'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface PrivateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'zh' | 'en';
}

const content = {
  zh: {
    title: '私人預約詢問',
    description: '填寫以下資訊，我們會盡快與您聯繫',
    name: '聯絡人姓名',
    namePlaceholder: '請輸入您的姓名',
    nameRequired: '請輸入姓名',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    emailRequired: '請輸入 Email',
    emailInvalid: '請輸入有效的 Email',
    phone: '聯絡電話',
    phonePlaceholder: '0912-345-678',
    phoneRequired: '請輸入聯絡電話',
    preferredDates: '希望日期',
    preferredDatesPlaceholder: '例如：2024/03/15 或 週末',
    groupSize: '參加人數',
    groupSizePlaceholder: '請輸入人數',
    groupSizeRequired: '請輸入人數',
    groupSizeInvalid: '人數必須大於 0',
    requirements: '特殊需求',
    requirementsPlaceholder: '請告訴我們您的特殊需求或想法...',
    cancel: '取消',
    submit: '送出詢問',
    submitting: '送出中...',
    success: '詢問已送出！',
    successMessage: '感謝您的詢問，我們會盡快與您聯繫。',
    error: '送出失敗',
    errorMessage: '請稍後再試，或直接聯繫我們。',
  },
  en: {
    title: 'Private Booking Inquiry',
    description: 'Fill in the information below and we will contact you soon',
    name: 'Contact Name',
    namePlaceholder: 'Enter your name',
    nameRequired: 'Name is required',
    email: 'Email',
    emailPlaceholder: 'your@email.com',
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email',
    phone: 'Phone',
    phonePlaceholder: '0912-345-678',
    phoneRequired: 'Phone is required',
    preferredDates: 'Preferred Dates',
    preferredDatesPlaceholder: 'e.g., 2024/03/15 or Weekends',
    groupSize: 'Group Size',
    groupSizePlaceholder: 'Enter number of participants',
    groupSizeRequired: 'Group size is required',
    groupSizeInvalid: 'Group size must be greater than 0',
    requirements: 'Special Requirements',
    requirementsPlaceholder: 'Tell us about your special requirements or ideas...',
    cancel: 'Cancel',
    submit: 'Submit Inquiry',
    submitting: 'Submitting...',
    success: 'Inquiry Submitted!',
    successMessage: 'Thank you for your inquiry. We will contact you soon.',
    error: 'Submission Failed',
    errorMessage: 'Please try again later or contact us directly.',
  },
};

export function PrivateBookingModal({
  isOpen,
  onClose,
  language = 'zh',
}: PrivateBookingModalProps) {
  const t = content[language];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDates: '',
    groupSize: '',
    requirements: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    groupSize: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validate = () => {
    const newErrors = { name: '', email: '', phone: '', groupSize: '' };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = t.nameRequired;
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.emailRequired;
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t.emailInvalid;
      isValid = false;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.phoneRequired;
      isValid = false;
    }

    if (!formData.groupSize) {
      newErrors.groupSize = t.groupSizeRequired;
      isValid = false;
    } else {
      const size = parseInt(formData.groupSize);
      if (isNaN(size) || size <= 0) {
        newErrors.groupSize = t.groupSizeInvalid;
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Send inquiry to backend API
      // In production, this would call an API endpoint
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setSubmitStatus('success');
      
      // Reset form after success
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          preferredDates: '',
          groupSize: '',
          requirements: '',
        });
        setSubmitStatus('idle');
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to submit inquiry:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        preferredDates: '',
        groupSize: '',
        requirements: '',
      });
      setErrors({ name: '', email: '', phone: '', groupSize: '' });
      setSubmitStatus('idle');
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title={t.title}
      description={t.description}
      size="lg"
    >
      {submitStatus === 'success' ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✓</div>
          <h3 className="text-2xl font-heading text-semantic-success mb-2">
            {t.success}
          </h3>
          <p className="text-brand-midnight/70">{t.successMessage}</p>
        </div>
      ) : submitStatus === 'error' ? (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">✗</div>
          <h3 className="text-2xl font-heading text-semantic-error mb-2">
            {t.error}
          </h3>
          <p className="text-brand-midnight/70 mb-6">{t.errorMessage}</p>
          <Button
            variant="primary"
            onClick={() => setSubmitStatus('idle')}
          >
            {language === 'zh' ? '重試' : 'Try Again'}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-brand-navy mb-2">
              {t.name} <span className="text-semantic-error">*</span>
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder={t.namePlaceholder}
              error={errors.name}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-brand-navy mb-2">
              {t.email} <span className="text-semantic-error">*</span>
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder={t.emailPlaceholder}
              error={errors.email}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-brand-navy mb-2">
              {t.phone} <span className="text-semantic-error">*</span>
            </label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder={t.phonePlaceholder}
              error={errors.phone}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Preferred Dates */}
            <div>
              <label htmlFor="preferredDates" className="block text-sm font-semibold text-brand-navy mb-2">
                {t.preferredDates}
              </label>
              <Input
                id="preferredDates"
                type="text"
                value={formData.preferredDates}
                onChange={(e) => setFormData({ ...formData, preferredDates: e.target.value })}
                placeholder={t.preferredDatesPlaceholder}
              />
            </div>

            {/* Group Size */}
            <div>
              <label htmlFor="groupSize" className="block text-sm font-semibold text-brand-navy mb-2">
                {t.groupSize} <span className="text-semantic-error">*</span>
              </label>
              <Input
                id="groupSize"
                type="number"
                min="1"
                value={formData.groupSize}
                onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                placeholder={t.groupSizePlaceholder}
                error={errors.groupSize}
              />
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label htmlFor="requirements" className="block text-sm font-semibold text-brand-navy mb-2">
              {t.requirements}
            </label>
            <textarea
              id="requirements"
              value={formData.requirements}
              onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
              placeholder={t.requirementsPlaceholder}
              rows={4}
              className="w-full px-4 py-3 border-2 border-brand-frost rounded-lg focus:outline-none focus:border-accent-aurora transition-colors resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              {t.cancel}
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? t.submitting : t.submit}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
