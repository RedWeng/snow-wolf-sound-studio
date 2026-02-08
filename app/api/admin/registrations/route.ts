/**
 * Admin Registrations API
 * 
 * Get all registrations across all sessions with full details
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/neon/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get('status') || 'all';
    const sessionFilter = searchParams.get('session') || 'all';
    const searchQuery = searchParams.get('search') || '';

    const pool = getPool();
    
    // Build WHERE conditions
    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    // Status filter
    if (statusFilter !== 'all') {
      if (statusFilter === 'confirmed') {
        conditions.push(`o.status = $${paramIndex}`);
        params.push('confirmed');
        paramIndex++;
      } else if (statusFilter === 'pending') {
        conditions.push(`o.status IN ($${paramIndex}, $${paramIndex + 1})`);
        params.push('pending_payment', 'payment_submitted');
        paramIndex += 2;
      } else if (statusFilter === 'cancelled') {
        conditions.push(`o.status LIKE $${paramIndex}`);
        params.push('cancelled%');
        paramIndex++;
      }
    }

    // Session filter
    if (sessionFilter !== 'all') {
      conditions.push(`s.id = $${paramIndex}`);
      params.push(sessionFilter);
      paramIndex++;
    }

    // Search query
    if (searchQuery) {
      conditions.push(`(
        c.name ILIKE $${paramIndex} OR
        u.full_name ILIKE $${paramIndex} OR
        u.email ILIKE $${paramIndex} OR
        o.order_number ILIKE $${paramIndex} OR
        s.title_zh ILIKE $${paramIndex}
      )`);
      params.push(`%${searchQuery}%`);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Get all registrations with full details
    const query = `
      SELECT 
        oi.id as order_item_id,
        oi.created_at as registration_date,
        oi.price,
        oi.discount_amount,
        oi.role_id,
        o.id as order_id,
        o.order_number,
        o.status as order_status,
        o.payment_method,
        o.group_code,
        o.total_amount,
        o.final_amount,
        o.created_at as order_created_at,
        c.id as child_id,
        c.name as child_name,
        c.age as child_age,
        c.notes as child_notes,
        u.id as parent_id,
        u.full_name as parent_name,
        u.email as parent_email,
        u.phone as parent_phone,
        s.id as session_id,
        s.title_zh as session_title,
        s.date as session_date,
        s.time as session_time,
        s.venue_zh as session_venue
      FROM order_items oi
      INNER JOIN orders o ON oi.order_id = o.id
      INNER JOIN children c ON oi.child_id = c.id
      INNER JOIN users u ON o.parent_id = u.id
      INNER JOIN sessions s ON oi.session_id = s.id
      ${whereClause}
      ORDER BY oi.created_at DESC
    `;

    const result = await pool.query(query, params);

    const registrations = result.rows.map(row => ({
      orderItem: {
        id: row.order_item_id,
        order_id: row.order_id,
        session_id: row.session_id,
        child_id: row.child_id,
        price: row.price,
        discount_amount: row.discount_amount,
        role_id: row.role_id,
        created_at: row.registration_date,
      },
      order: {
        id: row.order_id,
        order_number: row.order_number,
        status: row.order_status,
        payment_method: row.payment_method,
        group_code: row.group_code,
        total_amount: row.total_amount,
        final_amount: row.final_amount,
        created_at: row.order_created_at,
      },
      child: {
        id: row.child_id,
        name: row.child_name,
        age: row.child_age,
        notes: row.child_notes,
      },
      parent: {
        id: row.parent_id,
        full_name: row.parent_name,
        email: row.parent_email,
        phone: row.parent_phone,
      },
      session: {
        id: row.session_id,
        title_zh: row.session_title,
        date: row.session_date,
        time: row.session_time,
        venue_zh: row.session_venue,
      },
    }));

    // Calculate statistics
    const stats = {
      total: registrations.length,
      confirmed: registrations.filter(r => r.order.status === 'confirmed').length,
      pending: registrations.filter(r => 
        r.order.status === 'pending_payment' || r.order.status === 'payment_submitted'
      ).length,
      cancelled: registrations.filter(r => r.order.status.includes('cancelled')).length,
    };

    return NextResponse.json({
      success: true,
      registrations,
      stats,
    });

  } catch (error) {
    console.error('[Admin Registrations API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch registrations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
