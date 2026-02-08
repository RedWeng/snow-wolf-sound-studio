/**
 * Children API - Handle child profile creation and retrieval
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/neon/client';

/**
 * POST - Create or find child by name and parent
 * Returns existing child if found, creates new child otherwise
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { parent_id, name, age, notes } = body;

    // Validate required fields
    if (!parent_id || !name || !age) {
      return NextResponse.json(
        { success: false, error: 'Parent ID, name, and age are required' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Check if child already exists for this parent
    const checkQuery = 'SELECT * FROM children WHERE parent_id = $1 AND name = $2';
    const checkResult = await pool.query(checkQuery, [parent_id, name]);

    if (checkResult.rows.length > 0) {
      // Child exists, update their information
      const updateQuery = `
        UPDATE children
        SET age = $1,
            notes = $2,
            updated_at = NOW()
        WHERE parent_id = $3 AND name = $4
        RETURNING *
      `;

      const updateResult = await pool.query(updateQuery, [
        age,
        notes || null,
        parent_id,
        name,
      ]);

      console.log(`✅ [Children API] Child updated: ${name} (parent: ${parent_id})`);

      return NextResponse.json({
        success: true,
        child: updateResult.rows[0],
        isNew: false,
      });
    } else {
      // Create new child
      const insertQuery = `
        INSERT INTO children (parent_id, name, age, notes)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const insertResult = await pool.query(insertQuery, [
        parent_id,
        name,
        age,
        notes || null,
      ]);

      console.log(`✅ [Children API] Child created: ${name} (parent: ${parent_id})`);

      return NextResponse.json({
        success: true,
        child: insertResult.rows[0],
        isNew: true,
      });
    }
  } catch (error) {
    console.error('[Children API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create or find child',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Get children for a parent
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const parentId = searchParams.get('parentId');

    if (!parentId) {
      return NextResponse.json(
        { success: false, error: 'Parent ID required' },
        { status: 400 }
      );
    }

    const pool = getPool();

    const query = `
      SELECT * FROM children
      WHERE parent_id = $1
      ORDER BY created_at DESC
    `;

    const result = await pool.query(query, [parentId]);

    return NextResponse.json({
      success: true,
      children: result.rows,
    });
  } catch (error) {
    console.error('[Children API GET] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch children',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
