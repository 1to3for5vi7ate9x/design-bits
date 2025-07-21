'use client';

import { useState } from 'react';
import { componentDefinitions } from '@/lib/components/definitions';
import { cn } from '@/lib/utils/cn';
import { Search, Sparkles, Type, LayoutGrid, Zap } from 'lucide-react';
import { useDraggable } from '@dnd-kit/core';
import { useBuilderStore } from '@/store/builder';
import { getDefaultSize } from '@/lib/components/definitions';

const categoryIcons = {
  backgrounds: Sparkles,
  text: Type,
  components: LayoutGrid,
  animations: Zap,
};

function DraggableComponent({ definition }: { definition: typeof componentDefinitions[0] }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `library-${definition.type}`,
    data: {
      type: definition.type,
      isNew: true,
    },
  });
  
  const { addComponent } = useBuilderStore();

  const Icon = categoryIcons[definition.category];
  
  const handleDoubleClick = () => {
    // Add component to canvas at center position
    const canvasElement = document.querySelector('[data-canvas]') || document.querySelector('.flex-1.bg-canvas');
    const canvasRect = canvasElement?.getBoundingClientRect();
    
    const centerX = canvasRect ? canvasRect.width / 2 - 100 : 400;
    const centerY = canvasRect ? canvasRect.height / 2 - 100 : 300;
    
    addComponent({
      type: definition.type,
      position: { x: centerX, y: centerY },
      size: getDefaultSize(definition.type),
      props: definition.defaultProps,
    });
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onDoubleClick={handleDoubleClick}
      className={cn(
        'p-3 bg-surface rounded-lg border border-border cursor-move transition-all',
        'hover:border-primary hover:shadow-sm',
        isDragging && 'opacity-50'
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-4 h-4 text-text-secondary" />
        <span className="text-xs text-text-secondary">{definition.category}</span>
      </div>
      <p className="text-sm font-medium">{definition.name}</p>
    </div>
  );
}

export function ComponentLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredComponents = componentDefinitions.filter((comp) => {
    const matchesSearch = comp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || comp.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['backgrounds', 'text', 'components', 'animations'];

  return (
    <div className="w-80 bg-surface border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-3">Components</h2>
        
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search components..."
            className="w-full pl-9 pr-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'px-3 py-1 text-sm rounded-full transition-colors',
              !selectedCategory
                ? 'bg-primary text-white'
                : 'bg-surface-hover text-text-secondary hover:bg-surface-hover'
            )}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={cn(
                'px-3 py-1 text-sm rounded-full capitalize transition-colors',
                selectedCategory === category
                  ? 'bg-primary text-white'
                  : 'bg-surface-hover text-text-secondary hover:bg-surface-hover'
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid gap-3">
          {filteredComponents.map((definition) => (
            <DraggableComponent key={definition.type} definition={definition} />
          ))}
        </div>
        
        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-text-muted">
            <p>No components found</p>
          </div>
        )}
      </div>
    </div>
  );
}