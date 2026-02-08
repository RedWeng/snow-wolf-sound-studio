# Design Document: Session Character Role Selection

## Overview

This design document specifies the implementation of character role selection functionality for session registration in the Snow Wolf Event Registration System. The feature enables users to select character roles for their children when registering for specific sessions (like the Snow Wolf Boy series), while the system tracks role assignments and enforces capacity limits.

The design follows a reusable architecture pattern that allows any session to optionally enable character role selection by configuring a roles field. The system maintains referential integrity between sessions, roles, order items, and children while providing an intuitive visual selection interface.

## Architecture

### System Components

The character role selection feature integrates into the existing registration flow with the following components:

1. **Data Layer**: Extended Session and OrderItem types with role configuration and assignment fields
2. **API Layer**: Enhanced session and order APIs to handle role validation and capacity tracking
3. **UI Components**: New CharacterRoleSelector component for visual role selection
4. **Admin Dashboard**: Enhanced session management and reporting views for role distribution

### Integration Points

The feature integrates with existing components:

- **Session Management**: Sessions can optionally define available character roles
- **Cart/Checkout Flow**: Role selection occurs after child selection, before cart addition
- **Order Processing**: Role assignments are validated and stored with order items
- **Admin Dashboard**: Role distribution and assignments are visible in session details

### Data Flow

```
User selects child for session
  ↓
System checks if session has roles
  ↓
If yes: Display CharacterRoleSelector
  ↓
User selects character role
  ↓
System validates role availability
  ↓
Role assignment stored with order item
  ↓
Role capacity decremented
```

## Components and Interfaces

### 1. Data Model Extensions

#### CharacterRole Type

```typescript
interface CharacterRole {
  id: string;                    // Unique identifier (e.g., "aileen", "litt")
  name_zh: string;               // Chinese name (e.g., "艾琳")
  name_en: string;               // English name (e.g., "Aileen")
  image_url: string;             // Path to character image (e.g., "/full/aileen-full.png")
  capacity: number;              // Maximum slots for this role (default: 4)
  description_zh?: string;       // Optional character description in Chinese
  description_en?: string;       // Optional character description in English
}
```

#### Extended Session Type

```typescript
interface Session {
  // ... existing fields ...
  roles?: CharacterRole[];       // Optional array of available character roles
}
```

#### Extended OrderItem Type

```typescript
interface OrderItem {
  // ... existing fields ...
  role_id?: string | null;       // Optional role assignment (references CharacterRole.id)
}
```

### 2. API Functions

#### Session API Extensions

```typescript
/**
 * Get role availability for a session
 * Returns current capacity status for each role
 */
async function getSessionRoleAvailability(
  sessionId: string
): Promise<Map<string, { capacity: number; assigned: number; available: number }>>

/**
 * Validate role assignment
 * Checks if role exists and has available capacity
 */
async function validateRoleAssignment(
  sessionId: string,
  roleId: string
): Promise<{ valid: boolean; error?: string }>
```

#### Order API Extensions

```typescript
/**
 * Create order with role assignments
 * Validates all role assignments before creating order
 */
async function createOrderWithRoles(data: {
  parentId: string;
  items: Array<{
    sessionId: string;
    childId: string;
    roleId?: string;  // Optional role assignment
  }>;
  paymentMethod: 'bank_transfer' | 'line_pay';
  notes?: string;
}): Promise<Order>

/**
 * Release role assignments when order is cancelled
 * Increments available capacity for assigned roles
 */
async function releaseRoleAssignments(orderId: string): Promise<void>
```

### 3. UI Components

#### CharacterRoleSelector Component

```typescript
interface CharacterRoleSelectorProps {
  session: Session;                          // Session with roles configuration
  selectedRoleId: string | null;             // Currently selected role
  onRoleSelect: (roleId: string) => void;    // Callback when role is selected
  language: 'zh' | 'en';                     // Display language
}

/**
 * Visual character role selection component
 * - Displays character portraits in responsive grid
 * - Highlights selected character
 * - Disables fully booked characters (without showing count)
 * - Shows character names in selected language
 */
function CharacterRoleSelector(props: CharacterRoleSelectorProps): JSX.Element
```

Component Structure:
- Grid layout (2-3 columns on mobile, 3-4 on desktop)
- Each role displayed as a card with:
  - Character portrait image
  - Character name (localized)
  - Selection indicator (border/glow when selected)
  - Disabled state (grayscale + opacity when full)
- Responsive design using Tailwind CSS
- Smooth animations for selection and hover states

#### Integration into SessionDetailModal

The CharacterRoleSelector will be integrated into the existing SessionDetailModal component:

```typescript
// After child selection, before "Add to Cart" button
{selectedChild && session.roles && (
  <div className="mt-6">
    <h4 className="text-lg font-semibold mb-4">
      {language === 'zh' ? '選擇角色' : 'Select Character'}
    </h4>
    <CharacterRoleSelector
      session={session}
      selectedRoleId={selectedRoleId}
      onRoleSelect={setSelectedRoleId}
      language={language}
    />
  </div>
)}
```

### 4. Admin Dashboard Extensions

#### Session Role Distribution View

```typescript
interface RoleDistribution {
  roleId: string;
  roleName: string;
  capacity: number;
  assigned: number;
  children: Array<{
    childId: string;
    childName: string;
    childAge: number;
    parentName: string;
    parentEmail: string;
    parentPhone: string;
  }>;
}

/**
 * Display role distribution for a session
 * Shows which children are assigned to each role
 */
function SessionRoleDistribution(props: {
  sessionId: string;
  language: 'zh' | 'en';
}): JSX.Element
```

#### Role Assignment Export

```typescript
/**
 * Export role assignments to CSV
 * Includes child details and contact information
 */
async function exportRoleAssignments(
  sessionId: string
): Promise<Blob>
```

CSV Format:
```
Role ID,Role Name,Child Name,Child Age,Parent Name,Parent Email,Parent Phone
aileen,艾琳,王小明,10,王大明,wang@example.com,0912345678
litt,里特,李小華,9,李大華,li@example.com,0923456789
```

## Data Models

### Battle of Kadal Character Configuration

The Battle of Kadal session will be configured with the following 6 characters:

```typescript
const battleOfKadalRoles: CharacterRole[] = [
  {
    id: 'aileen',
    name_zh: '艾琳',
    name_en: 'Aileen',
    image_url: '/full/aileen-full.png',
    capacity: 4,
  },
  {
    id: 'litt',
    name_zh: '里特',
    name_en: 'Litt',
    image_url: '/full/Litt-full.png',
    capacity: 4,
  },
  {
    id: 'kadar',
    name_zh: '卡達爾',
    name_en: 'Kadar',
    image_url: '/full/kadar-full.png',
    capacity: 4,
  },
  {
    id: 'fia',
    name_zh: '菲亞',
    name_en: 'Fia',
    image_url: '/full/fia-full.png',
    capacity: 4,
  },
  {
    id: 'aeshir',
    name_zh: '賽西莉亞',
    name_en: 'Cecilia',
    image_url: '/full/aeshir-full.png',
    capacity: 4,
  },
  {
    id: 'erwin',
    name_zh: '艾爾文老師',
    name_en: 'Teacher Erwin',
    image_url: '/full/erwin-full.png',
    capacity: 4,
  },
];
```

### Database Schema Changes

#### Sessions Table
```sql
-- Add roles column to sessions table
ALTER TABLE sessions
ADD COLUMN roles JSONB NULL;

-- Example data structure:
-- roles: [
--   {
--     "id": "aileen",
--     "name_zh": "艾琳",
--     "name_en": "Aileen",
--     "image_url": "/full/aileen-full.png",
--     "capacity": 4
--   },
--   ...
-- ]
```

#### Order Items Table
```sql
-- Add role_id column to order_items table
ALTER TABLE order_items
ADD COLUMN role_id VARCHAR(50) NULL;

-- Add index for role queries
CREATE INDEX idx_order_items_role_id ON order_items(role_id);

-- Add index for session + role queries
CREATE INDEX idx_order_items_session_role ON order_items(session_id, role_id);
```

### Role Capacity Tracking

Role capacity is calculated dynamically by counting order items:

```typescript
/**
 * Calculate role availability for a session
 * Counts confirmed order items for each role
 */
async function calculateRoleAvailability(
  sessionId: string,
  roles: CharacterRole[]
): Promise<Map<string, number>> {
  const availability = new Map<string, number>();
  
  for (const role of roles) {
    // Count order items with this role that are not cancelled
    const assignedCount = await countOrderItems({
      session_id: sessionId,
      role_id: role.id,
      order_status: ['pending_payment', 'payment_submitted', 'confirmed']
    });
    
    const available = Math.max(0, role.capacity - assignedCount);
    availability.set(role.id, available);
  }
  
  return availability;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*


### Property 1: Role Data Completeness

*For any* character role defined in a session, the role object must contain all required fields: id, name_zh, name_en, image_url, and capacity.

**Validates: Requirements 1.2**

### Property 2: Default Role Capacity

*For any* character role created without an explicit capacity value, the system must assign a default capacity of 4 slots.

**Validates: Requirements 1.3**

### Property 3: Optional Role Selection

*For any* session without a roles field, the registration flow must not require or display character role selection.

**Validates: Requirements 1.4**

### Property 4: Role Assignment Persistence

*For any* order item created for a session with roles, storing a role assignment and then retrieving the order item must return the same role_id.

**Validates: Requirements 2.1, 2.3**

### Property 5: One-to-One Role Assignment

*For any* order item with a role assignment, the item must be associated with exactly one child_id and exactly one role_id (or null if no role required).

**Validates: Requirements 2.2**

### Property 6: Role Referential Integrity

*For any* order item with a role_id, the role_id must reference a valid role that exists in the associated session's roles configuration.

**Validates: Requirements 2.4**

### Property 7: Role Capacity Enforcement

*For any* role that has reached its capacity limit (assigned count equals capacity), attempting to create a new assignment to that role must be rejected with an error.

**Validates: Requirements 3.1**

### Property 8: Role Release on Cancellation

*For any* order with role assignments, cancelling the order must release all role assignments, making those slots available for new registrations.

**Validates: Requirements 3.3**

### Property 9: Role Display Completeness

*For any* session with roles, the CharacterRoleSelector component must render a selectable option for each role defined in the session.

**Validates: Requirements 4.1**

### Property 10: Selection State Management

*For any* role selection in the CharacterRoleSelector component, selecting a role must update the component state to reflect that role as selected.

**Validates: Requirements 4.3**

### Property 11: Disabled State for Full Roles

*For any* role with zero available capacity, the CharacterRoleSelector component must mark that role as disabled (not selectable).

**Validates: Requirements 4.4**

### Property 12: Capacity Privacy

*For any* rendered CharacterRoleSelector component, the output HTML must not contain numeric capacity values or availability counts.

**Validates: Requirements 4.5**

### Property 13: Role Selection Required

*For any* session with roles, attempting to add an item to cart without selecting a role must be prevented with a validation error.

**Validates: Requirements 6.2**

### Property 14: Role Selection Flow

*For any* session with roles, the character selection interface must be displayed after child selection and before cart addition.

**Validates: Requirements 6.1, 6.3**

### Property 15: Role Distribution Accuracy

*For any* session with roles, the calculated role distribution must equal the count of non-cancelled order items grouped by role_id.

**Validates: Requirements 7.1, 7.2**

### Property 16: Export Data Completeness

*For any* role assignment export, each row must contain all required fields: role_id, role_name, child_name, child_age, parent_name, parent_email, and parent_phone.

**Validates: Requirements 7.4**

### Property 17: Generic Role Configuration

*For any* session, adding a roles field with valid CharacterRole objects must enable role selection functionality for that session.

**Validates: Requirements 8.2**

### Property 18: Variable Role Count Support

*For any* number of roles (from 1 to N), the CharacterRoleSelector component must render all roles in a responsive grid layout.

**Validates: Requirements 8.3**

### Property 19: Independent Role Capacities

*For any* session with multiple roles having different capacity values, each role's capacity must be enforced independently without affecting other roles.

**Validates: Requirements 8.4**

### Property 20: Order Confirmation Role Display

*For any* order item with a role assignment, the order confirmation (email and UI) must include the character role name and image.

**Validates: Requirements 9.1, 9.4**

### Property 21: Role Validation

*For any* registration request with a role_id, the system must validate that the role_id exists in the target session's roles configuration, rejecting invalid role_ids with a descriptive error.

**Validates: Requirements 10.1, 10.3**

### Property 22: Session Modification Safety

*For any* session with existing role assignments, modifying the session's roles configuration must not orphan existing order items (all existing role_ids must remain valid or be migrated).

**Validates: Requirements 10.4**

## Error Handling

### Validation Errors

The system must handle and report the following validation errors:

1. **Invalid Role ID**: When a role_id doesn't exist in the session's roles configuration
   - Error: `"Invalid role: {roleId} is not available for this session"`
   - HTTP Status: 400 Bad Request

2. **Role Capacity Exceeded**: When attempting to assign a role that has reached capacity
   - Error: `"Role {roleName} is fully booked. Please select a different character."`
   - HTTP Status: 409 Conflict

3. **Missing Role Selection**: When attempting to register for a session with roles without selecting a role
   - Error: `"Please select a character role for this session"`
   - HTTP Status: 400 Bad Request

4. **Role Assignment Mismatch**: When order item role_id doesn't match session configuration
   - Error: `"Role assignment is invalid for this session"`
   - HTTP Status: 400 Bad Request

### Concurrent Access Handling

To prevent race conditions during role assignment:

1. **Optimistic Locking**: Check role availability immediately before order creation
2. **Transaction Isolation**: Use database transactions to ensure atomic role assignment
3. **Retry Logic**: If capacity check fails due to concurrent update, return clear error to user

### Data Integrity Errors

1. **Orphaned Role Assignments**: Prevent by validating role_id against session.roles before saving
2. **Invalid Capacity Values**: Validate that capacity is a positive integer (minimum 1)
3. **Missing Required Fields**: Validate all CharacterRole fields are present and non-empty

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** focus on:
- Specific examples of role selection flows
- Edge cases (empty roles array, single role, many roles)
- Error conditions (invalid role ID, full capacity)
- Integration between components (SessionDetailModal + CharacterRoleSelector)
- UI rendering with specific role configurations

**Property-Based Tests** focus on:
- Universal properties that hold for all inputs
- Role capacity enforcement across random role configurations
- Data integrity across random order creation/cancellation sequences
- Component behavior with randomly generated role arrays

Together, these approaches provide comprehensive coverage where unit tests catch concrete bugs and property tests verify general correctness.

### Property-Based Testing Configuration

**Testing Library**: We will use **fast-check** for TypeScript property-based testing.

**Test Configuration**:
- Minimum 100 iterations per property test (due to randomization)
- Each property test must reference its design document property
- Tag format: `// Feature: session-character-role-selection, Property {number}: {property_text}`

**Example Property Test Structure**:

```typescript
import fc from 'fast-check';

describe('Role Capacity Enforcement', () => {
  it('Property 7: prevents assignment to full roles', () => {
    // Feature: session-character-role-selection, Property 7: Role Capacity Enforcement
    fc.assert(
      fc.property(
        fc.array(fc.record({
          id: fc.string(),
          name_zh: fc.string(),
          name_en: fc.string(),
          image_url: fc.string(),
          capacity: fc.integer({ min: 1, max: 10 })
        }), { minLength: 1, maxLength: 10 }),
        fc.integer({ min: 0, max: 9 }),
        async (roles, roleIndex) => {
          const role = roles[roleIndex % roles.length];
          
          // Fill role to capacity
          for (let i = 0; i < role.capacity; i++) {
            await assignRole(sessionId, role.id, `child-${i}`);
          }
          
          // Attempt to assign one more
          const result = await assignRole(sessionId, role.id, 'child-overflow');
          
          // Should be rejected
          expect(result.success).toBe(false);
          expect(result.error).toContain('fully booked');
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Coverage

Unit tests should cover:

1. **CharacterRoleSelector Component**:
   - Renders correct number of role cards
   - Displays role names in correct language
   - Highlights selected role
   - Disables full roles
   - Calls onRoleSelect callback with correct role ID

2. **Role Validation Functions**:
   - validateRoleAssignment returns true for valid roles
   - validateRoleAssignment returns false for invalid role IDs
   - validateRoleAssignment returns false for full roles
   - validateRoleAssignment handles missing roles field

3. **Role Capacity Tracking**:
   - calculateRoleAvailability counts correctly
   - Role availability decrements on assignment
   - Role availability increments on cancellation
   - Handles multiple roles independently

4. **Order Creation with Roles**:
   - Creates order items with role_id
   - Validates role before creating order
   - Rejects invalid role assignments
   - Handles sessions without roles

5. **Admin Dashboard**:
   - Displays role distribution correctly
   - Shows children assigned to each role
   - Exports CSV with correct format
   - Handles sessions without roles

### Integration Test Scenarios

1. **Complete Registration Flow**:
   - User selects session with roles
   - User selects child
   - Character selector appears
   - User selects role
   - Item added to cart with role
   - Order created with role assignment

2. **Capacity Limit Scenario**:
   - Fill role to capacity
   - Attempt to select full role
   - Role appears disabled
   - Selection prevented
   - Error message displayed

3. **Order Cancellation Scenario**:
   - Create order with role assignment
   - Cancel order
   - Verify role capacity released
   - Verify role becomes available again

4. **Admin Workflow**:
   - View session with role assignments
   - See role distribution
   - Export role assignments
   - Verify CSV content

### Test Data

**Mock Sessions with Roles**:
```typescript
const mockSessionWithRoles: Session = {
  id: 'session-with-roles',
  title_zh: '測試課程',
  title_en: 'Test Session',
  // ... other fields ...
  roles: [
    {
      id: 'role-1',
      name_zh: '角色一',
      name_en: 'Role One',
      image_url: '/test/role-1.png',
      capacity: 4
    },
    {
      id: 'role-2',
      name_zh: '角色二',
      name_en: 'Role Two',
      image_url: '/test/role-2.png',
      capacity: 2
    }
  ]
};
```

**Property Test Generators**:
```typescript
// Generate random CharacterRole
const arbitraryRole = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  name_zh: fc.string({ minLength: 1, maxLength: 50 }),
  name_en: fc.string({ minLength: 1, maxLength: 50 }),
  image_url: fc.string({ minLength: 1, maxLength: 100 }),
  capacity: fc.integer({ min: 1, max: 20 })
});

// Generate random Session with roles
const arbitrarySessionWithRoles = fc.record({
  id: fc.string(),
  // ... other fields ...
  roles: fc.array(arbitraryRole, { minLength: 1, maxLength: 10 })
});
```

## Implementation Notes

### Performance Considerations

1. **Role Availability Caching**: Cache role availability calculations for 30 seconds to reduce database queries
2. **Batch Queries**: When displaying multiple sessions, batch role availability queries
3. **Image Optimization**: Use Next.js Image component for character portraits with proper sizing
4. **Lazy Loading**: Load character images lazily as user scrolls

### Accessibility

1. **Keyboard Navigation**: Support arrow keys for role selection
2. **Screen Reader Support**: Add ARIA labels for role cards and selection state
3. **Focus Management**: Maintain focus on selected role card
4. **Color Contrast**: Ensure disabled state has sufficient contrast

### Localization

1. **Role Names**: Store and display both Chinese and English names
2. **Error Messages**: Localize all validation error messages
3. **Admin Interface**: Support language switching in admin dashboard
4. **Export Headers**: Localize CSV column headers based on admin language preference

### Migration Strategy

1. **Backward Compatibility**: Existing sessions without roles continue to work normally
2. **Gradual Rollout**: Add roles to new sessions first, then migrate existing sessions
3. **Data Migration**: Script to add roles configuration to existing Battle of Kadal sessions
4. **Testing**: Test thoroughly with both sessions with and without roles

### Security Considerations

1. **Input Validation**: Validate all role_id inputs on server side
2. **Capacity Verification**: Always verify capacity on server, never trust client
3. **SQL Injection**: Use parameterized queries for role_id lookups
4. **Authorization**: Verify user has permission to view role assignments in admin dashboard
