/**
 * Content Section Component
 * 
 * Flexible section component for creating visual storytelling layouts.
 * Supports various layouts: full-width image, split (image + text), grid, etc.
 * 
 * Perfect for one-page websites with image-heavy content.
 */

'use client';

import { useRef, useState } from 'react';

interface ContentSectionProps {
  /**
   * Layout type
   * - 'full-image': Full-width image with optional overlay text
   * - 'split-left': Image on left, content on right
   * - 'split-right': Image on right, content on left
   * - 'grid': Image grid layout
   * - 'text-only': Text content only
   */
  layout?: 'full-image' | 'split-left' | 'split-right' | 'grid' | 'text-only';
  
  /**
   * Image URL(s)
   */
  image?: string;
  images?: string[];
  
  /**
   * Video URL (for full-image layout)
   */
  video?: string;
  
  /**
   * Content
   */
  title?: string;
  subtitle?: string;
  description?: string;
  children?: React.ReactNode;
  
  /**
   * Styling options
   */
  backgroundColor?: string;
  textColor?: string;
  overlayOpacity?: number;
  minHeight?: string;
  isHero?: boolean; // 是否為首頁 HERO 圖（使用超大字體）
  
  /**
   * Effects
   */
  parallax?: boolean;
  fadeIn?: boolean;
}

export function ContentSection({
  layout = 'split-left',
  image,
  images,
  video,
  title,
  subtitle,
  description,
  children,
  backgroundColor = 'bg-white',
  textColor = 'text-brand-navy',
  overlayOpacity = 0.3,
  minHeight = 'min-h-[500px]',
  isHero = false,
  parallax = false,
  fadeIn = true,
}: ContentSectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayButton, setShowPlayButton] = useState(true);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setShowPlayButton(false);
      }).catch((error) => {
        console.error('Video play failed:', error);
      });
    }
  };
  
  // Full-width image layout
  if (layout === 'full-image') {
    return (
      <section className={`relative ${minHeight} overflow-hidden ${backgroundColor}`}>
        {/* Background Video or Image */}
        <div className="absolute inset-0">
          {video ? (
            <>
              {/* Video Background */}
              <video
                ref={videoRef}
                key={video}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                playsInline
                preload="auto"
                onError={(e) => {
                  console.error('Video failed to load:', video);
                  const videoEl = e.currentTarget;
                  videoEl.style.display = 'none';
                  const fallbackImg = videoEl.nextElementSibling as HTMLImageElement;
                  if (fallbackImg) fallbackImg.style.display = 'block';
                }}
                onLoadedData={() => console.log('Video loaded successfully:', video)}
              >
                <source src={video} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {/* Fallback Image */}
              {image && (
                <img
                  src={image}
                  alt={title || 'Content image'}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ display: 'none' }}
                  loading="eager"
                />
              )}
            </>
          ) : image ? (
            <img
              src={image}
              alt={title || 'Content image'}
              className={`w-full h-full object-cover ${parallax ? 'parallax-image' : ''}`}
              loading="eager"
            />
          ) : null}
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-brand-navy/60 via-brand-navy/40 to-brand-navy/60"
            style={{ opacity: overlayOpacity }}
          />
          
          {/* Play Button Overlay for Video */}
          {video && showPlayButton && (
            <div 
              className="absolute inset-0 z-20 flex items-center justify-center cursor-pointer bg-black/20 backdrop-blur-sm"
              onClick={handlePlayVideo}
            >
              <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="w-24 h-24 rounded-full bg-white/90 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                  <svg className="w-12 h-12 text-brand-navy ml-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <p className="text-white text-xl font-bold drop-shadow-lg">點擊播放影片</p>
              </div>
            </div>
          )}
        </div>
        
        {/* Content Overlay */}
        {(title || subtitle || description || children) && (
          <div className={`absolute inset-0 z-10 ${isHero ? 'flex items-start justify-start' : 'flex items-center justify-center'}`}>
            <div className={`${isHero ? 'pt-8 pl-8 sm:pt-12 sm:pl-12' : 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center'}`}>
              {subtitle && (
                <div className={`${isHero ? 'mb-4' : 'mb-8'} animate-fade-in ${isHero ? '' : 'flex justify-center w-full'}`}>
                  <span className={`inline-block px-5 py-2.5 bg-white/10 border-2 border-white/40 rounded-full text-white/80 font-bold backdrop-blur-sm shadow-2xl ${
                    isHero 
                      ? 'text-base sm:text-lg md:text-xl' 
                      : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl'
                  }`}>
                    {subtitle}
                  </span>
                </div>
              )}
              {title && (
                <h1 className={`font-heading text-white/85 tracking-tight leading-tight drop-shadow-[0_8px_32px_rgba(0,0,0,0.9)] animate-fade-in delay-200 ${
                  isHero 
                    ? 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 text-left' 
                    : 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-8 text-center w-full'
                }`}>
                  {title}
                </h1>
              )}
              {description && (
                <p className={`leading-relaxed drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)] animate-fade-in delay-300 ${
                  isHero 
                    ? 'text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-200/70 mb-6 text-left max-w-2xl' 
                    : 'text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-gray-200/70 mb-12 text-center w-full'
                }`}>
                  {description}
                </p>
              )}
              {children}
            </div>
          </div>
        )}
      </section>
    );
  }
  
  // Split layout (image + text side by side)
  if (layout === 'split-left' || layout === 'split-right') {
    const imageOnLeft = layout === 'split-left';
    
    return (
      <section className={`py-20 sm:py-32 ${backgroundColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${fadeIn ? 'animate-fade-in' : ''}`}>
            {/* Image */}
            <div className={`${imageOnLeft ? 'lg:order-1' : 'lg:order-2'} relative`}>
              {image && (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={image}
                    alt={title || ''}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className={`${imageOnLeft ? 'lg:order-2' : 'lg:order-1'} space-y-6 ${textColor}`}>
              {subtitle && (
                <p className="text-accent-aurora text-lg font-semibold uppercase tracking-wide">
                  {subtitle}
                </p>
              )}
              {title && (
                <h2 className="text-4xl sm:text-5xl font-heading">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-lg text-brand-midnight/80 leading-relaxed">
                  {description}
                </p>
              )}
              {children}
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  // Grid layout (multiple images)
  if (layout === 'grid' && images) {
    return (
      <section className={`py-20 sm:py-32 ${backgroundColor}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          {(title || subtitle || description) && (
            <div className="text-center mb-16 space-y-4">
              {subtitle && (
                <p className="text-accent-aurora text-lg font-semibold uppercase tracking-wide">
                  {subtitle}
                </p>
              )}
              {title && (
                <h2 className={`text-4xl sm:text-5xl font-heading ${textColor}`}>
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-lg text-brand-midnight/80 max-w-3xl mx-auto">
                  {description}
                </p>
              )}
            </div>
          )}
          
          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300"
                style={{
                  animation: fadeIn ? `fade-in-up 0.6s ease-out ${index * 0.1}s both` : 'none',
                }}
              >
                <img
                  src={img}
                  alt={`Image ${index + 1}`}
                  className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
          
          {children && (
            <div className="mt-12 text-center">
              {children}
            </div>
          )}
        </div>
      </section>
    );
  }
  
  // Text-only layout
  if (layout === 'text-only') {
    return (
      <section className={`py-20 sm:py-32 ${backgroundColor}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {subtitle && (
            <p className="text-accent-aurora text-lg font-semibold uppercase tracking-wide mb-4">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className={`text-4xl sm:text-5xl font-heading mb-6 ${textColor}`}>
              {title}
            </h2>
          )}
          {description && (
            <p className="text-lg text-brand-midnight/80 leading-relaxed mb-8">
              {description}
            </p>
          )}
          {children}
        </div>
      </section>
    );
  }
  
  return null;
}
