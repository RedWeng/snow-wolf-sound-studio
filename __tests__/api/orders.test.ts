/**
 * Unit tests for orders API functions
 * Requirements: 4.1, 6.1
 */

import { createOrder, uploadPaymentProof } from '@/lib/api/orders';

describe('Orders API', () => {
  describe('createOrder', () => {
    it('should create an order with valid data', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [
          { sessionId: '1', childId: 'child-1' },
          { sessionId: '2', childId: 'child-2' },
        ],
        paymentMethod: 'bank_transfer' as const,
      };

      const order = await createOrder(orderData);

      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('order_number');
      expect(order.parent_id).toBe(orderData.parentId);
      expect(order.status).toBe('pending_payment');
      expect(order.payment_method).toBe(orderData.paymentMethod);
      expect(order.payment_proof_url).toBeNull();
      expect(order).toHaveProperty('payment_deadline');
      expect(order).toHaveProperty('created_at');
      expect(order).toHaveProperty('updated_at');
    });

    it('should generate unique order number', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [{ sessionId: '1', childId: 'child-1' }],
        paymentMethod: 'bank_transfer' as const,
      };

      const order1 = await createOrder(orderData);
      const order2 = await createOrder(orderData);

      expect(order1.order_number).not.toBe(order2.order_number);
      expect(order1.order_number).toMatch(/^SW\d{8}-\d{4}$/);
      expect(order2.order_number).toMatch(/^SW\d{8}-\d{4}$/);
    });

    it('should calculate base price correctly', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [
          { sessionId: '1', childId: 'child-1' }, // 2800
          { sessionId: '2', childId: 'child-2' }, // 3200
        ],
        paymentMethod: 'bank_transfer' as const,
      };

      const order = await createOrder(orderData);
      expect(order.total_amount).toBe(6000); // 2800 + 3200
    });

    it('should apply 10% discount for 2 items', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [
          { sessionId: '1', childId: 'child-1' }, // 2800
          { sessionId: '2', childId: 'child-2' }, // 3200
        ],
        paymentMethod: 'bank_transfer' as const,
      };

      const order = await createOrder(orderData);
      expect(order.total_amount).toBe(6000);
      expect(order.discount_amount).toBe(600); // 10% of 6000
      expect(order.final_amount).toBe(5400); // 6000 - 600
    });

    it('should apply 15% discount for 3+ items', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [
          { sessionId: '1', childId: 'child-1' }, // 2800
          { sessionId: '2', childId: 'child-2' }, // 3200
          { sessionId: '3', childId: 'child-3' }, // 2600
        ],
        paymentMethod: 'bank_transfer' as const,
      };

      const order = await createOrder(orderData);
      expect(order.total_amount).toBe(8600);
      expect(order.discount_amount).toBe(1290); // 15% of 8600
      expect(order.final_amount).toBe(7310); // 8600 - 1290
    });

    it('should not apply discount for single item', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [{ sessionId: '1', childId: 'child-1' }],
        paymentMethod: 'bank_transfer' as const,
      };

      const order = await createOrder(orderData);
      expect(order.discount_amount).toBe(0);
      expect(order.final_amount).toBe(order.total_amount);
    });

    it('should set payment deadline to 120 hours from now', async () => {
      const beforeCreate = new Date();
      const order = await createOrder({
        parentId: 'user-1',
        items: [{ sessionId: '1', childId: 'child-1' }],
        paymentMethod: 'bank_transfer',
      });
      const afterCreate = new Date();

      const deadline = new Date(order.payment_deadline);
      const expectedMinDeadline = new Date(beforeCreate);
      expectedMinDeadline.setHours(expectedMinDeadline.getHours() + 120);
      const expectedMaxDeadline = new Date(afterCreate);
      expectedMaxDeadline.setHours(expectedMaxDeadline.getHours() + 120);

      expect(deadline.getTime()).toBeGreaterThanOrEqual(
        expectedMinDeadline.getTime()
      );
      expect(deadline.getTime()).toBeLessThanOrEqual(
        expectedMaxDeadline.getTime()
      );
    });

    it('should include group code when provided', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [{ sessionId: '1', childId: 'child-1' }],
        groupCode: 'GROUP123',
        paymentMethod: 'bank_transfer' as const,
      };

      const order = await createOrder(orderData);
      expect(order.group_code).toBe('GROUP123');
    });

    it('should set group code to null when not provided', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [{ sessionId: '1', childId: 'child-1' }],
        paymentMethod: 'bank_transfer' as const,
      };

      const order = await createOrder(orderData);
      expect(order.group_code).toBeNull();
    });

    it('should include notes when provided', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [{ sessionId: '1', childId: 'child-1' }],
        paymentMethod: 'bank_transfer' as const,
        notes: 'Special request',
      };

      const order = await createOrder(orderData);
      expect(order.notes).toBe('Special request');
    });

    it('should trim whitespace from notes', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [{ sessionId: '1', childId: 'child-1' }],
        paymentMethod: 'bank_transfer' as const,
        notes: '  Special request  ',
      };

      const order = await createOrder(orderData);
      expect(order.notes).toBe('Special request');
    });

    it('should throw error when items array is empty', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [],
        paymentMethod: 'bank_transfer' as const,
      };

      await expect(createOrder(orderData)).rejects.toThrow(
        'Order must contain at least one item'
      );
    });

    it('should throw error for non-existent session', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [{ sessionId: 'non-existent', childId: 'child-1' }],
        paymentMethod: 'bank_transfer' as const,
      };

      await expect(createOrder(orderData)).rejects.toThrow(
        'Session with ID non-existent not found'
      );
    });

    it('should support LINE Pay payment method', async () => {
      const orderData = {
        parentId: 'user-1',
        items: [{ sessionId: '1', childId: 'child-1' }],
        paymentMethod: 'line_pay' as const,
      };

      const order = await createOrder(orderData);
      expect(order.payment_method).toBe('line_pay');
    });

    it('should simulate network delay', async () => {
      const startTime = Date.now();
      await createOrder({
        parentId: 'user-1',
        items: [{ sessionId: '1', childId: 'child-1' }],
        paymentMethod: 'bank_transfer',
      });
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(300);
    });
  });

  describe('uploadPaymentProof', () => {
    // Create a mock File object for testing
    const createMockFile = (
      name: string,
      type: string,
      size: number
    ): File => {
      const blob = new Blob(['x'.repeat(size)], { type });
      return new File([blob], name, { type });
    };

    it('should upload valid image file', async () => {
      const file = createMockFile('payment.jpg', 'image/jpeg', 1024);
      const result = await uploadPaymentProof('order-1', file);

      expect(result).toHaveProperty('url');
      expect(result.url).toContain('/uploads/payment-proofs/');
      expect(result.url).toContain('order-1');
    });

    it('should accept JPEG files', async () => {
      const file = createMockFile('payment.jpg', 'image/jpeg', 1024);
      await expect(
        uploadPaymentProof('order-1', file)
      ).resolves.not.toThrow();
    });

    it('should accept PNG files', async () => {
      const file = createMockFile('payment.png', 'image/png', 1024);
      await expect(
        uploadPaymentProof('order-1', file)
      ).resolves.not.toThrow();
    });

    it('should accept WebP files', async () => {
      const file = createMockFile('payment.webp', 'image/webp', 1024);
      await expect(
        uploadPaymentProof('order-1', file)
      ).resolves.not.toThrow();
    });

    it('should throw error for non-image files', async () => {
      const file = createMockFile('document.pdf', 'application/pdf', 1024);
      await expect(uploadPaymentProof('order-1', file)).rejects.toThrow(
        'Payment proof must be an image file'
      );
    });

    it('should throw error for files larger than 5MB', async () => {
      const file = createMockFile(
        'large.jpg',
        'image/jpeg',
        6 * 1024 * 1024
      ); // 6MB
      await expect(uploadPaymentProof('order-1', file)).rejects.toThrow(
        'Payment proof file size must be less than 5MB'
      );
    });

    it('should accept files exactly 5MB', async () => {
      const file = createMockFile(
        'exact.jpg',
        'image/jpeg',
        5 * 1024 * 1024
      ); // Exactly 5MB
      await expect(
        uploadPaymentProof('order-1', file)
      ).resolves.not.toThrow();
    });

    it('should generate unique URLs for different uploads', async () => {
      const file1 = createMockFile('payment1.jpg', 'image/jpeg', 1024);
      const file2 = createMockFile('payment2.jpg', 'image/jpeg', 1024);

      const result1 = await uploadPaymentProof('order-1', file1);
      const result2 = await uploadPaymentProof('order-1', file2);

      expect(result1.url).not.toBe(result2.url);
    });

    it('should simulate network delay', async () => {
      const file = createMockFile('payment.jpg', 'image/jpeg', 1024);
      const startTime = Date.now();
      await uploadPaymentProof('order-1', file);
      const endTime = Date.now();
      const duration = endTime - startTime;
      expect(duration).toBeGreaterThanOrEqual(500);
    });
  });
});
