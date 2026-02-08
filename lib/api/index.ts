/**
 * Mock API Layer - Central export for all API functions
 * Requirements: 2.1, 3.1, 4.1, 6.1
 * 
 * This module provides mock API functions that simulate backend functionality
 * with realistic network delays (100-500ms). All functions return promises
 * and include proper error handling.
 * 
 * Usage:
 * ```typescript
 * import { getSessions, createOrder, getChildren } from '@/lib/api';
 * 
 * // Fetch sessions with filtering
 * const sessions = await getSessions({ status: 'active' });
 * 
 * // Create a new order
 * const order = await createOrder({
 *   parentId: 'user-1',
 *   items: [{ sessionId: '1', childId: 'child-1' }],
 *   paymentMethod: 'bank_transfer'
 * });
 * ```
 */

// Session API
export {
  getSessions,
  getSessionById,
  getSessionAvailability,
} from './sessions';

// Children API
export {
  getChildren,
  createChild,
  updateChild,
  deleteChild,
} from './children';

// Orders API
export {
  createOrder,
  uploadPaymentProof,
  getOrderById,
  getOrdersByParent,
} from './orders';
