# Requirements Document: Snow Wolf Boy Event Registration System (v1)

## Introduction

The Snow Wolf Boy Event Registration System is a premium event registration platform designed for parents to register their children for themed recording and creative sessions. The system addresses critical pain points from previous events including manual price calculations, lack of group signup logic, inflexible sibling registration, manual payment tracking, and manual pre-event communication. The platform provides a seamless, automated experience for both parents and administrators while maintaining a high-end cinematic brand aesthetic.

## Glossary

- **System**: The Snow Wolf Boy Event Registration System
- **Parent**: A registered user who can register children for sessions
- **Child**: A minor registered by a parent for event sessions
- **Session**: A themed recording/creative event with specific date, time, capacity, and pricing
- **Order**: A collection of session registrations for one or more children by a parent
- **Order_Item**: A single child's registration for a specific session within an order
- **Waitlist_Entry**: A record of a child waiting for a seat in a full session
- **Group_Code**: An identifier allowing parents to coordinate seating arrangements
- **Admin**: A user with administrative privileges (Owner, Assistant, or Teacher/Guest role)
- **Payment_Deadline**: The 5-day (120-hour) window after order creation for payment submission
- **Bundle_Discount**: A price reduction applied when registering for multiple sessions
- **Hidden_Buffer**: Additional 4 seats beyond stated capacity reserved for waitlist promotion

## Requirements

### Requirement 1: User Authentication and Account Management

**User Story:** As a parent, I want to securely log in using my existing Google, LINE, or Facebook account, so that I can quickly access the registration system without creating new credentials.

#### Acceptance Criteria

1. WHEN a parent visits the login page, THE System SHALL display OAuth login options for Google, LINE, and Facebook
2. WHEN a parent successfully authenticates via OAuth, THE System SHALL create or retrieve their user account
3. WHEN a parent logs in, THE System SHALL redirect them to the landing page or their intended destination
4. THE System SHALL maintain user session state across page navigation
5. WHEN a parent logs out, THE System SHALL clear their session and redirect to the public landing page

### Requirement 2: Session Display and Interaction

**User Story:** As a parent, I want to view available sessions with clear, beautiful card-based presentation showing themes, dates, capacity, and pricing, so that I can quickly choose appropriate sessions for my children.

#### Acceptance Criteria

1. THE System SHALL display all active sessions as visually distinct, attractive cards in a responsive grid layout on the main page
2. WHEN a parent clicks on a session card, THE System SHALL open a modal dialog with detailed information including duration, age range, capacity status, and full description (no page navigation)
3. THE System SHALL calculate and display remaining capacity as (total_capacity - confirmed_registrations)
4. WHEN a session reaches stated capacity, THE System SHALL display "Full - Join Waitlist" instead of "Register"
5. THE System SHALL support bilingual display (Traditional Chinese and English) for all session information
6. WHEN displaying session pricing, THE System SHALL show base price per child and any available bundle discounts
7. THE System SHALL ensure each session card includes: title, theme, date, time, price, availability badge, and attractive imagery with Snow Wolf branding aesthetic
8. THE System SHALL implement smooth hover effects and transitions on session cards to enhance the premium user experience

### Requirement 3: Shopping Cart Sidebar and Multi-Child Registration

**User Story:** As a parent with multiple children, I want to add sessions to a cart that slides out from the side, allowing me to register different children for different sessions without leaving the main page, so that I can efficiently manage my family's registrations.

#### Acceptance Criteria

1. WHEN a parent clicks "Add to Cart" on a session card, THE System SHALL open a cart sidebar that slides in from the right side of the screen
2. THE System SHALL allow parents to add multiple children (minimum 1, maximum 4) to their account profile
3. WHEN adding a child, THE System SHALL require parent to provide child's name, age, and any special notes
4. WHEN a parent has multiple items in cart, THE System SHALL display a "Family Cart" summary in the sidebar showing each child and their selected sessions
5. THE System SHALL allow parents to register the same child for multiple sessions
6. THE System SHALL allow parents to register different children for different sessions within one order
7. THE System SHALL keep the cart sidebar accessible at all times via a cart icon in the header, showing item count badge
8. THE System SHALL allow the cart sidebar to be closed/dismissed, returning focus to the main page content

### Requirement 4: Automated Price Calculation

**User Story:** As a parent, I want the system to automatically calculate my total price including any discounts, so that I never have to manually calculate costs.

#### Acceptance Criteria

1. WHEN a parent adds sessions to cart, THE System SHALL calculate the base price as (number_of_registrations × session_price)
2. WHEN a parent registers for 2-3 sessions, THE System SHALL automatically apply bundle discounts if configured
3. THE System SHALL display a price breakdown showing: base price, bundle discount (if applicable), and final total
4. THE System SHALL update the total price in real-time as items are added or removed from cart
5. WHEN displaying the checkout summary, THE System SHALL show the final total prominently with currency (TWD)

### Requirement 5: Group Code Functionality

**User Story:** As a parent, I want to join or create a group using a group code, so that my children can be seated with their friends during sessions.

#### Acceptance Criteria

1. WHEN a parent is in the checkout flow, THE System SHALL provide an optional field to enter or create a group code
2. WHEN a parent creates a new group code, THE System SHALL generate a unique alphanumeric identifier
3. WHEN a parent enters an existing group code, THE System SHALL associate their order with that group
4. THE System SHALL display group membership information on the order confirmation page
5. WHEN an admin views session details, THE System SHALL display which children belong to which groups for seating arrangement

### Requirement 6: Checkout Flow in Sidebar/Modal

**User Story:** As a parent, I want to complete checkout within the cart sidebar or a modal dialog without navigating to separate pages, so that I can quickly finalize my order and receive clear payment instructions.

#### Acceptance Criteria

1. WHEN a parent clicks "Proceed to Checkout" in the cart sidebar, THE System SHALL transition the sidebar to checkout mode or open a checkout modal
2. WHEN checkout begins, THE System SHALL create an order with status "Pending Payment"
3. WHEN an order is created, THE System SHALL set a payment deadline of 5 days (120 hours) from creation time
4. WHEN an order is created, THE System SHALL send a confirmation email with order number, total amount, payment instructions, and deadline
5. THE System SHALL display a countdown timer showing remaining time until payment deadline in the order confirmation view
6. THE System SHALL allow the checkout flow to be completed without leaving the main page (all interactions in sidebar/modal)
7. WHEN checkout is complete, THE System SHALL display order confirmation with prominent order number and payment instructions

### Requirement 7: Payment Confirmation and Order Status

**User Story:** As a parent, I want to upload payment proof and track my order status, so that I can confirm my registration is secured.

#### Acceptance Criteria

1. WHEN a parent uploads payment proof, THE System SHALL store the proof and update order status to "Payment Submitted"
2. WHEN an admin marks an order as paid, THE System SHALL update order status to "Confirmed" and send confirmation email to parent
3. THE System SHALL allow parents to view their order status at any time after login
4. WHEN an order is confirmed, THE System SHALL reserve the registered seats and remove them from available capacity
5. THE System SHALL display order history showing all past and current orders for a parent

### Requirement 8: Automated Order Cancellation

**User Story:** As an administrator, I want unpaid orders to automatically cancel after 5 days, so that seats are released back to available capacity without manual intervention.

#### Acceptance Criteria

1. WHEN 5 days (120 hours) have elapsed since order creation, THE System SHALL automatically cancel orders with status "Pending Payment"
2. WHEN an order is auto-cancelled, THE System SHALL update order status to "Cancelled - Payment Timeout"
3. WHEN an order is auto-cancelled, THE System SHALL release all reserved seats back to session capacity
4. WHEN an order is auto-cancelled, THE System SHALL send a cancellation notification email to the parent
5. WHEN seats are released from cancelled orders, THE System SHALL trigger waitlist promotion process

### Requirement 9: Waitlist Management

**User Story:** As a parent, I want to join a waitlist when a session is full and be automatically notified when a seat becomes available, so that I don't miss registration opportunities.

#### Acceptance Criteria

1. WHEN a session reaches stated capacity, THE System SHALL display a "Join Waitlist" option
2. WHEN a parent joins a waitlist, THE System SHALL create a waitlist entry with timestamp and display their queue position
3. WHEN a seat becomes available, THE System SHALL identify the next waitlist entry by earliest timestamp
4. WHEN promoting from waitlist, THE System SHALL send an email notification with a 24-hour claim window
5. WHEN a waitlist offer expires unclaimed, THE System SHALL move to the next person in queue

### Requirement 10: Automated Pre-Event Reminders

**User Story:** As a parent with confirmed registrations, I want to receive automated reminder emails before the event, so that I don't forget important session details.

#### Acceptance Criteria

1. WHEN an order is confirmed, THE System SHALL schedule reminder emails for 7 days, 2 days, and 1 day before each session
2. WHEN a reminder is due, THE System SHALL send an email containing session details, location, time, and what to bring
3. THE System SHALL only send reminders for orders with status "Confirmed"
4. WHEN a session is cancelled by admin, THE System SHALL cancel all scheduled reminders for that session
5. THE System SHALL support bilingual reminder emails based on parent's language preference

### Requirement 11: Admin Dashboard and Session Management

**User Story:** As an administrator, I want a dashboard showing all sessions, orders, and payments, so that I can monitor and manage event registrations efficiently.

#### Acceptance Criteria

1. WHEN an admin logs in, THE System SHALL display a dashboard with summary metrics (total sessions, pending payments, confirmed orders, waitlist count)
2. THE System SHALL allow admins to view all sessions with capacity status and registration details
3. THE System SHALL allow admins to create new sessions with title, theme, date, time, duration, capacity, age range, and pricing
4. THE System SHALL allow admins to edit existing session details
5. THE System SHALL allow admins to cancel sessions and automatically notify all registered parents

### Requirement 12: Admin Manual Overrides

**User Story:** As an administrator, I want to manually override system actions when needed, so that I can handle exceptional cases and customer service issues.

#### Acceptance Criteria

1. WHEN viewing an order, THE System SHALL allow admins to manually mark it as "Confirmed" regardless of payment status
2. THE System SHALL allow admins to manually cancel any order and specify a reason
3. THE System SHALL allow admins to manually promote a specific person from the waitlist out of order
4. THE System SHALL allow admins to export registration data for a session in CSV format
5. WHEN an admin performs a manual override, THE System SHALL log the action with admin ID, timestamp, and reason

### Requirement 13: Role-Based Access Control

**User Story:** As a system owner, I want to assign different permission levels to team members, so that I can control who can perform sensitive administrative actions.

#### Acceptance Criteria

1. THE System SHALL support three admin roles: Owner, Assistant, and Teacher/Guest
2. WHEN a user has Owner role, THE System SHALL grant full access to all administrative functions
3. WHEN a user has Assistant role, THE System SHALL grant access to view all data and perform manual overrides except user role management
4. WHEN a user has Teacher/Guest role, THE System SHALL grant read-only access to session details and registration lists
5. THE System SHALL prevent users from accessing admin functions without an assigned admin role

### Requirement 14: Private Booking Inquiry

**User Story:** As a parent interested in a private event, I want to submit an inquiry for custom session booking, so that I can arrange exclusive sessions for my group.

#### Acceptance Criteria

1. THE System SHALL display a "Private Booking Inquiry" link on the landing page
2. WHEN a parent clicks the inquiry link, THE System SHALL display a form requesting contact information, preferred dates, group size, and special requirements
3. WHEN a parent submits the inquiry form, THE System SHALL send the inquiry details to the admin email address
4. WHEN an inquiry is submitted, THE System SHALL display a confirmation message to the parent
5. THE System SHALL store all inquiry submissions for admin review in the dashboard

### Requirement 15: One-Page Landing Experience

**User Story:** As a busy parent, I want a fast, intuitive one-page website where I can browse sessions, add to cart, and checkout without navigating to multiple pages, so that I can complete registration in under 3 minutes.

#### Acceptance Criteria

1. THE System SHALL display all content on a single scrollable page with smooth section transitions
2. THE System SHALL display a hero section with cinematic Snow Wolf branding and prominent call-to-action button
3. THE System SHALL display a "How It Works" section with 3 steps: Browse Sessions (3 seconds to understand), Add to Cart (30 seconds to order), Complete Payment (3 minutes total)
4. THE System SHALL display session cards in a beautiful grid layout, with each card showing title, theme, date, time, price, and availability status as a visually distinct, attractive card component
5. THE System SHALL ensure session cards are AAA-quality with clear typography, proper spacing, hover effects, and cinematic Snow Wolf aesthetic (gradient backgrounds, moon/snow motifs)
6. THE System SHALL display an FAQ accordion section answering common questions about registration, payment, and cancellation
7. THE System SHALL support bilingual display (Traditional Chinese and English) for all public-facing content
8. THE System SHALL eliminate traditional navigation links (About Us, Contact) and focus only on essential actions (Language, Login, Cart)

### Requirement 16: Mobile-Responsive Design

**User Story:** As a parent using a mobile device, I want the entire registration experience to work seamlessly on my phone, so that I can register on-the-go.

#### Acceptance Criteria

1. WHEN a parent accesses the System on a mobile device, THE System SHALL display a mobile-optimized layout
2. THE System SHALL ensure all interactive elements (buttons, forms, links) are touch-friendly with minimum 44px touch targets
3. THE System SHALL display readable text without requiring horizontal scrolling or zooming
4. WHEN a parent navigates between pages on mobile, THE System SHALL maintain consistent navigation patterns
5. THE System SHALL optimize images and assets for mobile bandwidth and performance

### Requirement 17: Email Notification System

**User Story:** As a parent, I want to receive timely email notifications about my registration status, so that I stay informed throughout the process.

#### Acceptance Criteria

1. WHEN an order is created, THE System SHALL send an order confirmation email with payment instructions
2. WHEN payment is confirmed by admin, THE System SHALL send a payment confirmation email
3. WHEN an order is cancelled, THE System SHALL send a cancellation notification email
4. WHEN a waitlist seat becomes available, THE System SHALL send a waitlist promotion email with claim instructions
5. THE System SHALL send pre-event reminder emails at 7 days, 2 days, and 1 day before each session

### Requirement 18: Data Export and Reporting

**User Story:** As an administrator, I want to export registration data for sessions, so that I can prepare attendance lists and analyze registration patterns.

#### Acceptance Criteria

1. WHEN viewing a session, THE System SHALL provide an "Export" button to download registration data
2. WHEN exporting session data, THE System SHALL generate a CSV file containing child names, parent contact, group codes, and payment status
3. THE System SHALL allow admins to export all orders within a date range
4. THE System SHALL allow admins to export waitlist data for capacity planning
5. WHEN exporting data, THE System SHALL include timestamps in the filename for version tracking
