/**
 * Sessions API - Duplicate Session
 * 
 * POST /api/sessions/[id]/duplicate - 複製課程
 */

import { NextRequest, NextResponse } from 'next/server';

// 動態載入資料庫模組
async function getDbModule() {
  const useNeon = !!process.env.DATABASE_URL && !process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (useNeon) {
    return await import('@/lib/db/neon-sessions');
  } else {
    return await import('@/lib/db/sessions');
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { duplicateSession } = await getDbModule();

    const options = {
      date: body.date,
      time: body.time,
      title_suffix: body.title_suffix,
    };

    const session = await duplicateSession(id, options);

    return NextResponse.json(
      {
        session,
        message: '課程複製成功！',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(`POST /api/sessions/[id]/duplicate error:`, error);
    
    if (error instanceof Error && error.message === 'Session not found') {
      return NextResponse.json(
        {
          error: {
            code: 'NOT_FOUND',
            message: 'Session not found',
          },
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'DUPLICATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to duplicate session',
        },
      },
      { status: 500 }
    );
  }
}
