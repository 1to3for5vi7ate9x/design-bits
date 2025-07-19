'use client';

import { cn } from '@/lib/utils/cn';

interface BounceProps {
  bounceHeight?: number;
  duration?: number;
  repeat?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Bounce({ 
  bounceHeight = 20,
  duration = 1,
  repeat = true,
  className,
  children
}: BounceProps) {
  return (
    <div
      className={cn('inline-block', className)}
      style={{
        animation: `bounce ${duration}s ease-in-out ${repeat ? 'infinite' : ''}`,
        '--bounce-height': `-${bounceHeight}px`,
      } as React.CSSProperties}
    >
      {children || (
        <div className="p-4 bg-blue-500 text-white rounded-lg">
          Bouncing Element
        </div>
      )}
      
    </div>
  );
}