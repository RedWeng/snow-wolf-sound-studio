/**
 * Property-based tests for role validation
 * Feature: session-character-role-selection
 */

import fc from 'fast-check';
import { validateRoleAssignment, roleExistsInSession } from '@/lib/api/role-validation';

describe('Role Validation Property Tests', () => {
  // Increase timeout for property tests with network delays
  jest.setTimeout(30000);

  describe('Property 21: Role Validation', () => {
    it('should reject invalid role IDs with descriptive error', async () => {
      // Feature: session-character-role-selection, Property 21: Role Validation
      // Validates: Requirements 10.1, 10.3
      
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 50 }),
          async (invalidRoleId: string) => {
            // Test with Battle of Kadal session (id: '2')
            // which has roles: aileen, litt, kadar, fia, aeshir, erwin
            const sessionId = '2';
            
            // Generate a role ID that definitely doesn't exist
            const nonExistentRoleId = `invalid-${invalidRoleId}-${Date.now()}`;
            
            const result = await validateRoleAssignment(sessionId, nonExistentRoleId);
            
            // Should be invalid
            expect(result.valid).toBe(false);
            
            // Should have an error message
            expect(result.error).toBeDefined();
            expect(result.error).toContain('Invalid role');
          }
        ),
        { numRuns: 20 } // Reduced to avoid timeout with network delays
      );
    });

    it('should accept valid role IDs for sessions with roles', async () => {
      // Feature: session-character-role-selection, Property 21: Role Validation
      // Validates: Requirements 10.1
      
      // Test with Battle of Kadal session (id: '2')
      const sessionId = '2';
      const validRoleIds = ['aileen', 'litt', 'kadar', 'fia', 'aeshir', 'erwin'];
      
      for (const roleId of validRoleIds) {
        const result = await validateRoleAssignment(sessionId, roleId);
        
        // Should be valid (assuming capacity is available)
        // Note: This might fail if capacity is full, which is expected behavior
        if (!result.valid && result.error?.includes('fully booked')) {
          // This is acceptable - role exists but is full
          expect(result.error).toContain('fully booked');
        } else {
          // Role should be valid
          expect(result.valid).toBe(true);
        }
      }
    });

    it('should reject role assignments for sessions without roles', async () => {
      // Feature: session-character-role-selection, Property 21: Role Validation
      // Validates: Requirements 10.1, 10.3
      
      // Test with a session that doesn't have roles (id: '1')
      const sessionId = '1';
      const anyRoleId = 'some-role';
      
      const result = await validateRoleAssignment(sessionId, anyRoleId);
      
      // Should be invalid
      expect(result.valid).toBe(false);
      
      // Should have an error message about role selection not being required
      expect(result.error).toBeDefined();
      expect(result.error).toContain('does not require role selection');
    });

    it('should validate role existence independently of capacity', async () => {
      // Feature: session-character-role-selection, Property 21: Role Validation
      // Validates: Requirements 10.1
      
      const sessionId = '2';
      const validRoleId = 'aileen';
      const invalidRoleId = 'non-existent-role';
      
      // Valid role should exist
      const validExists = await roleExistsInSession(sessionId, validRoleId);
      expect(validExists).toBe(true);
      
      // Invalid role should not exist
      const invalidExists = await roleExistsInSession(sessionId, invalidRoleId);
      expect(invalidExists).toBe(false);
    });
  });

  describe('Property 6: Role Referential Integrity', () => {
    it('should ensure role_id references valid role in session configuration', async () => {
      // Feature: session-character-role-selection, Property 6: Role Referential Integrity
      // Validates: Requirements 2.4
      
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('aileen', 'litt', 'kadar', 'fia', 'aeshir', 'erwin'),
          async (roleId: string) => {
            const sessionId = '2'; // Battle of Kadal
            
            // Role should exist in session configuration
            const exists = await roleExistsInSession(sessionId, roleId);
            expect(exists).toBe(true);
          }
        ),
        { numRuns: 20 } // Reduced to avoid timeout with network delays
      );
    });

    it('should reject role_id that does not exist in session configuration', async () => {
      // Feature: session-character-role-selection, Property 6: Role Referential Integrity
      // Validates: Requirements 2.4
      
      await fc.assert(
        fc.asyncProperty(
          fc.string({ minLength: 1, maxLength: 20 }),
          async (randomString: string) => {
            const sessionId = '2'; // Battle of Kadal
            const invalidRoleId = `invalid-${randomString}`;
            
            // Role should not exist in session configuration
            const exists = await roleExistsInSession(sessionId, invalidRoleId);
            expect(exists).toBe(false);
            
            // Validation should fail with appropriate error
            const result = await validateRoleAssignment(sessionId, invalidRoleId);
            expect(result.valid).toBe(false);
            expect(result.error).toContain('Invalid role');
          }
        ),
        { numRuns: 20 } // Reduced to avoid timeout with network delays
      );
    });

    it('should maintain referential integrity across all sessions', async () => {
      // Feature: session-character-role-selection, Property 6: Role Referential Integrity
      // Validates: Requirements 2.4
      
      // Session 1 has no roles
      const session1RoleExists = await roleExistsInSession('1', 'aileen');
      expect(session1RoleExists).toBe(false);
      
      // Session 2 has Battle of Kadal roles
      const session2RoleExists = await roleExistsInSession('2', 'aileen');
      expect(session2RoleExists).toBe(true);
      
      // Session 3 has no roles
      const session3RoleExists = await roleExistsInSession('3', 'aileen');
      expect(session3RoleExists).toBe(false);
    });
  });
});
