/**
 * Email Templates for Snow Wolf Registration System
 */

export interface OrderDetails {
  orderNumber: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  children: Array<{
    name: string;
    age: number;
  }>;
  sessions: Array<{
    title: string;
    date: string;
    time: string;
    childName: string;
    price: number;
  }>;
  totalAmount: number;
  paymentDeadline: string;
}

// 1. 報名確認信（給家長）
export function RegistrationConfirmationEmail(order: OrderDetails) {
  const uploadPaymentUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/payment-proof/${order.orderNumber}`;
  
  return {
    subject: `✅ Snow Wolf 報名確認 - 訂單編號 ${order.orderNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0a1628 0%, #1a2b47 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8fbff; padding: 30px; border-radius: 0 0 10px 10px; }
    .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .session-item { border-left: 4px solid #c8b6ff; padding-left: 15px; margin: 15px 0; }
    .total { font-size: 24px; font-weight: bold; color: #c8b6ff; text-align: right; margin-top: 20px; }
    .payment-section { background: #ffe5b4; padding: 20px; border-radius: 8px; margin: 20px 0; }
    .button { display: inline-block; background: linear-gradient(135deg, #ffe5b4 0%, #c8b6ff 100%); color: #0a1628; padding: 15px 40px; text-decoration: none; border-radius: 25px; font-weight: bold; margin: 20px 0; }
    .bank-info { background: white; padding: 15px; border-radius: 8px; margin: 10px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 報名確認成功！</h1>
      <p>感謝您為孩子選擇 Snow Wolf 聲音冒險</p>
    </div>
    
    <div class="content">
      <p>親愛的 ${order.parentName} 您好，</p>
      <p>我們已收到您的報名申請！以下是您的訂單詳情：</p>
      
      <div class="order-info">
        <h3>📋 訂單資訊</h3>
        <p><strong>訂單編號：</strong>${order.orderNumber}</p>
        <p><strong>報名日期：</strong>${new Date().toLocaleDateString('zh-TW')}</p>
        <p><strong>付款期限：</strong>${order.paymentDeadline}</p>
        
        <h3 style="margin-top: 20px;">👨‍👩‍👧‍👦 參加孩子</h3>
        ${order.children.map(child => `
          <p>• ${child.name} (${child.age} 歲)</p>
        `).join('')}
        
        <h3 style="margin-top: 20px;">🎯 報名課程</h3>
        ${order.sessions.map(session => `
          <div class="session-item">
            <h4>${session.title}</h4>
            <p>👤 ${session.childName}</p>
            <p>📅 ${session.date} ${session.time}</p>
            <p>💰 NT$ ${session.price.toLocaleString()}</p>
          </div>
        `).join('')}
        
        <div class="total">
          總金額：NT$ ${order.totalAmount.toLocaleString()}
        </div>
      </div>
      
      <div class="payment-section">
        <h3>💳 下一步：完成付款</h3>
        <p>請於 <strong>${order.paymentDeadline}</strong> 前完成付款，以確保您的報名資格。</p>
        
        <div style="text-align: center;">
          <a href="${uploadPaymentUrl}" class="button">
            📤 上傳付款證明
          </a>
        </div>
        
        <h4 style="margin-top: 20px;">付款方式：</h4>
        
        <div class="bank-info">
          <h4>🏦 銀行轉帳 / ATM</h4>
          <p><strong>銀行：</strong>台新銀行 (812)</p>
          <p><strong>帳號：</strong>1234-5678-9012-3456</p>
          <p><strong>戶名：</strong>Snow Wolf Studio</p>
          <p><strong>轉帳備註：</strong>${order.orderNumber}</p>
        </div>
        
        <div class="bank-info">
          <h4>💳 街口支付</h4>
          <p>點擊上方按鈕後選擇「街口支付」</p>
        </div>
        
        <div class="bank-info">
          <h4>💚 LINE Pay</h4>
          <p>點擊上方按鈕後掃描 QR Code</p>
        </div>
      </div>
      
      <p><strong>⚠️ 重要提醒：</strong></p>
      <ul>
        <li>完成付款後，請務必點擊上方按鈕上傳付款證明</li>
        <li>我們會在確認付款後發送正式的報名成功通知</li>
        <li>如有任何問題，請聯繫我們：molodyschool@gmail.com</li>
      </ul>
    </div>
    
    <div class="footer">
      <p>Snow Wolf Sound Studio</p>
      <p>讓孩子的聲音，成為最動人的故事</p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

// 2. 付款待確認通知（給管理員）
export function PaymentPendingNotification(order: OrderDetails, paymentProof?: string) {
  const adminUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders/${order.orderNumber}`;
  
  return {
    subject: `🔔 新付款待確認 - ${order.orderNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5; }
    .header { background: #ff6b00; color: white; padding: 20px; text-align: center; }
    .content { background: white; padding: 30px; }
    .order-summary { background: #f8f8f8; padding: 15px; border-radius: 8px; margin: 15px 0; }
    .button { display: inline-block; background: #10b981; color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
    .proof-image { max-width: 100%; border: 2px solid #ddd; border-radius: 8px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>🔔 新付款待確認</h2>
    </div>
    
    <div class="content">
      <h3>訂單資訊</h3>
      <div class="order-summary">
        <p><strong>訂單編號：</strong>${order.orderNumber}</p>
        <p><strong>家長姓名：</strong>${order.parentName}</p>
        <p><strong>聯絡電話：</strong>${order.parentPhone}</p>
        <p><strong>Email：</strong>${order.parentEmail}</p>
        <p><strong>總金額：</strong>NT$ ${order.totalAmount.toLocaleString()}</p>
      </div>
      
      <h3>報名課程</h3>
      ${order.sessions.map(session => `
        <p>• ${session.title} - ${session.childName}</p>
      `).join('')}
      
      ${paymentProof ? `
        <h3>付款證明</h3>
        <img src="${paymentProof}" alt="付款證明" class="proof-image" />
      ` : ''}
      
      <div style="text-align: center;">
        <a href="${adminUrl}" class="button">
          ✅ 前往後台確認付款
        </a>
      </div>
      
      <p style="color: #666; font-size: 14px; margin-top: 20px;">
        確認付款後，系統將自動發送報名成功通知給家長。
      </p>
    </div>
  </div>
</body>
</html>
    `,
  };
}

// 3. 報名成功確認信（給家長）
export function RegistrationSuccessEmail(order: OrderDetails) {
  return {
    subject: `🎊 報名成功！歡迎加入 Snow Wolf - ${order.orderNumber}`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 10px 10px; }
    .success-icon { font-size: 60px; margin-bottom: 20px; }
    .session-card { background: white; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #10b981; }
    .info-box { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="success-icon">🎊</div>
      <h1>報名成功！</h1>
      <p>付款已確認，期待與您的孩子見面</p>
    </div>
    
    <div class="content">
      <p>親愛的 ${order.parentName} 您好，</p>
      <p>恭喜！您的付款已確認，報名正式完成！✨</p>
      
      <h3>📅 課程資訊</h3>
      ${order.sessions.map(session => `
        <div class="session-card">
          <h4>${session.title}</h4>
          <p>👤 參加孩子：${session.childName}</p>
          <p>📅 上課日期：${session.date}</p>
          <p>⏰ 上課時間：${session.time}</p>
        </div>
      `).join('')}
      
      <div class="info-box">
        <h4>📍 上課地點</h4>
        <p>Snow Wolf Sound Studio</p>
        <p>台北市信義區○○路○○號</p>
        
        <h4 style="margin-top: 15px;">📞 聯絡資訊</h4>
        <p>Email: molodyschool@gmail.com</p>
        <p>電話: 02-XXXX-XXXX</p>
      </div>
      
      <h3>⚠️ 課前提醒</h3>
      <ul>
        <li>請提前 10 分鐘到達</li>
        <li>建議穿著舒適的服裝</li>
        <li>可攜帶水壺</li>
        <li>如需請假，請提前 24 小時通知</li>
      </ul>
      
      <p style="margin-top: 30px;">
        如有任何問題，歡迎隨時與我們聯繫。<br>
        期待在課堂上見到您的孩子！🎤
      </p>
    </div>
    
    <div class="footer">
      <p>Snow Wolf Sound Studio</p>
      <p>讓孩子的聲音，成為最動人的故事</p>
    </div>
  </div>
</body>
</html>
    `,
  };
}
