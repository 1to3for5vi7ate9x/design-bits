'use client';

import { useState } from 'react';
import { useBuilderStore } from '@/store/builder';
import { X, Copy, Download, Code2 } from 'lucide-react';
import { generateReactCode } from '@/lib/export/codeGenerator';
import { cn } from '@/lib/utils/cn';
import MonacoEditor from '@monaco-editor/react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const { components } = useBuilderStore();
  const [exportFormat, setExportFormat] = useState<'react' | 'nextjs'>('react');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const code = generateReactCode(components, exportFormat);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `landing-page.${exportFormat === 'react' ? 'jsx' : 'tsx'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center p-4">
      <div className="bg-surface rounded-lg w-full h-full max-w-[90vw] max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Code2 className="w-5 h-5" />
              Export Code
            </h2>
            
            {/* Format Selector */}
            <div className="flex items-center gap-2 bg-surface-hover rounded-lg p-1">
              <button
                onClick={() => setExportFormat('react')}
                className={cn(
                  'px-3 py-1 rounded text-sm transition-colors',
                  exportFormat === 'react'
                    ? 'bg-surface shadow-sm'
                    : 'hover:bg-surface-hover'
                )}
              >
                React
              </button>
              <button
                onClick={() => setExportFormat('nextjs')}
                className={cn(
                  'px-3 py-1 rounded text-sm transition-colors',
                  exportFormat === 'nextjs'
                    ? 'bg-surface shadow-sm'
                    : 'hover:bg-surface-hover'
                )}
              >
                Next.js
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 bg-surface-hover rounded-lg hover:bg-surface-hover transition-colors"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy'}
            </button>
            
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
            
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-hover rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 overflow-hidden">
          <MonacoEditor
            height="100%"
            language={exportFormat === 'react' ? 'javascript' : 'typescript'}
            theme="vs-dark"
            value={code}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              wordWrap: 'on',
              automaticLayout: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}