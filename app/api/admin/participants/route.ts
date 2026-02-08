/**
 * Admin Participants API
 * 
 * Get all participants (children) with their session history
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/neon/client';

export async function GET(_request: NextRequest) {
  try {
    const pool = getPool();
    
    // Get all children with their session history
    const query = `
      SELECT 
        c.id,
        c.name,
        c.age,
        c.notes,
        c.parent_id,
        c.created_at,
        COUNT(DISTINCT oi.id) as total_sessions,
        json_agg(
          json_build_object(
            'session_id', s.id,
            'session_title_zh', s.title_zh,
            'session_date', s.date,
            'session_time', s.time,
            'attended_date', oi.created_at,
            'order_number', o.order_number,
            'order_status', o.status
          ) ORDER BY oi.created_at DESC
        ) FILTER (WHERE oi.id IS NOT NULL) as sessions_attended
      FROM children c
      LEFT JOIN order_items oi ON c.id = oi.child_id
      LEFT JOIN orders o ON oi.order_id = o.id
      LEFT JOIN sessions s ON oi.session_id = s.id
      WHERE o.status = 'confirmed' OR o.status IS NULL
      GROUP BY c.id
      ORDER BY total_sessions DESC, c.name ASC
    `;

    const result = await pool.query(query);

    const participants = result.rows.map(row => ({
      child: {
        id: row.id,
        name: row.name,
        age: row.age,
        notes: row.notes,
        parent_id: row.parent_id,
        created_at: row.created_at,
      },
      sessionsAttended: row.sessions_attended || [],
      totalSessions: parseInt(row.total_sessions) || 0,
    }));

    return NextResponse.json({
      success: true,
      participants,
    });

  } catch (error) {
    console.error('[Admin Participants API] Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch participants',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
