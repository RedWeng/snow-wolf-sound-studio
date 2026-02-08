/**
 * Orders API - Handle order submission and retrieval
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/neon/client';
import { saveOrderToDatabase, updateSessionRegistrations } from '@/lib/api/database';

/**
 * GET - Retrieve orders for authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const pool = getPool();
    
    // Build WHERE conditions
    const conditions = ['o.parent_id = $1'];
    const params: any[] = [userId];
    let paramIndex = 2;
    
    if (status && status !== 'all') {
      conditions.push(`o.status = $${paramIndex}`);
      params.push(status);
      paramIndex++;
    }
    
    const whereClause = conditions.join(' AND ');
    
    // Query orders with items
    const query = `
      SELECT 
        o.*,
        json_agg(
          json_build_object(
            'id', oi.id,
            'session_id', oi.session_id,
            'child_id', oi.child_id,
            'role_id', oi.role_id,
            'price', oi.price,
            'discount_amount', oi.discount_amount,
            'session_title', s.title_zh,
            'session_date', s.date,
            'session_time', s.time,
            'child_name', c.name,
            'child_age', c.age
          ) ORDER BY oi.created_at
        ) FILTER (WHERE oi.id IS NOT NULL) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN sessions s ON oi.session_id = s.id
      LEFT JOIN children c ON oi.child_id = c.id
      WHERE ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    
    const result = await pool.query(query, params);
    
    return NextResponse.json({
      success: true,
      orders: result.rows,
    });
    
  } catch (error) {
    console.error('[Orders API GET] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Create new order
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parentInfo, orderItems, paymentMethod: _paymentMethod, totalAmount, discountAmount, finalAmount } = body;

    // Validate parent ID
    if (!parentInfo?.id) {
      return NextResponse.json(
        { success: false, error: '用戶資料不完整，請重新登入' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Create or find children records
    const childrenMap = new Map<string, string>(); // childName -> childId
    
    for (const item of orderItems) {
      if (!childrenMap.has(item.childName)) {
        // Create or find child
        const childResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/children`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            parent_id: parentInfo.id,
            name: item.childName,
            age: item.childAge,
          }),
        });
        
        const childData = await childResponse.json();
        
        if (childData.success && childData.child) {
          childrenMap.set(item.childName, childData.child.id);
        } else {
          return NextResponse.json(
            { success: false, error: `無法建立孩子資料: ${item.childName}` },
            { status: 400 }
          );
        }
      }
    }

    // Update orderItems with child IDs
    const updatedOrderItems = orderItems.map((item: any) => ({
      ...item,
      childId: childrenMap.get(item.childName) || item.childId,
    }));

    // CRITICAL: Validate capacity for all sessions before creating order
    const sessionCapacityCheck = new Map<string, number>();
    
    for (const item of updatedOrderItems) {
      // Fetch session from database
      const sessionQuery = 'SELECT id, title_zh, capacity, current_registrations FROM sessions WHERE id = $1';
      const sessionResult = await pool.query(sessionQuery, [item.sessionId]);
      
      if (sessionResult.rows.length === 0) {
        return NextResponse.json(
          { success: false, error: `場次不存在: ${item.sessionTitle}` },
          { status: 400 }
        );
      }
      
      const session = sessionResult.rows[0];
      
      // Count how many registrations for this session in current order
      const currentCount = sessionCapacityCheck.get(item.sessionId) || 0;
      sessionCapacityCheck.set(item.sessionId, currentCount + 1);
      
      // Check if session has capacity
      const currentRegistrations = session.current_registrations || 0;
      const capacity = session.capacity;
      const remaining = capacity - currentRegistrations;
      const orderCount = sessionCapacityCheck.get(item.sessionId) || 0;
      
      if (remaining < orderCount) {
        return NextResponse.json(
          { 
            success: false, 
            error: `場次「${session.title_zh}」名額不足！剩餘 ${remaining} 個名額，您嘗試報名 ${orderCount} 位孩子。請返回重新選擇。` 
          },
          { status: 400 }
        );
      }
    }

    // Generate order number
    const orderNumber = `SW${Date.now()}`;
    
    // Calculate payment deadline (3 days from now)
    const paymentDeadline = new Date();
    paymentDeadline.setDate(paymentDeadline.getDate() + 3);
    const deadlineStr = paymentDeadline.toLocaleDateString('zh-TW');

    // Prepare order details
    const orderDetails: {
      orderNumber: string;
      parentName: string;
      parentEmail: string;
      parentPhone: string;
      children: Array<{ name: string; age: number }>;
      sessions: Array<{
        title: string;
        date: string;
        time: string;
        childName: string;
        price: number;
      }>;
      totalAmount: number;
      paymentDeadline: string;
    } = {
      orderNumber,
      parentName: parentInfo.name,
      parentEmail: parentInfo.email,
      parentPhone: parentInfo.phone,
      children: [], // Will be populated from orderItems
      sessions: updatedOrderItems.map((item: any) => ({
        title: item.sessionTitle,
        date: item.sessionDate,
        time: item.sessionTime,
        childName: item.childName,
        price: item.price,
      })),
      totalAmount,
      paymentDeadline: deadlineStr,
    };

    // Extract unique children
    const childrenMapForDetails = new Map();
    updatedOrderItems.forEach((item: any) => {
      if (!childrenMapForDetails.has(item.childName)) {
        childrenMapForDetails.set(item.childName, {
          name: item.childName,
          age: item.childAge,
        });
      }
    });
    orderDetails.children = Array.from(childrenMapForDetails.values());

    // Save order to database
    await saveOrderToDatabase({
      orderNumber,
      parentId: parentInfo.id,
      items: updatedOrderItems.map((item: any) => ({
        sessionId: item.sessionId,
        childId: item.childId,
        roleId: item.roleId,
        price: item.price,
        discountAmount: item.discountAmount || 0,
      })),
      groupCode: body.groupCode,
      paymentMethod: body.paymentMethod || 'bank_transfer',
      notes: body.notes,
      totalAmount,
      discountAmount: discountAmount || 0,
      finalAmount: finalAmount || totalAmount,
      paymentDeadline: orderDetails.paymentDeadline,
      status: 'pending_payment',
    });

    // Update session registrations atomically
    // Count registrations per session
    const sessionCounts = new Map<string, number>();
    for (const item of updatedOrderItems) {
      const count = sessionCounts.get(item.sessionId) || 0;
      sessionCounts.set(item.sessionId, count + 1);
    }
    
    // Update each session
    for (const [sessionId, count] of sessionCounts.entries()) {
      await updateSessionRegistrations(sessionId, count);
    }

    // Send emails
    if (process.env.RESEND_API_KEY) {
      // Real email sending with Resend
      const { sendRegistrationConfirmation, sendPaymentPendingNotification } = await import('@/lib/email/service');
      
      await sendRegistrationConfirmation(orderDetails);
      await sendPaymentPendingNotification(orderDetails);
    } else if (process.env.NODE_ENV === 'development') {
      // Development mode - log to console
      console.log('📧 [DEV] Email would be sent to:', parentInfo.email);
      console.log('📧 [DEV] Admin notification would be sent to: molodyschool@gmail.com');
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      message: process.env.RESEND_API_KEY 
        ? 'Order created and emails sent!' 
        : 'Order created! (Email in mock mode - check console)',
    });

  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
