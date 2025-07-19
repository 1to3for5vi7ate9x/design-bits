'use client';

import { cn } from '@/lib/utils/cn';

interface GridProps {
  color?: string;
  size?: number;
  opacity?: number;
  className?: string;
}

export function Grid({ 
  color = '#e5e7eb',
  size = 50,
  opacity = 0.5,
  className 
}: GridProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 w-full h-full',
        className
      )}
      style={{
        backgroundImage: `
          linear-gradient(${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px),
          linear-gradient(90deg, ${color}${Math.floor(opacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
      }}
    />
  );
}