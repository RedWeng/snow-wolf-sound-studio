/**
 * Upload media files to Cloudinary CDN
 * 
 * This script uploads all images and videos from public/ to Cloudinary
 * and generates a mapping file for URL replacement.
 */

import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, statSync, writeFileSync } from 'fs';
import { join } from 'path';

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dp31h1t3v',
  api_key: '642126794397693',
  api_secret: '6rxocSmZliNqrAxmx6S1DcQV3t4',
});

interface UploadResult {
  localPath: string;
  cloudinaryUrl: string;
  publicId: string;
}

const uploadResults: UploadResult[] = [];

async function uploadFile(filePath: string, folder: string): Promise<void> {
  try {
    // Check file size (skip files > 10MB for free tier)
    const stats = statSync(filePath);
    const fileSizeMB = stats.size / (1024 * 1024);
    
    if (fileSizeMB > 10) {
      console.log(`⚠️  Skipping large file (${fileSizeMB.toFixed(2)}MB): ${filePath}`);
      return;
    }
    
    console.log(`Uploading (${fileSizeMB.toFixed(2)}MB): ${filePath}`);
    
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `snow-wolf/${folder}`,
      resource_type: 'image', // Only images, no videos
      overwrite: true,
      timeout: 120000, // 2 minutes timeout
    });

    uploadResults.push({
      localPath: filePath.replace(/\\/g, '/').replace('public/', '/'),
      cloudinaryUrl: result.secure_url,
      publicId: result.public_id,
    });

    console.log(`✅ Uploaded: ${result.secure_url}`);
  } catch (error: any) {
    console.error(`❌ Failed to upload ${filePath}:`, error?.message || error);
  }
}

async function uploadDirectory(dirPath: string, folder: string): Promise<void> {
  const items = readdirSync(dirPath);

  for (const item of items) {
    const fullPath = join(dirPath, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively upload subdirectories
      await uploadDirectory(fullPath, `${folder}/${item}`);
    } else if (stat.isFile()) {
      // Check if it's an image (NO VIDEOS)
      const ext = item.toLowerCase();
      if (
        ext.endsWith('.png') ||
        ext.endsWith('.jpg') ||
        ext.endsWith('.jpeg') ||
        ext.endsWith('.gif') ||
        ext.endsWith('.webp')
      ) {
        await uploadFile(fullPath, folder);
      }
    }
  }
}

async function main() {
  console.log('🚀 Starting upload to Cloudinary...\n');

  // Upload all image directories (NO VIDEOS)
  const directories = [
    { path: 'public/full', folder: 'full' },
    { path: 'public/image', folder: 'image' },
    { path: 'public/image2', folder: 'image2' },
  ];

  for (const dir of directories) {
    console.log(`\n📁 Uploading directory: ${dir.path}`);
    try {
      await uploadDirectory(dir.path, dir.folder);
    } catch (error) {
      console.error(`Failed to upload directory ${dir.path}:`, error);
    }
  }

  // Save mapping to file
  const mappingPath = 'cloudinary-mapping.json';
  writeFileSync(mappingPath, JSON.stringify(uploadResults, null, 2));
  
  console.log(`\n✅ Upload complete! ${uploadResults.length} files uploaded.`);
  console.log(`📄 Mapping saved to: ${mappingPath}`);
  console.log('\n🔗 Cloudinary URLs:');
  uploadResults.forEach(result => {
    console.log(`  ${result.localPath} -> ${result.cloudinaryUrl}`);
  });
}

main().catch(console.error);
