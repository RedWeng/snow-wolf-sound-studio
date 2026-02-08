/**
 * Payment Proof Upload API
 */

import { NextRequest, NextResponse } from 'next/server';
import { savePaymentProof, updateOrderStatus } from '@/lib/api/database';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const orderNumber = formData.get('orderNumber') as string;
    const file = formData.get('file') as File;

    if (!orderNumber || !file) {
      return NextResponse.json(
        { success: false, error: 'Missing order number or file' },
        { status: 400 }
      );
    }

    // TODO: Upload file to storage (e.g., Supabase Storage, AWS S3, Cloudinary)
    // For now, we'll just simulate the upload
    const fileUrl = `https://storage.example.com/payment-proofs/${orderNumber}-${Date.now()}.${file.name.split('.').pop()}`;
    
    console.log(`📤 [MOCK] File would be uploaded: ${file.name} (${file.size} bytes)`);
    console.log(`📤 [MOCK] File URL: ${fileUrl}`);

    // Save payment proof URL to database
    await savePaymentProof(orderNumber, fileUrl);

    // Update order status to payment submitted
    await updateOrderStatus(orderNumber, 'payment_submitted');

    // TODO: Send notification to admin about new payment proof
    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 [DEV] Admin would be notified about payment proof for order: ${orderNumber}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Payment proof uploaded successfully',
      fileUrl,
    });

  } catch (error) {
    console.error('Payment proof upload failed:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upload payment proof' },
      { status: 500 }
    );
  }
}
