/**
 * Users API - Handle user creation and retrieval
 */

import { NextRequest, NextResponse } from 'next/server';
import { getPool } from '@/lib/neon/client';

/**
 * POST - Create or find user by email
 * Returns existing user if email exists, creates new user otherwise
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, full_name, phone, line_id, fb_id } = body;

    // Validate required fields
    if (!email || !full_name) {
      return NextResponse.json(
        { success: false, error: 'Email and name are required' },
        { status: 400 }
      );
    }

    const pool = getPool();

    // Check if user already exists
    const checkQuery = 'SELECT * FROM users WHERE email = $1';
    const checkResult = await pool.query(checkQuery, [email]);

    if (checkResult.rows.length > 0) {
      // User exists, update their information
      const updateQuery = `
        UPDATE users
        SET full_name = $1,
            phone = $2,
            line_id = $3,
            fb_id = $4,
            updated_at = NOW()
        WHERE email = $5
        RETURNING *
      `;

      const updateResult = await pool.query(updateQuery, [
        full_name,
        phone || null,
        line_id || null,
        fb_id || null,
        email,
      ]);

      console.log(`✅ [Users API] User updated: ${email}`);

      return NextResponse.json({
        success: true,
        user: updateResult.rows[0],
        isNew: false,
      });
    } else {
      // Create new user
      const insertQuery = `
        INSERT INTO users (email, full_name, phone, line_id, fb_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;

      const insertResult = await pool.query(insertQuery, [
        email,
        full_name,
        phone || null,
        line_id || null,
        fb_id || null,
      ]);

      console.log(`✅ [Users API] User created: ${email}`);

      return NextResponse.json({
        success: true,
        user: insertResult.rows[0],
        isNew: true,
      });
    }
  } catch (error) {
    console.error('[Users API] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create or find user',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET - Get user by email or ID
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const id = searchParams.get('id');

    if (!email && !id) {
      return NextResponse.json(
        { success: false, error: 'Email or ID required' },
        { status: 400 }
      );
    }

    const pool = getPool();

    let query: string;
    let params: any[];

    if (id) {
      query = 'SELECT * FROM users WHERE id = $1';
      params = [id];
    } else {
      query = 'SELECT * FROM users WHERE email = $1';
      params = [email];
    }

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: result.rows[0],
    });
  } catch (error) {
    console.error('[Users API GET] Error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch user',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
