# Implementation Plan: Family Recording Add-on

## Overview

This implementation plan breaks down the family recording add-on feature into discrete coding tasks. The approach follows a bottom-up strategy: database schema → API layer → business logic → UI components → integration. Each task builds incrementally, with testing integrated throughout to catch errors early.

## Tasks

- [ ] 1. Set up database schema and models
  - [ ] 1.1 Create database migration for FamilyRecordingSession, TimeSlot, and Booking tables
    - Add tables with proper foreign keys and constraints
    - Include unique constraint on TimeSlot.bookingId
    - Add check constraint for Booking.familySize (1-6)
    - Add cascade delete rules for main course cancellations
    - _Requirements: 12.1, 12.4_
  
  - [ ] 1.2 Write property test for database constraints
    - **Property 13: Double Booking Prevention**
    - **Validates: Requirements 5.3, 5.4, 12.1**
    - Test that attempting to create multiple bookings for same slot fails
  
  - [ ] 1.3 Create TypeScript models and interfaces
    - Define FamilyRecordingSession, TimeSlot, Booking interfaces
    - Create BookingStatus type
    - Add validation helpers for family size range
    - _Requirements: 3.1, 4.1_
  
  - [ ] 1.4 Write property test for family size validation
    - **Property 7: Family Size Validation**
    - **Validates: Requirements 3.1, 3.2**
    - Test that values 1-6 are accepted, others rejected

- [ ] 2. Implement core booking service and validation
  - [ ] 2.1 Create BookingValidationService
    - Implement validateBooking method with all validation rules
    - Verify main course exists and belongs to parent
    - Verify time slot availability
    - Verify family size range (1-6)
    - Verify session date consistency
    - _Requirements: 5.1, 5.2, 5.3, 12.3_
  
  - [ ] 2.2 Write property test for main course prerequisite validation
    - **Property 12: Main Course Prerequisite Validation**
    - **Validates: Requirements 5.1, 5.2**
    - Test that checkout fails without main course in cart
  
  - [ ] 2.3 Create RefundPolicyService
    - Implement calculateRefund method with tiered refund logic
    - Handle >7 days (100%), 3-7 days (50%), <3 days (0%)
    - Handle admin cancellations (always 100%)
    - _Requirements: 10.1, 10.2, 10.3, 10.4_
  
  - [ ] 2.4 Write property test for refund calculation
    - **Property 23: Refund Calculation Policy**
    - **Validates: Requirements 10.1, 10.2, 10.3, 10.4**
    - Test refund amounts across all time windows and scenarios
  
  - [ ] 2.5 Create TemporaryReservationService
    - Implement createTemporaryReservation with 15-minute expiry
    - Implement releaseExpiredReservations for cleanup job
    - Implement confirmReservation to finalize booking
    - _Requirements: 2.4, 2.5_
  
  - [ ] 2.6 Write property test for temporary reservations
    - **Property 6: Temporary Reservation Creation**
    - **Validates: Requirements 2.4, 2.5**
    - Test that reservations expire after timeout

- [ ] 3. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Implement API endpoints for family recording sessions
  - [ ] 4.1 Create GET /api/family-recording/sessions/:courseId endpoint
    - Fetch family recording sessions for a course
    - Return time slots with availability status
    - Handle case where no sessions exist (empty array)
    - _Requirements: 1.1, 2.2_
  
  - [ ] 4.2 Write property test for time slot structure
    - **Property 1: Time Slot Structure Invariant**
    - **Validates: Requirements 1.4, 2.1**
    - Test that every session has exactly 4 slots of 20 minutes each
  
  - [ ] 4.3 Create POST /api/family-recording/bookings endpoint
    - Accept booking request with validation
    - Use database transaction for atomicity
    - Create booking and mark slot unavailable
    - Return booking confirmation
    - _Requirements: 5.5, 3.4_
  
  - [ ] 4.4 Write property test for slot availability state transition
    - **Property 4: Slot Availability State Transition**
    - **Validates: Requirements 2.3, 5.5**
    - Test that confirming booking changes slot to unavailable
  
  - [ ] 4.5 Create PATCH /api/family-recording/bookings/:bookingId endpoint
    - Allow time slot and family size modifications
    - Implement atomic slot swap (release old, reserve new)
    - Validate new values before applying changes
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [ ] 4.6 Write property test for modification atomicity
    - **Property 19: Time Slot Modification Atomicity**
    - **Validates: Requirements 8.1, 8.3, 8.4**
    - Test that slot changes are atomic or maintain original booking
  
  - [ ] 4.7 Create DELETE /api/family-recording/bookings/:bookingId endpoint
    - Calculate refund based on cancellation timing
    - Release time slot
    - Update booking status to cancelled
    - _Requirements: 6.3, 10.1_

- [ ] 5. Implement booking dependency management
  - [ ] 5.1 Create BookingDependencyService
    - Implement handleMainCourseCancellation for cascading cancellation
    - Implement handleMainCourseDateChange for date updates
    - Ensure time slots are released on cancellation
    - _Requirements: 6.1, 6.3, 6.4_
  
  - [ ] 5.2 Write property test for cascading cancellation
    - **Property 15: Cascading Cancellation**
    - **Validates: Requirements 6.1, 6.3**
    - Test that main course cancellation auto-cancels add-on bookings
  
  - [ ] 5.3 Integrate BookingDependencyService with order cancellation flow
    - Hook into existing order cancellation logic
    - Call handleMainCourseCancellation when order is cancelled
    - Ensure full refund is processed for auto-cancellations
    - _Requirements: 6.1, 10.4_

- [ ] 6. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Implement email notification service
  - [ ] 7.1 Create email templates for family recording
    - Booking confirmation template with all required details
    - Cancellation notification template
    - Modification confirmation template
    - Reminder email template (3 days before)
    - _Requirements: 7.2, 7.5_
  
  - [ ] 7.2 Write property test for confirmation email completeness
    - **Property 17: Confirmation Email Completeness**
    - **Validates: Requirements 7.2, 7.5**
    - Test that emails contain all required fields
  
  - [ ] 7.3 Integrate email notifications with booking lifecycle
    - Send confirmation on booking creation
    - Send notification on booking modification
    - Send notification on booking cancellation
    - _Requirements: 7.1, 7.4, 6.2_
  
  - [ ] 7.4 Write property test for notification on state changes
    - **Property 16: Notification on State Changes**
    - **Validates: Requirements 6.2, 7.1, 7.4, 8.5, 9.5**
    - Test that emails are sent for all state transitions
  
  - [ ] 7.5 Create scheduled job for reminder emails
    - Query bookings with session date 3 days away
    - Send reminder emails to parents
    - Mark reminders as sent to avoid duplicates
    - _Requirements: 7.3_

- [ ] 8. Implement UI components for add-on selection
  - [ ] 8.1 Create AddOnCard component
    - Display family recording add-on information
    - Show price (NT$6,500) and description
    - Fetch and display available time slots
    - Include TimeSlotPicker and FamilySizeSelector
    - Show "Fully Booked" message when all slots taken
    - _Requirements: 1.1, 4.1, 11.2_
  
  - [ ] 8.2 Write unit test for AddOnCard visibility
    - Test that component only renders when main course selected
    - Test "Fully Booked" message appears correctly
    - _Requirements: 1.2, 11.2_
  
  - [ ] 8.3 Create TimeSlotPicker component
    - Display 4 time slots in grid layout
    - Show availability status with color coding
    - Highlight selected slot
    - Disable unavailable slots
    - _Requirements: 2.2, 11.5_
  
  - [ ] 8.4 Write property test for availability display consistency
    - **Property 5: Availability Display Consistency**
    - **Validates: Requirements 2.2, 11.4**
    - Test that displayed status matches database state
  
  - [ ] 8.5 Create FamilySizeSelector component
    - Render dropdown with options 1-6
    - Validate selected value
    - Show error for invalid input
    - _Requirements: 3.1, 3.2_
  
  - [ ] 8.6 Add "Family Recording Available" indicator to course cards
    - Display badge on courses with family recording
    - Fetch availability status from API
    - _Requirements: 1.3_
  
  - [ ] 8.7 Write property test for course indicator accuracy
    - **Property 3: Course Indicator Accuracy**
    - **Validates: Requirements 1.3**
    - Test that indicator appears only for courses with add-on

- [ ] 9. Integrate add-on with cart and checkout flow
  - [ ] 9.1 Enhance cart service to support add-on items
    - Add addFamilyRecording method to cart service
    - Store time slot ID and family size in cart item
    - Calculate total price including add-on
    - _Requirements: 4.2, 4.4_
  
  - [ ] 9.2 Write property test for cart price calculation
    - **Property 10: Cart Price Calculation**
    - **Validates: Requirements 4.2, 4.4**
    - Test that total = main course price + NT$6,500
  
  - [ ] 9.3 Update CartLineItem component to display add-on details
    - Show add-on as separate line item
    - Display time slot and family size
    - Show price (NT$6,500)
    - Allow removal from cart
    - _Requirements: 4.3, 4.5_
  
  - [ ] 9.4 Write property test for cart item completeness
    - **Property 11: Cart Item Completeness**
    - **Validates: Requirements 4.3, 4.5**
    - Test that cart displays all add-on details
  
  - [ ] 9.5 Add validation to checkout flow
    - Verify main course exists before allowing checkout with add-on
    - Create temporary reservation on checkout start
    - Confirm reservation on payment success
    - Release reservation on checkout abandonment
    - _Requirements: 5.1, 5.2, 2.4_
  
  - [ ] 9.6 Write property test for add-on visibility dependency
    - **Property 2: Add-on Visibility Dependency**
    - **Validates: Requirements 1.1, 1.2**
    - Test that add-on options visible iff main course selected

- [ ] 10. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 11. Implement admin dashboard features
  - [ ] 11.1 Create GET /api/admin/family-recording/bookings endpoint
    - Return all bookings with filtering and pagination
    - Support filters: session date, status
    - Include parent name, child name, time slot, family size
    - _Requirements: 9.1, 9.2_
  
  - [ ] 11.2 Write property test for admin dashboard data completeness
    - **Property 21: Admin Dashboard Data Completeness**
    - **Validates: Requirements 9.2**
    - Test that all required fields are present in response
  
  - [ ] 11.3 Create admin UI for viewing bookings
    - Display bookings in table format
    - Add filters for date and status
    - Show all booking details
    - _Requirements: 9.1, 9.2_
  
  - [ ] 11.4 Add manual cancellation/modification functionality for admins
    - Allow admins to cancel bookings
    - Allow admins to modify time slots
    - Send notifications to parents on admin actions
    - _Requirements: 9.3, 9.5_
  
  - [ ] 11.5 Create CSV export functionality
    - Generate CSV with all booking data
    - Include headers for all fields
    - Trigger download on button click
    - _Requirements: 9.4_
  
  - [ ] 11.6 Write property test for CSV export completeness
    - **Property 22: CSV Export Completeness**
    - **Validates: Requirements 9.4**
    - Test that CSV contains all booking records with complete data

- [ ] 12. Implement concurrency control and race condition handling
  - [ ] 12.1 Add database row-level locking for time slot booking
    - Use SELECT FOR UPDATE in booking transaction
    - Implement retry logic with exponential backoff
    - Return appropriate error on lock timeout
    - _Requirements: 12.2_
  
  - [ ] 12.2 Write property test for concurrent booking race condition
    - **Property 14: Concurrent Booking Race Condition**
    - **Validates: Requirements 12.2**
    - Test that simultaneous bookings result in exactly one success
  
  - [ ] 12.3 Add optimistic locking with version numbers
    - Add version field to Booking table
    - Increment version on each update
    - Detect stale data and return concurrency error
    - _Requirements: 12.2_

- [ ] 13. Implement scheduled jobs and background tasks
  - [ ] 13.1 Create job for releasing expired temporary reservations
    - Query reservations older than 15 minutes
    - Release time slots in batch transaction
    - Log cleanup statistics
    - Schedule to run every 5 minutes
    - _Requirements: 2.5_
  
  - [ ] 13.2 Create job for sending reminder emails
    - Query bookings with session date 3 days away
    - Send reminder emails
    - Mark reminders as sent
    - Schedule to run daily
    - _Requirements: 7.3_
  
  - [ ] 13.3 Write property test for scheduled reminder emails
    - **Property 18: Scheduled Reminder Emails**
    - **Validates: Requirements 7.3**
    - Test that reminders are sent for bookings 3 days away

- [ ] 14. Add error handling and logging
  - [ ] 14.1 Implement comprehensive error handling for all API endpoints
    - Return appropriate error codes and messages
    - Handle validation, availability, dependency, and concurrency errors
    - Log errors with full context
    - _Requirements: 3.2, 5.2, 5.4, 8.4_
  
  - [ ] 14.2 Add data inconsistency detection and logging
    - Validate referential integrity on read operations
    - Log inconsistencies with full context
    - Send admin notifications for manual review
    - _Requirements: 12.5_
  
  - [ ] 14.3 Write unit tests for error handling
    - Test validation error responses
    - Test availability error responses
    - Test dependency error responses
    - Test concurrency error responses

- [ ] 15. Final checkpoint and integration testing
  - [ ] 15.1 Run full test suite
    - Execute all unit tests
    - Execute all property-based tests (100+ iterations each)
    - Verify all tests pass
  
  - [ ] 15.2 Test end-to-end booking flow
    - Test complete flow: course selection → add-on selection → checkout → confirmation
    - Test modification flow
    - Test cancellation flow with refund calculation
    - Test admin dashboard functionality
  
  - [ ] 15.3 Test edge cases
    - Test fully booked sessions
    - Test concurrent booking attempts
    - Test main course cancellation cascading
    - Test temporary reservation expiry
  
  - [ ] 15.4 Ensure all tests pass, ask the user if questions arise.

## Notes

- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties with 100+ iterations
- Unit tests validate specific examples and edge cases
- Database transactions ensure atomicity for critical operations
- Email notifications are queued for retry to handle service failures
- Scheduled jobs handle background tasks (reservation cleanup, reminders)
