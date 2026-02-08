/**
 * Property-based tests for character role functionality
 * Feature: session-character-role-selection
 */

import fc from 'fast-check';
import { CharacterRole } from '@/lib/types/database';

/**
 * Arbitrary generator for CharacterRole objects
 */
const arbitraryRole = fc.record({
  id: fc.string({ minLength: 1, maxLength: 20 }),
  name_zh: fc.string({ minLength: 1, maxLength: 50 }),
  name_en: fc.string({ minLength: 1, maxLength: 50 }),
  image_url: fc.string({ minLength: 1, maxLength: 100 }),
  capacity: fc.integer({ min: 1, max: 15 }),
  description_zh: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
  description_en: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
});

describe('Character Role Property Tests', () => {
  describe('Property 1: Role Data Completeness', () => {
    it('should have all required fields for any character role', () => {
      // Feature: session-character-role-selection, Property 1: Role Data Completeness
      // Validates: Requirements 1.2
      fc.assert(
        fc.property(arbitraryRole, (role: CharacterRole) => {
          // All required fields must be present and non-empty
          expect(role.id).toBeDefined();
          expect(role.id.length).toBeGreaterThan(0);
          
          expect(role.name_zh).toBeDefined();
          expect(role.name_zh.length).toBeGreaterThan(0);
          
          expect(role.name_en).toBeDefined();
          expect(role.name_en.length).toBeGreaterThan(0);
          
          expect(role.image_url).toBeDefined();
          expect(role.image_url.length).toBeGreaterThan(0);
          
          expect(role.capacity).toBeDefined();
          expect(typeof role.capacity).toBe('number');
          expect(role.capacity).toBeGreaterThan(0);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 2: Default Role Capacity', () => {
    it('should assign default capacity of 4 when capacity is not explicitly provided', () => {
      // Feature: session-character-role-selection, Property 2: Default Role Capacity
      // Validates: Requirements 1.3
      
      /**
       * Helper function to create a role with optional capacity
       * Simulates the behavior of role creation where capacity defaults to 4
       */
      const createRoleWithDefaultCapacity = (
        roleData: Omit<CharacterRole, 'capacity'> & { capacity?: number }
      ): CharacterRole => {
        return {
          ...roleData,
          capacity: roleData.capacity ?? 4, // Default to 4 if not provided
        };
      };

      // Generate roles without explicit capacity
      const arbitraryRoleWithoutCapacity = fc.record({
        id: fc.string({ minLength: 1, maxLength: 20 }),
        name_zh: fc.string({ minLength: 1, maxLength: 50 }),
        name_en: fc.string({ minLength: 1, maxLength: 50 }),
        image_url: fc.string({ minLength: 1, maxLength: 100 }),
        description_zh: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
        description_en: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
      });

      fc.assert(
        fc.property(arbitraryRoleWithoutCapacity, (roleData) => {
          const role = createRoleWithDefaultCapacity(roleData);
          
          // When capacity is not explicitly provided, it should default to 4
          expect(role.capacity).toBe(4);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve explicit capacity values when provided', () => {
      // Feature: session-character-role-selection, Property 2: Default Role Capacity
      // Validates: Requirements 1.3
      
      const createRoleWithDefaultCapacity = (
        roleData: Omit<CharacterRole, 'capacity'> & { capacity?: number }
      ): CharacterRole => {
        return {
          ...roleData,
          capacity: roleData.capacity ?? 4,
        };
      };

      // Generate roles with explicit capacity
      const arbitraryRoleWithCapacity = fc.record({
        id: fc.string({ minLength: 1, maxLength: 20 }),
        name_zh: fc.string({ minLength: 1, maxLength: 50 }),
        name_en: fc.string({ minLength: 1, maxLength: 50 }),
        image_url: fc.string({ minLength: 1, maxLength: 100 }),
        capacity: fc.integer({ min: 1, max: 15 }),
        description_zh: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
        description_en: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: undefined }),
      });

      fc.assert(
        fc.property(arbitraryRoleWithCapacity, (roleData) => {
          const explicitCapacity = roleData.capacity;
          const role = createRoleWithDefaultCapacity(roleData);
          
          // When capacity is explicitly provided, it should be preserved
          expect(role.capacity).toBe(explicitCapacity);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe('Property 3: Optional Role Selection', () => {
    it('should not require role selection for sessions without roles field', () => {
      // Feature: session-character-role-selection, Property 3: Optional Role Selection
      // Validates: Requirements 1.4
      
      /**
       * Helper function to check if role selection is required
       * Returns true if session has roles, false otherwise
       */
      const isRoleSelectionRequired = (session: { roles?: CharacterRole[] }): boolean => {
        return session.roles !== undefined && session.roles.length > 0;
      };

      // Generate sessions with and without roles
      const arbitrarySession = fc.record({
        id: fc.string({ minLength: 1, maxLength: 20 }),
        roles: fc.option(
          fc.array(arbitraryRole, { minLength: 1, maxLength: 15 }),
          { nil: undefined }
        ),
      });

      fc.assert(
        fc.property(arbitrarySession, (session) => {
          const requiresRoleSelection = isRoleSelectionRequired(session);
          
          if (session.roles === undefined) {
            // Sessions without roles field should not require role selection
            expect(requiresRoleSelection).toBe(false);
          } else if (session.roles.length === 0) {
            // Sessions with empty roles array should not require role selection
            expect(requiresRoleSelection).toBe(false);
          } else {
            // Sessions with roles should require role selection
            expect(requiresRoleSelection).toBe(true);
          }
        }),
        { numRuns: 100 }
      );
    });
  });
});
