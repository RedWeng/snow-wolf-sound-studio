/**
 * Role availability calculation functions
 * Tracks and calculates available capacity for character roles
 * Requirements: 3.1, 3.2, 7.1
 */

import { CharacterRole } from '../types/database';
import { mockOrderItems, mockOrders } from '../mock-data/orders';
import { getSessionById } from './sessions';

/**
 * Role availability information
 */
export interface RoleAvailability {
  roleId: string;
  capacity: number;
  assigned: number;
  available: number;
}

/**
 * Simulates network latency with a random delay
 * @param min Minimum delay in milliseconds (default: 100)
 * @param max Maximum delay in milliseconds (default: 500)
 */
const simulateDelay = (min: number = 100, max: number = 500): Promise<void> => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, delay));
};

/**
 * Calculate role availability for a session
 * Counts order items by role_id for non-cancelled orders
 * 
 * @param sessionId Session ID to calculate availability for
 * @param roles Array of character roles for the session
 * @returns Map of role_id to available count
 */
export async function calculateRoleAvailability(
  sessionId: string,
  roles: CharacterRole[]
): Promise<Map<string, number>> {
  const availability = new Map<string, number>();

  // Get all non-cancelled order IDs
  const activeOrderIds = mockOrders
    .filter(
      (order) =>
        order.status === 'pending_payment' ||
        order.status === 'payment_submitted' ||
        order.status === 'confirmed'
    )
    .map((order) => order.id);

  // For each role, count assigned slots
  for (const role of roles) {
    // Count order items with this role that are in active orders
    const assignedCount = mockOrderItems.filter(
      (item) =>
        item.session_id === sessionId &&
        item.role_id === role.id &&
        activeOrderIds.includes(item.order_id)
    ).length;

    // Calculate available slots
    const available = Math.max(0, role.capacity - assignedCount);
    availability.set(role.id, available);
  }

  return availability;
}

/**
 * Get session role availability
 * Returns current capacity status for each role in a session
 * 
 * @param sessionId Session ID
 * @returns Promise resolving to array of role availability information
 * @throws Error if session not found or session has no roles
 */
export async function getSessionRoleAvailability(
  sessionId: string
): Promise<RoleAvailability[]> {
  await simulateDelay();

  // Fetch session
  const session = await getSessionById(sessionId);
  if (!session) {
    throw new Error(`Session with ID ${sessionId} not found`);
  }

  // Check if session has roles
  if (!session.roles || session.roles.length === 0) {
    throw new Error(`Session ${sessionId} does not have character roles`);
  }

  // Calculate availability for each role
  const availabilityMap = await calculateRoleAvailability(
    sessionId,
    session.roles
  );

  // Build result array
  const result: RoleAvailability[] = session.roles.map((role) => {
    const available = availabilityMap.get(role.id) ?? role.capacity;
    const assigned = role.capacity - available;

    return {
      roleId: role.id,
      capacity: role.capacity,
      assigned,
      available,
    };
  });

  return result;
}

/**
 * Check if a specific role has available capacity
 * 
 * @param sessionId Session ID
 * @param roleId Role ID to check
 * @returns Promise resolving to true if role has available capacity
 */
export async function isRoleAvailable(
  sessionId: string,
  roleId: string
): Promise<boolean> {
  const availabilities = await getSessionRoleAvailability(sessionId);
  const roleAvailability = availabilities.find((a) => a.roleId === roleId);

  if (!roleAvailability) {
    return false;
  }

  return roleAvailability.available > 0;
}

/**
 * Get total assigned count for all roles in a session
 * 
 * @param sessionId Session ID
 * @returns Promise resolving to total number of role assignments
 */
export async function getTotalRoleAssignments(
  sessionId: string
): Promise<number> {
  await simulateDelay();

  const session = await getSessionById(sessionId);
  if (!session || !session.roles) {
    return 0;
  }

  const availabilityMap = await calculateRoleAvailability(
    sessionId,
    session.roles
  );

  let totalAssigned = 0;
  for (const role of session.roles) {
    const available = availabilityMap.get(role.id) ?? role.capacity;
    const assigned = role.capacity - available;
    totalAssigned += assigned;
  }

  return totalAssigned;
}
