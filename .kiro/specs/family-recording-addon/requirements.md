# Requirements Document: Family Recording Add-on

## Introduction

This document specifies the requirements for a family animation voice recording add-on service that parents can purchase when registering their children for main courses in the Snow Wolf event registration system. The add-on provides exclusive 20-minute recording sessions for families of 1-6 people at NT$6,500 per session.

## Glossary

- **Main_Course**: A primary educational course that children register for in the Snow Wolf system
- **Family_Recording_Session**: A 20-minute exclusive voice recording session for one family
- **Time_Slot**: A specific 20-minute period when a family recording session can be scheduled
- **Add_On**: An optional service that can be purchased alongside a main course
- **Family_Size**: The number of people (1-6) participating in a family recording session
- **Eligible_Parent**: A parent who has registered their child for a main course on a specific date
- **Booking**: A confirmed reservation for a family recording session at a specific time slot
- **Cart**: The collection of items (courses and add-ons) a parent intends to purchase
- **Session_Date**: The date when a main course and its associated family recording sessions occur

## Requirements

### Requirement 1: Add-on Availability and Eligibility

**User Story:** As a parent, I want to see family recording add-on options only when I've selected a main course, so that I understand the add-on is tied to my child's course registration.

#### Acceptance Criteria

1. WHEN a parent selects a main course for a specific date, THE System SHALL display available family recording time slots for that Session_Date
2. WHEN a parent has not selected any main course, THE System SHALL NOT display family recording add-on options
3. WHEN a parent views course details, THE System SHALL display a "Family Recording Available" indicator for courses that offer this add-on
4. WHERE a main course is offered, THE System SHALL provide 4 time slots for family recording sessions after the course ends

### Requirement 2: Time Slot Management

**User Story:** As a parent, I want to select a specific time slot for my family recording session, so that I can plan my schedule accordingly.

#### Acceptance Criteria

1. THE System SHALL provide exactly 4 time slots per Session_Date, each 20 minutes in duration
2. WHEN displaying time slots, THE System SHALL show real-time availability status for each slot
3. WHEN a time slot is fully booked (1 family), THE System SHALL mark it as unavailable
4. WHEN a parent selects a time slot, THE System SHALL reserve it temporarily during the checkout process
5. IF a parent abandons checkout, THEN THE System SHALL release the temporarily reserved time slot after 15 minutes

### Requirement 3: Family Size Selection

**User Story:** As a parent, I want to specify how many family members will attend the recording session, so that the facility can prepare appropriately.

#### Acceptance Criteria

1. WHEN a parent adds a family recording session to cart, THE System SHALL require selection of Family_Size between 1 and 6 people
2. IF a parent attempts to select a Family_Size outside the 1-6 range, THEN THE System SHALL prevent the selection and display an error message
3. THE System SHALL allow parents to modify Family_Size before completing checkout
4. WHEN displaying the booking confirmation, THE System SHALL show the selected Family_Size

### Requirement 4: Pricing and Cart Integration

**User Story:** As a parent, I want to see the total cost including the add-on during checkout, so that I understand the complete price before purchasing.

#### Acceptance Criteria

1. THE Family_Recording_Session SHALL have a fixed price of NT$6,500
2. WHEN a parent adds a family recording session to Cart, THE System SHALL add NT$6,500 to the total price
3. WHEN displaying Cart contents, THE System SHALL show the main course and family recording add-on as separate line items
4. WHEN calculating the final price, THE System SHALL sum the main course price and add-on price
5. THE System SHALL display the selected time slot and Family_Size in the Cart summary

### Requirement 5: Booking Validation

**User Story:** As a system administrator, I want the system to enforce booking rules, so that we maintain data integrity and prevent invalid bookings.

#### Acceptance Criteria

1. WHEN a parent attempts to checkout with a family recording add-on, THE System SHALL verify that a main course for the same Session_Date exists in the Cart
2. IF no main course exists in Cart, THEN THE System SHALL prevent checkout and display an error message
3. WHEN a parent attempts to book a time slot, THE System SHALL verify the slot is not already booked
4. IF a time slot is already booked, THEN THE System SHALL prevent the booking and display an error message
5. WHEN a booking is confirmed, THE System SHALL mark the time slot as unavailable for other parents

### Requirement 6: Main Course Dependency Management

**User Story:** As a parent, I want the system to handle changes to my main course registration appropriately, so that my add-on booking remains valid or is properly cancelled.

#### Acceptance Criteria

1. WHEN a parent cancels a main course registration, THE System SHALL automatically cancel the associated family recording booking
2. WHEN a family recording booking is auto-cancelled, THE System SHALL send a cancellation notification to the parent
3. WHEN a family recording booking is cancelled, THE System SHALL release the time slot for other parents to book
4. WHEN a main course date is changed by an administrator, THE System SHALL notify affected parents with family recording bookings

### Requirement 7: Booking Confirmation and Notifications

**User Story:** As a parent, I want to receive confirmation of my family recording booking, so that I have all the details I need for the session.

#### Acceptance Criteria

1. WHEN a booking is confirmed, THE System SHALL send a confirmation email to the parent
2. THE confirmation email SHALL include the Session_Date, time slot, Family_Size, main course details, and total price
3. WHEN the Session_Date is 3 days away, THE System SHALL send a reminder email to the parent
4. WHEN a booking is cancelled or modified, THE System SHALL send a notification email to the parent
5. THE confirmation email SHALL include instructions for the recording session and facility location

### Requirement 8: Booking Modification

**User Story:** As a parent, I want to modify my family recording booking if my plans change, so that I can adjust the time slot or family size.

#### Acceptance Criteria

1. WHEN a parent requests to modify a booking, THE System SHALL allow changes to time slot if alternative slots are available
2. WHEN a parent requests to modify a booking, THE System SHALL allow changes to Family_Size within the 1-6 range
3. WHEN a time slot is modified, THE System SHALL release the original slot and reserve the new slot
4. IF no alternative time slots are available, THEN THE System SHALL inform the parent and maintain the original booking
5. WHEN a booking is modified, THE System SHALL send an updated confirmation email

### Requirement 9: Admin Dashboard Management

**User Story:** As an administrator, I want to view and manage all family recording bookings, so that I can oversee operations and handle special cases.

#### Acceptance Criteria

1. THE Admin_Dashboard SHALL display all family recording bookings organized by Session_Date
2. WHEN viewing bookings, THE Admin_Dashboard SHALL show parent name, child name, time slot, Family_Size, and booking status
3. THE Admin_Dashboard SHALL allow administrators to manually cancel or modify bookings
4. THE Admin_Dashboard SHALL provide an export function to download booking reports in CSV format
5. WHEN an administrator modifies a booking, THE System SHALL send a notification to the affected parent

### Requirement 10: Refund Policy Enforcement

**User Story:** As a parent, I want to understand the refund policy for add-on cancellations, so that I know the financial implications of cancelling.

#### Acceptance Criteria

1. WHEN a parent cancels a family recording booking more than 7 days before the Session_Date, THE System SHALL process a full refund of NT$6,500
2. WHEN a parent cancels between 3-7 days before the Session_Date, THE System SHALL process a 50% refund of NT$3,250
3. WHEN a parent cancels less than 3 days before the Session_Date, THE System SHALL not process any refund
4. WHEN a main course is cancelled by the administrator, THE System SHALL process a full refund regardless of timing
5. THE System SHALL display the refund policy clearly during the booking process

### Requirement 11: Capacity and Availability Display

**User Story:** As a parent, I want to see how many time slots are available, so that I can make an informed decision about booking.

#### Acceptance Criteria

1. WHEN displaying time slots, THE System SHALL show the number of available slots (0-4)
2. WHEN all time slots are fully booked, THE System SHALL display a "Fully Booked" message
3. WHEN viewing a main course, THE System SHALL indicate if family recording add-on is available for that date
4. THE System SHALL update availability in real-time as bookings are made
5. WHEN a time slot has a temporary reservation, THE System SHALL mark it as "Pending" for other users

### Requirement 12: Data Integrity and Validation

**User Story:** As a system administrator, I want the system to maintain data integrity, so that we avoid double-bookings and data corruption.

#### Acceptance Criteria

1. THE System SHALL enforce a maximum of 1 family per time slot through database constraints
2. WHEN two parents attempt to book the same time slot simultaneously, THE System SHALL allow only the first confirmed booking
3. THE System SHALL validate that Session_Date for family recording matches the main course Session_Date
4. THE System SHALL prevent orphaned family recording bookings without associated main course registrations
5. WHEN data inconsistencies are detected, THE System SHALL log errors and notify administrators
