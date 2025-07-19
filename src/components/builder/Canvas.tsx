'use client';

import { useRef, useState } from 'react';
import { useBuilderStore } from '@/store/builder';
import { cn } from '@/lib/utils/cn';
import { useDroppable } from '@dnd-kit/core';
import { ComponentWrapper } from './ComponentWrapper';
import { Layers } from 'lucide-react';
import { CanvasProvider } from '@/lib/contexts/CanvasContext';

export function Canvas() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { components, activeBreakpoint, updateComponent } = useBuilderStore();
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const { setNodeRef } = useDroppable({
    id: 'canvas',
    data: {
      type: 'canvas',
    },
  });

  const getCanvasSize = () => {
    switch (activeBreakpoint) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      case 'desktop':
        return 'max-w-7xl';
    }
  };

  // Check if component is a background type
  const backgroundTypes = [
    'aurora', 'waves', 'grid', 'particles', 'dot-grid', 'balatro', 'ballpit',
    'beams', 'dark-veil', 'dither', 'grid-distortion', 'grid-motion', 'hyperspeed',
    'iridescence', 'letter-glitch', 'lightning', 'liquid-chrome', 'orb',
    'ripple-grid', 'silk', 'squares', 'threads'
  ];
  const isBackgroundComponent = (type: string) => {
    return backgroundTypes.includes(type);
  };

  // Handle component position update after drag
  const handleComponentMove = (componentId: string, newPosition: { x: number; y: number }) => {
    updateComponent(componentId, { position: newPosition });
  };

  return (
    <div className="flex-1 bg-background overflow-auto">
      <div className="min-h-full p-8">
        <div
          ref={(node) => {
            canvasRef.current = node;
            setNodeRef(node);
          }}
          className={cn(
            'relative mx-auto bg-background rounded-lg shadow-lg transition-all duration-300 border border-border',
            'min-h-[800px]',
            isDraggingOver && 'ring-2 ring-primary',
            getCanvasSize()
          )}
          onDragOver={() => setIsDraggingOver(true)}
          onDragLeave={() => setIsDraggingOver(false)}
          onDrop={() => setIsDraggingOver(false)}
        >
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-text-muted pointer-events-none">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <p className="mt-2 text-sm">Drag components here to get started</p>
              </div>
            </div>
          )}

          {/* Render all components */}
          <CanvasProvider>
            {components.map((component) => (
              <ComponentWrapper 
                key={component.id} 
                component={component}
                onMove={handleComponentMove}
              />
            ))}
          </CanvasProvider>
        </div>
      </div>
    </div>
  );
}