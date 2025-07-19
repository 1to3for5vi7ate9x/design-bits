'use client';

import { useRef, useState, useEffect } from 'react';
import { BuilderComponent } from '@/types/builder';
import { useBuilderStore } from '@/store/builder';
import { cn } from '@/lib/utils/cn';
import { useDraggable } from '@dnd-kit/core';
import { Trash2, Move, Settings } from 'lucide-react';
import { ComponentRenderer } from './ComponentRenderer';

interface ComponentWrapperProps {
  component: BuilderComponent;
  onMove?: (componentId: string, newPosition: { x: number; y: number }) => void;
}

export function ComponentWrapper({ component, onMove }: ComponentWrapperProps) {
  const { selectedId, selectComponent, deleteComponent, updateComponent } = useBuilderStore();
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState(component.position);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const isSelected = selectedId === component.id;
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPosition(component.position);
  }, [component.position]);

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only start drag if we're not clicking on a resize handle or toolbar button (unless it's the drag handle)
    const target = e.target as HTMLElement;
    const isDragHandle = target.closest('.drag-handle');
    if (!isDragHandle && (target.closest('button') || target.classList.contains('resize-handle'))) return;
    
    setIsDragging(true);
    const rect = wrapperRef.current?.getBoundingClientRect();
    const parentRect = wrapperRef.current?.offsetParent?.getBoundingClientRect();
    
    if (rect && parentRect) {
      setDragStart({
        x: e.clientX - (rect.left - parentRect.left),
        y: e.clientY - (rect.top - parentRect.top)
      });
    }
    
    selectComponent(component.id);
    e.preventDefault();
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const parentRect = wrapperRef.current?.offsetParent?.getBoundingClientRect();
      if (!parentRect) return;

      const newX = e.clientX - parentRect.left - dragStart.x;
      const newY = e.clientY - parentRect.top - dragStart.y;
      
      // Use transform for smooth visual feedback
      setDragOffset({ x: newX - position.x, y: newY - position.y });
    };

    const handleMouseUp = () => {
      // Apply the final position
      const parentRect = wrapperRef.current?.offsetParent?.getBoundingClientRect();
      if (parentRect) {
        const finalX = Math.max(0, position.x + dragOffset.x);
        const finalY = Math.max(0, position.y + dragOffset.y);
        
        setPosition({ x: finalX, y: finalY });
        updateComponent(component.id, { position: { x: finalX, y: finalY } });
      }
      
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, position, dragOffset, component.id, updateComponent]);

  const handleResize = (e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = parseInt(component.size.width) || 200;
    const startHeight = parseInt(component.size.height) || 100;
    const startLeft = position.x;
    const startTop = position.y;

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;
      
      let newWidth = startWidth;
      let newHeight = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;

      // Handle horizontal resizing
      if (direction.includes('right')) {
        newWidth = startWidth + deltaX;
      } else if (direction.includes('left')) {
        newWidth = startWidth - deltaX;
        newLeft = startLeft + deltaX;
      }

      // Handle vertical resizing
      if (direction.includes('bottom')) {
        newHeight = startHeight + deltaY;
      } else if (direction.includes('top')) {
        newHeight = startHeight - deltaY;
        newTop = startTop + deltaY;
      }

      // Update immediately for smooth resizing
      updateComponent(component.id, {
        size: {
          width: `${Math.max(50, newWidth)}px`,
          height: `${Math.max(50, newHeight)}px`,
        },
        position: {
          x: Math.max(0, newLeft),
          y: Math.max(0, newTop)
        }
      });
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const style = {
    position: 'absolute' as const,
    left: position.x,
    top: position.y,
    width: component.size.width,
    height: component.size.height,
    cursor: isDragging ? 'grabbing' : isHovered ? 'grab' : 'default',
    willChange: isDragging ? 'transform' : 'auto',
    transform: isDragging ? `translate(${dragOffset.x}px, ${dragOffset.y}px)` : 'none',
    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
  };

  // Check if this is a background component
  const backgroundTypes = [
    'aurora', 'waves', 'grid', 'particles', 'dot-grid', 'balatro', 'ballpit',
    'beams', 'dark-veil', 'dither', 'grid-distortion', 'grid-motion', 'hyperspeed',
    'iridescence', 'letter-glitch', 'lightning', 'liquid-chrome', 'orb',
    'ripple-grid', 'silk', 'squares', 'threads'
  ];
  const isBackground = backgroundTypes.includes(component.type);

  return (
    <div
      ref={wrapperRef}
      style={style}
      className={cn(
        'group relative transition-all',
        isSelected && 'ring-2 ring-primary shadow-lg z-10',
        isHovered && !isSelected && 'ring-1 ring-border/50',
        isDragging && 'opacity-90',
        isBackground && 'overflow-hidden'
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectComponent(component.id);
      }}
      onMouseDown={handleMouseDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Component Toolbar - Always show for selected/hovered including backgrounds */}
      {(isSelected || isHovered) && (
        <div className="absolute -top-10 left-0 flex items-center gap-1 bg-surface rounded-md shadow-lg border border-border px-2 py-1 z-[100]">
          <div 
            className="drag-handle p-1.5 text-xs text-text-muted cursor-move hover:bg-surface-hover rounded transition-colors"
            onMouseDown={(e) => {
              e.stopPropagation();
              handleMouseDown(e);
            }}
            title="Drag"
          >
            <Move className="w-3.5 h-3.5" />
          </div>
          <button
            className="p-1.5 hover:bg-surface-hover rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              // Open properties panel
            }}
            title="Properties"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
          <button
            className="p-1.5 hover:bg-error/20 text-error rounded transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              deleteComponent(component.id);
            }}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Resize Handles */}
      {isSelected && (
        <>
          {/* Corner handles */}
          <div
            className="resize-handle absolute -right-2 -top-2 w-4 h-4 bg-primary rounded-full cursor-nwse-resize border-2 border-white shadow-sm z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleResize(e, 'top-right')}
          />
          <div
            className="resize-handle absolute -left-2 -top-2 w-4 h-4 bg-primary rounded-full cursor-nesw-resize border-2 border-white shadow-sm z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleResize(e, 'top-left')}
          />
          <div
            className="resize-handle absolute -right-2 -bottom-2 w-4 h-4 bg-primary rounded-full cursor-nesw-resize border-2 border-white shadow-sm z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleResize(e, 'bottom-right')}
          />
          <div
            className="resize-handle absolute -left-2 -bottom-2 w-4 h-4 bg-primary rounded-full cursor-nwse-resize border-2 border-white shadow-sm z-50 hover:scale-125 transition-transform"
            onMouseDown={(e) => handleResize(e, 'bottom-left')}
          />
          
          {/* Edge handles */}
          <div
            className="resize-handle absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-primary rounded cursor-ew-resize border-2 border-white shadow-sm z-50 hover:scale-110 transition-transform"
            onMouseDown={(e) => handleResize(e, 'right')}
          />
          <div
            className="resize-handle absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-8 bg-primary rounded cursor-ew-resize border-2 border-white shadow-sm z-50 hover:scale-110 transition-transform"
            onMouseDown={(e) => handleResize(e, 'left')}
          />
          <div
            className="resize-handle absolute left-1/2 -bottom-2 -translate-x-1/2 w-8 h-4 bg-primary rounded cursor-ns-resize border-2 border-white shadow-sm z-50 hover:scale-110 transition-transform"
            onMouseDown={(e) => handleResize(e, 'bottom')}
          />
          <div
            className="resize-handle absolute left-1/2 -top-2 -translate-x-1/2 w-8 h-4 bg-primary rounded cursor-ns-resize border-2 border-white shadow-sm z-50 hover:scale-110 transition-transform"
            onMouseDown={(e) => handleResize(e, 'top')}
          />
        </>
      )}

      {/* Selection Outline */}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-primary pointer-events-none rounded-sm" />
      )}

      {/* Drag Overlay - shows when hovering to indicate draggable area */}
      {isHovered && !isSelected && !isDragging && (
        <div className="absolute inset-0 bg-primary/5 pointer-events-none rounded-sm" />
      )}

      {/* Component Content */}
      <ComponentRenderer component={component} />
    </div>
  );
}