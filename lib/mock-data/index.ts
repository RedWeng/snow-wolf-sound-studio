/**
 * Mock Data for Snow Wolf Event Registration System
 * 
 * This module provides comprehensive mock data sets for development and testing.
 * All data is realistic and follows the database schema defined in the design document.
 * 
 * Requirements: 2.1, 3.2, 6.1
 */

export { mockSessions } from './sessions';
export { mockUsers } from './users';
export { mockChildren } from './children';
export { mockOrders, mockOrderItems } from './orders';
export { mockWaitlistEntries } from './waitlist';

// Re-export types for convenience
export type {
  User,
  Child,
  Session,
  Order,
  OrderItem,
  WaitlistEntry,
  AdminAction,
} from '../types/database';
