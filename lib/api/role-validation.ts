/**
 * Role validation functions
 * Validates role assignments and ensures data integrity
 * Requirements: 10.1, 10.2, 10.3
 */

import { getSessionById } from './sessions';
import { isRoleAvailable } from './role-availability';

/**
 * Validation result interface
 */
export interface ValidationResult {
  valid: boolean;
  error?: string;
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
 * Validate role assignment
 * Checks if role exists in session configuration and has available capacity
 * 
 * @param sessionId Session ID
 * @param roleId Role ID to validate
 * @returns Promise resolving to validation result
 */
export async function validateRoleAssignment(
  sessionId: string,
  roleId: string
): Promise<ValidationResult> {
  await simulateDelay();

  // Fetch session
  const session = await getSessionById(sessionId);
  if (!session) {
    return {
      valid: false,
      error: `Session with ID ${sessionId} not found`,
    };
  }

  // Check if session has roles
  if (!session.roles || session.roles.length === 0) {
    return {
      valid: false,
      error: `Session ${session.title_en} does not require role selection`,
    };
  }

  // Check if role exists in session configuration
  const role = session.roles.find((r) => r.id === roleId);
  if (!role) {
    return {
      valid: false,
      error: `Invalid role: ${roleId} is not available for this session`,
    };
  }

  // Check if role has available capacity
  const available = await isRoleAvailable(sessionId, roleId);
  if (!available) {
    return {
      valid: false,
      error: `Role ${role.name_en} is fully booked. Please select a different character.`,
    };
  }

  return {
    valid: true,
  };
}

/**
 * Validate multiple role assignments
 * Useful for validating an entire order with multiple items
 * 
 * @param assignments Array of session and role ID pairs
 * @returns Promise resolving to validation result
 */
export async function validateRoleAssignments(
  assignments: Array<{ sessionId: string; roleId?: string }>
): Promise<ValidationResult> {
  await simulateDelay();

  for (const assignment of assignments) {
    // Skip if no role ID (session doesn't require role selection)
    if (!assignment.roleId) {
      continue;
    }

    // Validate this assignment
    const result = await validateRoleAssignment(
      assignment.sessionId,
      assignment.roleId
    );

    if (!result.valid) {
      return result;
    }
  }

  return {
    valid: true,
  };
}

/**
 * Check if a session requires role selection
 * 
 * @param sessionId Session ID
 * @returns Promise resolving to true if session requires role selection
 */
export async function requiresRoleSelection(
  sessionId: string
): Promise<boolean> {
  const session = await getSessionById(sessionId);
  if (!session) {
    return false;
  }

  return session.roles !== undefined && session.roles.length > 0;
}

/**
 * Validate that a role ID exists in a session's configuration
 * Does not check capacity, only referential integrity
 * 
 * @param sessionId Session ID
 * @param roleId Role ID to validate
 * @returns Promise resolving to true if role exists in session
 */
export async function roleExistsInSession(
  sessionId: string,
  roleId: string
): Promise<boolean> {
  const session = await getSessionById(sessionId);
  if (!session || !session.roles) {
    return false;
  }

  return session.roles.some((role) => role.id === roleId);
}
