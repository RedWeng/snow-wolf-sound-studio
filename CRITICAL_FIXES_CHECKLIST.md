# 關鍵修復檢查清單
## 500 人同時上線準備 - 2026-02-08

---

## ✅ 任務完成狀態

### 任務 1: 統一錯誤處理機制 ✅

**檔案**: `lib/api/error-handler.ts`

- [x] APIError 類別已建立
- [x] handleAPIError 函數已實作
- [x] 統一的錯誤回應格式
- [x] 資料庫錯誤處理
- [x] 驗證錯誤處理
- [x] withErrorHandler 包裝器
- [x] 輔助函數（validateRequiredFields, safeJSONParse 等）
- [x] 完整的 TypeScript 類型定義
- [x] 使用文件已建立

**測試項目**:
```bash
# 測試錯誤處理
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{}'
# 預期: 400 錯誤，包含 MISSING_REQUIRED_FIELD 代碼
```

---

### 任務 2: 前端 API 請求 Hook ✅

**檔案**: `lib/hooks/useAPIRequest.ts`

- [x] useAPIRequest hook 已實作
- [x] 自動重試機制（預設 3 次）
- [x] Loading 狀態管理
- [x] 錯誤狀態管理
- [x] 指數退避重試策略
- [x] 請求取消支援
- [x] 超時控制
- [x] 便捷 Hooks（useAPIGet, useAPIPost, useAPIPut, useAPIDelete）
- [x] 完整的 TypeScript 類型定義
- [x] 使用文件已建立

**測試項目**:
```typescript
// 在任何元件中測試
const { request, loading, error } = useAPIRequest();

// 測試自動重試
await request('/api/test-endpoint', {
  method: 'GET',
  retries: 3,
});
```

---

### 任務 3: 表單防重複提交 Hook ✅

**檔案**: `lib/hooks/useFormSubmit.ts`

- [x] useFormSubmit hook 已實作
- [x] 防止重複提交
- [x] 防抖機制
- [x] Loading 狀態
- [x] 錯誤處理
- [x] 成功回調
- [x] 表單驗證支援
- [x] useForm hook（完整表單管理）
- [x] useFormField hook（單一欄位管理）
- [x] 完整的 TypeScript 類型定義
- [x] 使用文件已建立

**測試項目**:
```typescript
// 測試防重複提交
const { handleSubmit, isSubmitting } = useFormSubmit({
  onSubmit: async (data) => {
    // 提交邏輯
  },
});

// 快速點擊兩次，應該只提交一次
handleSubmit(data);
handleSubmit(data); // 應該被忽略
```

---

## 📋 整合檢查清單

### 後端 API 整合

- [ ] 將現有 API 路由遷移到使用 `withErrorHandler`
- [ ] 替換手動錯誤處理為統一錯誤處理
- [ ] 使用 `validateRequiredFields` 驗證輸入
- [ ] 使用 `safeJSONParse` 解析請求 body
- [ ] 使用語義化的錯誤建立函數

**優先級高的 API 端點**:
1. [ ] `/api/orders` - 訂單建立
2. [ ] `/api/sessions` - 課程查詢
3. [ ] `/api/registrations` - 報名管理
4. [ ] `/api/auth/login` - 使用者登入
5. [ ] `/api/children` - 孩童資料管理

### 前端元件整合

- [ ] 將現有表單遷移到使用 `useFormSubmit`
- [ ] 將現有 API 請求遷移到使用 `useAPIRequest`
- [ ] 確保所有提交按鈕有 `disabled={isSubmitting}` 屬性
- [ ] 顯示適當的 Loading 狀態
- [ ] 顯示錯誤訊息

**優先級高的元件**:
1. [ ] `components/checkout/OrderForm.tsx` - 訂單表單
2. [ ] `components/landing/SessionsGridSection.tsx` - 課程列表
3. [ ] `app/login/page.tsx` - 登入頁面
4. [ ] `components/profile/ChildFormModal.tsx` - 孩童資料表單
5. [ ] `app/checkout/page.tsx` - 結帳頁面

---

## 🧪 測試檢查清單

### 單元測試

- [ ] 測試 APIError 類別
- [ ] 測試 handleAPIError 函數
- [ ] 測試資料庫錯誤轉換
- [ ] 測試 useAPIRequest 重試機制
- [ ] 測試 useFormSubmit 防重複提交

### 整合測試

- [ ] 測試訂單建立流程
- [ ] 測試並發請求處理
- [ ] 測試錯誤處理流程
- [ ] 測試表單提交流程

### 負載測試

- [ ] 使用 k6 進行負載測試
- [ ] 測試 500 個並發使用者
- [ ] 測試資料庫連線池
- [ ] 測試 API 回應時間

```bash
# 負載測試腳本
k6 run --vus 500 --duration 5m load-test.js
```

---

## 🔍 程式碼審查檢查清單

### 錯誤處理

- [ ] 所有 API 路由都使用 `withErrorHandler`
- [ ] 錯誤訊息對使用者友善
- [ ] 錯誤代碼語義化
- [ ] 開發環境提供詳細錯誤資訊
- [ ] 生產環境不洩漏敏感資訊

### 表單處理

- [ ] 所有表單都防止重複提交
- [ ] 提交按鈕在提交時禁用
- [ ] 顯示適當的 Loading 狀態
- [ ] 錯誤訊息清晰明確
- [ ] 成功後有適當的回饋

### API 請求

- [ ] 使用自動重試機制
- [ ] 設定適當的超時時間
- [ ] 處理網路錯誤
- [ ] 顯示 Loading 狀態
- [ ] 可以取消請求

---

## 📊 效能檢查清單

### 資料庫

- [ ] 連線池已設定（最大 20 個連線）
- [ ] 使用資料庫交易
- [ ] 使用 `SELECT FOR UPDATE` 鎖定記錄
- [ ] 索引已建立
- [ ] 查詢已優化

### API

- [ ] 回應時間 < 500ms（正常情況）
- [ ] 回應時間 < 2s（高負載情況）
- [ ] 錯誤率 < 1%
- [ ] 重試成功率 > 90%

### 前端

- [ ] 首次內容繪製 (FCP) < 1.5s
- [ ] 最大內容繪製 (LCP) < 2.5s
- [ ] 首次輸入延遲 (FID) < 100ms
- [ ] 累積版面配置位移 (CLS) < 0.1

---

## 🚀 部署前檢查清單

### 環境變數

- [ ] `DATABASE_URL` 已設定
- [ ] `JWT_SECRET` 已設定
- [ ] `NEXT_PUBLIC_API_URL` 已設定
- [ ] `NODE_ENV=production` 已設定

### 資料庫

- [ ] 連線測試通過
- [ ] 遷移已執行
- [ ] 索引已建立
- [ ] 備份已設定

### 監控

- [ ] 錯誤追蹤已設定（Sentry）
- [ ] 效能監控已設定（Vercel Analytics）
- [ ] 日誌已設定
- [ ] 警報已設定

### 安全性

- [ ] HTTPS 已啟用
- [ ] CORS 已設定
- [ ] Rate limiting 已啟用
- [ ] SQL 注入防護已啟用
- [ ] XSS 防護已啟用

---

## 📝 文件檢查清單

- [x] 錯誤處理使用文件
- [x] Hooks 使用文件
- [x] 整合範例文件
- [x] 檢查清單文件
- [ ] API 文件更新
- [ ] 部署文件更新

---

## 🎯 上線前最終確認

### 功能測試

- [ ] 訂單建立流程正常
- [ ] 課程報名流程正常
- [ ] 付款流程正常
- [ ] 郵件發送正常
- [ ] 錯誤處理正常

### 效能測試

- [ ] 500 個並發使用者測試通過
- [ ] 資料庫連線穩定
- [ ] API 回應時間符合要求
- [ ] 前端載入速度符合要求

### 安全測試

- [ ] SQL 注入測試通過
- [ ] XSS 測試通過
- [ ] CSRF 測試通過
- [ ] 認證測試通過

### 監控測試

- [ ] 錯誤追蹤正常運作
- [ ] 效能監控正常運作
- [ ] 日誌記錄正常運作
- [ ] 警報通知正常運作

---

## 🆘 回滾計劃

如果上線後出現問題：

1. **立即回滾**
   ```bash
   # Vercel 回滾到上一個版本
   vercel rollback
   ```

2. **檢查錯誤日誌**
   - 查看 Vercel 日誌
   - 查看 Sentry 錯誤報告
   - 查看資料庫日誌

3. **通知使用者**
   - 在網站顯示維護訊息
   - 發送郵件通知
   - 更新社群媒體

4. **修復問題**
   - 識別問題根源
   - 在開發環境修復
   - 重新測試
   - 重新部署

---

## 📞 緊急聯絡

- **技術負責人**: [姓名] - [電話]
- **資料庫管理員**: [姓名] - [電話]
- **客服負責人**: [姓名] - [電話]

---

## ✅ 簽核

- [ ] 開發團隊確認
- [ ] 測試團隊確認
- [ ] 產品負責人確認
- [ ] 技術負責人確認

**確認日期**: _______________

**簽名**: _______________

---

**建立日期**: 2026-02-08
**最後更新**: 2026-02-08
**版本**: 1.0
