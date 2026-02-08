# 🚀 生產環境部署完整計劃（含金流整合）

## 📋 目錄
1. [金流整合方案](#金流整合方案)
2. [環境變數配置](#環境變數配置)
3. [資料庫部署](#資料庫部署)
4. [應用程式部署](#應用程式部署)
5. [金流測試](#金流測試)
6. [監控和日誌](#監控和日誌)
7. [上線檢查清單](#上線檢查清單)

---

## 🏦 金流整合方案

### 推薦方案：綠界科技 ECPay（台灣最普及）

#### 為什麼選擇 ECPay？
1. ✅ **台灣市場主流** - 最多商家使用
2. ✅ **支援多種付款方式**
   - 信用卡（一次付清、分期）
   - ATM 虛擬帳號
   - 超商代碼（7-11、全家、萊爾富、OK）
   - LINE Pay
   - 街口支付
   - Apple Pay / Google Pay
3. ✅ **手續費合理** - 約 2.5-3%
4. ✅ **完整的 API 文件**
5. ✅ **測試環境完善**

#### ECPay 申請流程
```
1. 前往 ECPay 官網註冊
   https://www.ecpay.com.tw/

2. 準備文件
   - 公司登記證明（或個人身分證）
   - 銀行帳戶資料
   - 營業登記證（公司行號）

3. 填寫申請表單
   - 預計營業額
   - 商品類型
   - 網站資訊

4. 等待審核（約 3-5 個工作天）

5. 取得測試環境帳號
   - MerchantID（特店編號）
   - HashKey
   - HashIV

6. 整合測試

7. 申請正式環境
```

### 替代方案

#### 方案 2: 藍新金流 NewebPay
- 優點：介面友善、整合簡單
- 缺點：手續費略高（3-3.5%）
- 適合：快速上線

#### 方案 3: TapPay（街口支付旗下）
- 優點：現代化 API、支援訂閱制
- 缺點：較新、市佔率較低
- 適合：技術團隊強

---

## 💳 ECPay 整合實作

### 1. 安裝 ECPay SDK

```bash
npm install ecpay_aio_nodejs
```

### 2. 建立 ECPay 配置

**檔案**: `lib/payment/ecpay-config.ts`

```typescript
export const ECPAY_CONFIG = {
  // 測試環境
  test: {
    MerchantID: process.env.ECPAY_TEST_MERCHANT_ID || '',
    HashKey: process.env.ECPAY_TEST_HASH_KEY || '',
    HashIV: process.env.ECPAY_TEST_HASH_IV || '',
    BaseURL: 'https://payment-stage.ecpay.com.tw',
  },
  // 正式環境
  production: {
    MerchantID: process.env.ECPAY_MERCHANT_ID || '',
    HashKey: process.env.ECPAY_HASH_KEY || '',
    HashIV: process.env.ECPAY_HASH_IV || '',
    BaseURL: 'https://payment.ecpay.com.tw',
  },
};

export function getECPayConfig() {
  return process.env.NODE_ENV === 'production'
    ? ECPAY_CONFIG.production
    : ECPAY_CONFIG.test;
}
```

### 3. 建立付款 API

**檔案**: `app/api/payment/create/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import ecpay_payment from 'ecpay_aio_nodejs';
import { getECPayConfig } from '@/lib/payment/ecpay-config';
import { getPool } from '@/lib/neon/client';

export async function POST(request: NextRequest) {
  try {
    const { orderNumber, returnUrl, clientBackUrl } = await request.json();
    
    // 1. 從資料庫取得訂單資訊
    const pool = getPool();
    const orderQuery = `
      SELECT o.*, u.email, u.full_name
      FROM orders o
      INNER JOIN users u ON o.parent_id = u.id
      WHERE o.order_number = $1
    `;
    const orderResult = await pool.query(orderQuery, [orderNumber]);
    
    if (orderResult.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    const order = orderResult.rows[0];
    
    // 2. 建立 ECPay 付款參數
    const config = getECPayConfig();
    const options = {
      OperationMode: 'Test', // 測試模式，正式環境改為 'Production'
      MercProfile: {
        MerchantID: config.MerchantID,
        HashKey: config.HashKey,
        HashIV: config.HashIV,
      },
      IsProjectContractor: false,
    };
    
    const ecpay = new ecpay_payment(options);
    
    // 3. 設定付款參數
    const tradeDate = new Date().toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(/\//g, '/').replace(/:/g, ':').replace(/ /g, ' ');
    
    const base_param = {
      MerchantTradeNo: orderNumber, // 訂單編號（唯一值）
      MerchantTradeDate: tradeDate,
      TotalAmount: order.final_amount.toString(),
      TradeDesc: '雪狼男孩錄音派對課程報名',
      ItemName: `課程報名 x ${order.items?.length || 1}`,
      ReturnURL: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/api/payment/callback`,
      ClientBackURL: clientBackUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderNumber}`,
      ChoosePayment: 'ALL', // 顯示所有付款方式
      EncryptType: 1,
      
      // 信用卡分期（選填）
      // CreditInstallment: '3,6,12',
      
      // ATM 虛擬帳號（選填）
      // ExpireDate: 3, // 繳費期限（天）
      
      // 超商代碼（選填）
      // StoreExpireDate: 10080, // 繳費期限（分鐘，7天 = 10080）
    };
    
    // 4. 產生付款表單 HTML
    const html = ecpay.payment_client.aio_check_out_all(base_param);
    
    // 5. 更新訂單狀態為「處理中」
    await pool.query(
      `UPDATE orders SET status = 'processing', updated_at = NOW() WHERE order_number = $1`,
      [orderNumber]
    );
    
    return NextResponse.json({
      success: true,
      paymentHtml: html,
      orderNumber,
    });
    
  } catch (error) {
    console.error('[Payment Create API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create payment',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
```

### 4. 建立付款回調 API

**檔案**: `app/api/payment/callback/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import ecpay_payment from 'ecpay_aio_nodejs';
import { getECPayConfig } from '@/lib/payment/ecpay-config';
import { getPool } from '@/lib/neon/client';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const data: any = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    
    console.log('[Payment Callback] Received:', data);
    
    // 1. 驗證 CheckMacValue
    const config = getECPayConfig();
    const options = {
      OperationMode: 'Test',
      MercProfile: {
        MerchantID: config.MerchantID,
        HashKey: config.HashKey,
        HashIV: config.HashIV,
      },
      IsProjectContractor: false,
    };
    
    const ecpay = new ecpay_payment(options);
    const checkValue = ecpay.payment_client.helper.gen_chk_mac_value(data);
    
    if (checkValue !== data.CheckMacValue) {
      console.error('[Payment Callback] CheckMacValue verification failed');
      return new NextResponse('0|CheckMacValue Error', { status: 400 });
    }
    
    // 2. 更新訂單狀態
    const pool = getPool();
    const orderNumber = data.MerchantTradeNo;
    const rtnCode = data.RtnCode;
    
    let newStatus = 'pending_payment';
    if (rtnCode === '1' || rtnCode === 1) {
      // 付款成功
      newStatus = 'confirmed';
    } else if (rtnCode === '2' || rtnCode === 2) {
      // ATM 取號成功（等待付款）
      newStatus = 'payment_submitted';
    } else {
      // 付款失敗
      newStatus = 'payment_failed';
    }
    
    await pool.query(
      `UPDATE orders 
       SET status = $1, 
           payment_info = $2,
           updated_at = NOW() 
       WHERE order_number = $3`,
      [newStatus, JSON.stringify(data), orderNumber]
    );
    
    console.log(`[Payment Callback] Order ${orderNumber} updated to ${newStatus}`);
    
    // 3. 如果付款成功，發送確認信
    if (newStatus === 'confirmed') {
      // TODO: 發送付款成功通知信
      console.log(`[Payment Callback] Sending confirmation email for ${orderNumber}`);
    }
    
    // 4. 回傳 1|OK 給 ECPay
    return new NextResponse('1|OK');
    
  } catch (error) {
    console.error('[Payment Callback] Error:', error);
    return new NextResponse('0|Error', { status: 500 });
  }
}
```

### 5. 建立付款頁面

**檔案**: `app/payment/[orderNumber]/page.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { LoadingSpinner } from '@/components/ui/Loading';

export default function PaymentPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const [loading, setLoading] = useState(true);
  const [paymentHtml, setPaymentHtml] = useState('');

  useEffect(() => {
    createPayment();
  }, []);

  const createPayment = async () => {
    try {
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          returnUrl: `${window.location.origin}/api/payment/callback`,
          clientBackUrl: `${window.location.origin}/orders/${orderNumber}`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setPaymentHtml(data.paymentHtml);
        setLoading(false);
        
        // 自動提交表單
        setTimeout(() => {
          const form = document.querySelector('form');
          if (form) form.submit();
        }, 100);
      } else {
        alert('建立付款失敗：' + data.error);
      }
    } catch (error) {
      console.error('Payment creation error:', error);
      alert('建立付款失敗，請稍後再試');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="ml-4 text-lg">正在前往付款頁面...</p>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center"
      dangerouslySetInnerHTML={{ __html: paymentHtml }}
    />
  );
}
```

---

## 🔧 環境變數配置

### 開發環境 (`.env.local`)

```bash
# 應用程式
NEXT_PUBLIC_BASE_URL=http://localhost:3000
NODE_ENV=development

# 資料庫
DATABASE_URL=postgresql://user:password@localhost:5432/snowwolf

# ECPay 測試環境
ECPAY_TEST_MERCHANT_ID=2000132
ECPAY_TEST_HASH_KEY=5294y06JbISpM5x9
ECPAY_TEST_HASH_IV=v77hoKGq4kWxNNIS

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# 管理員
ADMIN_PASSWORD=your_secure_admin_password
```

### 正式環境 (Vercel 環境變數)

```bash
# 應用程式
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production

# 資料庫（Neon）
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/snowwolf?sslmode=require

# ECPay 正式環境
ECPAY_MERCHANT_ID=你的特店編號
ECPAY_HASH_KEY=你的HashKey
ECPAY_HASH_IV=你的HashIV

# Email (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@yourdomain.com

# 管理員
ADMIN_PASSWORD=強密碼（至少16字元）

# 監控（選用）
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## 🗄️ 資料庫部署

### 1. Neon PostgreSQL 設定

```bash
# 1. 前往 Neon 官網
https://neon.tech/

# 2. 建立專案
- 選擇區域：Asia Pacific (Singapore) - 最接近台灣
- 資料庫名稱：snowwolf
- 分支：main

# 3. 取得連線字串
postgresql://user:password@ep-xxx.region.aws.neon.tech/snowwolf?sslmode=require

# 4. 建立資料表
執行 SQL schema（見下方）
```

### 2. 資料庫 Schema

**檔案**: `database/schema.sql`

```sql
-- 用戶表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  phone VARCHAR(20),
  line_id VARCHAR(100),
  fb_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 孩子表
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  age INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 課程表
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_zh VARCHAR(200) NOT NULL,
  title_en VARCHAR(200),
  theme_zh VARCHAR(200),
  theme_en VARCHAR(200),
  story_zh TEXT,
  story_en TEXT,
  description_zh TEXT,
  description_en TEXT,
  venue_zh VARCHAR(200),
  venue_en VARCHAR(200),
  date DATE NOT NULL,
  day_of_week VARCHAR(20),
  time VARCHAR(50),
  duration_minutes INTEGER,
  capacity INTEGER NOT NULL,
  hidden_buffer INTEGER DEFAULT 0,
  current_registrations INTEGER DEFAULT 0,
  price INTEGER NOT NULL,
  age_min INTEGER,
  age_max INTEGER,
  image_url TEXT,
  video_url TEXT,
  status VARCHAR(20) DEFAULT 'active',
  tags TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 訂單表
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(50) UNIQUE NOT NULL,
  parent_id UUID REFERENCES users(id),
  status VARCHAR(30) DEFAULT 'pending_payment',
  total_amount INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  final_amount INTEGER NOT NULL,
  group_code VARCHAR(50),
  payment_method VARCHAR(30),
  payment_proof_url TEXT,
  payment_deadline TIMESTAMP,
  payment_info JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 訂單項目表
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  session_id UUID REFERENCES sessions(id),
  child_id UUID REFERENCES children(id),
  role_id VARCHAR(50),
  price INTEGER NOT NULL,
  discount_amount INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 課程角色表
CREATE TABLE session_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  role_id VARCHAR(50) NOT NULL,
  name_zh VARCHAR(100),
  name_en VARCHAR(100),
  image_url TEXT,
  capacity INTEGER,
  description_zh TEXT,
  description_en TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_orders_parent_id ON orders(parent_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_session_id ON order_items(session_id);
CREATE INDEX idx_sessions_date ON sessions(date);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_children_parent_id ON children(parent_id);
```

---

## 🚀 Vercel 部署

### 1. 準備部署

```bash
# 1. 確保所有變更已提交
git add .
git commit -m "Production ready with payment integration"
git push origin main

# 2. 安裝 Vercel CLI
npm install -g vercel

# 3. 登入 Vercel
vercel login
```

### 2. 部署步驟

```bash
# 1. 初始化專案
vercel

# 2. 設定環境變數（在 Vercel Dashboard）
- 前往 Project Settings > Environment Variables
- 新增所有正式環境變數

# 3. 部署到正式環境
vercel --prod

# 4. 設定自訂網域（選用）
- 前往 Project Settings > Domains
- 新增你的網域
- 設定 DNS（A 或 CNAME 記錄）
```

### 3. Vercel 配置

**檔案**: `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["sin1"],
  "env": {
    "NODE_ENV": "production"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "no-store, must-revalidate"
        }
      ]
    }
  ]
}
```

---

## ✅ 上線前檢查清單

### 環境配置
- [ ] 正式環境變數已設定
- [ ] 資料庫連線測試通過
- [ ] ECPay 正式環境已申請
- [ ] Email 服務已設定
- [ ] 網域 DNS 已設定

### 功能測試
- [ ] 完整購買流程測試
- [ ] 金流付款測試（測試環境）
- [ ] 訂單查詢測試
- [ ] 管理後台測試
- [ ] Email 通知測試

### 安全性
- [ ] 所有 API 都有權限驗證
- [ ] SQL 注入防護
- [ ] XSS 防護
- [ ] CSRF 防護
- [ ] 敏感資料加密

### 效能
- [ ] 圖片已優化
- [ ] 資料庫查詢已優化
- [ ] CDN 已設定
- [ ] 快取策略已實作

### 監控
- [ ] 錯誤追蹤（Sentry）
- [ ] 效能監控
- [ ] 資料庫監控
- [ ] 金流交易監控

---

## 📊 金流測試

### ECPay 測試卡號

```
信用卡測試：
卡號：4311-9522-2222-2222
有效期限：任意未來日期
CVV：任意3碼

ATM 測試：
會產生虛擬帳號，可在測試環境查看

超商代碼測試：
會產生代碼，可在測試環境查看
```

### 測試流程

1. **建立測試訂單**
   - 選擇課程
   - 填寫資料
   - 送出訂單

2. **測試付款**
   - 選擇付款方式
   - 使用測試卡號
   - 完成付款

3. **驗證回調**
   - 檢查訂單狀態更新
   - 檢查 Email 通知
   - 檢查資料庫記錄

4. **測試退款**（如需要）
   - 在 ECPay 後台測試退款
   - 驗證退款流程

---

## 🎯 上線後監控

### 1. 即時監控

```typescript
// 使用 Sentry 監控錯誤
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. 資料庫監控

- 使用 Neon Dashboard 監控
- 設定告警（連線數、查詢時間）
- 定期備份

### 3. 金流監控

- 每日對帳
- 異常交易告警
- 退款處理追蹤

---

## 📞 緊急聯絡

### ECPay 客服
- 電話：02-2655-1775
- Email：service@ecpay.com.tw
- 服務時間：週一至週五 9:00-18:00

### Vercel 支援
- Dashboard: https://vercel.com/support
- Discord: https://vercel.com/discord

### Neon 支援
- Dashboard: https://console.neon.tech/
- Discord: https://discord.gg/neon

---

## 🎉 部署完成！

系統現在已經準備好正式上線，包含完整的金流整合！

記得在正式上線前：
1. 完整測試所有功能
2. 備份資料庫
3. 準備回滾計劃
4. 通知用戶上線時間
