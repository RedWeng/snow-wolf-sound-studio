# 快速報名實施計劃
**目標**: 30-60 秒完成報名
**開始日期**: 2026-02-06

---

## 🎯 Phase 1: 立即實施 (本週完成)

### 1.1 簡化孩子資料輸入 ⚡
**預計時間**: 2-3 小時
**節省用戶時間**: 30-45 秒

#### 修改文件
- `app/onboarding/page.tsx`
- `components/profile/ChildFormModal.tsx`

#### 具體改動
```typescript
// 原本的表單 (複雜)
<form>
  <input name="name" placeholder="姓名" required />
  <input name="age" type="number" required />
  <select name="gender">
    <option>男</option>
    <option>女</option>
  </select>
  <textarea name="specialNeeds" placeholder="特殊需求" />
  <checkbox name="hasAttendedBefore" />
</form>

// 優化後的表單 (簡潔)
<form>
  <input 
    name="name" 
    placeholder="孩子姓名" 
    required 
    autoFocus
  />
  
  {/* 年齡快速選擇器 */}
  <div className="age-selector">
    <label>年齡</label>
    <div className="flex gap-2 flex-wrap">
      {[5,6,7,8,9,10,11,12].map(age => (
        <button
          type="button"
          key={age}
          onClick={() => setAge(age)}
          className={`
            px-4 py-3 rounded-full font-bold
            ${selectedAge === age 
              ? 'bg-accent-aurora text-white' 
              : 'bg-white/10 text-white/70 hover:bg-white/20'
            }
          `}
        >
          {age}歲
        </button>
      ))}
    </div>
  </div>
  
  {/* 移除性別、特殊需求等非必要欄位 */}
  {/* 可在後續步驟補充 */}
</form>
```

#### 驗證標準
- ✅ 只需填寫姓名和年齡
- ✅ 年齡選擇只需點擊一次
- ✅ 新增一個孩子 < 15 秒

---

### 1.2 課程卡片全資訊顯示 + 一鍵報名 ⚡⚡⚡
**預計時間**: 4-5 小時
**節省用戶時間**: 60-90 秒 (包含移除查看詳情的時間)

#### 核心改進
✅ **直接在卡片上顯示所有資訊**
- 地點、價格、時間、適合年齡
- 無需點擊「查看詳情」
- 無需打開 Modal
- 無需跳轉頁面

#### 修改文件
- `app/sessions/page.tsx`
- 移除 `components/landing/SessionDetailModal.tsx` (不再需要)

#### 新卡片設計

```typescript
// 完整資訊卡片
<div className="session-card">
  {/* 圖片 */}
  <div className="card-media">
    <img src={session.image_url} />
    {isAlmostFull && (
      <div className="badge-urgent">
        ⚡ 剩餘 {remaining} 個名額
      </div>
    )}
  </div>
  
  {/* 所有關鍵資訊 - 直接顯示 */}
  <div className="card-content">
    <h3>🎬 {session.title_zh}</h3>
    <p>{session.theme_zh}</p>
    
    {/* 關鍵資訊網格 */}
    <div className="info-grid">
      <div>📅 {date} ({day}) {time}</div>
      <div>⏱️ {duration} 分鐘</div>
      <div>📍 {venue}</div>
      <div>👥 適合 {age_min}-{age_max} 歲</div>
      <div className="price">💰 NT$ {price} / 人</div>
    </div>
    
    {/* 孩子選擇器 - 直接在卡片上 */}
    <div className="children-selector">
      <label>選擇參加的孩子：</label>
      <div className="children-chips">
        {children.map(child => (
          <button
            onClick={() => toggle(child.id)}
            className={isSelected ? 'selected' : ''}
          >
            {child.name} {child.age}歲
          </button>
        ))}
      </div>
    </div>
    
    {/* 立即報名按鈕 */}
    <button className="btn-book-now">
      {selectedCount === 0 
        ? '請選擇孩子' 
        : `立即報名 (已選 ${selectedCount} 位)`
      }
    </button>
    
    {/* 優惠提示 */}
    {selectedCount > 0 && (
      <div className="discount-hint">
        💡 {getDiscountHint(selectedCount)}
      </div>
    )}
  </div>
</div>
```

#### 具體改動

**情況 A: 只有一個孩子**
```typescript
// 直接在卡片上顯示「立即報名」
<button
  onClick={() => {
    // 自動選擇唯一的孩子
    handleChildToggle(session.id, children[0].id);
    // 直接加入購物車
    handleAddToCart(session.id);
    // 自動打開購物車
    setIsCartOpen(true);
  }}
  className="quick-book-btn"
>
  立即報名
</button>
```

**情況 B: 多個孩子**
```typescript
// 卡片上直接顯示孩子選擇器
<div className="children-quick-select">
  {children.map(child => (
    <button
      key={child.id}
      onClick={() => handleChildToggle(session.id, child.id)}
      className={`
        child-chip
        ${isSelected(child.id) ? 'selected' : ''}
      `}
    >
      {child.name} {child.age}歲
    </button>
  ))}
</div>

<button
  onClick={() => handleAddToCart(session.id)}
  disabled={!hasSelection}
>
  加入購物車
</button>
```

#### UI 改進
```typescript
// 課程卡片新佈局
<div className="session-card">
  {/* 課程資訊 */}
  <div className="session-info">
    <h3>{session.title}</h3>
    <p>{session.date} {session.time}</p>
  </div>
  
  {/* 快速選擇區 - 不需要展開 */}
  <div className="quick-select-area">
    {children.length === 1 ? (
      // 單一孩子：直接顯示報名按鈕
      <button className="btn-primary-large">
        為 {children[0].name} 立即報名
      </button>
    ) : (
      // 多個孩子：顯示快速選擇器
      <>
        <div className="children-chips">
          {children.map(child => (
            <ChildChip 
              key={child.id}
              child={child}
              selected={isSelected(child.id)}
              onToggle={() => toggle(child.id)}
            />
          ))}
        </div>
        <button className="btn-primary">
          加入購物車
        </button>
      </>
    )}
  </div>
</div>
```

#### 驗證標準
- ✅ 單一孩子：1 次點擊完成選課
- ✅ 多個孩子：2-3 次點擊完成選課
- ✅ 不需要展開/收合卡片

---

### 1.3 角色選擇後置 ⚡
**預計時間**: 2-3 小時
**節省用戶時間**: 30-45 秒

#### 修改文件
- `app/sessions/page.tsx` - 移除角色選擇
- `app/checkout/page.tsx` - 新增角色選擇

#### 具體改動

**Sessions Page: 移除角色選擇**
```typescript
// 移除這段代碼
{session.roles && (
  <CharacterRoleSelector
    session={session}
    selectedRoleId={roleId}
    onRoleSelect={setRoleId}
  />
)}

// 改為在加入購物車時標記「需要選擇角色」
addItem({
  ...itemData,
  needsRoleSelection: session.roles && session.roles.length > 0,
});
```

**Checkout Page: 新增角色選擇**
```typescript
// 在結帳頁面統一選擇角色
<div className="role-selection-section">
  <h3>選擇配音角色</h3>
  
  {orderItems
    .filter(item => item.needsRoleSelection)
    .map(item => (
      <div key={item.id} className="role-select-row">
        <div className="item-info">
          <span>{item.sessionTitle}</span>
          <span>{item.childName}</span>
        </div>
        
        <select
          value={item.roleId || ''}
          onChange={(e) => updateItemRole(item.id, e.target.value)}
          className="role-dropdown"
        >
          <option value="">請選擇角色</option>
          {session.roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.name_zh}
            </option>
          ))}
        </select>
      </div>
    ))
  }
</div>
```

#### 驗證標準
- ✅ 課程選擇時不需要選角色
- ✅ 結帳頁面統一選擇所有角色
- ✅ 角色選擇使用下拉選單（更快）

---

### 1.4 結帳頁面預填 ⚡
**預計時間**: 1-2 小時
**節省用戶時間**: 20-30 秒

#### 修改文件
- `app/checkout/page.tsx`

#### 具體改動
```typescript
// 自動預填用戶資訊
useEffect(() => {
  if (user) {
    setParentInfo({
      name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      lineId: '', // 選填
      fbId: '', // 選填
      notes: '',
    });
  }
}, [user]);

// 記住付款方式偏好
useEffect(() => {
  const savedPaymentMethod = localStorage.getItem('preferred_payment_method');
  if (savedPaymentMethod) {
    setPaymentMethod(savedPaymentMethod as any);
  }
}, []);

// 保存付款方式偏好
const handlePaymentMethodChange = (method: string) => {
  setPaymentMethod(method);
  localStorage.setItem('preferred_payment_method', method);
};
```

#### UI 改進
```typescript
// 簡化表單佈局
<form className="checkout-form">
  {/* 只顯示未填寫的必填欄位 */}
  {!parentInfo.phone && (
    <input
      name="phone"
      placeholder="手機號碼 *"
      required
      autoFocus
    />
  )}
  
  {/* 選填欄位摺疊 */}
  <details>
    <summary>更多聯絡方式（選填）</summary>
    <input name="lineId" placeholder="LINE ID" />
    <input name="fbId" placeholder="Facebook ID" />
  </details>
  
  {/* 備註欄位摺疊 */}
  <details>
    <summary>備註（選填）</summary>
    <textarea name="notes" />
  </details>
</form>
```

#### 驗證標準
- ✅ 已登入用戶自動填入姓名、Email
- ✅ 只需填寫手機號碼（如果沒有）
- ✅ 記住付款方式偏好

---

## 🚀 Phase 2: 進階優化 (下週完成)

### 2.1 智能推薦系統
**預計時間**: 4-6 小時

#### 功能
1. 根據孩子年齡自動篩選課程
2. 優先顯示即將額滿的課程
3. 標記「推薦」課程

#### 實施
```typescript
// 智能排序課程
const sortedSessions = useMemo(() => {
  return mockSessions
    .filter(s => s.status === 'active')
    .sort((a, b) => {
      // 1. 適合孩子年齡的課程優先
      const aFitsAge = children.some(c => 
        c.age >= a.age_min && c.age <= a.age_max
      );
      const bFitsAge = children.some(c => 
        c.age >= b.age_min && c.age <= b.age_max
      );
      if (aFitsAge && !bFitsAge) return -1;
      if (!aFitsAge && bFitsAge) return 1;
      
      // 2. 即將額滿的課程優先
      const aRemaining = a.capacity - (a.current_registrations || 0);
      const bRemaining = b.capacity - (b.current_registrations || 0);
      const aAlmostFull = aRemaining <= 3;
      const bAlmostFull = bRemaining <= 3;
      if (aAlmostFull && !bAlmostFull) return -1;
      if (!aAlmostFull && bAlmostFull) return 1;
      
      // 3. 日期較近的優先
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
}, [mockSessions, children]);
```

---

### 2.2 快速報名模式
**預計時間**: 6-8 小時

#### 功能
為回訪用戶提供「快速報名」入口

#### 實施
```typescript
// 新增快速報名組件
<QuickBookingPanel>
  <h3>快速報名</h3>
  <p>為 {children[0].name} 選擇課程</p>
  
  <div className="recommended-sessions">
    {getRecommendedSessions().map(session => (
      <button
        key={session.id}
        onClick={() => quickBook(session)}
        className="quick-book-card"
      >
        <h4>{session.title}</h4>
        <p>{session.date} {session.time}</p>
        <span className="price">NT$ {session.price}</span>
        <div className="btn-primary">立即報名</div>
      </button>
    ))}
  </div>
</QuickBookingPanel>

// 快速報名函數
const quickBook = async (session: Session) => {
  // 1. 自動選擇預設孩子
  const defaultChild = children[0];
  
  // 2. 直接加入購物車
  addItem({
    sessionId: session.id,
    childId: defaultChild.id,
    // ... 其他資訊
  });
  
  // 3. 直接跳到結帳
  router.push('/checkout');
};
```

---

### 2.3 記住用戶偏好
**預計時間**: 3-4 小時

#### 功能
記住並自動應用用戶的選擇偏好

#### 實施
```typescript
// 保存用戶偏好
interface UserPreferences {
  lastSelectedChildren: string[];
  preferredSessionTypes: string[];
  preferredPaymentMethod: string;
  lastBookingDate: string;
}

// 保存偏好
const savePreferences = () => {
  const prefs: UserPreferences = {
    lastSelectedChildren: selections.flatMap(s => s.childIds),
    preferredSessionTypes: selections.map(s => s.sessionId),
    preferredPaymentMethod: paymentMethod || '',
    lastBookingDate: new Date().toISOString(),
  };
  
  localStorage.setItem(
    `user_prefs_${user.id}`, 
    JSON.stringify(prefs)
  );
};

// 載入偏好
const loadPreferences = () => {
  const saved = localStorage.getItem(`user_prefs_${user.id}`);
  if (saved) {
    const prefs: UserPreferences = JSON.parse(saved);
    
    // 自動選擇上次的孩子
    prefs.lastSelectedChildren.forEach(childId => {
      // 自動勾選
    });
    
    // 自動展開推薦課程
    const recommendedSession = getRecommendedSession(prefs);
    setExpandedSession(recommendedSession);
  }
};
```

---

## 📊 測試計劃

### 測試場景

#### 場景 1: 新用戶首次報名
```
目標時間: 60 秒

步驟:
1. 登入 (10秒)
2. 新增孩子 (15秒)
3. 選擇課程 (15秒)
4. 結帳 (20秒)

驗證:
- ✅ 總時間 < 60 秒
- ✅ 無錯誤提示
- ✅ 流程順暢
```

#### 場景 2: 回訪用戶報名
```
目標時間: 30 秒

步驟:
1. 自動登入 (0秒)
2. 快速報名 (10秒)
3. 結帳 (20秒)

驗證:
- ✅ 總時間 < 30 秒
- ✅ 自動預填資訊
- ✅ 記住偏好
```

#### 場景 3: 多個孩子報名
```
目標時間: 45 秒

步驟:
1. 選擇課程 (10秒)
2. 快速勾選孩子 (10秒)
3. 加入購物車 (5秒)
4. 結帳 (20秒)

驗證:
- ✅ 總時間 < 45 秒
- ✅ 批次選擇順暢
- ✅ 無需重複操作
```

---

## 🎯 成功指標

### 量化指標
- ✅ 平均報名時間 < 60 秒
- ✅ 新用戶轉換率 > 60%
- ✅ 回訪用戶轉換率 > 80%
- ✅ 放棄率 < 20%

### 質化指標
- ✅ 用戶反饋正面
- ✅ 客服諮詢減少
- ✅ 錯誤率降低
- ✅ 滿意度提升

---

## 📝 實施檢查清單

### Phase 1 (本週)
- [ ] 簡化孩子資料輸入
  - [ ] 移除非必要欄位
  - [ ] 新增年齡快速選擇器
  - [ ] 測試表單驗證
  
- [ ] 課程卡片一鍵報名
  - [ ] 單一孩子直接報名
  - [ ] 多個孩子快速選擇
  - [ ] 測試購物車流程
  
- [ ] 角色選擇後置
  - [ ] 移除課程頁面角色選擇
  - [ ] 新增結帳頁面角色選擇
  - [ ] 測試角色分配
  
- [ ] 結帳頁面預填
  - [ ] 自動填入用戶資訊
  - [ ] 記住付款方式
  - [ ] 測試預填邏輯

### Phase 2 (下週)
- [ ] 智能推薦系統
- [ ] 快速報名模式
- [ ] 記住用戶偏好

---

## 🚨 風險與應對

### 風險 1: 簡化過度導致資訊不足
**應對**: 
- 在確認頁面補充資訊
- 提供「編輯」功能
- 保留選填欄位

### 風險 2: 用戶不習慣新流程
**應對**:
- 提供引導提示
- 保留舊流程入口
- 收集用戶反饋

### 風險 3: 技術實施困難
**應對**:
- 分階段實施
- 充分測試
- 準備回滾方案

---

**下一步**: 開始實施 Phase 1.1 - 簡化孩子資料輸入
