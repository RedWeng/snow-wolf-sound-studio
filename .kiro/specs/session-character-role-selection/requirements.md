# Requirements Document

## Introduction

This document specifies the requirements for adding character role selection functionality to session registration. When users register children for certain sessions (like the Snow Wolf Boy series), they need to select which character role each child will play. The system must track role assignments, enforce capacity limits, and provide an intuitive visual selection interface.

## Glossary

- **Session**: A scheduled event or class that users can register their children for
- **Character_Role**: A specific character that a child can play during a session (e.g., Aileen, Litt, Kadar)
- **Role_Assignment**: The association between a child, an order item, and a character role
- **Role_Capacity**: The maximum number of children that can be assigned to a specific character role
- **Order_Item**: A line item in an order representing one child's registration for one session
- **Registration_System**: The backend system that processes and validates session registrations
- **Character_Selection_UI**: The user interface component for selecting character roles
- **Admin_Dashboard**: The administrative interface for managing sessions and viewing role assignments

## Requirements

### Requirement 1: Character Role Data Model

**User Story:** As a system administrator, I want to define character roles for sessions, so that I can configure which sessions require role selection and what roles are available.

#### Acceptance Criteria

1. THE Session SHALL have an optional roles field containing a list of character roles
2. WHEN a character role is defined, THE System SHALL store the role id, name in Chinese, name in English, image URL, and capacity
3. THE System SHALL set the default capacity to 4 slots per role
4. WHEN a session has no roles field, THE System SHALL treat it as a session without role selection requirements

### Requirement 2: Role Assignment Tracking

**User Story:** As a developer, I want to track which child is assigned which role in each order, so that the system maintains accurate role assignment data.

#### Acceptance Criteria

1. WHEN an order item is created for a session with roles, THE System SHALL store the assigned role id with the order item
2. THE System SHALL associate each role assignment with exactly one child and one order item
3. WHEN retrieving order details, THE System SHALL include the assigned role information for each order item
4. THE System SHALL maintain referential integrity between order items and character roles

### Requirement 3: Role Capacity Management

**User Story:** As a system administrator, I want the system to enforce role capacity limits, so that no character role is overbooked.

#### Acceptance Criteria

1. WHEN a role assignment is requested, THE Registration_System SHALL validate that the role has available capacity
2. WHEN a role reaches its capacity limit, THE Registration_System SHALL prevent additional assignments to that role
3. WHEN an order is cancelled, THE Registration_System SHALL release the role assignment and increment available capacity
4. THE Registration_System SHALL handle concurrent registration requests without allowing overbooking

### Requirement 4: Character Role Selection Interface

**User Story:** As a parent, I want to select a character role for my child when registering for a session, so that my child can play their preferred character.

#### Acceptance Criteria

1. WHEN registering a child for a session with roles, THE Character_Selection_UI SHALL display all available character roles
2. THE Character_Selection_UI SHALL show character images in a grid layout
3. WHEN a character role is selected, THE Character_Selection_UI SHALL highlight the selected character
4. WHEN a character role is at full capacity, THE Character_Selection_UI SHALL disable that role option
5. THE Character_Selection_UI SHALL NOT display the remaining capacity numbers to users
6. THE Character_Selection_UI SHALL be responsive and work on mobile devices

### Requirement 5: Battle of Kadal Character Configuration

**User Story:** As a system administrator, I want to configure the Battle of Kadal session with 6 specific characters, so that users can select from the correct character roster.

#### Acceptance Criteria

1. THE System SHALL support the following 6 characters for Battle of Kadal sessions: Aileen, Litt, Kadar, Fia, Cecilia (Aeshir), and Teacher Erwin
2. WHEN configuring Battle of Kadal characters, THE System SHALL use images from the /public/full/ directory with the correct filenames
3. THE System SHALL set each character role capacity to 4 slots
4. THE System SHALL store both Chinese and English names for each character

### Requirement 6: Registration Flow Integration

**User Story:** As a parent, I want the character selection to appear naturally in the registration flow, so that the process is intuitive and seamless.

#### Acceptance Criteria

1. WHEN a user selects a child for a session with roles, THE System SHALL display the character selection interface
2. THE System SHALL require role selection before allowing the user to proceed with registration
3. WHEN a user completes role selection, THE System SHALL store the assignment and continue to the next step
4. THE System SHALL validate that a role is selected before adding the item to the cart

### Requirement 7: Admin Role Distribution Visibility

**User Story:** As a system administrator, I want to view role distribution for each session, so that I can plan session logistics and ensure balanced character assignments.

#### Acceptance Criteria

1. WHEN viewing a session in the admin dashboard, THE Admin_Dashboard SHALL display the distribution of children across all character roles
2. THE Admin_Dashboard SHALL show which specific children are assigned to each role
3. THE Admin_Dashboard SHALL provide an export function for role assignments
4. WHEN exporting role assignments, THE System SHALL generate a file containing child names, contact information, and assigned roles

### Requirement 8: Reusable Role Selection Architecture

**User Story:** As a developer, I want the role selection feature to be reusable, so that other sessions can easily adopt character role selection in the future.

#### Acceptance Criteria

1. THE System SHALL implement role selection as a generic feature not tied to specific sessions
2. WHEN adding role selection to a new session, THE System SHALL only require configuration of the roles field
3. THE Character_Selection_UI SHALL adapt to any number of character roles
4. THE System SHALL support different capacity limits for different roles within the same session

### Requirement 9: Order Management with Roles

**User Story:** As a parent, I want to view my child's assigned character role in order confirmations and order history, so that I can verify the correct role was assigned.

#### Acceptance Criteria

1. WHEN an order is confirmed, THE System SHALL include the assigned character role in the confirmation email
2. WHEN viewing order details, THE System SHALL display the character role assignment for each child
3. WHEN viewing order history, THE System SHALL show character role information alongside session details
4. THE System SHALL display character images in order confirmations and order details

### Requirement 10: Role Assignment Validation

**User Story:** As a developer, I want comprehensive validation of role assignments, so that data integrity is maintained throughout the system.

#### Acceptance Criteria

1. WHEN processing a registration, THE Registration_System SHALL validate that the selected role exists in the session's role configuration
2. WHEN processing a registration, THE Registration_System SHALL validate that the role id matches a valid role for that session
3. IF a role assignment is invalid, THEN THE Registration_System SHALL return a descriptive error message
4. THE Registration_System SHALL prevent orphaned role assignments when sessions are modified
