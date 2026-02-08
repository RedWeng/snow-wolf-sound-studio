/**
 * Sessions API - List and Create
 * 
 * GET  /api/sessions - 取得課程列表
 * POST /api/sessions - 新增課程
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

export async function GET(request: NextRequest) {
  try {
    const { getAllSessions } = await getDbModule();
    const searchParams = request.nextUrl.searchParams;
    
    const options = {
      status: searchParams.get('status') as 'active' | 'completed' | 'cancelled' | 'all' | undefined,
      search: searchParams.get('search') || undefined,
      dateFrom: searchParams.get('dateFrom') || undefined,
      dateTo: searchParams.get('dateTo') || undefined,
      page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : undefined,
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined,
    };

    const result = await getAllSessions(options);

    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/sessions error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch sessions',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { createSession } = await getDbModule();

    // 基本驗證
    if (!body.title_zh || !body.title_en) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Title (Chinese and English) is required',
          },
        },
        { status: 400 }
      );
    }

    if (!body.date || !body.time) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Date and time are required',
          },
        },
        { status: 400 }
      );
    }

    if (!body.capacity || body.capacity < 1) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Capacity must be at least 1',
          },
        },
        { status: 400 }
      );
    }

    if (!body.price || body.price < 0) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Price must be 0 or greater',
          },
        },
        { status: 400 }
      );
    }

    const session = await createSession(body);

    return NextResponse.json(
      {
        session,
        message: '課程新增成功！',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/sessions error:', error);
    return NextResponse.json(
      {
        error: {
          code: 'CREATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to create session',
        },
      },
      { status: 500 }
    );
  }
}
