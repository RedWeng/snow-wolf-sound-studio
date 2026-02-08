/**
 * Admin Login API
 * 
 * POST /api/admin/login - 管理者登入驗證
 */

import { NextRequest, NextResponse } from 'next/server';
import { sign } from 'jsonwebtoken';

// 管理者帳號（實際應該存在資料庫中，這裡先用環境變數）
const ADMIN_CREDENTIALS = {
  email: process.env.ADMIN_LOGIN_EMAIL || 'admin@snowwolf.com',
  password: process.env.ADMIN_LOGIN_PASSWORD || 'admin123456',
};

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 驗證必填欄位
    if (!email || !password) {
      return NextResponse.json(
        { error: '請輸入電子郵件和密碼' },
        { status: 400 }
      );
    }

    // 驗證管理者帳號
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      // 記錄失敗的登入嘗試
      console.warn(`Failed admin login attempt: ${email} at ${new Date().toISOString()}`);
      
      return NextResponse.json(
        { error: '電子郵件或密碼錯誤' },
        { status: 401 }
      );
    }

    // 建立管理者使用者物件
    const adminUser = {
      id: 'admin-1',
      email: ADMIN_CREDENTIALS.email,
      full_name: '系統管理員',
      phone: null,
      language_preference: 'zh' as const,
      role: 'admin' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // 產生 JWT token
    const token = sign(
      {
        userId: adminUser.id,
        email: adminUser.email,
        role: 'admin',
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 記錄成功的登入
    console.log(`Admin login successful: ${email} at ${new Date().toISOString()}`);

    return NextResponse.json({
      success: true,
      user: adminUser,
      token,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: '登入失敗，請稍後再試' },
      { status: 500 }
    );
  }
}
