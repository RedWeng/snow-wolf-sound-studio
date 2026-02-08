# Implementation Plan: Snow Wolf Boy Event Registration System

## Overview

This implementation plan follows a **UI-first development strategy with one-page architecture**, prioritizing AAA-grade user interface with mock data before implementing complex backend logic. The approach ensures a polished, production-ready frontend optimized for busy parents who need fast, efficient ordering.

### Development Phases

**Phase 1 (Current Focus)**: Premium one-page UI with mock data

- Cinematic Snow Wolf brand aesthetics
- Single-page experience with modals and sidebars
- Beautiful session cards as the centerpiece
- Complete fast-ordering flow without page navigation
- AAA-grade visual quality
- Goal: "3 seconds to understand, 30 seconds to order, 3 minutes to complete payment"

**Phase 2 (Future)**: Backend logic and real data

- Database integration and real-time data
- Payment automation and waitlist logic
- Complex pricing calculation rules
- Email notification system

## Tasks

### 1. Project Setup and Design System Foundation

- [x] 1.1 Initialize Next.js 14 project with TypeScript and Tailwind CSS
  - Create new Next.js project with App Router
  - Configure TypeScript with strict mode
  - Set up Tailwind CSS with custom configuration
  - Install core dependencies (Radix UI, Zod, React Hook Form)
  - Configure ESLint and Prettier
  - _Requirements: 16.1, 16.2_

- [ ] 1.2 Configure design tokens and theme system
  - Define color palette in Tailwind config (brand navy, frost, moon gold, ice blue, aurora purple)
  - Configure typography system (Playfair Display for headings, Inter for body)
  - Set up spacing scale and responsive breakpoints
  - Configure animation and transition utilities
  - Create CSS custom properties for dynamic theming
  - _Requirements: 15.1, 16.1_

- [ ] 1.3 Create base UI component library
  - Implement Button component with variants (primary, secondary, ghost)
  - Implement Card component with gradient backgrounds
  - Implement Input and Form components with validation states
  - Implement Modal/Dialog component
  - Implement Loading and Skeleton components
  - Add Storybook or component documentation
  - _Requirements: 16.2, 16.3_

- [ ] 1.4 Write unit tests for base UI components
  - Test Button variants and interactions
  - Test Form validation states
  - Test Modal open/close behavior
  - Test responsive behavior
  - _Requirements: 16.2_

### 2. Layout Components and Navigation

- [x] 2.1 Implement Header component with simplified navigation
  - Create responsive header with logo
  - Remove traditional navigation links (About, Contact)
  - Keep only essential elements: Language switcher, Login/Logout, Cart icon with badge
  - Ensure 44px minimum touch targets for mobile
  - Add smooth animations for interactions
  - _Requirements: 1.1, 2.5, 15.8, 16.2_

- [x] 2.2 Implement Footer component
  - Create minimal footer with contact information
  - Add social media icons
  - Implement responsive layout
  - Keep design clean and unobtrusive
  - _Requirements: 15.1_

- [x] 2.3 Create layout wrapper components
  - Implement PublicLayout for one-page landing
  - Implement AuthenticatedLayout with user context
  - Implement AdminLayout with role-based navigation
  - Add loading states and error boundaries
  - _Requirements: 1.3, 1.4, 13.2_

- [x] 2.4 Write unit tests for layout components
  - Test simplified header rendering
  - Test cart icon badge display
  - Test language switcher
  - Test responsive breakpoints
  - _Requirements: 16.1, 16.4_

### 3. Mock Data and API Layer Setup

- [ ] 3.1 Create comprehensive mock data sets
  - Generate 8-10 mock sessions with realistic details
  - Create mock user profiles (parents and admins)
  - Generate mock children data (1-4 per parent)
  - Create mock orders with various statuses
  - Generate mock waitlist entries
  - _Requirements: 2.1, 3.2, 6.1_

- [x] 3.2 Implement mock API functions
  - Create getSessions() with filtering
  - Create getSessionById() and getSessionAvailability()
  - Create createOrder() with mock price calculation
  - Create getChildren() and createChild()
  - Create uploadPaymentProof() mock
  - Add realistic delays to simulate network latency
  - _Requirements: 2.1, 3.1, 4.1, 6.1_

- [ ] 3.3 Set up client-side state management
  - Implement cart state with localStorage persistence
  - Create user session context
  - Implement language preference context
  - Add optimistic UI update patterns
  - _Requirements: 1.4, 3.4, 4.4_

### 4. One-Page Landing Experience

- [ ] 4.1 Implement hero section with cinematic branding
  - Create full-viewport hero with gradient background (navy to frost)
  - Add moon/snow visual motifs and imagery
  - Implement animated call-to-action button ("Browse Sessions" scroll to sessions)
  - Add scroll indicator
  - Ensure mobile-responsive layout
  - _Requirements: 15.1, 15.2, 16.1_

- [ ] 4.2 Implement "How It Works" section
  - Create 3-step process visualization with emphasis on speed:
    - Step 1: Browse Sessions (3 seconds to understand)
    - Step 2: Add to Cart (30 seconds to order)
    - Step 3: Complete Payment (3 minutes total)
  - Add icons and illustrations for each step
  - Implement bilingual content display
  - Add smooth scroll animations
  - _Requirements: 15.3, 15.7_

- [ ] 4.3 Implement beautiful session cards grid (CRITICAL)
  - Display all active sessions in responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
  - Design AAA-quality cards with:
    - Session image with gradient overlay
    - Clear title and theme typography
    - Date, time, and duration with icons
    - Price prominently displayed
    - Availability badge (Available/Limited/Full) with color coding
    - Smooth hover effects (lift, shadow, scale)
  - Ensure cards are visually distinct and attractive
  - Implement proper spacing and alignment
  - Add "View Details" and "Add to Cart" buttons
  - Ensure 44px touch targets on mobile
  - _Requirements: 2.1, 2.7, 2.8, 15.4, 15.5_

- [ ] 4.4 Implement FAQ section
  - Create accordion component for FAQ items
  - Add bilingual FAQ content (registration, payment, cancellation)
  - Implement smooth expand/collapse animations
  - _Requirements: 15.6, 15.7_

- [ ] 4.5 Write property test for session card display
  - **Property 5: Session Cards Display Required Information**
  - **Validates: Requirements 2.1, 15.4**
  - _Requirements: 2.1, 15.4_

### 5. Session Detail Modal and Cart Sidebar

- [ ] 5.1 Implement session detail modal
  - Create modal component that opens when clicking session card
  - Display session image, full description, duration, age range
  - Show capacity status with visual indicator
  - Display price and bundle discount information
  - Add "Add to Cart" or "Join Waitlist" button
  - Implement smooth open/close animations
  - Ensure mobile-responsive design
  - _Requirements: 2.2, 2.3, 2.6_

- [ ] 5.2 Implement cart sidebar component
  - Create sidebar that slides in from right side
  - Add overlay background to focus attention
  - Display cart items grouped by child
  - Show real-time price calculation with discounts
  - Add "Proceed to Checkout" button
  - Implement close/dismiss functionality
  - Ensure smooth slide animations
  - Make responsive for mobile (full-width on small screens)
  - _Requirements: 3.1, 3.4, 3.7, 3.8_

- [ ] 5.3 Implement cart item management in sidebar
  - Display session title, date, time, price for each item
  - Show child name and age
  - Add remove button with confirmation
  - Implement child reassignment dropdown
  - Add loading states for updates
  - _Requirements: 3.4, 3.5, 3.6_

- [ ] 5.4 Implement price breakdown in cart sidebar
  - Display base price calculation
  - Show bundle discount with label (if applicable)
  - Display final total prominently
  - Add currency formatting (TWD)
  - Update in real-time as cart changes
  - _Requirements: 4.1, 4.2, 4.3_

- [ ] 5.5 Write property test for capacity calculation
  - **Property 7: Remaining Capacity Calculation**
  - **Validates: Requirements 2.3**
  - _Requirements: 2.3_

### 6. Authentication Pages

- [ ] 6.1 Implement login page with OAuth options
  - Create centered login card with Snow Wolf branding
  - Add Google, LINE, Facebook OAuth buttons with icons
  - Implement mock OAuth flow (redirect simulation)
  - Add loading states during authentication
  - Display error messages for failed authentication
  - _Requirements: 1.1, 1.2_

- [ ] 6.2 Implement authentication flow logic
  - Create mock user session on successful login
  - Store session in localStorage/cookies
  - Implement redirect to intended destination after login
  - Add session persistence across page navigation
  - Implement logout functionality
  - _Requirements: 1.2, 1.3, 1.4, 1.5_

- [ ] 6.3 Write property tests for authentication flow
  - **Property 1: OAuth Authentication Creates or Retrieves User**
  - **Property 3: Session Persistence Across Navigation**
  - **Property 4: Logout Clears Session**
  - **Validates: Requirements 1.2, 1.4, 1.5**
  - _Requirements: 1.2, 1.4, 1.5_

### 7. Shopping Cart and Family Cart

- [ ] 7.1 Implement cart page layout
  - Create "Family Cart" header with summary
  - Display cart items grouped by child
  - Show empty cart state with call-to-action
  - Add mobile-optimized layout
  - _Requirements: 3.4, 16.1_

- [ ] 7.2 Implement cart item component
  - Display session title, date, time, price
  - Show child name and age
  - Add remove button with confirmation
  - Implement child reassignment dropdown
  - Add loading states for updates
  - _Requirements: 3.4, 3.5_

- [ ] 7.3 Implement price breakdown component
  - Display base price calculation
  - Show bundle discount with label (if applicable)
  - Display final total prominently
  - Add currency formatting (TWD)
  - Update in real-time as cart changes
  - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [ ] 7.4 Add "Proceed to Checkout" button
  - Implement validation (minimum 1 item)
  - Add loading state during navigation
  - Ensure mobile-friendly button size
  - _Requirements: 3.4, 16.2_

- [ ] 7.5 Write property tests for price calculation
  - **Property 15: Base Price Calculation**
  - **Property 16: Bundle Discount Application**
  - **Property 17: Price Breakdown Completeness**
  - **Validates: Requirements 4.1, 4.2, 4.3**
  - _Requirements: 4.1, 4.2, 4.3_

### 7. Checkout Flow in Sidebar

- [ ] 7.1 Implement checkout mode in cart sidebar
  - Transition cart sidebar to checkout mode when user clicks "Proceed to Checkout"
  - Create multi-step progress indicator (Review → Group Code → Payment → Confirm)
  - Maintain sidebar layout (no page navigation)
  - Add back navigation between steps
  - _Requirements: 6.1, 6.6, 16.1_

- [ ] 7.2 Implement Step 1: Review order
  - Display all cart items with child assignments in sidebar
  - Show price breakdown
  - Add "Edit Cart" button to return to cart mode
  - Implement "Continue" button
  - _Requirements: 3.4, 4.3_

- [ ] 7.3 Implement Step 2: Group code (optional)
  - Add group code input field
  - Implement "Create New Group" button (generates code)
  - Add "Join Existing Group" input
  - Display group code validation feedback
  - Show skip option
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 7.4 Implement Step 3: Payment method selection
  - Add radio buttons for Bank Transfer and LINE Pay
  - Display payment instructions for each method
  - Show payment deadline (5 days from now)
  - Add notes field (optional)
  - _Requirements: 6.2, 6.3, 6.4_

- [ ] 7.5 Implement Step 4: Order confirmation
  - Create order on submission
  - Display order number prominently in sidebar
  - Show payment instructions and deadline
  - Display countdown timer
  - Add "View Order Status" button (navigates to order page)
  - Add "Continue Shopping" button (closes sidebar, returns to main page)
  - Send mock confirmation email
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.7_

- [ ] 7.6 Write property tests for checkout flow
  - **Property 18: Group Code Uniqueness**
  - **Property 21: Order Creation Sets Pending Status**
  - **Property 22: Payment Deadline Calculation**
  - **Validates: Requirements 5.2, 6.1, 6.2**
  - _Requirements: 5.2, 6.1, 6.2_

### 8. Order Status and Management (Parent)

- [ ] 8.1 Implement order detail page
  - Display order number and status badge
  - Show all order items with session details
  - Display price breakdown
  - Show payment deadline with countdown timer
  - Add payment proof upload section
  - Display group code if applicable
  - _Requirements: 6.4, 6.5, 7.1, 7.3_

- [ ] 8.2 Implement payment proof upload
  - Add file input with drag-and-drop
  - Show image preview before upload
  - Implement mock upload with progress bar
  - Update order status to "Payment Submitted"
  - Display success message
  - _Requirements: 7.1_

- [ ] 8.3 Implement order history page
  - Display all orders in reverse chronological order
  - Show order number, date, status, total amount
  - Add filters (All, Pending, Confirmed, Cancelled)
  - Implement mobile-optimized card layout
  - Add "View Details" link for each order
  - _Requirements: 7.5_

- [ ] 8.4 Write property test for order status display
  - **Property 27: Parent Order Access**
  - **Validates: Requirements 7.3, 7.5**
  - _Requirements: 7.3, 7.5_

### 9. Parent Dashboard and Profile

- [ ] 9.1 Implement parent dashboard page
  - Display welcome message with user name
  - Show upcoming sessions (confirmed orders)
  - Display pending payments with countdown
  - Add quick actions (Browse Sessions, View Orders, Manage Children)
  - Implement mobile-optimized layout
  - _Requirements: 1.3, 7.5_

- [ ] 9.2 Implement profile management page
  - Display user information (email, name, phone)
  - Add language preference selector
  - Show edit profile form
  - Implement save functionality with validation
  - _Requirements: 2.5, 15.7_

- [ ] 9.3 Implement children management section
  - Display all children in cards (max 4)
  - Show name, age, notes for each child
  - Add "Add Child" button (disabled if 4 children exist)
  - Implement edit and delete actions
  - Add confirmation modal for delete
  - _Requirements: 3.2, 3.3_

- [ ] 9.4 Create child form modal
  - Add name input (required)
  - Add age input with number validation (0-18)
  - Add notes textarea (optional)
  - Implement form validation with error messages
  - Add save and cancel buttons
  - _Requirements: 3.3_

- [ ] 9.5 Write property tests for child management
  - **Property 11: Maximum Four Children Per Parent**
  - **Property 12: Child Creation Requires Name and Age**
  - **Validates: Requirements 3.2, 3.3**
  - _Requirements: 3.2, 3.3_

### 10. Waitlist Flow

- [ ] 10.1 Implement "Join Waitlist" functionality
  - Add waitlist button on full sessions (in card and modal)
  - Create child selector modal for waitlist
  - Display queue position after joining
  - Show success message with explanation
  - _Requirements: 9.1, 9.2_

- [ ] 10.2 Implement waitlist status page
  - Display all waitlist entries for parent
  - Show session details and queue position
  - Add "Leave Waitlist" button
  - Display mock notification about promotion
  - _Requirements: 9.2_

- [ ] 10.3 Write property test for waitlist ordering
  - **Property 32: Waitlist Ordering by Timestamp**
  - **Validates: Requirements 9.3**
  - _Requirements: 9.3_

### 11. Admin Dashboard (Basic)

- [ ] 11.1 Implement admin dashboard layout
  - Create admin navigation sidebar
  - Display summary metrics cards (sessions, orders, payments, waitlist)
  - Add role-based access control check
  - Implement responsive layout for tablet/desktop
  - _Requirements: 11.1, 13.2_

- [ ] 11.2 Implement sessions management page
  - Display all sessions in table format
  - Show title, date, capacity, registered count, status
  - Add filters (Active, Cancelled, Completed)
  - Implement search by title
  - Add "Create Session" and "Edit" buttons
  - _Requirements: 11.2, 11.3_

- [ ] 11.3 Implement session form (create/edit)
  - Add bilingual title and theme inputs
  - Add date and time pickers
  - Add duration, capacity, price inputs
  - Add age range inputs (min/max)
  - Add description textarea (bilingual)
  - Add image upload
  - Implement form validation
  - _Requirements: 11.3, 11.4_

- [ ] 11.4 Implement orders management page
  - Display all orders in table format
  - Show order number, parent, date, status, amount
  - Add status filters
  - Implement search by order number or parent name
  - Add "View Details" and "Mark as Paid" actions
  - _Requirements: 11.2, 12.1_

- [ ] 11.5 Implement order detail page (admin view)
  - Display complete order information
  - Show payment proof image if uploaded
  - Add "Confirm Payment" button
  - Add "Cancel Order" button with reason input
  - Display group code and members
  - Show admin action log
  - _Requirements: 12.1, 12.2, 12.5_

- [ ] 11.6 Implement waitlist management page
  - Display waitlist entries grouped by session
  - Show queue position and timestamp
  - Add "Promote" button for manual promotion
  - Display promotion history
  - _Requirements: 12.3_

- [ ] 11.7 Write property tests for admin actions
  - **Property 40: Admin Manual Order Confirmation**
  - **Property 43: Admin Action Logging**
  - **Property 44: Role-Based Access Control**
  - **Validates: Requirements 12.1, 12.5, 13.2-13.5**
  - _Requirements: 12.1, 12.5, 13.2, 13.3, 13.4, 13.5_

### 12. Private Booking Inquiry

- [ ] 12.1 Implement private booking inquiry modal
  - Create inquiry form modal (opens from footer link)
  - Add contact fields (name, email, phone)
  - Add preferred dates input
  - Add group size input
  - Add special requirements textarea
  - Implement form validation
  - _Requirements: 14.2_

- [ ] 12.2 Implement inquiry submission
  - Mock email sending to admin
  - Display confirmation message
  - Store inquiry in mock data
  - Close modal and return to main page
  - _Requirements: 14.3, 14.4_

- [ ] 12.3 Write property test for inquiry submission
  - **Property 45: Private Inquiry Submission**
  - **Validates: Requirements 14.3, 14.4, 14.5**
  - _Requirements: 14.3, 14.4, 14.5_

### 13. Polish and Responsive Optimization

- [ ] 13.1 Implement loading states and skeletons
  - Add skeleton loaders for all data-fetching components
  - Implement smooth page and modal transition animations
  - Add loading spinners for async actions
  - Ensure smooth loading experience
  - _Requirements: 16.1_

- [ ] 13.2 Implement error states and boundaries
  - Create error boundary components
  - Add error pages (404, 500)
  - Implement inline error messages
  - Add retry mechanisms for failed actions
  - _Requirements: Error Handling_

- [ ] 13.3 Add animations and transitions
  - Implement smooth modal and sidebar transitions
  - Add hover effects on interactive elements (especially session cards)
  - Create entrance animations for cards and sections
  - Add micro-interactions (button clicks, form focus)
  - Ensure 60fps performance
  - _Requirements: 15.1, 16.1_

- [ ] 13.4 Optimize mobile experience
  - Test all pages on mobile devices (iOS and Android)
  - Ensure touch targets are minimum 44px
  - Optimize images for mobile bandwidth
  - Test form inputs on mobile keyboards
  - Verify horizontal scrolling is eliminated
  - Test cart sidebar on mobile (full-width)
  - _Requirements: 16.1, 16.2, 16.3, 16.5_

- [ ] 13.5 Implement accessibility features
  - Add ARIA labels to interactive elements
  - Ensure keyboard navigation works throughout
  - Test with screen readers
  - Verify color contrast ratios (WCAG AA)
  - Add focus indicators
  - _Requirements: 16.2_

- [ ] 13.6 Write property test for mobile responsiveness
  - **Property 46: Mobile-Responsive Layout**
  - **Validates: Requirements 16.1, 16.2, 16.3, 16.5**
  - _Requirements: 16.1, 16.2, 16.3, 16.5_

### 14. Checkpoint - UI Phase Complete

- [ ] 14.1 Comprehensive UI testing and review
  - Test complete one-page flow: Browse → Add to Cart (sidebar) → Checkout (in sidebar) → Complete
  - Verify session cards are beautiful, clear, and AAA-quality
  - Test cart sidebar slide-in/out animations
  - Test session detail modal open/close
  - Verify all interactions happen without page navigation
  - Test on mobile, tablet, desktop viewports
  - Check all animations and transitions are smooth
  - Verify bilingual content displays correctly
  - Test with different user roles (parent, admin)
  - Ensure "3 seconds to understand, 30 seconds to order, 3 minutes to complete" goal is met
  - Ask the user if questions arise or if ready to proceed to Phase 2
  - _Requirements: All UI requirements_

## Phase 2 Tasks (Future Implementation)

The following tasks will be implemented in Phase 2 after the UI is complete and approved:

### 16. Supabase Integration (Phase 2)

- [ ] 16.1 Set up Supabase project and database schema
- [ ] 16.2 Implement Supabase Auth with OAuth providers
- [ ] 16.3 Create database tables and relationships
- [ ] 16.4 Implement Row Level Security (RLS) policies
- [ ] 16.5 Replace mock API functions with real Supabase queries

### 17. Payment and Order Automation (Phase 2)

- [ ] 17.1 Implement automatic order cancellation cron job
- [ ] 17.2 Implement waitlist promotion logic
- [ ] 17.3 Implement complex pricing calculation rules
- [ ] 17.4 Add payment proof storage to Supabase Storage

### 18. Email Notification System (Phase 2)

- [ ] 18.1 Set up email service (Resend/SendGrid)
- [ ] 18.2 Create email templates (confirmation, reminders, cancellation)
- [ ] 18.3 Implement email sending via Supabase Edge Functions
- [ ] 18.4 Implement reminder scheduling system

### 19. Data Export and Reporting (Phase 2)

- [ ] 19.1 Implement CSV export functionality
- [ ] 19.2 Create admin reporting dashboard
- [ ] 19.3 Add analytics and metrics tracking

## Notes

- All tasks are required for comprehensive implementation
- Each task references specific requirements for traceability
- Phase 1 focuses exclusively on UI with mock data
- Phase 2 will add backend logic without requiring significant UI changes
- Checkpoint task (15.1) ensures quality before moving to Phase 2
- Property-based tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
