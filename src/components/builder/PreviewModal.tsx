'use client';

import { useBuilderStore } from '@/store/builder';
import { X, Monitor, Tablet, Smartphone } from 'lucide-react';
import { ComponentRenderer } from './ComponentRenderer';
import { cn } from '@/lib/utils/cn';
import { useState } from 'react';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const { components } = useBuilderStore();
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  if (!isOpen) return null;

  const getPreviewSize = () => {
    switch (previewMode) {
      case 'mobile':
        return 'max-w-sm';
      case 'tablet':
        return 'max-w-2xl';
      case 'desktop':
        return 'max-w-7xl';
    }
  };

  const devices = [
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
    { id: 'tablet', icon: Tablet, label: 'Tablet' },
    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg w-full h-full max-w-[95vw] max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            
            {/* Device Selector */}
            <div className="flex items-center gap-1 bg-surface-hover rounded-lg p-1">
              {devices.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => setPreviewMode(id as typeof previewMode)}
                  className={cn(
                    'p-2 rounded transition-colors',
                    previewMode === id
                      ? 'bg-surface shadow-sm'
                      : 'hover:bg-surface-hover'
                  )}
                  title={label}
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-background overflow-auto p-8">
          <div
            className={cn(
              'mx-auto bg-surface rounded-lg shadow-lg transition-all duration-300',
              'min-h-[600px] relative',
              getPreviewSize()
            )}
          >
            {components.map((component) => (
              <div
                key={component.id}
                style={{
                  position: 'absolute',
                  left: component.position.x,
                  top: component.position.y,
                  width: component.size.width,
                  height: component.size.height,
                }}
              >
                <ComponentRenderer component={component} isPreview />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}