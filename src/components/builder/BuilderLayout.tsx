'use client';

import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from '@dnd-kit/core';
import { useState } from 'react';
import { ComponentLibrary } from './ComponentLibrary';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { BuilderHeader } from './BuilderHeader';
import { useBuilderStore } from '@/store/builder';
import { getComponentDefinition, getDefaultSize } from '@/lib/components/all-definitions';

export function BuilderLayout() {
  const { addComponent, moveComponent, reorderComponents } = useBuilderStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    // Check if this is a new component from the library
    if (active.data.current?.isNew) {
      const definition = getComponentDefinition(active.data.current.type);
      if (!definition) return;

      // Add new component to canvas
      const defaultSize = getDefaultSize(definition.type);
      addComponent({
        type: definition.type,
        props: definition.defaultProps,
        position: { x: 50, y: 50 },
        size: defaultSize,
      });
    } else {
      // Moving existing component
      if (active.id !== over.id) {
        // Handle reordering if needed
      }
    }

    setActiveId(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen flex flex-col bg-background">
        <BuilderHeader />
        
        <div className="flex-1 flex overflow-hidden">
          <ComponentLibrary />
          <Canvas />
          <PropertiesPanel />
        </div>
      </div>

      <DragOverlay>
        {activeId ? (
          <div className="bg-blue-100 border-2 border-blue-400 rounded p-4 opacity-80">
            <p className="text-sm font-medium">Dragging component</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}