/**
 * Image URL Utility
 * 
 * Maps local image paths to Cloudinary CDN URLs
 * Falls back to local paths for images not uploaded to Cloudinary
 */

import cloudinaryMapping from '../../cloudinary-mapping.json';

// Create a lookup map for faster access
const imageMap = new Map<string, string>();
cloudinaryMapping.forEach((item) => {
  imageMap.set(item.localPath, item.cloudinaryUrl);
});

/**
 * Get the CDN URL for an image, or fallback to local path
 * @param localPath - Local image path (e.g., '/image2/RPG.png')
 * @returns Cloudinary URL if available, otherwise local path
 */
export function getImageUrl(localPath: string): string {
  return imageMap.get(localPath) || localPath;
}

/**
 * Check if an image is available on Cloudinary
 * @param localPath - Local image path
 * @returns true if image is on Cloudinary
 */
export function isOnCloudinary(localPath: string): boolean {
  return imageMap.has(localPath);
}

/**
 * Get all uploaded image paths
 * @returns Array of local paths that are on Cloudinary
 */
export function getUploadedImages(): string[] {
  return Array.from(imageMap.keys());
}
