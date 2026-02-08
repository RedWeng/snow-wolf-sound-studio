/**
 * Checkout Page - Payment & Order Summary
 * 
 * First time prices are shown
 * Premium immersive checkout experience
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PaymentMethodSelector from '@/components/checkout/PaymentMethodSelector';
import { calculateDiscount, CartItem as DiscountCartItem } from '@/lib/api/discount-calculator';

interface OrderItem {
  sessionId: string;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  childName: string;
  childAge: number;
  price: number;
  roleId?: string | null;
  needsRoleSelection?: boolean;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<'zh' | 'en'>('zh');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [parentInfo, setParentInfo] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    lineId: '',
    fbId: '',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'jkopay' | 'bank_transfer' | 'line_pay' | null>(null);
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [transferCode, setTransferCode] = useState('');

  const content = {
    zh: {
      title: '確認報名資訊',
      subtitle: '請確認您的報名內容與付款資訊',
      orderSummary: '報名摘要',
      parentInfo: '家長資訊',
      paymentInfo: '付款資訊',
      paymentMethod: '付款方式',
      selectPaymentMethod: '請選擇付款方式',
      name: '姓名',
      email: 'Email',
      phone: '手機號碼',
      lineId: 'LINE ID',
      fbId: 'Facebook ID',
      notes: '備註',
      notesPlaceholder: '孩子有無特殊狀況或需求需要我們留意',
      required: '必填',
      optional: '選填',
      subtotal: '小計',
      total: '總計',
      confirmPayment: '確認付款',
      backToSessions: '返回選課',
      child: '孩子',
      session: '課程',
      date: '日期',
      time: '時間',
      price: '價格',
      creditCard: '信用卡',
      bankTransfer: '銀行轉帳 / ATM',
      linePay: 'LINE Pay',
      jkoPay: '街口支付',
      paymentNote: '完成報名後，請於 3 天內完成付款',
      paymentInstructions: '付款說明',
      bankAccount: '銀行帳號',
      bankName: '銀行名稱',
      accountNumber: '帳號',
      accountName: '戶名',
      transferNote: '轉帳備註',
      pleaseNote: '請備註',
      uploadProof: '上傳付款證明',
      uploadProofDesc: '請上傳轉帳截圖或付款證明',
      transferLastFive: '轉帳帳號後五碼',
      enterLastFive: '請輸入轉帳帳號後五碼',
      paymentCompleted: '我已完成付款',
      jkoPayLink: '點此使用街口支付',
      jkoPayDesc: '點擊按鈕將開啟街口支付 APP',
      linePayQR: 'LINE Pay 收款碼',
      linePayDesc: '請使用 LINE APP 掃描 QR Code 付款',
      scanQR: '掃描 QR Code',
      afterPayment: '付款後請上傳截圖',
    },
    en: {
      title: 'Confirm Registration',
      subtitle: 'Please confirm your registration and payment information',
      orderSummary: 'Order Summary',
      parentInfo: 'Parent Information',
      paymentInfo: 'Payment Information',
      paymentMethod: 'Payment Method',
      selectPaymentMethod: 'Please select payment method',
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      lineId: 'LINE ID',
      fbId: 'Facebook ID',
      notes: 'Notes',
      notesPlaceholder: 'Any special conditions or needs we should be aware of',
      required: 'Required',
      optional: 'Optional',
      subtotal: 'Subtotal',
      total: 'Total',
      confirmPayment: 'Confirm Payment',
      backToSessions: 'Back to Sessions',
      child: 'Child',
      session: 'Session',
      date: 'Date',
      time: 'Time',
      price: 'Price',
      creditCard: 'Credit Card',
      bankTransfer: 'Bank Transfer / ATM',
      linePay: 'LINE Pay',
      jkoPay: 'JKO Pay',
      paymentNote: 'Please complete payment within 3 days after registration',
      paymentInstructions: 'Payment Instructions',
      bankAccount: 'Bank Account',
      bankName: 'Bank Name',
      accountNumber: 'Account Number',
      accountName: 'Account Name',
      transferNote: 'Transfer Note',
      pleaseNote: 'Please note',
      uploadProof: 'Upload Payment Proof',
      uploadProofDesc: 'Please upload transfer screenshot or payment proof',
      transferLastFive: 'Last 5 Digits',
      enterLastFive: 'Enter last 5 digits of transfer account',
      paymentCompleted: 'Payment Completed',
      jkoPayLink: 'Pay with JKO Pay',
      jkoPayDesc: 'Click to open JKO Pay APP',
      linePayQR: 'LINE Pay QR Code',
      linePayDesc: 'Scan QR Code with LINE APP to pay',
      scanQR: 'Scan QR Code',
      afterPayment: 'Upload screenshot after payment',
    },
  };

  const t = content[language];

  // Load data from localStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    
    if (storedCart) {
      // Use cart data directly (includes both course items and addon items)
      const cartItems = JSON.parse(storedCart);
      
      const items: OrderItem[] = cartItems.map((cartItem: any) => ({
        sessionId: cartItem.sessionId,
        sessionTitle: cartItem.sessionTitle,
        sessionDate: cartItem.sessionDate,
        sessionTime: cartItem.sessionTime,
        childName: cartItem.childName,
        childAge: cartItem.childAge,
        price: cartItem.price,
        roleId: cartItem.roleId || null,
        needsRoleSelection: cartItem.needsRoleSelection || false,
      }));
      
      setOrderItems(items);
    }

    // Auto-fill user information from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setParentInfo(prev => ({
          ...prev,
          id: user.id || prev.id,
          name: user.full_name || user.name || prev.name,
          email: user.email || prev.email,
          phone: user.phone || prev.phone,
        }));
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    // Load saved payment method preference
    const savedPaymentMethod = localStorage.getItem('preferred_payment_method');
    if (savedPaymentMethod && ['jkopay', 'bank_transfer', 'line_pay'].includes(savedPaymentMethod)) {
      setPaymentMethod(savedPaymentMethod as 'jkopay' | 'bank_transfer' | 'line_pay');
    }
  }, [language]);

  const calculateTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.price, 0);
  };

  const calculateDiscountAmount = () => {
    // Convert orderItems to DiscountCartItem format
    const discountItems: DiscountCartItem[] = orderItems.map((item, index) => ({
      id: `${item.sessionId}-${item.childName}-${index}`,
      sessionId: item.sessionId,
      childId: item.childName, // Use childName as identifier
      price: item.price,
      type: 'individual' as const,
    }));

    const result = calculateDiscount(discountItems);
    return result.discountAmount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!parentInfo.name.trim()) {
      alert('請填寫姓名');
      return;
    }
    
    if (!parentInfo.email.trim()) {
      alert('請填寫 Email');
      return;
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(parentInfo.email)) {
      alert('請填寫正確的 Email 格式');
      return;
    }
    
    if (!parentInfo.phone.trim()) {
      alert('請填寫手機號碼');
      return;
    }

    // Validate role selection for items that need it
    const itemsNeedingRoles = orderItems.filter(item => item.needsRoleSelection);
    if (itemsNeedingRoles.some(item => !item.roleId)) {
      alert(language === 'zh' ? '請為每位孩子選擇配音角色' : 'Please select a role for each child');
      return;
    }
    
    // Validate payment method selected
    if (!paymentMethod) {
      alert('請選擇付款方式');
      return;
    }
    
    // Validate payment proof for bank transfer and LINE Pay
    if ((paymentMethod === 'bank_transfer' || paymentMethod === 'line_pay') && !paymentProof && !transferCode) {
      alert('請上傳付款證明或輸入轉帳帳號後五碼');
      return;
    }

    // Save payment method preference for next time
    if (paymentMethod) {
      localStorage.setItem('preferred_payment_method', paymentMethod);
    }
    
    try {
      // CRITICAL: Ensure parentInfo.id is set before submitting order
      let finalParentInfo = { ...parentInfo };
      
      if (!finalParentInfo.id) {
        // If no user ID, create or find user first
        const userResponse = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: parentInfo.email,
            full_name: parentInfo.name,
            phone: parentInfo.phone,
            line_id: parentInfo.lineId,
            fb_id: parentInfo.fbId,
          }),
        });
        
        const userData = await userResponse.json();
        
        if (userData.success && userData.user) {
          finalParentInfo.id = userData.user.id;
          // Update localStorage with user data
          localStorage.setItem('user', JSON.stringify(userData.user));
        } else {
          alert('無法建立用戶資料，請稍後再試');
          return;
        }
      }
      
      // Calculate discount
      const discountAmount = calculateDiscountAmount();
      const finalAmount = calculateTotal() - discountAmount;
      
      // Submit order
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentInfo: finalParentInfo,
          orderItems,
          paymentMethod,
          paymentProof: paymentProof?.name,
          transferCode,
          totalAmount: calculateTotal(),
          discountAmount,
          finalAmount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart after successful order
        localStorage.removeItem('cart');
        
        alert(`報名成功！\n\n訂單編號：${data.orderNumber}\n\n${data.message}\n\n請檢查您的 Email 收件匣（${parentInfo.email}）`);
        router.push(`/orders/${data.orderNumber}`);
      } else {
        // Show specific error message from API (e.g., capacity issues)
        alert(`報名失敗\n\n${data.error || '提交失敗，請稍後再試。'}`);
      }
    } catch (error) {
      console.error('Order submission error:', error);
      alert('提交失敗，請稍後再試。');
    }
  };

  if (orderItems.length === 0) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Confirmation Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/image2/確認報名資底圖.png')`,
          }}
        />
        
        {/* Darker overlay - 60% opacity */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Realistic Snowfall Effect - Pure CSS */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(100)].map((_, i) => {
            const size = 2 + Math.random() * 5;
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white shadow-sm"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-${Math.random() * 20}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  opacity: Math.random() * 0.7 + 0.2,
                  filter: `blur(${Math.random() * 1.5}px)`,
                  boxShadow: '0 0 3px rgba(255, 255, 255, 0.5)',
                  animation: `fall ${10 + Math.random() * 15}s linear infinite`,
                  animationDelay: `${Math.random() * 10}s`,
                }}
              />
            );
          })}
        </div>

        <div className="relative z-10 max-w-md mx-auto text-center py-12 px-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
          <p className="text-xl text-white mb-4">尚未選擇課程</p>
          <button
            onClick={() => router.push('/sessions')}
            className="px-8 py-4 bg-gradient-to-r from-accent-moon to-accent-aurora text-brand-navy rounded-full font-bold hover:scale-105 transition-all duration-300"
          >
            前往選課
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Confirmation Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/image2/確認報名資底圖.png')`,
        }}
      />
      
      {/* Darker overlay - 60% opacity */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Realistic Snowfall Effect - Pure CSS */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {[...Array(100)].map((_, i) => {
          const size = 2 + Math.random() * 5;
          return (
            <div
              key={i}
              className="absolute rounded-full bg-white shadow-sm"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}px`,
                width: `${size}px`,
                height: `${size}px`,
                opacity: Math.random() * 0.7 + 0.2,
                filter: `blur(${Math.random() * 1.5}px)`,
                boxShadow: '0 0 3px rgba(255, 255, 255, 0.5)',
                animation: `fall ${10 + Math.random() * 15}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`,
              }}
            />
          );
        })}
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-gray-400/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-end">
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className="group relative px-6 py-2.5 bg-gradient-to-r from-gray-500/20 to-gray-400/20 border-2 border-gray-400/50 rounded-full text-white font-semibold hover:from-gray-400/30 hover:to-gray-300/30 hover:border-gray-300/70 transition-all duration-300 backdrop-blur-sm"
          >
            <span className="relative z-10 flex items-center gap-2">
              <span className="text-sm">{language === 'zh' ? '中文' : 'EN'}</span>
              <span className="text-xs opacity-60">|</span>
              <span className="text-sm opacity-60">{language === 'zh' ? 'EN' : '中文'}</span>
            </span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-32">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h2 className="text-5xl sm:text-6xl font-heading text-white mb-4">
              {t.title}
            </h2>
            <p className="text-xl text-white/70">
              {t.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Summary */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Items */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-2xl font-heading text-white mb-6">
                  {t.orderSummary}
                </h3>

                <div className="space-y-4">
                  {orderItems.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-2">
                            {item.sessionTitle}
                          </h4>
                          <div className="space-y-1 text-sm text-white/70">
                            <p>
                              <span>{item.childName} ({item.childAge} 歲)</span>
                            </p>
                            <p>
                              <span>{item.sessionDate}</span>
                            </p>
                            <p>
                              <span>{item.sessionTime}</span>
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-accent-moon">
                            NT$ {item.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="mt-6 pt-6 border-t border-white/20">
                  <div className="flex items-center justify-between text-2xl font-bold">
                    <span className="text-white">{t.total}</span>
                    <span className="text-accent-aurora">
                      NT$ {calculateTotal().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Role Selection Section - Only show if any item needs role selection */}
              {orderItems.some(item => item.needsRoleSelection) && (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                  <h3 className="text-2xl font-heading text-white mb-4">
                    {language === 'zh' ? '🎭 選擇配音角色' : '🎭 Select Voice Acting Roles'}
                  </h3>
                  <p className="text-sm text-white/70 mb-6">
                    {language === 'zh' 
                      ? '此課程為雪狼男孩系列動畫配音，請為每位孩子選擇一個角色' 
                      : 'This is a Snow Wolf Boy animation voice acting session. Please select a role for each child'}
                  </p>

                  <div className="space-y-4">
                    {orderItems
                      .filter(item => item.needsRoleSelection)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="bg-white/5 border border-white/10 rounded-xl p-5"
                        >
                          <div className="flex items-center justify-between gap-4 mb-3">
                            <div>
                              <h4 className="text-lg font-bold text-white">
                                {item.sessionTitle}
                              </h4>
                              <p className="text-sm text-white/70">
                                {item.childName} ({item.childAge} 歲)
                              </p>
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-white/80 text-sm font-medium mb-2">
                              {language === 'zh' ? '選擇角色' : 'Select Role'} <span className="text-accent-aurora">*</span>
                            </label>
                            <select
                              value={item.roleId || ''}
                              onChange={(e) => {
                                const newOrderItems = [...orderItems];
                                newOrderItems[orderItems.indexOf(item)].roleId = e.target.value || null;
                                setOrderItems(newOrderItems);
                                
                                // Update cart in localStorage
                                const storedCart = localStorage.getItem('cart');
                                if (storedCart) {
                                  const cartItems = JSON.parse(storedCart);
                                  const cartItemIndex = cartItems.findIndex((ci: any) => 
                                    ci.sessionId === item.sessionId && ci.childName === item.childName
                                  );
                                  if (cartItemIndex !== -1) {
                                    cartItems[cartItemIndex].roleId = e.target.value || null;
                                    localStorage.setItem('cart', JSON.stringify(cartItems));
                                  }
                                }
                              }}
                              required
                              className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300"
                            >
                              <option value="" className="bg-brand-navy text-white">
                                {language === 'zh' ? '請選擇角色' : 'Please select a role'}
                              </option>
                              {/* Note: In production, you would fetch roles from session data */}
                              <option value="litt" className="bg-brand-navy text-white">
                                {language === 'zh' ? '里特 (Litt)' : 'Litt'}
                              </option>
                              <option value="dean" className="bg-brand-navy text-white">
                                {language === 'zh' ? '迪恩 (Dean)' : 'Dean'}
                              </option>
                              <option value="heather" className="bg-brand-navy text-white">
                                {language === 'zh' ? '海瑟 (Heather)' : 'Heather'}
                              </option>
                              <option value="aileen" className="bg-brand-navy text-white">
                                {language === 'zh' ? '艾琳 (Aileen)' : 'Aileen'}
                              </option>
                              <option value="fia" className="bg-brand-navy text-white">
                                {language === 'zh' ? '菲亞 (Fia)' : 'Fia'}
                              </option>
                            </select>
                          </div>
                        </div>
                      ))}
                  </div>

                  {/* Warning if any role not selected */}
                  {orderItems.some(item => item.needsRoleSelection && !item.roleId) && (
                    <div className="mt-4 p-4 bg-semantic-warning/20 border-2 border-semantic-warning/50 rounded-xl">
                      <p className="text-sm text-white font-semibold flex items-center gap-2">
                        <svg className="w-5 h-5 text-semantic-warning flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>
                          {language === 'zh' ? '⚠️ 請為每位孩子選擇角色才能完成報名' : '⚠️ Please select a role for each child to complete registration'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Parent Information Form */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <h3 className="text-2xl font-heading text-white mb-6">
                  {t.parentInfo}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name - Required */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      {t.name} <span className="text-accent-aurora">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={parentInfo.name}
                      onChange={(e) => setParentInfo({ ...parentInfo, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300"
                      placeholder="請輸入您的姓名"
                    />
                  </div>

                  {/* Email - Required */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      {t.email} <span className="text-accent-aurora">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={parentInfo.email}
                      onChange={(e) => setParentInfo({ ...parentInfo, email: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300"
                      placeholder="example@email.com"
                    />
                  </div>

                  {/* Phone - Required */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      {t.phone} <span className="text-accent-aurora">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={parentInfo.phone}
                      onChange={(e) => setParentInfo({ ...parentInfo, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300"
                      placeholder="0912-345-678"
                    />
                  </div>

                  {/* LINE ID - Optional */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      {t.lineId} <span className="text-white/40 text-xs">({t.optional})</span>
                    </label>
                    <input
                      type="text"
                      value={parentInfo.lineId}
                      onChange={(e) => setParentInfo({ ...parentInfo, lineId: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300"
                      placeholder="您的 LINE ID"
                    />
                  </div>

                  {/* Facebook ID - Optional */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      {t.fbId} <span className="text-white/40 text-xs">({t.optional})</span>
                    </label>
                    <input
                      type="text"
                      value={parentInfo.fbId}
                      onChange={(e) => setParentInfo({ ...parentInfo, fbId: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300"
                      placeholder="您的 Facebook ID"
                    />
                  </div>

                  {/* Notes - Optional */}
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      {t.notes} <span className="text-white/40 text-xs">({t.optional})</span>
                    </label>
                    <textarea
                      value={parentInfo.notes}
                      onChange={(e) => setParentInfo({ ...parentInfo, notes: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-accent-aurora focus:bg-white/15 transition-all duration-300 resize-none"
                      placeholder={t.notesPlaceholder}
                    />
                  </div>
                </form>
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <PaymentMethodSelector
                  totalAmount={calculateTotal() - calculateDiscountAmount()}
                  orderNumber={`SW${Date.now()}`}
                  orderItems={orderItems}
                  discount={calculateDiscountAmount()}
                  onPaymentMethodChange={setPaymentMethod}
                  onPaymentProofUpload={setPaymentProof}
                  onTransferCodeChange={setTransferCode}
                  language={language}
                />
              </div>
            </div>

            {/* Right Column - Payment Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Payment Summary Card */}
                <div className="bg-gradient-to-br from-accent-moon/20 via-accent-aurora/20 to-accent-ice/20 backdrop-blur-md border-2 border-accent-aurora/50 rounded-2xl p-6 shadow-2xl">
                  <h3 className="text-2xl font-heading text-white mb-6">
                    {t.paymentInfo}
                  </h3>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-white/80">
                      <span>{t.subtotal}</span>
                      <span className="font-semibold">NT$ {calculateTotal().toLocaleString()}</span>
                    </div>
                    
                    {calculateDiscountAmount() > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span className="flex items-center gap-2">
                          <span>🎉</span>
                          <span>多人優惠</span>
                        </span>
                        <span className="font-semibold">
                          -NT$ {calculateDiscountAmount().toLocaleString()}
                        </span>
                      </div>
                    )}
                    
                    <div className="h-px bg-white/20" />
                    <div className="flex justify-between text-xl font-bold">
                      <span className="text-white">{t.total}</span>
                      <span className="text-accent-aurora">NT$ {(calculateTotal() - calculateDiscountAmount()).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Payment Note */}
                  <div className="bg-white/10 rounded-xl p-4 mb-6">
                    <p className="text-sm text-white/80 leading-relaxed">
                      {t.paymentNote}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={handleSubmit}
                      className="w-full px-6 py-4 bg-gradient-to-r from-accent-moon to-accent-aurora text-brand-navy rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      {t.confirmPayment}
                    </button>
                    <button
                      onClick={() => router.push('/sessions')}
                      className="w-full px-6 py-4 bg-white/10 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300"
                    >
                      {t.backToSessions}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      </div> {/* Close content wrapper */}
    </div>
  );
}
