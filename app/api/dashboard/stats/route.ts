/**
 * Dashboard Statistics API
 * 
 * Get dashboard statistics for authenticated user
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/neon/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID required' },
        { status: 400 }
      );
    }

    const pool = getPool();
    
    // Get upcoming sessions (confirmed orders with future dates)
    const upcomingQuery = `
      SELECT 
        s.id as session_id,
        s.title_zh,
        s.title_en,
        s.date,
        s.time,
        s.venue_zh,
        s.venue_en,
        c.id as child_id,
        c.name as child_name,
        c.age as child_age,
        o.order_number,
        o.status as order_status
      FROM order_items oi
      INNER JOIN orders o ON oi.order_id = o.id
      INNER JOIN sessions s ON oi.session_id = s.id
      INNER JOIN children c ON oi.child_id = c.id
      WHERE o.parent_id = $1
        AND o.status = 'confirmed'
        AND s.date >= CURRENT_DATE
      ORDER BY s.date ASC, s.time ASC
      LIMIT 10
    `;
    
    // Get pending payments
    const pendingQuery = `
      SELECT 
        o.id,
        o.order_number,
        o.status,
        o.total_amount,
        o.final_amount,
        o.payment_deadline,
        o.created_at,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.parent_id = $1
        AND o.status IN ('pending_payment', 'payment_submitted')
        AND o.payment_deadline >= NOW()
      GROUP BY o.id
      ORDER BY o.payment_deadline ASC
    `;
    
    // Get order statistics
    const statsQuery = `
      SELECT 
        COUNT(DISTINCT o.id) as total_orders,
        COUNT(DISTINCT CASE WHEN o.status = 'confirmed' THEN o.id END) as confirmed_orders,
        COUNT(DISTINCT CASE WHEN o.status IN ('pending_payment', 'payment_submitted') THEN o.id END) as pending_orders,
        COUNT(DISTINCT oi.session_id) as total_sessions_registered,
        COALESCE(SUM(CASE WHEN o.status = 'confirmed' THEN o.final_amount ELSE 0 END), 0) as total_spent
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.parent_id = $1
    `;
    
    const [upcomingResult, pendingResult, statsResult] = await Promise.all([
      pool.query(upcomingQuery, [userId]),
      pool.query(pendingQuery, [userId]),
      pool.query(statsQuery, [userId]),
    ]);
    
    return NextResponse.json({
      success: true,
      upcomingSessions: upcomingResult.rows,
      pendingPayments: pendingResult.rows,
      statistics: statsResult.rows[0],
    });
    
  } catch (error) {
    console.error('[Dashboard Stats API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch dashboard statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
