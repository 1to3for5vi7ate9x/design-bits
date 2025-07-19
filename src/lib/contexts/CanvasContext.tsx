'use client';

import { createContext, useContext, useRef, RefObject } from 'react';

interface CanvasContextType {
  containerRef: RefObject<HTMLDivElement>;
}

const CanvasContext = createContext<CanvasContextType | null>(null);

export function CanvasProvider({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <CanvasContext.Provider value={{ containerRef }}>
      <div ref={containerRef} className="relative w-full h-full">
        {children}
      </div>
    </CanvasContext.Provider>
  );
}

export function useCanvasContext() {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('useCanvasContext must be used within a CanvasProvider');
  }
  return context;
}