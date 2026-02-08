/**
 * Waitlist API Route
 * 
 * Handle waitlist operations
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  addToWaitlist,
  removeFromWaitlist,
  promoteFromWaitlist,
  getWaitlistForSession,
  getWaitlistForParent,
} from '@/lib/api/waitlist';

/**
 * POST /api/waitlist - Add to waitlist
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...data } = body;

    if (action === 'add') {
      const result = await addToWaitlist(data);
      if (result.success) {
        return NextResponse.json(result, { status: 201 });
      }
      return NextResponse.json(result, { status: 400 });
    }

    if (action === 'remove') {
      const result = await removeFromWaitlist(data.entryId);
      if (result.success) {
        return NextResponse.json(result, { status: 200 });
      }
      return NextResponse.json(result, { status: 400 });
    }

    if (action === 'promote') {
      const result = await promoteFromWaitlist(data.entryId);
      if (result.success) {
        return NextResponse.json(result, { status: 200 });
      }
      return NextResponse.json(result, { status: 400 });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/waitlist - Get waitlist entries
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const parentId = searchParams.get('parentId');

    if (sessionId) {
      const result = await getWaitlistForSession(sessionId);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    if (parentId) {
      const result = await getWaitlistForParent(parentId);
      return NextResponse.json(result, { status: result.success ? 200 : 400 });
    }

    return NextResponse.json(
      { success: false, error: 'Missing sessionId or parentId parameter' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
