/**
 * Cart Sidebar Component
 * 
 * Slides in from the right side to display cart items and checkout flow.
 * Supports multi-step checkout: Cart → Review → Group Code → Payment → Confirm
 * 
 * Requirements: 3.1, 3.4, 3.7, 3.8, 6.1-6.7, 7.1-7.6
 */

'use client';

import { useState } from 'react';
import { createOrder } from '@/lib/api/orders';
import { calculateDiscount, CartItem as DiscountCartItem } from '@/lib/api/discount-calculator';
import { DiscountDisplay } from '@/components/cart/DiscountDisplay';

type CheckoutStep = 'cart' | 'review' | 'group' | 'payment' | 'confirm';

interface CartItem {
  id: string;
  sessionId: string;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  price: number;
  childId?: string;
  childName?: string;
  childAge?: number;
  familyId?: string;
  roleId?: string | null;
  isAddon?: boolean;
  addonName?: string;
  type: 'individual' | 'family' | 'addon';
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (itemId: string) => void;
  onReassignChild: (itemId: string, newChildId: string) => void;
  onCheckout: () => void;
  language?: 'zh' | 'en';
  userId?: string;
}

const content = {
  zh: {
    // Cart view
    title: '家庭購物車',
    empty: '購物車是空的',
    emptyDescription: '還沒有為孩子選擇課程',
    browseSessions: '瀏覽課程',
    itemsCount: '項課程',
    basePrice: '課程費用',
    bundleDiscount: '多堂優惠',
    total: '總計',
    checkout: '前往結帳',
    remove: '移除',
    child: '孩子',
    age: '歲',
    close: '關閉',
    backToCart: '返回購物車',
    
    // Checkout steps
    step: '步驟',
    of: '/',
    
    // Review step
    reviewTitle: '確認訂單',
    reviewDescription: '請確認您的訂單內容',
    editCart: '編輯購物車',
    continueToGroup: '繼續',
    
    // Group code step
    groupTitle: '團體代碼 (選填)',
    groupDescription: '與朋友一起報名可享優惠',
    createGroup: '建立新團體',
    joinGroup: '加入現有團體',
    groupCode: '團體代碼',
    groupCodePlaceholder: '輸入團體代碼',
    skip: '跳過',
    continueToPayment: '繼續',
    yourGroupCode: '您的團體代碼',
    shareCode: '分享此代碼給朋友',
    
    // Payment step
    paymentTitle: '付款方式',
    paymentDescription: '選擇您的付款方式',
    bankTransfer: '銀行轉帳',
    linePay: 'LINE Pay',
    paymentDeadline: '付款期限',
    days: '天',
    notes: '備註 (選填)',
    notesPlaceholder: '有任何特殊需求嗎？',
    placeOrder: '確認訂單',
    
    // Confirm step
    confirmTitle: '訂單完成！',
    confirmDescription: '感謝您的訂購',
    orderNumber: '訂單編號',
    paymentInstructions: '付款說明',
    bankInfo: '銀行帳號：123-456-789',
    uploadProof: '請於期限內完成付款並上傳付款證明',
    viewOrder: '查看訂單',
    continueShopping: '繼續購物',
  },
  en: {
    // Cart view
    title: 'Family Cart',
    empty: 'Cart is Empty',
    emptyDescription: 'No sessions selected for your children yet',
    browseSessions: 'Browse Sessions',
    itemsCount: 'sessions',
    basePrice: 'Base Price',
    bundleDiscount: 'Bundle Discount',
    total: 'Total',
    checkout: 'Proceed to Checkout',
    remove: 'Remove',
    child: 'Child',
    age: 'years old',
    close: 'Close',
    backToCart: 'Back to Cart',
    
    // Checkout steps
    step: 'Step',
    of: 'of',
    
    // Review step
    reviewTitle: 'Review Order',
    reviewDescription: 'Please review your order',
    editCart: 'Edit Cart',
    continueToGroup: 'Continue',
    
    // Group code step
    groupTitle: 'Group Code (Optional)',
    groupDescription: 'Register with friends for discounts',
    createGroup: 'Create New Group',
    joinGroup: 'Join Existing Group',
    groupCode: 'Group Code',
    groupCodePlaceholder: 'Enter group code',
    skip: 'Skip',
    continueToPayment: 'Continue',
    yourGroupCode: 'Your Group Code',
    shareCode: 'Share this code with friends',
    
    // Payment step
    paymentTitle: 'Payment Method',
    paymentDescription: 'Choose your payment method',
    bankTransfer: 'Bank Transfer',
    linePay: 'LINE Pay',
    paymentDeadline: 'Payment Deadline',
    days: 'days',
    notes: 'Notes (Optional)',
    notesPlaceholder: 'Any special requirements?',
    placeOrder: 'Place Order',
    
    // Confirm step
    confirmTitle: 'Order Complete!',
    confirmDescription: 'Thank you for your order',
    orderNumber: 'Order Number',
    paymentInstructions: 'Payment Instructions',
    bankInfo: 'Bank Account: 123-456-789',
    uploadProof: 'Please complete payment and upload proof within deadline',
    viewOrder: 'View Order',
    continueShopping: 'Continue Shopping',
  },
};

function calculatePricing(items: CartItem[]) {
  // Convert CartItem to DiscountCartItem format
  const discountItems: DiscountCartItem[] = items.map(item => ({
    id: item.id,
    sessionId: item.sessionId,
    childId: item.childId,
    isAddon: item.isAddon || false,
    price: item.price,
    type: item.type || 'individual',
  }));
  
  const result = calculateDiscount(discountItems);
  
  return {
    basePrice: result.originalTotal,
    discount: result.discountAmount,
    total: result.finalTotal,
    discountRate: result.discountTier === '400' ? 0.1 : result.discountTier === '300' ? 0.05 : 0,
    discountTier: result.discountTier,
  };
}

export function CartSidebar({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onReassignChild: _onReassignChild,
  onCheckout: _onCheckout,
  language = 'zh',
  userId,
}: CartSidebarProps) {
  const t = content[language];
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [groupMode, setGroupMode] = useState<'create' | 'join' | null>(null);
  const [groupCode, setGroupCode] = useState('');
  const [generatedGroupCode, setGeneratedGroupCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'line_pay'>('bank_transfer');
  const [notes, setNotes] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [paymentDeadline, setPaymentDeadline] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const { basePrice, discount, total, discountTier } = calculatePricing(items);

  // Group items by child
  const itemsByChild = items.reduce((acc, item) => {
    const key = item.childId || 'addon';
    if (!acc[key]) {
      acc[key] = {
        childName: item.childName || '',
        childAge: item.childAge || 0,
        items: [],
      };
    }
    acc[key].items.push(item);
    return acc;
  }, {} as Record<string, { childName: string; childAge: number; items: CartItem[] }>);

  const handleRemove = (itemId: string) => {
    setRemovingItemId(itemId);
    setTimeout(() => {
      onRemoveItem(itemId);
      setRemovingItemId(null);
    }, 300);
  };

  const handleStartCheckout = () => {
    setCheckoutStep('review');
  };

  const handleBackToCart = () => {
    setCheckoutStep('cart');
  };

  const handleContinueToGroup = () => {
    setCheckoutStep('group');
  };

  const handleCreateGroup = () => {
    const code = `GROUP${Date.now().toString().slice(-6)}`;
    setGeneratedGroupCode(code);
    setGroupCode(code);
    setGroupMode('create');
  };

  const handleSkipGroup = () => {
    setGroupCode('');
    setGeneratedGroupCode('');
    setGroupMode(null);
    setCheckoutStep('payment');
  };

  const handleContinueToPayment = () => {
    setCheckoutStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (!userId) {
      alert(language === 'zh' ? '請先登入' : 'Please login first');
      return;
    }

    setIsProcessing(true);
    try {
      const order = await createOrder({
        parentId: userId,
        items: items
          .filter(item => item.childId) // Only include items with childId
          .map(item => ({
            sessionId: item.sessionId,
            childId: item.childId!,
            roleId: item.roleId || undefined,
          })),
        groupCode: groupCode || undefined,
        paymentMethod,
        notes: notes || undefined,
      });

      setOrderNumber(order.order_number);
      setPaymentDeadline(order.payment_deadline);
      setCheckoutStep('confirm');
      
      // Clear cart after successful order
      items.forEach(item => onRemoveItem(item.id));
    } catch (error) {
      console.error('Failed to create order:', error);
      alert(language === 'zh' ? '訂單建立失敗，請重試' : 'Failed to create order, please try again');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinueShopping = () => {
    setCheckoutStep('cart');
    setGroupMode(null);
    setGroupCode('');
    setGeneratedGroupCode('');
    setPaymentMethod('bank_transfer');
    setNotes('');
    setOrderNumber('');
    setPaymentDeadline('');
    onClose();
  };

  const handleViewOrder = () => {
    window.location.href = `/orders/${orderNumber}`;
  };

  const getStepNumber = () => {
    switch (checkoutStep) {
      case 'cart': return 0;
      case 'review': return 1;
      case 'group': return 2;
      case 'payment': return 3;
      case 'confirm': return 4;
      default: return 0;
    }
  };

  const totalSteps = 4;
  const currentStepNumber = getStepNumber();

  const calculateDaysRemaining = () => {
    if (!paymentDeadline) return 0;
    const deadline = new Date(paymentDeadline);
    const now = new Date();
    const diff = deadline.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-brand-frost bg-gradient-to-r from-brand-navy to-brand-midnight">
            <div>
              <h2 className="text-2xl font-heading text-white">
                {checkoutStep === 'cart' ? t.title : 
                 checkoutStep === 'review' ? t.reviewTitle :
                 checkoutStep === 'group' ? t.groupTitle :
                 checkoutStep === 'payment' ? t.paymentTitle :
                 t.confirmTitle}
              </h2>
              {checkoutStep === 'cart' && items.length > 0 && (
                <p className="text-accent-moon text-sm mt-1">
                  {items.length} {t.itemsCount}
                </p>
              )}
              {checkoutStep !== 'cart' && checkoutStep !== 'confirm' && (
                <p className="text-accent-moon text-sm mt-1">
                  {t.step} {currentStepNumber} {t.of} {totalSteps}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors min-h-[44px] min-w-[44px]"
              aria-label={t.close}
            >
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Progress Indicator */}
          {checkoutStep !== 'cart' && checkoutStep !== 'confirm' && (
            <div className="px-6 py-4 bg-brand-frost/20">
              <div className="flex items-center justify-between">
                {['review', 'group', 'payment'].map((step, index) => (
                  <div key={step} className="flex items-center flex-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      getStepNumber() > index + 1 ? 'bg-semantic-success text-white' :
                      getStepNumber() === index + 1 ? 'bg-brand-navy text-white' :
                      'bg-brand-frost text-brand-midnight/40'
                    }`}>
                      {index + 1}
                    </div>
                    {index < 2 && (
                      <div className={`flex-1 h-1 mx-2 ${
                        getStepNumber() > index + 1 ? 'bg-semantic-success' : 'bg-brand-frost'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Cart View */}
            {checkoutStep === 'cart' && (
              <>
                {items.length === 0 ? (
                  /* Empty State */
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <div className="w-24 h-24 bg-brand-frost/30 rounded-full flex items-center justify-center mb-6">
                      <svg className="w-12 h-12 text-brand-midnight/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-heading text-brand-navy mb-2">
                      {t.empty}
                    </h3>
                    <p className="text-brand-midnight/60 mb-6">
                      {t.emptyDescription}
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-3 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-midnight transition-colors min-h-[44px]"
                    >
                      {t.browseSessions}
                    </button>
                  </div>
                ) : (
                  /* Cart Items */
                  <div className="p-6 space-y-6">
                    {Object.entries(itemsByChild).map(([childId, { childName, childAge, items: childItems }]) => (
                      <div key={childId} className="space-y-3">
                        {/* Child Header */}
                        <div className="flex items-center gap-2 pb-2 border-b border-brand-frost">
                          <div className="w-8 h-8 bg-accent-aurora/20 rounded-full flex items-center justify-center">
                            <span className="text-sm">👤</span>
                          </div>
                          <div>
                            <div className="font-semibold text-brand-navy">
                              {childName}
                            </div>
                            <div className="text-xs text-brand-midnight/60">
                              {childAge} {t.age}
                            </div>
                          </div>
                        </div>

                        {/* Child's Items */}
                        {childItems.map((item) => (
                          <div
                            key={item.id}
                            className={`bg-brand-frost/20 rounded-xl p-4 border border-brand-frost transition-all duration-300 ${
                              removingItemId === item.id ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                            }`}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex-1">
                                <h4 className="font-semibold text-brand-navy mb-1">
                                  {item.sessionTitle}
                                </h4>
                                <div className="text-sm text-brand-midnight/70 space-y-1">
                                  <div>📅 {item.sessionDate}</div>
                                  <div>⏰ {item.sessionTime}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-brand-navy">
                                  NT${item.price.toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2 pt-3 border-t border-brand-frost/50">
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="flex-1 px-3 py-2 text-sm text-semantic-error hover:bg-semantic-error/10 rounded-lg transition-colors min-h-[44px]"
                              >
                                {t.remove}
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Review Step */}
            {checkoutStep === 'review' && (
              <div className="p-6 space-y-6">
                <p className="text-brand-midnight/70">{t.reviewDescription}</p>
                
                {/* Order Summary */}
                <div className="space-y-4">
                  {Object.entries(itemsByChild).map(([childId, { childName, childAge, items: childItems }]) => (
                    <div key={childId} className="bg-brand-frost/20 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-brand-frost">
                        <div className="w-6 h-6 bg-accent-aurora/20 rounded-full flex items-center justify-center">
                          <span className="text-xs">👤</span>
                        </div>
                        <div className="font-semibold text-brand-navy">
                          {childName} ({childAge} {t.age})
                        </div>
                      </div>
                      {childItems.map((item) => (
                        <div key={item.id} className="py-2 text-sm">
                          <div className="font-medium text-brand-navy">{item.sessionTitle}</div>
                          <div className="text-brand-midnight/60">
                            {item.sessionDate} • {item.sessionTime}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="bg-brand-frost/30 rounded-xl p-4 space-y-2">
                  <DiscountDisplay
                    originalTotal={basePrice}
                    discountAmount={discount}
                    finalTotal={total}
                    discountTier={discountTier}
                    language={language}
                    variant="light"
                  />
                </div>

                <button
                  onClick={handleBackToCart}
                  className="w-full px-4 py-3 text-brand-navy border border-brand-navy rounded-lg hover:bg-brand-frost/30 transition-colors min-h-[44px]"
                >
                  {t.editCart}
                </button>
              </div>
            )}

            {/* Group Code Step */}
            {checkoutStep === 'group' && (
              <div className="p-6 space-y-6">
                <p className="text-brand-midnight/70">{t.groupDescription}</p>

                {!groupMode && (
                  <div className="space-y-3">
                    <button
                      onClick={handleCreateGroup}
                      className="w-full px-6 py-4 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-midnight transition-colors min-h-[44px]"
                    >
                      {t.createGroup}
                    </button>
                    <button
                      onClick={() => setGroupMode('join')}
                      className="w-full px-6 py-4 border-2 border-brand-navy text-brand-navy rounded-lg font-semibold hover:bg-brand-frost/30 transition-colors min-h-[44px]"
                    >
                      {t.joinGroup}
                    </button>
                  </div>
                )}

                {groupMode === 'create' && generatedGroupCode && (
                  <div className="bg-accent-aurora/10 border-2 border-accent-aurora rounded-xl p-6 text-center">
                    <div className="text-sm text-brand-midnight/70 mb-2">{t.yourGroupCode}</div>
                    <div className="text-3xl font-bold text-brand-navy mb-2 font-mono">
                      {generatedGroupCode}
                    </div>
                    <div className="text-sm text-brand-midnight/60">{t.shareCode}</div>
                  </div>
                )}

                {groupMode === 'join' && (
                  <div>
                    <label className="block text-sm font-medium text-brand-navy mb-2">
                      {t.groupCode}
                    </label>
                    <input
                      type="text"
                      value={groupCode}
                      onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                      placeholder={t.groupCodePlaceholder}
                      className="w-full px-4 py-3 border-2 border-brand-frost rounded-lg focus:border-brand-navy focus:outline-none font-mono text-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Payment Step */}
            {checkoutStep === 'payment' && (
              <div className="p-6 space-y-6">
                <p className="text-brand-midnight/70">{t.paymentDescription}</p>

                {/* Payment Method Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t.paymentTitle}
                  </label>
                  
                  <button
                    onClick={() => setPaymentMethod('bank_transfer')}
                    className={`w-full px-6 py-4 rounded-lg border-2 transition-all min-h-[44px] text-left ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-brand-navy bg-brand-navy/5'
                        : 'border-brand-frost hover:border-brand-navy/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'bank_transfer' ? 'border-brand-navy' : 'border-brand-frost'
                      }`}>
                        {paymentMethod === 'bank_transfer' && (
                          <div className="w-3 h-3 rounded-full bg-brand-navy" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-brand-navy">{t.bankTransfer}</div>
                        <div className="text-sm text-brand-midnight/60">{t.paymentDeadline}: 5 {t.days}</div>
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => setPaymentMethod('line_pay')}
                    className={`w-full px-6 py-4 rounded-lg border-2 transition-all min-h-[44px] text-left ${
                      paymentMethod === 'line_pay'
                        ? 'border-brand-navy bg-brand-navy/5'
                        : 'border-brand-frost hover:border-brand-navy/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'line_pay' ? 'border-brand-navy' : 'border-brand-frost'
                      }`}>
                        {paymentMethod === 'line_pay' && (
                          <div className="w-3 h-3 rounded-full bg-brand-navy" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-brand-navy">{t.linePay}</div>
                        <div className="text-sm text-brand-midnight/60">{t.paymentDeadline}: 5 {t.days}</div>
                      </div>
                    </div>
                  </button>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    {t.notes}
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t.notesPlaceholder}
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-brand-frost rounded-lg focus:border-brand-navy focus:outline-none resize-none"
                  />
                </div>

                {/* Price Summary */}
                <div className="bg-brand-frost/30 rounded-xl p-4 space-y-2">
                  <DiscountDisplay
                    originalTotal={basePrice}
                    discountAmount={discount}
                    finalTotal={total}
                    discountTier={discountTier}
                    language={language}
                    variant="light"
                  />
                </div>
              </div>
            )}

            {/* Confirm Step */}
            {checkoutStep === 'confirm' && (
              <div className="p-6 space-y-6">
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-semantic-success/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-10 h-10 text-semantic-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-heading text-brand-navy mb-2">
                    {t.confirmTitle}
                  </h3>
                  <p className="text-brand-midnight/70">{t.confirmDescription}</p>
                </div>

                {/* Order Number */}
                <div className="bg-brand-frost/30 rounded-xl p-6 text-center">
                  <div className="text-sm text-brand-midnight/70 mb-2">{t.orderNumber}</div>
                  <div className="text-2xl font-bold text-brand-navy font-mono">
                    {orderNumber}
                  </div>
                </div>

                {/* Payment Instructions */}
                <div className="bg-accent-moon/10 border-2 border-accent-moon rounded-xl p-6">
                  <h4 className="font-semibold text-brand-navy mb-3">{t.paymentInstructions}</h4>
                  <div className="space-y-2 text-sm text-brand-midnight/80">
                    <div>{t.bankInfo}</div>
                    <div>{t.uploadProof}</div>
                    <div className="flex items-center gap-2 pt-2 text-semantic-warning">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">
                        {t.paymentDeadline}: {calculateDaysRemaining()} {t.days}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={handleViewOrder}
                    className="w-full px-6 py-4 bg-brand-navy text-white rounded-lg font-semibold hover:bg-brand-midnight transition-colors min-h-[44px]"
                  >
                    {t.viewOrder}
                  </button>
                  <button
                    onClick={handleContinueShopping}
                    className="w-full px-6 py-4 border-2 border-brand-navy text-brand-navy rounded-lg font-semibold hover:bg-brand-frost/30 transition-colors min-h-[44px]"
                  >
                    {t.continueShopping}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Actions based on step */}
          {items.length > 0 && checkoutStep === 'cart' && (
            <div className="border-t border-brand-frost bg-white p-6 space-y-4">
              {/* Important Notice */}
              <div className="bg-accent-aurora/10 border border-accent-aurora/30 rounded-lg p-4">
                <div className="flex items-start gap-2 mb-2">
                  <svg className="w-5 h-5 text-accent-aurora flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-semibold text-brand-navy text-sm mb-1">
                      {language === 'zh' ? '📍 活動地點' : '📍 Venue'}
                    </h4>
                    <p className="text-xs text-brand-midnight/80">
                      {language === 'zh' 
                        ? 'D.D.BOX（台北兒童新樂園內2F劇場）' 
                        : 'D.D.BOX (2F Theater, Taipei Children\'s Amusement Park)'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2 pt-2 border-t border-accent-aurora/20">
                  <svg className="w-5 h-5 text-semantic-warning flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="font-semibold text-brand-navy text-sm mb-1">
                      {language === 'zh' ? '退費政策' : 'Refund Policy'}
                    </h4>
                    <p className="text-xs text-brand-midnight/70 leading-relaxed">
                      {language === 'zh' 
                        ? '30天前全額退費 • 14-30天退90% • 7-13天退50% • 6天內可轉讓名額' 
                        : '30+ days: 100% • 14-30 days: 90% • 7-13 days: 50% • <6 days: Transfer only'}
                    </p>
                    <a 
                      href="/refund-policy" 
                      target="_blank"
                      className="text-xs text-brand-navy hover:text-accent-aurora underline mt-1 inline-block"
                    >
                      {language === 'zh' ? '查看完整政策 →' : 'View full policy →'}
                    </a>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2">
                <DiscountDisplay
                  originalTotal={basePrice}
                  discountAmount={discount}
                  finalTotal={total}
                  discountTier={discountTier}
                  language={language}
                  variant="light"
                />
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleStartCheckout}
                className="w-full px-6 py-4 bg-gradient-to-r from-brand-navy to-brand-midnight text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 min-h-[44px]"
              >
                {t.checkout}
              </button>
            </div>
          )}

          {checkoutStep === 'review' && (
            <div className="border-t border-brand-frost bg-white p-6 space-y-4">
              {/* Important Reminder */}
              <div className="bg-accent-moon/10 border border-accent-moon/30 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-accent-moon flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-brand-midnight/70">
                    {language === 'zh' 
                      ? '活動地點：D.D.BOX（台北兒童新樂園內2F劇場）• 專業攝影記錄' 
                      : 'Venue: D.D.BOX (2F Theater, Taipei Children\'s Amusement Park) • Professional photography'}
                  </p>
                </div>
              </div>

              <button
                onClick={handleContinueToGroup}
                className="w-full px-6 py-4 bg-gradient-to-r from-brand-navy to-brand-midnight text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 min-h-[44px]"
              >
                {t.continueToGroup}
              </button>
            </div>
          )}

          {checkoutStep === 'group' && (
            <div className="border-t border-brand-frost bg-white p-6 space-y-3">
              <button
                onClick={handleContinueToPayment}
                disabled={groupMode === 'join' && !groupCode}
                className="w-full px-6 py-4 bg-gradient-to-r from-brand-navy to-brand-midnight text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[44px]"
              >
                {t.continueToPayment}
              </button>
              {!groupMode && (
                <button
                  onClick={handleSkipGroup}
                  className="w-full px-6 py-3 text-brand-midnight/60 hover:text-brand-navy transition-colors min-h-[44px]"
                >
                  {t.skip}
                </button>
              )}
            </div>
          )}

          {checkoutStep === 'payment' && (
            <div className="border-t border-brand-frost bg-white p-6">
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full px-6 py-4 bg-gradient-to-r from-brand-navy to-brand-midnight text-white rounded-lg font-semibold text-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 min-h-[44px] flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>{language === 'zh' ? '處理中...' : 'Processing...'}</span>
                  </>
                ) : (
                  t.placeOrder
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
