import React from 'react';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

/**
 * Skeleton loading component for content placeholders
 * Provides visual feedback while content is loading
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
  className = '',
  style,
  ...props
}) => {
  // Base styles
  const baseStyles = 'bg-brand-frost';

  // Variant styles
  const variantStyles = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  // Animation styles
  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer bg-gradient-to-r from-brand-frost via-white to-brand-frost bg-[length:200%_100%]',
    none: '',
  };

  // Combine styles
  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${animationStyles[animation]} ${className}`;

  // Combine inline styles
  const combinedStyle: React.CSSProperties = {
    width: width || (variant === 'text' ? '100%' : undefined),
    height: height || (variant === 'circular' ? width : undefined),
    ...style,
  };

  return <div className={combinedClassName} style={combinedStyle} {...props} />;
};

export interface SkeletonCardProps {
  showImage?: boolean;
  lines?: number;
}

/**
 * Pre-built skeleton for card components
 */
export const SkeletonCard: React.FC<SkeletonCardProps> = ({ showImage = true, lines = 3 }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      {showImage && <Skeleton variant="rectangular" height={200} />}
      <Skeleton variant="text" width="60%" height={24} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} variant="text" width={i === lines - 1 ? '80%' : '100%'} />
      ))}
    </div>
  );
};

export interface SkeletonListProps {
  items?: number;
}

/**
 * Pre-built skeleton for list items
 */
export const SkeletonList: React.FC<SkeletonListProps> = ({ items = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" width="40%" height={20} />
            <Skeleton variant="text" width="80%" />
          </div>
        </div>
      ))}
    </div>
  );
};

export interface SkeletonTextProps {
  lines?: number;
}

/**
 * Pre-built skeleton for text content
 */
export const SkeletonText: React.FC<SkeletonTextProps> = ({ lines = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 ? '70%' : '100%'}
        />
      ))}
    </div>
  );
};
