# Implementation Plan: Session Character Role Selection

## Overview

This implementation plan breaks down the character role selection feature into discrete coding tasks. The approach follows an incremental development strategy: first extending data models and types, then implementing backend validation logic, followed by UI components, and finally admin dashboard enhancements. Each task builds on previous work to ensure no orphaned code.

## Tasks

- [x] 1. Extend data models and types for character roles
  - Add CharacterRole interface to lib/types/database.ts
  - Extend Session interface with optional roles field
  - Extend OrderItem interface with optional role_id field
  - Update mock data types to include role configurations
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 1.1 Write property test for role data completeness
  - **Property 1: Role Data Completeness**
  - **Validates: Requirements 1.2**

- [x] 1.2 Write property test for default role capacity
  - **Property 2: Default Role Capacity**
  - **Validates: Requirements 1.3**

- [x] 2. Create Battle of Kadal character configuration
  - Create lib/config/character-roles.ts with Battle of Kadal roles
  - Define all 6 characters with Chinese/English names and image paths
  - Set capacity to 4 for each role
  - Export configuration for use in session setup
  - _Requirements: 5.1, 5.2, 5.3_

- [x] 3. Update mock session data with character roles
  - Update Battle of Kadal session in lib/mock-data/sessions.ts
  - Add roles field with Battle of Kadal character configuration
  - Verify other sessions remain unchanged (no roles field)
  - Test that sessions load correctly with and without roles
  - _Requirements: 1.4, 8.2_

- [x] 3.1 Write property test for optional role selection
  - **Property 3: Optional Role Selection**
  - **Validates: Requirements 1.4**

- [x] 4. Implement role availability calculation functions
  - [x] 4.1 Create lib/api/role-availability.ts
    - Implement calculateRoleAvailability function
    - Count order items by role_id for a session
    - Filter by non-cancelled order statuses
    - Return Map of role_id to available count
    - _Requirements: 3.1, 3.2_

  - [x] 4.2 Implement getSessionRoleAvailability function
    - Accept sessionId parameter
    - Fetch session and roles configuration
    - Calculate availability for each role
    - Return structured availability data
    - _Requirements: 3.1, 7.1_

  - [x] 4.3 Write property test for role capacity enforcement
    - **Property 7: Role Capacity Enforcement**
    - **Validates: Requirements 3.1**

  - [x] 4.4 Write property test for independent role capacities
    - **Property 19: Independent Role Capacities**
    - **Validates: Requirements 8.4**

- [x] 5. Implement role validation functions
  - [x] 5.1 Create lib/api/role-validation.ts
    - Implement validateRoleAssignment function
    - Check if role exists in session configuration
    - Check if role has available capacity
    - Return validation result with error message
    - _Requirements: 10.1, 10.2_

  - [x] 5.2 Write property test for role validation
    - **Property 21: Role Validation**
    - **Validates: Requirements 10.1, 10.3**

  - [x] 5.3 Write property test for role referential integrity
    - **Property 6: Role Referential Integrity**
    - **Validates: Requirements 2.4**

- [x] 6. Extend order creation API to support role assignments
  - [x] 6.1 Update lib/api/orders.ts createOrder function
    - Accept roleId in items array
    - Validate role assignments before creating order
    - Store role_id with each order item
    - Handle sessions without roles (roleId optional)
    - _Requirements: 2.1, 6.2, 6.4_

  - [x] 6.2 Add error handling for role validation failures
    - Return descriptive errors for invalid role IDs
    - Return descriptive errors for full capacity
    - Return descriptive errors for missing role selection
    - Use appropriate HTTP status codes
    - _Requirements: 10.3_

  - [x] 6.3 Write property test for role assignment persistence
    - **Property 4: Role Assignment Persistence**
    - **Validates: Requirements 2.1, 2.3**

  - [x] 6.4 Write property test for one-to-one role assignment
    - **Property 5: One-to-One Role Assignment**
    - **Validates: Requirements 2.2**

- [x] 7. Checkpoint - Ensure backend logic tests pass
  - Run all property tests for role validation and capacity
  - Verify role availability calculations are correct
  - Test order creation with and without roles
  - Ensure all tests pass, ask the user if questions arise.

- [-] 8. Create CharacterRoleSelector component
  - [x] 8.1 Create components/session/CharacterRoleSelector.tsx
    - Define component props interface
    - Implement grid layout for character cards
    - Display character images and names
    - Handle role selection with onClick
    - Show selected state with visual highlight
    - Show disabled state for full roles
    - Support language switching (zh/en)
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 8.2 Add styling and animations
    - Use Tailwind CSS for responsive grid
    - Add hover effects for available roles
    - Add selection highlight (border/glow)
    - Add disabled state styling (grayscale/opacity)
    - Ensure mobile responsiveness
    - _Requirements: 4.6_

  - [ ] 8.3 Write property test for role display completeness
    - **Property 9: Role Display Completeness**
    - **Validates: Requirements 4.1**

  - [ ] 8.4 Write property test for selection state management
    - **Property 10: Selection State Management**
    - **Validates: Requirements 4.3**

  - [ ] 8.5 Write property test for disabled state
    - **Property 11: Disabled State for Full Roles**
    - **Validates: Requirements 4.4**

  - [ ] 8.6 Write property test for capacity privacy
    - **Property 12: Capacity Privacy**
    - **Validates: Requirements 4.5**

  - [x] 8.7 Write unit tests for CharacterRoleSelector
    - Test rendering with different role counts
    - Test language switching
    - Test selection callback
    - Test disabled state rendering

- [-] 9. Integrate CharacterRoleSelector into SessionDetailModal
  - [x] 9.1 Update components/landing/SessionDetailModal.tsx
    - Add state for selected role ID
    - Fetch role availability when session has roles
    - Display CharacterRoleSelector after child selection
    - Require role selection before enabling "Add to Cart"
    - Pass selected role to cart addition logic
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ] 9.2 Update cart state management
    - Extend cart item interface to include roleId
    - Store role ID with session and child selections
    - Pass role ID to checkout flow
    - _Requirements: 2.1_

  - [ ] 9.3 Write property test for role selection required
    - **Property 13: Role Selection Required**
    - **Validates: Requirements 6.2**

  - [ ] 9.4 Write property test for role selection flow
    - **Property 14: Role Selection Flow**
    - **Validates: Requirements 6.1, 6.3**

- [ ] 10. Update checkout flow to handle role assignments
  - [ ] 10.1 Update app/checkout/page.tsx
    - Display selected role in order summary
    - Show character image and name for each item
    - Pass role IDs to order creation API
    - _Requirements: 9.1, 9.4_

  - [ ] 10.2 Update order confirmation display
    - Include role information in order items
    - Display character images in confirmation
    - Show role names in selected language
    - _Requirements: 9.2, 9.3_

  - [ ] 10.3 Write property test for order confirmation role display
    - **Property 20: Order Confirmation Role Display**
    - **Validates: Requirements 9.1, 9.4**

- [ ] 11. Checkpoint - Ensure frontend integration tests pass
  - Test complete registration flow with role selection
  - Test sessions without roles still work
  - Test role selection validation
  - Verify UI displays correctly on mobile and desktop
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 12. Implement order cancellation with role release
  - [ ] 12.1 Create releaseRoleAssignments function in lib/api/orders.ts
    - Query order items for cancelled order
    - Extract role IDs from order items
    - Update role availability (handled by recalculation)
    - _Requirements: 3.3_

  - [ ] 12.2 Integrate into order cancellation flow
    - Call releaseRoleAssignments when order is cancelled
    - Handle both manual and timeout cancellations
    - Verify role becomes available after release
    - _Requirements: 3.3_

  - [ ] 12.3 Write property test for role release on cancellation
    - **Property 8: Role Release on Cancellation**
    - **Validates: Requirements 3.3**

- [ ] 13. Create admin role distribution view
  - [ ] 13.1 Create components/admin/SessionRoleDistribution.tsx
    - Fetch role assignments for session
    - Group children by role ID
    - Display role name and assigned count
    - Show list of children for each role
    - Include parent contact information
    - Support language switching
    - _Requirements: 7.1, 7.2_

  - [ ] 13.2 Write property test for role distribution accuracy
    - **Property 15: Role Distribution Accuracy**
    - **Validates: Requirements 7.1, 7.2**

  - [ ] 13.3 Write unit tests for SessionRoleDistribution
    - Test rendering with various role distributions
    - Test empty roles
    - Test language switching

- [ ] 14. Integrate role distribution into admin session details
  - [ ] 14.1 Update app/admin/sessions/[sessionId]/registrations/page.tsx
    - Add SessionRoleDistribution component
    - Display below or alongside registration list
    - Show only for sessions with roles
    - _Requirements: 7.1, 7.2_

  - [ ] 14.2 Add visual indicators for role capacity
    - Show progress bars for each role
    - Use color coding (green/yellow/red) for capacity status
    - Display capacity without showing exact numbers to users
    - _Requirements: 7.1_

- [ ] 15. Implement role assignment export functionality
  - [ ] 15.1 Create lib/api/export-roles.ts
    - Implement exportRoleAssignments function
    - Query order items with role assignments
    - Join with child and parent data
    - Format as CSV with required columns
    - Return Blob for download
    - _Requirements: 7.3, 7.4_

  - [ ] 15.2 Add export button to admin interface
    - Add "Export Role Assignments" button to session details
    - Trigger CSV download on click
    - Show loading state during export
    - Handle errors gracefully
    - _Requirements: 7.3_

  - [ ] 15.3 Write property test for export data completeness
    - **Property 16: Export Data Completeness**
    - **Validates: Requirements 7.4**

- [ ] 16. Add email notification with role information
  - [ ] 16.1 Update lib/email/templates.ts
    - Add role information to order confirmation template
    - Include character name and image
    - Support both Chinese and English
    - _Requirements: 9.1_

  - [ ] 16.2 Update email sending logic
    - Pass role data to email template
    - Ensure images are accessible in email
    - Test email rendering with role information
    - _Requirements: 9.1_

- [ ] 17. Add comprehensive error handling and validation
  - [ ] 17.1 Create centralized error messages
    - Define error messages for all validation failures
    - Support localization (zh/en)
    - Include user-friendly descriptions
    - _Requirements: 10.3_

  - [ ] 17.2 Add client-side validation
    - Validate role selection before API calls
    - Show inline error messages
    - Prevent form submission with invalid data
    - _Requirements: 6.2, 10.1_

  - [ ] 17.3 Add server-side validation
    - Validate all role assignments in API
    - Check referential integrity
    - Enforce capacity limits
    - Return structured error responses
    - _Requirements: 10.1, 10.2, 10.3_

- [ ] 18. Implement session modification safety
  - [ ] 18.1 Add validation for session role updates
    - Check for existing role assignments before modifying roles
    - Prevent removal of roles with active assignments
    - Warn admin if changes will affect existing orders
    - _Requirements: 10.4_

  - [ ] 18.2 Write property test for session modification safety
    - **Property 22: Session Modification Safety**
    - **Validates: Requirements 10.4**

- [ ] 19. Add support for variable role configurations
  - [ ] 19.1 Write property test for generic role configuration
    - **Property 17: Generic Role Configuration**
    - **Validates: Requirements 8.2**

  - [ ] 19.2 Write property test for variable role count support
    - **Property 18: Variable Role Count Support**
    - **Validates: Requirements 8.3**

  - [ ] 19.3 Write integration tests
    - Test sessions with 1 role
    - Test sessions with 10+ roles
    - Test sessions with mixed capacities
    - Test sessions without roles

- [ ] 20. Final checkpoint and integration testing
  - Run complete test suite (unit + property tests)
  - Test full user flow from session selection to order confirmation
  - Test admin workflow for viewing and exporting role assignments
  - Test order cancellation and role release
  - Verify backward compatibility with sessions without roles
  - Test on mobile and desktop browsers
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Property tests validate universal correctness properties across all inputs
- Unit tests validate specific examples, edge cases, and UI rendering
- The implementation follows TypeScript/React patterns consistent with the existing codebase
