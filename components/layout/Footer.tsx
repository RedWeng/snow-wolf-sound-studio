'use client';

import React from 'react';
import Link from 'next/link';

export interface FooterProps {
  /**
   * Current language preference
   */
  language?: 'zh' | 'en';
}

/**
 * Footer component with contact information and links
 * Features:
 * - Contact information and links
 * - Social media icons
 * - Responsive layout
 * - Private booking inquiry link
 * 
 * Requirements: 14.1, 15.1
 */
export const Footer: React.FC<FooterProps> = ({ language = 'zh' }) => {
  // Translation strings
  const t = {
    zh: {
      tagline: '捕捉童年最美的時光',
      quickLinks: '快速連結',
      home: '首頁',
      sessions: '活動課程',
      about: '關於我們',
      contact: '聯絡我們',
      privateBooking: '私人包場諮詢',
      followUs: '追蹤我們',
      contactInfo: '聯絡資訊',
      email: '電子郵件',
      phone: '電話',
      address: '地址',
      copyright: '© 2024 Snow Wolf Boy. 版權所有。',
      privacyPolicy: '隱私政策',
      termsOfService: '服務條款',
      refundPolicy: '退費政策',
    },
    en: {
      tagline: 'Capturing the most beautiful moments of childhood',
      quickLinks: 'Quick Links',
      home: 'Home',
      sessions: 'Sessions',
      about: 'About',
      contact: 'Contact',
      privateBooking: 'Private Booking Inquiry',
      followUs: 'Follow Us',
      contactInfo: 'Contact Info',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      copyright: '© 2024 Snow Wolf Boy. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      termsOfService: 'Terms of Service',
      refundPolicy: 'Refund Policy',
    },
  };

  const translations = t[language];

  // Quick links
  const quickLinks = [
    { href: '/', label: translations.home },
    { href: '/sessions', label: translations.sessions },
    { href: '/about', label: translations.about },
    { href: '/contact', label: translations.contact },
    { href: '/private-booking', label: translations.privateBooking },
  ];

  // Social media links
  const socialLinks = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/snowwolfboy',
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/snowwolfboy',
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'LINE',
      href: 'https://line.me/ti/p/@snowwolfboy',
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@snowwolfboy',
      icon: (
        <svg
          className="w-6 h-6"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ];

  return (
    <footer className="bg-gradient-navy-frost border-t border-brand-frost">
      <div className="container-custom py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded-lg"
            >
              <div className="w-12 h-12 bg-gradient-navy-frost rounded-full flex items-center justify-center transition-transform duration-base group-hover:scale-110 border-2 border-brand-snow">
                <span className="text-brand-snow font-heading font-bold text-xl">
                  SW
                </span>
              </div>
              <span className="font-heading text-h4 text-brand-snow">
                Snow Wolf
              </span>
            </Link>
            <p className="text-body-sm text-brand-frost leading-relaxed">
              {translations.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-h4 text-brand-snow mb-4">
              {translations.quickLinks}
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-body-sm text-brand-frost hover:text-brand-snow transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded px-1 py-0.5 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading text-h4 text-brand-snow mb-4">
              {translations.contactInfo}
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-brand-frost mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <a
                  href="mailto:info@snowwolfboy.com"
                  className="text-body-sm text-brand-frost hover:text-brand-snow transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded"
                >
                  info@snowwolfboy.com
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-brand-frost mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <a
                  href="tel:+886912345678"
                  className="text-body-sm text-brand-frost hover:text-brand-snow transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded"
                >
                  +886 912-345-678
                </a>
              </li>
              <li className="flex items-start space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-brand-frost mt-0.5 flex-shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-body-sm text-brand-frost">
                  {language === 'zh'
                    ? 'D.D.BOX（台北兒童新樂園內2F劇場）'
                    : 'D.D.BOX (2F Theater, Taipei Children\'s Amusement Park)'}
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-heading text-h4 text-brand-snow mb-4">
              {translations.followUs}
            </h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="touch-target w-10 h-10 flex items-center justify-center rounded-full bg-brand-midnight/50 text-brand-frost hover:bg-brand-midnight hover:text-brand-snow transition-all duration-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora"
                  aria-label={`Follow us on ${social.name}`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-brand-midnight">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-body-sm text-brand-frost text-center md:text-left">
              {translations.copyright}
            </p>
            <div className="flex space-x-6">
              <Link
                href="/privacy"
                className="text-body-sm text-brand-frost hover:text-brand-snow transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded px-1 py-0.5"
              >
                {translations.privacyPolicy}
              </Link>
              <Link
                href="/terms"
                className="text-body-sm text-brand-frost hover:text-brand-snow transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded px-1 py-0.5"
              >
                {translations.termsOfService}
              </Link>
              <Link
                href="/refund-policy"
                className="text-body-sm text-brand-frost hover:text-brand-snow transition-colors duration-fast focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-aurora rounded px-1 py-0.5"
              >
                {translations.refundPolicy}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
