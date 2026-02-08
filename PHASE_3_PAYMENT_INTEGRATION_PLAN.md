# 第三階段：金流整合計劃

## 📋 概述

第三階段將整合 ECPay 綠界科技金流，實現完整的線上付款功能。

## 🎯 目標

1. 整合 ECPay 金流服務
2. 實作付款頁面和回調處理
3. 更新訂單狀態自動化
4. 發送付款成功通知
5. 完成生產環境部署

## 📦 需要安裝的套件

```bash
npm install ecpay_aio_nodejs
```

## 🔧 需要建立的檔案

### 1. ECPay 配置
**檔案**: `lib/payment/ecpay-config.ts`
- 測試環境配置
- 正式環境配置
- 環境切換邏輯

### 2. 付款建立 API
**檔案**: `app/api/payment/create/route.ts`
- 從資料庫取得訂單資訊
- 建立 ECPay 付款參數
- 產生付款表單 HTML
- 更新訂單狀態為「處理中」

### 3. 付款回調 API
**檔案**: `app/api/payment/callback/route.ts`
- 驗證 CheckMacValue
- 更新訂單狀態
- 發送付款成功通知
- 回傳 1|OK 給 ECPay

### 4. 付款頁面
**檔案**: `app/payment/[orderNumber]/page.tsx`
- 呼叫付款建立 API
- 顯示載入狀態
- 自動提交表單到 ECPay

### 5. Checkout 頁面更新
**檔案**: `app/checkout/page.tsx`
- 整合付款流程
- 訂單建立後導向付款頁面
- 移除舊的付款證明上傳邏輯（改為 ECPay）

## 🔑 需要設定的環境變數

### 開發環境 (`.env.local`)
```bash
# ECPay 測試環境
ECPAY_TEST_MERCHANT_ID=2000132
ECPAY_TEST_HASH_KEY=5294y06JbISpM5x9
ECPAY_TEST_HASH_IV=v77hoKGq4kWxNNIS
```

### 正式環境 (Vercel)
```bash
# ECPay 正式環境
ECPAY_MERCHANT_ID=你的特店編號
ECPAY_HASH_KEY=你的HashKey
ECPAY_HASH_IV=你的HashIV
```

## 📝 實作步驟

### Step 1: 安裝 ECPay SDK
```bash
npm install ecpay_aio_nodejs
```

### Step 2: 建立 ECPay 配置
參考 `PRODUCTION_DEPLOYMENT_PLAN_WITH_PAYMENT.md` 中的範例程式碼

### Step 3: 建立付款 API
- 付款建立 API (`/api/payment/create`)
- 付款回調 API (`/api/payment/callback`)

### Step 4: 建立付款頁面
- 付款頁面 (`/payment/[orderNumber]`)

### Step 5: 更新 Checkout 頁面
- 訂單建立成功後導向付款頁面
- 移除舊的付款方式選擇（改為統一使用 ECPay）

### Step 6: 測試
- 使用 ECPay 測試卡號測試
- 驗證訂單狀態更新
- 驗證付款成功通知

### Step 7: 部署
- 設定 Vercel 環境變數
- 部署到正式環境
- 申請 ECPay 正式環境帳號

## 🧪 測試計劃

### 測試環境測試
1. **信用卡付款測試**
   - 使用測試卡號：4311-9522-2222-2222
   - 驗證付款成功
   - 驗證訂單狀態更新為「已確認」
   - 驗證收到付款成功通知信

2. **ATM 付款測試**
   - 選擇 ATM 付款
   - 取得虛擬帳號
   - 驗證訂單狀態更新為「已提交付款」

3. **超商代碼測試**
   - 選擇超商付款
   - 取得繳費代碼
   - 驗證訂單狀態更新為「已提交付款」

### 回調測試
1. **成功回調測試**
   - 模擬 ECPay 成功回調
   - 驗證訂單狀態更新
   - 驗證通知信發送

2. **失敗回調測試**
   - 模擬 ECPay 失敗回調
   - 驗證訂單狀態更新為「付款失敗」
   - 驗證錯誤處理

## 📊 付款流程圖

```
用戶完成報名
    ↓
建立訂單（status: pending_payment）
    ↓
導向付款頁面 (/payment/[orderNumber])
    ↓
呼叫 POST /api/payment/create
    ↓
產生 ECPay 付款表單
    ↓
自動提交到 ECPay
    ↓
用戶在 ECPay 完成付款
    ↓
ECPay 回調 POST /api/payment/callback
    ↓
驗證 CheckMacValue
    ↓
更新訂單狀態（confirmed / payment_failed）
    ↓
發送付款成功通知
    ↓
用戶返回訂單詳情頁面
```

## 🔒 安全性考量

### CheckMacValue 驗證
- 所有回調都必須驗證 CheckMacValue
- 防止偽造的付款通知
- 使用 ECPay SDK 提供的驗證方法

### HTTPS 要求
- ECPay 回調 URL 必須使用 HTTPS
- Vercel 自動提供 HTTPS

### 環境變數保護
- HashKey 和 HashIV 不可外洩
- 使用環境變數儲存
- 不可提交到 Git

## 📞 ECPay 支援

### 申請流程
1. 前往 ECPay 官網註冊
2. 準備文件（公司登記證明或個人身分證）
3. 填寫申請表單
4. 等待審核（約 3-5 個工作天）
5. 取得測試環境帳號
6. 整合測試
7. 申請正式環境

### 客服資訊
- 電話：02-2655-1775
- Email：service@ecpay.com.tw
- 服務時間：週一至週五 9:00-18:00

## 🎯 成功指標

### 功能完整性
- [ ] 信用卡付款成功
- [ ] ATM 付款成功
- [ ] 超商代碼付款成功
- [ ] 訂單狀態自動更新
- [ ] 付款成功通知發送

### 效能指標
- [ ] 付款頁面載入時間 < 2 秒
- [ ] 回調處理時間 < 1 秒
- [ ] 支援 500+ 並發付款

### 安全性指標
- [ ] CheckMacValue 驗證 100% 通過
- [ ] 無 SQL 注入漏洞
- [ ] 無 XSS 漏洞
- [ ] HTTPS 連線

## 📝 注意事項

### 測試環境限制
- 測試環境不會真的扣款
- 測試卡號僅供測試使用
- 測試環境資料不會同步到正式環境

### 正式環境注意
- 正式環境會真的扣款
- 需要申請正式環境帳號
- 需要設定正式環境的 HashKey 和 HashIV
- 需要設定正式環境的回調 URL

### 手續費
- 信用卡：約 2.5-3%
- ATM：約 $10-15/筆
- 超商代碼：約 $25-30/筆

## 🎉 完成後的系統功能

完成第三階段後，系統將具備：

1. ✅ 完整的線上付款功能
2. ✅ 多種付款方式（信用卡、ATM、超商）
3. ✅ 自動化訂單狀態更新
4. ✅ 付款成功通知
5. ✅ 完整的付款記錄
6. ✅ 生產環境就緒

**系統將可以正式上線營運！** 🚀

## 📚 參考文件

- `PRODUCTION_DEPLOYMENT_PLAN_WITH_PAYMENT.md` - 完整的金流整合指南
- ECPay 官方文件：https://www.ecpay.com.tw/
- ECPay API 文件：https://developers.ecpay.com.tw/

---

**準備好開始第三階段了嗎？** 🎯

建議先完成第二階段的完整測試，確保所有功能正常運作後，再開始第三階段的金流整合。
