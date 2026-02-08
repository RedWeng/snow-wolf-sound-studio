/**
 * File Upload API
 * 
 * POST /api/upload - 上傳圖片或影片到 public 資料夾
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'image' or 'video'

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // 驗證檔案類型
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (type === 'image' && !allowedImageTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '只支援 JPG, PNG, GIF, WebP 格式的圖片' },
        { status: 400 }
      );
    }

    if (type === 'video' && !allowedVideoTypes.includes(file.type)) {
      return NextResponse.json(
        { error: '只支援 MP4, WebM, MOV 格式的影片' },
        { status: 400 }
      );
    }

    // 檔案大小限制
    const maxSize = type === 'image' ? 5 * 1024 * 1024 : 50 * 1024 * 1024; // 圖片 5MB, 影片 50MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: `檔案太大，${type === 'image' ? '圖片' : '影片'}最大 ${maxSize / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    // 產生唯一檔名
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${timestamp}-${originalName}`;

    // 決定儲存路徑
    const uploadDir = type === 'image' ? 'image2' : 'video';
    const publicPath = join(process.cwd(), 'public', uploadDir);

    // 確保目錄存在
    if (!existsSync(publicPath)) {
      await mkdir(publicPath, { recursive: true });
    }

    // 儲存檔案
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(publicPath, fileName);
    await writeFile(filePath, buffer);

    // 回傳公開 URL
    const url = `/${uploadDir}/${fileName}`;

    return NextResponse.json({
      success: true,
      url,
      fileName,
      size: file.size,
      type: file.type,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: '上傳失敗' },
      { status: 500 }
    );
  }
}
