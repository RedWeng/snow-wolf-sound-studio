# 付款整合指南 💳

## 已完成功能 ✅

### 1. 付款方式選擇器
位置：`components/checkout/PaymentMethodSelector.tsx`

支援三種付款方式：
- **街口支付（JKO Pay）**
- **銀行轉帳 / ATM**
- **LINE Pay**

### 2. 結帳頁面整合
位置：`app/checkout/page.tsx`

功能：
- 訂單摘要顯示
- 家長資訊表單
- 付款方式選擇
- 付款證明上傳
- 訂單提交

---

## 需要你完成的設定 📝

### 1. 街口支付（JKO Pay）

**步驟：**
1. 開啟街口支付 APP
2. 進入「收款」功能
3. 產生你的收款連結或 QR Code

**更新位置：**
`components/checkout/PaymentMethodSelector.tsx` 第 95 行

```typescript
const generateJkoPayLink = () => {
  // 替換成你的街口收款連結
  return `你的街口收款連結?amount=${totalAmount}&note=${orderNumber}`;
};
```

**優點：**
- 可以帶入金額
- 客戶點擊直接開啟街口 APP
- 錢立刻到你帳戶

---

### 2. 銀行轉帳資訊

**更新位置：**
`components/checkout/PaymentMethodSelector.tsx` 第 175-185 行

```typescript
<div className="space-y-3 p-4 bg-white/5 rounded-lg">
  <div className="flex justify-between">
    <span className="text-white/60">{t.bankName}:</span>
    <span className="text-white font-semibold">你的銀行名稱 (代碼)</span>
  </div>
  <div className="flex justify-between">
    <span className="text-white/60">{t.accountNumber}:</span>
    <span className="text-white font-mono font-semibold">你的銀行帳號</span>
  </div>
  <div className="flex justify-between">
    <span className="text-white/60">{t.accountName}:</span>
    <span className="text-white font-semibold">你的戶名</span>
  </div>
</div>
```

---

### 3. LINE Pay QR Code

**步驟：**
1. 開啟 LINE APP
2. 進入「LINE Pay」
3. 點選「收款」
4. 產生你的收款 QR Code
5. 截圖保存

**更新位置：**
`components/checkout/PaymentMethodSelector.tsx` 第 220-230 行

**方法 A：使用圖片**
```typescript
<div className="w-48 h-48 bg-white rounded-xl overflow-hidden">
  <img 
    src="/images/line-pay-qr.png" 
    alt="LINE Pay QR Code"
    className="w-full h-full object-cover"
  />
</div>
```

**方法 B：使用 QR Code 生成器**
```bash
npm install qrcode.react
```

```typescript
import QRCode from 'qrcode.react';

<QRCode 
  value="你的 LINE Pay 收款連結"
  size={192}
  level="H"
/>
```

---

## 測試流程 🧪

### 本地測試

1. 啟動開發伺服器：
```bash
npm run dev
```

2. 訪問：`http://localhost:3000`

3. 完整流程測試：
   - 首頁 → 點擊「為孩子選擇聲音冒險」
   - Onboarding → 模擬登入 → 新增孩子
   - 課程選擇 → 選擇課程和孩子
   - 結帳頁面 → 填寫資料 → 選擇付款方式

### 付款方式測試

**街口支付：**
- 點擊「使用街口支付」按鈕
- 應該開啟街口 APP（或顯示連結）
- 上傳付款截圖

**銀行轉帳：**
- 查看銀行帳號資訊
- 上傳付款證明或輸入後五碼

**LINE Pay：**
- 掃描 QR Code
- 上傳付款截圖

---

## 下一步：後台管理 🔧

你需要一個簡單的後台來：

1. **查看訂單列表**
   - 待確認付款的訂單
   - 已完成的訂單
   - 取消的訂單

2. **確認付款**
   - 查看付款截圖
   - 核對轉帳後五碼
   - 一鍵確認訂單

3. **通知客戶**
   - 付款確認後發送 Email
   - 課程提醒通知

**要我幫你建立後台管理系統嗎？**

---

## 綠界整合（未來升級）

如果你決定使用綠界科技：

### 優點
- 自動對帳（無需人工確認）
- 虛擬帳號自動產生
- 支援信用卡、LINE Pay、街口等
- T+1 或 T+2 撥款

### 申請流程
1. 前往 [綠界科技官網](https://www.ecpay.com.tw/)
2. 註冊帳號（個人/公司都可）
3. 填寫資料並審核
4. 取得 API 金鑰
5. 整合到系統（我可以幫你）

### 撥款時間
- 虛擬帳號：T+1 到 T+2
- 信用卡：T+2 到 T+7
- 可申請快速撥款

---

## 常見問題 ❓

**Q: 街口支付可以自動通知系統嗎？**
A: 個人收款無法自動通知，需要客戶上傳截圖。商家版可以，但需要申請。

**Q: LINE Pay 可以產生付款連結嗎？**
A: 個人版不行，只能掃 QR Code。商家版可以產生連結。

**Q: 銀行轉帳如何快速對帳？**
A: 讓客戶輸入「轉帳帳號後五碼」，你只需核對後五碼即可，比對帳快很多。

**Q: 需要 SSL 憑證嗎？**
A: 正式上線時需要 HTTPS，開發測試可以用 HTTP。

**Q: 如何處理退款？**
A: 目前需要手動退款。如果使用綠界，可以透過 API 自動退款。

---

## 聯絡資訊

如果你在設定過程中遇到問題，或想要：
- 建立後台管理系統
- 整合綠界金流
- 加入其他付款方式
- 優化付款流程

隨時告訴我！
