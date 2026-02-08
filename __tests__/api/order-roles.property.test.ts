/**
 * Property-based tests for order creation with role assignments
 * Feature: session-character-role-selection
 */

import fc from 'fast-check';
import { createOrder, createOrderItems } from '@/lib/api/orders';

describe('Order Role Assignment Property Tests', () => {
  // Increase timeout for property tests with network delays
  jest.setTimeout(30000);

  describe('Property 4: Role Assignment Persistence', () => {
    it('should persist role_id when creating order items', async () => {
      // Feature: session-character-role-selection, Property 4: Role Assignment Persistence
      // Validates: Requirements 2.1, 2.3
      
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('aileen', 'litt', 'kadar', 'fia', 'aeshir', 'erwin'),
          async (roleId: string) => {
            const orderId = 'test-order-123';
            const items = [
              {
                sessionId: '2', // Battle of Kadal
                childId: 'child-1',
                roleId: roleId,
                price: 3200,
              },
            ];

            // Create order items with role assignment
            const orderItems = await createOrderItems(orderId, items);

            // Verify role_id is persisted
            expect(orderItems).toHaveLength(1);
            expect(orderItems[0].role_id).toBe(roleId);
            expect(orderItems[0].session_id).toBe('2');
            expect(orderItems[0].child_id).toBe('child-1');
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should handle null role_id for sessions without roles', async () => {
      // Feature: session-character-role-selection, Property 4: Role Assignment Persistence
      // Validates: Requirements 2.1, 2.3
      
      const orderId = 'test-order-456';
      const items = [
        {
          sessionId: '1', // Session without roles
          childId: 'child-1',
          roleId: undefined,
          price: 2800,
        },
      ];

      // Create order items without role assignment
      const orderItems = await createOrderItems(orderId, items);

      // Verify role_id is null
      expect(orderItems).toHaveLength(1);
      expect(orderItems[0].role_id).toBeNull();
      expect(orderItems[0].session_id).toBe('1');
    });
  });

  describe('Property 5: One-to-One Role Assignment', () => {
    it('should associate each order item with exactly one child and one role', async () => {
      // Feature: session-character-role-selection, Property 5: One-to-One Role Assignment
      // Validates: Requirements 2.2
      
      await fc.assert(
        fc.asyncProperty(
          fc.constantFrom('aileen', 'litt', 'kadar', 'fia', 'aeshir', 'erwin'),
          fc.string({ minLength: 1, maxLength: 20 }),
          async (roleId: string, childId: string) => {
            const orderId = 'test-order-789';
            const items = [
              {
                sessionId: '2',
                childId: childId,
                roleId: roleId,
                price: 3200,
              },
            ];

            const orderItems = await createOrderItems(orderId, items);

            // Each order item should have exactly one child_id and one role_id
            expect(orderItems).toHaveLength(1);
            expect(orderItems[0].child_id).toBe(childId);
            expect(orderItems[0].role_id).toBe(roleId);
            
            // Verify it's a one-to-one relationship
            expect(typeof orderItems[0].child_id).toBe('string');
            expect(typeof orderItems[0].role_id).toBe('string');
          }
        ),
        { numRuns: 20 }
      );
    });

    it('should handle multiple items with different role assignments', async () => {
      // Feature: session-character-role-selection, Property 5: One-to-One Role Assignment
      // Validates: Requirements 2.2
      
      const orderId = 'test-order-multi';
      const items = [
        {
          sessionId: '2',
          childId: 'child-1',
          roleId: 'aileen',
          price: 3200,
        },
        {
          sessionId: '2',
          childId: 'child-2',
          roleId: 'litt',
          price: 3200,
        },
        {
          sessionId: '1',
          childId: 'child-3',
          roleId: undefined,
          price: 2800,
        },
      ];

      const orderItems = await createOrderItems(orderId, items);

      // Verify each item has correct associations
      expect(orderItems).toHaveLength(3);
      
      expect(orderItems[0].child_id).toBe('child-1');
      expect(orderItems[0].role_id).toBe('aileen');
      
      expect(orderItems[1].child_id).toBe('child-2');
      expect(orderItems[1].role_id).toBe('litt');
      
      expect(orderItems[2].child_id).toBe('child-3');
      expect(orderItems[2].role_id).toBeNull();
    });
  });

  describe('Order Creation with Role Validation', () => {
    it('should reject orders with invalid role assignments', async () => {
      // Test that createOrder validates role assignments
      
      const orderData = {
        parentId: 'parent-1',
        items: [
          {
            sessionId: '2',
            childId: 'child-1',
            roleId: 'invalid-role-id',
          },
        ],
        paymentMethod: 'bank_transfer' as const,
      };

      // Should throw error for invalid role
      await expect(createOrder(orderData)).rejects.toThrow();
    });

    it('should accept orders with valid role assignments', async () => {
      // Test that createOrder accepts valid role assignments
      
      const orderData = {
        parentId: 'parent-1',
        items: [
          {
            sessionId: '2',
            childId: 'child-1',
            roleId: 'aileen',
          },
        ],
        paymentMethod: 'bank_transfer' as const,
      };

      // Should succeed (assuming capacity is available)
      const order = await createOrder(orderData);
      expect(order).toBeDefined();
      expect(order.parent_id).toBe('parent-1');
    });

    it('should accept orders without role assignments for sessions without roles', async () => {
      // Test that createOrder accepts items without roleId for sessions that don't require roles
      
      const orderData = {
        parentId: 'parent-1',
        items: [
          {
            sessionId: '1', // Session without roles
            childId: 'child-1',
          },
        ],
        paymentMethod: 'bank_transfer' as const,
      };

      // Should succeed
      const order = await createOrder(orderData);
      expect(order).toBeDefined();
      expect(order.parent_id).toBe('parent-1');
    });
  });
});
