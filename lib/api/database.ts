/**
 * Database Operations
 * 
 * Real database operations using Neon PostgreSQL
 */

import { getPool, executeTransaction } from '@/lib/neon/client';

/**
 * Save order to database with all related data
 * @param orderData - Order data to save
 * @returns Promise with saved order
 */
export async function saveOrderToDatabase(orderData: {
  orderNumber: string;
  parentId: string;
  items: Array<{
    sessionId: string;
    childId: string;
    roleId?: string;
    price?: number;
    discountAmount?: number;
  }>;
  groupCode?: string;
  paymentMethod: string;
  notes?: string;
  totalAmount: number;
  discountAmount?: number;
  finalAmount?: number;
  paymentDeadline: string;
  status: string;
}) {
  try {
    const result = await executeTransaction(async (client) => {
      // Calculate amounts
      const discountAmount = orderData.discountAmount || 0;
      const finalAmount = orderData.finalAmount || (orderData.totalAmount - discountAmount);
      
      // Calculate payment deadline as ISO string
      const deadlineParts = orderData.paymentDeadline.split('/');
      let paymentDeadlineISO: string;
      
      if (deadlineParts.length === 3) {
        // Format: YYYY/MM/DD or MM/DD/YYYY
        const year = deadlineParts[0].length === 4 ? deadlineParts[0] : deadlineParts[2];
        const month = deadlineParts[0].length === 4 ? deadlineParts[1] : deadlineParts[0];
        const day = deadlineParts[0].length === 4 ? deadlineParts[2] : deadlineParts[1];
        paymentDeadlineISO = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T23:59:59+08:00`;
      } else {
        // Fallback: 3 days from now
        const deadline = new Date();
        deadline.setDate(deadline.getDate() + 3);
        paymentDeadlineISO = deadline.toISOString();
      }

      // Insert order
      const orderQuery = `
        INSERT INTO orders (
          order_number, parent_id, status, total_amount, discount_amount, 
          final_amount, group_code, payment_method, payment_deadline, notes
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING id, created_at
      `;

      const orderValues = [
        orderData.orderNumber,
        orderData.parentId,
        orderData.status,
        orderData.totalAmount,
        discountAmount,
        finalAmount,
        orderData.groupCode || null,
        orderData.paymentMethod,
        paymentDeadlineISO,
        orderData.notes || null,
      ];

      const orderResult = await client.query(orderQuery, orderValues);
      const orderId = orderResult.rows[0].id;

      // Insert order items
      for (const item of orderData.items) {
        const itemQuery = `
          INSERT INTO order_items (
            order_id, session_id, child_id, role_id, price, discount_amount
          ) VALUES ($1, $2, $3, $4, $5, $6)
        `;

        const itemValues = [
          orderId,
          item.sessionId,
          item.childId,
          item.roleId || null,
          item.price || 0,
          item.discountAmount || 0,
        ];

        await client.query(itemQuery, itemValues);
      }

      console.log(`✅ [Database] Order ${orderData.orderNumber} saved successfully`);
      
      return { 
        success: true, 
        orderId,
        orderNumber: orderData.orderNumber,
        createdAt: orderResult.rows[0].created_at,
      };
    });

    return result;
  } catch (error) {
    console.error('❌ [Database] Failed to save order:', error);
    throw new Error(`Failed to save order: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Update session registration count atomically
 * @param sessionId - Session ID to update
 * @param increment - Number to increment by (can be negative)
 * @returns Promise with updated session
 */
export async function updateSessionRegistrations(
  sessionId: string,
  increment: number
) {
  try {
    const pool = getPool();
    
    const query = `
      UPDATE sessions
      SET current_registrations = GREATEST(0, COALESCE(current_registrations, 0) + $1),
          updated_at = NOW()
      WHERE id = $2
      RETURNING id, current_registrations, capacity
    `;

    const result = await pool.query(query, [increment, sessionId]);

    if (result.rows.length === 0) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const session = result.rows[0];
    console.log(`📊 [Database] Session ${sessionId} registrations updated: ${session.current_registrations}/${session.capacity}`);

    return { success: true, data: session };
  } catch (error) {
    console.error('❌ [Database] Failed to update session registrations:', error);
    throw new Error(`Failed to update session registrations: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get order by order number
 * @param orderNumber - Order number to fetch
 * @returns Promise with order data
 */
export async function getOrderByNumber(orderNumber: string) {
  try {
    const pool = getPool();
    
    const query = `
      SELECT o.*,
             json_agg(
               json_build_object(
                 'id', oi.id,
                 'session_id', oi.session_id,
                 'child_id', oi.child_id,
                 'role_id', oi.role_id,
                 'price', oi.price,
                 'discount_amount', oi.discount_amount
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.order_number = $1
      GROUP BY o.id
    `;

    const result = await pool.query(query, [orderNumber]);

    if (result.rows.length === 0) {
      return { success: false, error: 'Order not found' };
    }

    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('❌ [Database] Failed to fetch order:', error);
    return { success: false, error: 'Failed to fetch order' };
  }
}

/**
 * Update order status
 * @param orderNumber - Order number to update
 * @param status - New status
 * @returns Promise with updated order
 */
export async function updateOrderStatus(
  orderNumber: string,
  status: 'pending_payment' | 'payment_submitted' | 'confirmed' | 'cancelled_manual' | 'cancelled_timeout'
) {
  try {
    const pool = getPool();
    
    const query = `
      UPDATE orders
      SET status = $1, updated_at = NOW()
      WHERE order_number = $2
      RETURNING *
    `;

    const result = await pool.query(query, [status, orderNumber]);

    if (result.rows.length === 0) {
      return { success: false, error: 'Order not found' };
    }

    console.log(`✅ [Database] Order ${orderNumber} status updated to: ${status}`);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('❌ [Database] Failed to update order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

/**
 * Save payment proof
 * @param orderNumber - Order number
 * @param proofUrl - URL of uploaded payment proof
 * @returns Promise with updated order
 */
export async function savePaymentProof(
  orderNumber: string,
  proofUrl: string
) {
  try {
    const pool = getPool();
    
    const query = `
      UPDATE orders
      SET payment_proof_url = $1,
          status = 'payment_submitted',
          updated_at = NOW()
      WHERE order_number = $2
      RETURNING *
    `;

    const result = await pool.query(query, [proofUrl, orderNumber]);

    if (result.rows.length === 0) {
      return { success: false, error: 'Order not found' };
    }

    console.log(`💳 [Database] Payment proof saved for order ${orderNumber}`);
    return { success: true, data: result.rows[0] };
  } catch (error) {
    console.error('❌ [Database] Failed to save payment proof:', error);
    return { success: false, error: 'Failed to save payment proof' };
  }
}
