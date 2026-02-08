/**
 * FAQ Section Component
 * 
 * Accordion-style FAQ section answering common questions about
 * registration, payment, and cancellation.
 * 
 * Requirements: 15.6, 15.7
 */

'use client';

import { useState } from 'react';

interface FAQSectionProps {
  language?: 'zh' | 'en';
}

const content = {
  zh: {
    title: '常見問題',
    subtitle: '關於課程報名、付款與取消的常見疑問',
    faqs: [
      {
        question: '如何為孩子報名課程？',
        answer: '點擊課程卡片的「為孩子報名」按鈕，選擇要報名的孩子，然後在側邊欄完成報名流程即可。整個過程只需要3分鐘！',
      },
      {
        question: '可以為多個孩子報名嗎？',
        answer: '當然可以！您最多可以為4個孩子建立檔案。在報名清單中，您可以為不同的孩子選擇不同的課程，或讓多個孩子參加同一個課程。',
      },
      {
        question: '有多堂課程優惠嗎？',
        answer: '有的！報名2堂課程享9折優惠，報名3堂以上享85折優惠。優惠會在結帳時自動計算。',
      },
      {
        question: '付款期限是多久？',
        answer: '訂單建立後，您有5天（120小時）的時間完成付款。請在期限內上傳付款證明，我們會盡快確認您的報名。',
      },
      {
        question: '如果課程額滿怎麼辦？',
        answer: '您可以加入候補名單。當有名額釋出時，我們會依照候補順序發送通知，您將有24小時的時間確認報名。',
      },
      {
        question: '可以取消或更改報名嗎？',
        answer: '付款確認前，您可以隨時取消報名。付款確認後，請聯繫我們的客服團隊協助處理退款或更改事宜。',
      },
      {
        question: '什麼是群組代碼？',
        answer: '群組代碼讓您可以和朋友的孩子安排在同一個課程中。您可以建立新的群組代碼分享給朋友，或輸入朋友提供的代碼加入他們的群組。',
      },
      {
        question: '會收到課程提醒通知嗎？',
        answer: '會的！報名確認後，我們會在課程前7天、2天和1天發送提醒郵件，確保您不會錯過任何重要資訊。',
      },
    ],
  },
  en: {
    title: 'Frequently Asked Questions',
    subtitle: 'Common questions about course registration, payment, and cancellation',
    faqs: [
      {
        question: 'How do I register my child for a session?',
        answer: 'Click the "Register Child" button on a session card, select the child you want to register, and complete the registration process in the sidebar. The entire process takes only 3 minutes!',
      },
      {
        question: 'Can I register multiple children?',
        answer: 'Absolutely! You can create profiles for up to 4 children. In the registration list, you can select different sessions for different children, or have multiple children attend the same session.',
      },
      {
        question: 'Are there discounts for multiple sessions?',
        answer: 'Yes! Register for 2 sessions and get 10% off, or 3+ sessions for 15% off. Discounts are automatically calculated at checkout.',
      },
      {
        question: 'What is the payment deadline?',
        answer: 'After creating an order, you have 5 days (120 hours) to complete payment. Please upload payment proof within this period, and we will confirm your registration as soon as possible.',
      },
      {
        question: 'What if a session is full?',
        answer: 'You can join the waitlist. When a spot becomes available, we will notify you in order of the waitlist, and you will have 24 hours to confirm your registration.',
      },
      {
        question: 'Can I cancel or change my registration?',
        answer: 'Before payment confirmation, you can cancel your registration at any time. After payment confirmation, please contact our customer service team for assistance with refunds or changes.',
      },
      {
        question: 'What is a group code?',
        answer: 'A group code allows you to arrange for your children to be in the same session with friends. You can create a new group code to share with friends, or enter a code provided by friends to join their group.',
      },
      {
        question: 'Will I receive session reminder notifications?',
        answer: 'Yes! After registration confirmation, we will send reminder emails 7 days, 2 days, and 1 day before the session to ensure you don\'t miss any important information.',
      },
    ],
  },
};

export function FAQSection({ language = 'zh' }: FAQSectionProps) {
  const t = content[language];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 sm:py-32 bg-gradient-to-b from-white to-brand-frost/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-heading text-brand-navy">
            {t.title}
          </h2>
          <p className="text-lg sm:text-xl text-brand-midnight/80">
            {t.subtitle}
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {t.faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden border border-brand-frost"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 hover:bg-brand-frost/30 transition-colors duration-200 min-h-[44px]"
                >
                  <span className="text-lg font-semibold text-brand-navy pr-4">
                    {faq.question}
                  </span>
                  <span
                    className={`text-2xl text-brand-midnight transition-transform duration-300 flex-shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>

                {/* Answer */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-5 pt-2 text-brand-midnight/80 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
