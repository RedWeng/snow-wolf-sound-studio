# 付款方式頁面細項顯示 - Payment Method Itemized Display

## 問題描述 (Problem Description)

**用戶反饋：** 在結帳頁面的「付款方式」步驟，家長只能看到總價，無法看到詳細的課程細項。

**User Feedback:** In the checkout page's "Payment Method" step, parents can only see the total amount without detailed course item breakdown.

---

## 修正內容 (Fixes Applied)

### 1. PaymentMethodSelector 組件更新

**檔案：** `components/checkout/PaymentMethodSelector.tsx`

#### 1.1 新增 Props

添加了以下新的 props：
- `orderItems: OrderItem[]` - 訂單項目列表
- `discount?: number` - 折扣金額（選填，預設為 0）

```typescript
interface OrderItem {
  sessionId: string;
  sessionTitle: string;
  sessionDate: string;
  sessionTime: string;
  childName: string;
  childAge: number;
  price: number;
}

interface PaymentMethodSelectorProps {
  totalAmount: number;
  orderNumber: string;
  orderItems: OrderItem[];        // ✅ 新增
  discount?: number;              // ✅ 新增
  onPaymentMethodChange: (method: 'jkopay' | 'bank_transfer' | 'line_pay' | null) => void;
  onPaymentProofUpload: (file: File) => void;
  onTransferCodeChange: (code: string) => void;
  language?: 'zh' | 'en';
}
```

#### 1.2 新增課程費用細項區塊

在「選擇付款方式」之前，新增了「課程費用」區塊，顯示：

1. **每個課程項目的詳細資訊：**
   - 課程名稱
   - 孩子姓名和年齡
   - 上課日期和時間
   - 單項價格

2. **價格摘要：**
   - 小計（原價總和）
   - 多人優惠（如果有折扣）
   - 總計（折扣後價格）

```typescript
{/* Course Details Section */}
<div className="p-6 bg-white/5 border border-white/20 rounded-xl space-y-4">
  <h4 className="text-lg font-bold text-white mb-4">{t.courseDetails}</h4>
  
  {/* Order Items List */}
  <div className="space-y-3">
    {orderItems.map((item, index) => (
      <div key={index} className="flex items-start justify-between gap-4 p-3 bg-white/5 rounded-lg">
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">
            {item.sessionTitle}
          </p>
          <p className="text-white/60 text-xs mt-1">
            {item.childName} ({item.childAge} 歲)
          </p>
          <p className="text-white/50 text-xs">
            {item.sessionDate} · {item.sessionTime}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-white font-bold">
            NT$ {item.price.toLocaleString()}
          </p>
        </div>
      </div>
    ))}
  </div>

  {/* Pricing Summary */}
  <div className="pt-4 border-t border-white/20 space-y-2">
    <div className="flex justify-between text-white/80">
      <span>{t.subtotal}</span>
      <span className="font-semibold">
        NT$ {(totalAmount + discount).toLocaleString()}
      </span>
    </div>
    
    {discount > 0 && (
      <div className="flex justify-between text-green-400">
        <span className="flex items-center gap-2">
          <span>🎉</span>
          <span>{t.discount}</span>
        </span>
        <span className="font-semibold">
          -NT$ {discount.toLocaleString()}
        </span>
      </div>
    )}
    
    <div className="h-px bg-white/20 my-2" />
    
    <div className="flex justify-between text-xl font-bold">
      <span className="text-white">{t.total}</span>
      <span className="text-accent-aurora">
        NT$ {totalAmount.toLocaleString()}
      </span>
    </div>
    
    {discount > 0 && (
      <p className="text-xs text-green-400/80 text-right">
        ✓ {t.discountApplied}
      </p>
    )}
  </div>
</div>
```

#### 1.3 新增多語言文字

```typescript
const content = {
  zh: {
    // ... 原有文字
    courseDetails: '課程費用',
    subtotal: '小計',
    discount: '多人優惠',
    total: '總計',
    discountApplied: '已套用優惠',
  },
  en: {
    // ... 原有文字
    courseDetails: 'Course Fees',
    subtotal: 'Subtotal',
    discount: 'Multi-person Discount',
    total: 'Total',
    discountApplied: 'Discount Applied',
  },
};
```

---

### 2. 結帳頁面更新

**檔案：** `app/checkout/page.tsx`

#### 2.1 引入折扣計算器

```typescript
import { calculateDiscount, CartItem as DiscountCartItem } from '@/lib/api/discount-calculator';
```

#### 2.2 新增折扣計算函數

```typescript
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
```

#### 2.3 更新 PaymentMethodSelector 調用

傳遞 `orderItems` 和 `discount` 參數：

```typescript
<PaymentMethodSelector
  totalAmount={calculateTotal() - calculateDiscountAmount()}
  orderNumber={`SW${Date.now()}`}
  orderItems={orderItems}                    // ✅ 新增
  discount={calculateDiscountAmount()}       // ✅ 新增
  onPaymentMethodChange={setPaymentMethod}
  onPaymentProofUpload={setPaymentProof}
  onTransferCodeChange={setTransferCode}
  language={language}
/>
```

#### 2.4 更新右側付款摘要

在右側的付款摘要卡片中也顯示折扣：

```typescript
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
    <span className="text-accent-aurora">
      NT$ {(calculateTotal() - calculateDiscountAmount()).toLocaleString()}
    </span>
  </div>
</div>
```

---

## 顯示效果 (Display Effect)

### 付款方式步驟顯示內容：

```
┌─────────────────────────────────────────┐
│ 請選擇付款方式                           │
├─────────────────────────────────────────┤
│                                         │
│ 課程費用                                 │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 雪狼經典場 × 擬音錄音                 │ │
│ │ 小明 (8歲)                           │ │
│ │ 2026/4/12 · 13:00                   │ │
│ │                        NT$ 5,500    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 雪狼經典場 × 擬音錄音                 │ │
│ │ 小華 (6歲)                           │ │
│ │ 2026/4/12 · 13:00                   │ │
│ │                        NT$ 5,500    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 【加購】家庭動畫錄音                  │ │
│ │ 加購項目 (0歲)                       │ │
│ │ 2026/4/12 · 13:00                   │ │
│ │                        NT$ 4,500    │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ─────────────────────────────────────── │
│ 小計                        NT$ 15,500  │
│ 🎉 多人優惠                  -NT$ 1,200 │
│ ─────────────────────────────────────── │
│ 總計                        NT$ 14,300  │
│ ✓ 已套用優惠                            │
│                                         │
├─────────────────────────────────────────┤
│                                         │
│ 💳 街口支付                              │
│ ✓ 點擊按鈕開啟街口 APP 付款              │
│                                         │
│ 🏦 銀行轉帳 / ATM                        │
│   轉帳後請上傳證明或輸入後五碼            │
│                                         │
│ 💚 LINE Pay                             │
│   掃描 QR Code 使用 LINE Pay 付款        │
│                                         │
└─────────────────────────────────────────┘
```

---

## 折扣計算邏輯 (Discount Calculation Logic)

使用 `lib/api/discount-calculator.ts` 中的 `calculateDiscount` 函數：

### 折扣規則：
1. **2場/2人以上** → 每項目 -$300
2. **3場/3人以上** → 每項目 -$400（上限）
3. 適用於：場次票價、家庭場、加購項目
4. 每一個項目最高回饋 -$400
5. 回饋擇一，不疊加

### 範例計算：

#### 範例 1：2 位孩子 + 1 個加購
- 項目數：3 項
- 折扣條件：3 場/3 人 → -$400/項
- 小計：$5,500 + $5,500 + $4,500 = $15,500
- 折扣：-$400 × 3 = -$1,200
- **總計：$14,300**

#### 範例 2：1 位孩子 + 1 個加購
- 項目數：2 項
- 折扣條件：2 場/2 人 → -$300/項
- 小計：$5,500 + $4,500 = $10,000
- 折扣：-$300 × 2 = -$600
- **總計：$9,400**

---

## 使用者體驗改善 (UX Improvements)

### 改善前：
- ❌ 只顯示總價 NT$ 14,300
- ❌ 家長不知道具體報名了哪些課程
- ❌ 不清楚折扣如何計算
- ❌ 無法核對每個項目的價格

### 改善後：
- ✅ 清楚列出每個課程項目
- ✅ 顯示孩子姓名、年齡、日期、時間
- ✅ 顯示每個項目的單價
- ✅ 明確顯示小計、折扣、總計
- ✅ 折扣金額用綠色和 🎉 圖示突出顯示
- ✅ 家長可以在付款前再次確認所有細節

---

## 相關檔案 (Related Files)

1. **`components/checkout/PaymentMethodSelector.tsx`** - 付款方式選擇器組件（新增課程細項顯示）
2. **`app/checkout/page.tsx`** - 結帳頁面（傳遞 orderItems 和 discount）
3. **`lib/api/discount-calculator.ts`** - 折扣計算邏輯

---

## 測試場景 (Test Scenarios)

### 場景 1：單一課程，無折扣
- **訂單：** 1 位孩子報名 1 個課程
- **顯示：** 
  - 小計：NT$ 5,500
  - 折扣：不顯示
  - 總計：NT$ 5,500

### 場景 2：2 個項目，-$300 折扣
- **訂單：** 2 位孩子報名同一課程
- **顯示：**
  - 小計：NT$ 11,000
  - 折扣：-NT$ 600 (2 × $300)
  - 總計：NT$ 10,400

### 場景 3：3 個項目，-$400 折扣
- **訂單：** 2 位孩子 + 1 個加購
- **顯示：**
  - 小計：NT$ 15,500
  - 折扣：-NT$ 1,200 (3 × $400)
  - 總計：NT$ 14,300

### 場景 4：多個課程 + 加購
- **訂單：** 
  - 小明：雪狼經典場 ($5,500)
  - 小華：雪狼經典場 ($5,500)
  - 小明：慢慢先生的一天 ($2,800)
  - 加購：家庭動畫錄音 ($4,500)
- **顯示：**
  - 小計：NT$ 18,300
  - 折扣：-NT$ 1,600 (4 × $400)
  - 總計：NT$ 16,700

---

## 驗證清單 (Verification Checklist)

- [x] PaymentMethodSelector 接收 orderItems 和 discount
- [x] 顯示每個課程項目的詳細資訊
- [x] 顯示小計、折扣、總計
- [x] 折扣金額用綠色和圖示突出顯示
- [x] 右側付款摘要也顯示折扣
- [x] 多語言支援（中文/英文）
- [x] Build 成功無錯誤
- [ ] 手動測試：單一課程無折扣
- [ ] 手動測試：2 個項目 -$300 折扣
- [ ] 手動測試：3 個項目 -$400 折扣
- [ ] 手動測試：多個課程 + 加購
- [ ] 驗證折扣計算正確性

---

## 總結 (Summary)

此次修正解決了付款方式頁面缺少課程細項的問題：

1. ✅ **詳細課程列表** - 每個項目顯示課程名稱、孩子資訊、日期時間、價格
2. ✅ **清楚的價格摘要** - 小計、折扣、總計一目了然
3. ✅ **折扣透明化** - 明確顯示折扣金額和優惠說明
4. ✅ **改善使用者體驗** - 家長可以在付款前再次確認所有細節
5. ✅ **視覺設計優化** - 使用顏色和圖示突出重要資訊

**關鍵改進：** 從只顯示總價，到完整顯示課程細項、折扣明細和價格摘要！

---

**修正日期：** 2026-02-03  
**修正人員：** Kiro AI Assistant  
**測試狀態：** Build 成功，待手動測試驗證
