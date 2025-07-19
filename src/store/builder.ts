import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { BuilderComponent, BuilderState, Breakpoint } from '@/types/builder';

interface BuilderStore extends BuilderState {
  addComponent: (component: Omit<BuilderComponent, 'id' | 'order'>) => void;
  updateComponent: (id: string, updates: Partial<BuilderComponent>) => void;
  deleteComponent: (id: string) => void;
  selectComponent: (id: string | null) => void;
  moveComponent: (id: string, newPosition: { x: number; y: number }) => void;
  resizeComponent: (id: string, newSize: { width: string; height: string }) => void;
  reorderComponents: (components: BuilderComponent[]) => void;
  setActiveBreakpoint: (breakpoint: Breakpoint) => void;
  setIsDragging: (isDragging: boolean) => void;
  undo: () => void;
  redo: () => void;
  saveToHistory: () => void;
  loadProject: (components: BuilderComponent[]) => void;
  clearCanvas: () => void;
}

export const useBuilderStore = create<BuilderStore>()(
  devtools((set, get) => ({
    components: [],
    selectedId: null,
    history: [[]],
    historyIndex: 0,
    activeBreakpoint: 'desktop',
    isDragging: false,

    addComponent: (component) => {
      const id = `component-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const currentComponents = get().components;
      const order = currentComponents.length;
      
      const newComponent: BuilderComponent = {
        ...component,
        id,
        order,
      };

      set((state) => ({
        components: [...state.components, newComponent],
        selectedId: id,
      }));
      
      get().saveToHistory();
    },

    updateComponent: (id, updates) => {
      set((state) => ({
        components: state.components.map((comp) =>
          comp.id === id ? { ...comp, ...updates } : comp
        ),
      }));
      get().saveToHistory();
    },

    deleteComponent: (id) => {
      set((state) => ({
        components: state.components.filter((comp) => comp.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId,
      }));
      get().saveToHistory();
    },

    selectComponent: (id) => {
      set({ selectedId: id });
    },

    moveComponent: (id, newPosition) => {
      set((state) => ({
        components: state.components.map((comp) =>
          comp.id === id ? { ...comp, position: newPosition } : comp
        ),
      }));
    },

    resizeComponent: (id, newSize) => {
      set((state) => ({
        components: state.components.map((comp) =>
          comp.id === id ? { ...comp, size: newSize } : comp
        ),
      }));
      get().saveToHistory();
    },

    reorderComponents: (components) => {
      set({ components });
      get().saveToHistory();
    },

    setActiveBreakpoint: (breakpoint) => {
      set({ activeBreakpoint: breakpoint });
    },

    setIsDragging: (isDragging) => {
      set({ isDragging });
    },

    saveToHistory: () => {
      const currentComponents = get().components;
      const currentHistory = get().history;
      const currentIndex = get().historyIndex;
      
      const newHistory = currentHistory.slice(0, currentIndex + 1);
      newHistory.push([...currentComponents]);
      
      set({
        history: newHistory,
        historyIndex: newHistory.length - 1,
      });
    },

    undo: () => {
      const { history, historyIndex } = get();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        set({
          components: [...history[newIndex]],
          historyIndex: newIndex,
        });
      }
    },

    redo: () => {
      const { history, historyIndex } = get();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        set({
          components: [...history[newIndex]],
          historyIndex: newIndex,
        });
      }
    },

    loadProject: (components) => {
      set({
        components,
        selectedId: null,
        history: [[...components]],
        historyIndex: 0,
      });
    },

    clearCanvas: () => {
      set({
        components: [],
        selectedId: null,
      });
      get().saveToHistory();
    },
  }))
);