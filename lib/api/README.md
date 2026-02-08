# Mock API Layer

This directory contains mock API functions that simulate backend functionality for the Snow Wolf Event Registration System. All functions include realistic network delays (100-500ms) to simulate real-world API behavior.

## Overview

The mock API layer provides a complete set of functions for:
- **Session Management**: Fetching and filtering sessions, checking availability
- **Children Management**: CRUD operations for parent's children
- **Order Management**: Creating orders with price calculation, uploading payment proofs

## Requirements Validated

- **Requirement 2.1**: Session management and display
- **Requirement 3.1**: Multi-child registration flow
- **Requirement 4.1**: Automated price calculation
- **Requirement 6.1**: Order creation and payment deadline

## Usage

### Import API Functions

```typescript
import {
  getSessions,
  getSessionById,
  getSessionAvailability,
  getChildren,
  createChild,
  updateChild,
  deleteChild,
  createOrder,
  uploadPaymentProof,
} from '@/lib/api';
```

### Session API

#### `getSessions(filters?)`

Fetch all sessions with optional filtering.

```typescript
// Get all active sessions
const sessions = await getSessions({ status: 'active' });

// Get sessions in date range
const sessions = await getSessions({
  dateFrom: '2024-02-15',
  dateTo: '2024-03-15',
});

// Get all sessions (no filter)
const allSessions = await getSessions();
```

**Parameters:**
- `filters` (optional):
  - `status`: Filter by session status ('active' | 'cancelled' | 'completed')
  - `dateFrom`: Filter sessions from this date (YYYY-MM-DD)
  - `dateTo`: Filter sessions up to this date (YYYY-MM-DD)

**Returns:** `Promise<Session[]>` - Array of sessions sorted by date ascending

---

#### `getSessionById(id)`

Fetch a single session by ID.

```typescript
const session = await getSessionById('1');
if (session) {
  console.log(session.title_zh);
}
```

**Parameters:**
- `id`: Session ID

**Returns:** `Promise<Session | null>` - Session object or null if not found

---

#### `getSessionAvailability(sessionId)`

Get availability information for a session.

```typescript
const availability = await getSessionAvailability('1');
console.log(`Available seats: ${availability.available}`);
console.log(`Waitlist only: ${availability.isWaitlistOnly}`);
```

**Parameters:**
- `sessionId`: Session ID

**Returns:** `Promise<{ capacity, registered, available, isWaitlistOnly }>`

**Throws:** Error if session not found

---

### Children API

#### `getChildren(parentId)`

Get all children for a parent.

```typescript
const children = await getChildren('user-1');
// Returns children sorted by age descending (oldest first)
```

**Parameters:**
- `parentId`: Parent user ID

**Returns:** `Promise<Child[]>` - Array of children

---

#### `createChild(data)`

Create a new child for a parent.

```typescript
const child = await createChild({
  parentId: 'user-1',
  name: '王小明',
  age: 8,
  notes: '喜歡音樂', // optional
});
```

**Parameters:**
- `data`:
  - `parentId`: Parent user ID (required)
  - `name`: Child's name (required, will be trimmed)
  - `age`: Child's age 0-18 (required)
  - `notes`: Additional notes (optional, will be trimmed)

**Returns:** `Promise<Child>` - Created child object

**Throws:**
- Error if parent already has 4 children
- Error if name is empty or only whitespace
- Error if age is missing or out of range (0-18)

---

#### `updateChild(id, data)`

Update an existing child.

```typescript
const updatedChild = await updateChild('child-1', {
  name: '王小華',
  age: 9,
  notes: '更新的備註',
});
```

**Parameters:**
- `id`: Child ID
- `data`: Partial child data to update
  - `name`: New name (optional, will be trimmed)
  - `age`: New age 0-18 (optional)
  - `notes`: New notes (optional, will be trimmed, empty string sets to null)

**Returns:** `Promise<Child>` - Updated child object

**Throws:**
- Error if child not found
- Error if name is empty
- Error if age is out of range (0-18)

---

#### `deleteChild(id)`

Delete a child.

```typescript
await deleteChild('child-1');
```

**Parameters:**
- `id`: Child ID

**Returns:** `Promise<void>`

**Throws:** Error if child not found

**Note:** In a real implementation, this would prevent deletion if the child has confirmed registrations.

---

### Orders API

#### `createOrder(data)`

Create a new order with automatic price calculation.

```typescript
const order = await createOrder({
  parentId: 'user-1',
  items: [
    { sessionId: '1', childId: 'child-1' },
    { sessionId: '2', childId: 'child-2' },
  ],
  groupCode: 'GROUP123', // optional
  paymentMethod: 'bank_transfer',
  notes: 'Special request', // optional
});
```

**Parameters:**
- `data`:
  - `parentId`: Parent user ID (required)
  - `items`: Array of session-child pairs (required, minimum 1)
    - `sessionId`: Session ID
    - `childId`: Child ID
  - `groupCode`: Group code for seating arrangement (optional)
  - `paymentMethod`: 'bank_transfer' | 'line_pay' (required)
  - `notes`: Additional notes (optional, will be trimmed)

**Returns:** `Promise<Order>` - Created order with:
- Unique order number (format: SW20240215-0001)
- Status: 'pending_payment'
- Price breakdown with bundle discounts:
  - 2 items: 10% discount
  - 3+ items: 15% discount
- Payment deadline: 120 hours from creation

**Throws:**
- Error if items array is empty
- Error if any session ID is invalid

---

#### `uploadPaymentProof(orderId, file)`

Upload payment proof image for an order.

```typescript
const fileInput = document.querySelector('input[type="file"]');
const file = fileInput.files[0];

const result = await uploadPaymentProof('order-1', file);
console.log(`Uploaded to: ${result.url}`);
```

**Parameters:**
- `orderId`: Order ID
- `file`: File object (must be image)

**Returns:** `Promise<{ url: string }>` - Uploaded file URL

**Throws:**
- Error if file is missing
- Error if file is not an image (JPEG, PNG, or WebP)
- Error if file size exceeds 5MB

**Note:** In a real implementation, this would:
1. Upload to Supabase Storage
2. Update order with payment_proof_url
3. Update order status to 'payment_submitted'

---

## Price Calculation Logic

The mock API implements the following pricing rules:

### Base Price
Sum of all session prices for all items in the order.

### Bundle Discounts
- **2 items**: 10% discount on total
- **3+ items**: 15% discount on total
- **1 item**: No discount

### Example Calculations

**Single Session:**
```
Session 1: TWD 2,800
Total: TWD 2,800
Discount: TWD 0
Final: TWD 2,800
```

**Two Sessions (10% discount):**
```
Session 1: TWD 2,800
Session 2: TWD 3,200
Total: TWD 6,000
Discount: TWD 600 (10%)
Final: TWD 5,400
```

**Three Sessions (15% discount):**
```
Session 1: TWD 2,800
Session 2: TWD 3,200
Session 3: TWD 2,600
Total: TWD 8,600
Discount: TWD 1,290 (15%)
Final: TWD 7,310
```

---

## Network Delay Simulation

All API functions include realistic network delays to simulate real-world behavior:

- **Default operations**: 100-500ms random delay
- **Create/Update/Delete operations**: 200-600ms random delay
- **File uploads**: 500-1500ms random delay

This helps ensure the UI handles loading states properly and provides a realistic development experience.

---

## Testing

Comprehensive unit tests are provided for all API functions:

```bash
# Run all API tests
npm test -- __tests__/api/

# Run specific test suites
npm test -- __tests__/api/sessions.test.ts
npm test -- __tests__/api/children.test.ts
npm test -- __tests__/api/orders.test.ts
```

Test coverage includes:
- ✅ Happy path scenarios
- ✅ Error handling and validation
- ✅ Edge cases (boundary values, empty inputs)
- ✅ Network delay simulation
- ✅ Price calculation logic
- ✅ File upload validation

---

## Future Implementation

In Phase 2, these mock functions will be replaced with real Supabase queries:

1. **Session API**: Query `sessions` table with RLS policies
2. **Children API**: CRUD operations on `children` table with parent validation
3. **Orders API**: 
   - Create orders and order_items atomically
   - Trigger email notifications
   - Implement real payment proof storage
   - Add order status tracking

The API interface will remain the same, ensuring a smooth transition from mock to real data.

---

## File Structure

```
lib/api/
├── index.ts           # Central export for all API functions
├── sessions.ts        # Session management functions
├── children.ts        # Children management functions
├── orders.ts          # Order management functions
└── README.md          # This file

__tests__/api/
├── sessions.test.ts   # Session API tests
├── children.test.ts   # Children API tests
└── orders.test.ts     # Orders API tests
```

---

## Notes

- All functions are async and return Promises
- All string inputs are trimmed automatically
- Validation errors throw descriptive error messages
- Mock data is imported from `lib/mock-data/`
- Type definitions are imported from `lib/types/database.ts`
