'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/builder';
import { Save, Undo, Redo, Eye, Code, Smartphone, Tablet, Monitor } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { PreviewModal } from './PreviewModal';
import { ExportModal } from './ExportModal';

export function BuilderHeader() {
  const { 
    undo, 
    redo, 
    history, 
    historyIndex, 
    activeBreakpoint, 
    setActiveBreakpoint 
  } = useBuilderStore();
  
  const [projectName, setProjectName] = useState('Untitled Project');
  const [showPreview, setShowPreview] = useState(false);
  const [showExport, setShowExport] = useState(false);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const breakpoints = [
    { id: 'mobile', icon: Smartphone, label: 'Mobile' },
    { id: 'tablet', icon: Tablet, label: 'Tablet' },
    { id: 'desktop', icon: Monitor, label: 'Desktop' },
  ] as const;

  return (
    <header className="bg-surface border-b border-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-semibold text-text-primary">ReactBits Studio</h1>
          
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="px-3 py-1 bg-surface border border-border rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <div className="flex items-center gap-1 mr-4">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={cn(
                'p-2 rounded hover:bg-surface-hover text-text-secondary',
                !canUndo && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={cn(
                'p-2 rounded hover:bg-surface-hover text-text-secondary',
                !canRedo && 'opacity-50 cursor-not-allowed'
              )}
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Breakpoint Switcher */}
          <div className="flex items-center gap-1 bg-surface rounded-lg p-1 mr-4">
            {breakpoints.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveBreakpoint(id)}
                className={cn(
                  'p-2 rounded transition-colors',
                  activeBreakpoint === id
                    ? 'bg-primary text-white shadow-sm'
                    : 'hover:bg-surface-hover text-text-secondary'
                )}
                title={label}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>

          {/* Actions */}
          <button 
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface text-text-secondary rounded-lg hover:bg-surface-hover transition-colors"
          >
            <Eye className="w-4 h-4" />
            Preview
          </button>
          
          <button 
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-surface text-text-secondary rounded-lg hover:bg-surface-hover transition-colors"
          >
            <Code className="w-4 h-4" />
            Export
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors">
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
      
      <PreviewModal 
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
      />
      
      <ExportModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />
    </header>
  );
}