/**
 * Single Order API - Get order details by order number
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/neon/client';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params;
    
    if (!orderNumber) {
      return NextResponse.json(
        { success: false, error: 'Order number required' },
        { status: 400 }
      );
    }

    const pool = getPool();
    
    // Query order with all related data
    const query = `
      SELECT 
        o.*,
        u.full_name as parent_name,
        u.email as parent_email,
        u.phone as parent_phone,
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
      LEFT JOIN users u ON o.parent_id = u.id
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN sessions s ON oi.session_id = s.id
      LEFT JOIN children c ON oi.child_id = c.id
      WHERE o.order_number = $1
      GROUP BY o.id, u.full_name, u.email, u.phone
    `;
    
    const result = await pool.query(query, [orderNumber]);
    
    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      order: result.rows[0],
    });
    
  } catch (error) {
    console.error('[Order Detail API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch order details',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
