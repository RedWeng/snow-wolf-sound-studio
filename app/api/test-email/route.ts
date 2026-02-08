/**
 * Test Email API - Send test emails
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  sendRegistrationConfirmation,
  sendPaymentPendingNotification,
  sendRegistrationSuccess,
} from '@/lib/email/service';
import type { OrderDetails } from '@/lib/email/templates';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { template, order } = body as { template: string; order: OrderDetails };

    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json({
        success: false,
        message: '❌ Resend API Key 未設定。請檢查 .env.local 檔案。',
      });
    }

    let result;
    switch (template) {
      case 'confirmation':
        result = await sendRegistrationConfirmation(order);
        break;
      case 'pending':
        result = await sendPaymentPendingNotification(order);
        break;
      case 'success':
        result = await sendRegistrationSuccess(order);
        break;
      default:
        return NextResponse.json({
          success: false,
          message: '❌ 無效的模板類型',
        });
    }

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `✅ Email 已成功發送！請檢查收件匣（可能在垃圾郵件中）`,
      });
    } else {
      return NextResponse.json({
        success: false,
        message: `❌ 發送失敗：${JSON.stringify(result.error)}`,
      });
    }
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json({
      success: false,
      message: `❌ 發送失敗：${(error as Error).message}`,
    }, { status: 500 });
  }
}
