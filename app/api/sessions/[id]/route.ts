/**
 * Sessions API - Single Session Operations
 * 
 * GET    /api/sessions/[id] - 取得單一課程
 * PUT    /api/sessions/[id] - 更新課程
 * DELETE /api/sessions/[id] - 刪除課程
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

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { getSessionById } = await getDbModule();
    const session = await getSessionById(id);
    return NextResponse.json({ session });
  } catch (error) {
    console.error(`GET /api/sessions/[id] error:`, error);
    
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
          code: 'FETCH_ERROR',
          message: error instanceof Error ? error.message : 'Failed to fetch session',
        },
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { getSessionById, updateSession } = await getDbModule();

    // 驗證：如果更新容量，確保不小於目前報名人數
    if (body.capacity !== undefined) {
      const currentSession = await getSessionById(id);
      if (body.capacity < currentSession.current_registrations) {
        return NextResponse.json(
          {
            error: {
              code: 'VALIDATION_ERROR',
              message: `Capacity cannot be less than current registrations (${currentSession.current_registrations})`,
            },
          },
          { status: 400 }
        );
      }
    }

    const session = await updateSession(id, body);

    return NextResponse.json({
      session,
      message: '課程更新成功！',
    });
  } catch (error) {
    console.error(`PUT /api/sessions/[id] error:`, error);
    
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
          code: 'UPDATE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to update session',
        },
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { deleteSession } = await getDbModule();
    await deleteSession(id);

    return NextResponse.json({
      success: true,
      message: '課程刪除成功！',
    });
  } catch (error) {
    console.error(`DELETE /api/sessions/[id] error:`, error);
    
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

    if (error instanceof Error && error.message.includes('existing registrations')) {
      return NextResponse.json(
        {
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Cannot delete session with existing registrations',
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        error: {
          code: 'DELETE_ERROR',
          message: error instanceof Error ? error.message : 'Failed to delete session',
        },
      },
      { status: 500 }
    );
  }
}
