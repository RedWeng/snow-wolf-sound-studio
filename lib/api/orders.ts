/**
 * Mock API functions for order management
 * Requirements: 4.1, 6.1
 */

import { Order, OrderItem } from '../types/database';
import { mockSessions } from '../mock-data/sessions';
import { validateRoleAssignments } from './role-validation';

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
 * Calculate price breakdown for order items
 * @param items Array of order items with session, child, and optional role IDs
 * @returns Price breakdown with base, discount, and final amounts
 */
function calculatePriceBreakdown(
  items: Array<{ sessionId: string; childId: string; roleId?: string }>
): {
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
  itemPrices: Array<{ sessionId: string; childId: string; roleId?: string; price: number }>;
} {
  // Calculate base price for each item
  const itemPrices = items.map((item) => {
    const session = mockSessions.find((s) => s.id === item.sessionId);
    if (!session) {
      throw new Error(`Session with ID ${item.sessionId} not found`);
    }
    return {
      sessionId: item.sessionId,
      childId: item.childId,
      roleId: item.roleId,
      price: session.price,
    };
  });

  // Calculate total base price
  const totalAmount = itemPrices.reduce((sum, item) => sum + item.price, 0);

  // Calculate bundle discount based on number of items
  const itemCount = items.length;
  let discountRate = 0;

  if (itemCount >= 3) {
    discountRate = 0.15; // 15% off for 3+ sessions
  } else if (itemCount === 2) {
    discountRate = 0.1; // 10% off for 2 sessions
  }

  const discountAmount = Math.floor(totalAmount * discountRate);
  const finalAmount = totalAmount - discountAmount;

  return {
    totalAmount,
    discountAmount,
    finalAmount,
    itemPrices,
  };
}

/**
 * Generate a unique order number
 * Format: SW + YYYYMMDD + - + 4-digit sequence
 * @returns Order number string
 */
function generateOrderNumber(): string {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const sequence = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `SW${dateStr}-${sequence}`;
}

/**
 * Create a new order
 * @param data Order creation data with optional role assignments
 * @returns Promise resolving to created order
 */
export async function createOrder(data: {
  parentId: string;
  items: Array<{ sessionId: string; childId: string; roleId?: string }>;
  groupCode?: string;
  paymentMethod: 'bank_transfer' | 'line_pay';
  notes?: string;
}): Promise<Order> {
  await simulateDelay(300, 800);

  // Validate items
  if (!data.items || data.items.length === 0) {
    throw new Error('Order must contain at least one item');
  }

  // Validate role assignments
  const roleValidation = await validateRoleAssignments(
    data.items.map((item) => ({
      sessionId: item.sessionId,
      roleId: item.roleId,
    }))
  );

  if (!roleValidation.valid) {
    throw new Error(roleValidation.error || 'Invalid role assignment');
  }

  // Calculate price breakdown
  const priceBreakdown = calculatePriceBreakdown(data.items);

  // Set payment deadline (120 hours from now)
  const paymentDeadline = new Date();
  paymentDeadline.setHours(paymentDeadline.getHours() + 120);

  // Create order
  const order: Order = {
    id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    order_number: generateOrderNumber(),
    parent_id: data.parentId,
    status: 'pending_payment',
    total_amount: priceBreakdown.totalAmount,
    discount_amount: priceBreakdown.discountAmount,
    final_amount: priceBreakdown.finalAmount,
    group_code: data.groupCode || null,
    payment_method: data.paymentMethod,
    payment_proof_url: null,
    payment_deadline: paymentDeadline.toISOString(),
    notes: data.notes?.trim() || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // In a real implementation, this would also create order items with role_id
  // and send a confirmation email

  return order;
}

/**
 * Create order items for an order
 * This is a helper function that would be called after order creation
 * @param orderId Order ID
 * @param items Array of items with session, child, and optional role IDs
 * @returns Promise resolving to created order items
 */
export async function createOrderItems(
  orderId: string,
  items: Array<{ sessionId: string; childId: string; roleId?: string; price: number; discountAmount?: number }>
): Promise<OrderItem[]> {
  await simulateDelay();

  const orderItems: OrderItem[] = items.map((item, index) => ({
    id: `item-${Date.now()}-${index}`,
    order_id: orderId,
    session_id: item.sessionId,
    child_id: item.childId,
    price: item.price,
    discount_amount: item.discountAmount || 0,
    role_id: item.roleId || null,
    created_at: new Date().toISOString(),
  }));

  // In a real implementation, this would insert into database
  return orderItems;
}

/**
 * Upload payment proof for an order
 * @param orderId Order ID
 * @param file Payment proof file
 * @returns Promise resolving to uploaded file URL
 */
export async function uploadPaymentProof(
  orderId: string,
  file: File
): Promise<{ url: string }> {
  await simulateDelay(500, 1500);

  // Validate file
  if (!file) {
    throw new Error('Payment proof file is required');
  }

  // Validate file type (images only)
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Payment proof must be an image file (JPEG, PNG, or WebP)');
  }

  // Validate file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > maxSize) {
    throw new Error('Payment proof file size must be less than 5MB');
  }

  // Mock upload - generate a fake URL
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  const fileExtension = file.name.split('.').pop();
  const mockUrl = `/uploads/payment-proofs/${orderId}-${timestamp}-${randomStr}.${fileExtension}`;

  // In a real implementation, this would:
  // 1. Upload to Supabase Storage
  // 2. Update order with payment_proof_url
  // 3. Update order status to 'payment_submitted'

  return { url: mockUrl };
}

/**
 * Get order by ID
 * @param orderId Order ID
 * @returns Promise resolving to order or null if not found
 */
export async function getOrderById(_orderId: string): Promise<Order | null> {
  await simulateDelay();

  // In a real implementation, this would query the database
  // For mock purposes, we'll return null
  return null;
}

/**
 * Get all orders for a parent
 * @param parentId Parent user ID
 * @returns Promise resolving to array of orders
 */
export async function getOrdersByParent(_parentId: string): Promise<Order[]> {
  await simulateDelay();

  // In a real implementation, this would query the database
  // For mock purposes, we'll return an empty array
  return [];
}
