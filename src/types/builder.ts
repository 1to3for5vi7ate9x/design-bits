export interface BuilderComponent {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  position: { x: number; y: number };
  size: { width: string; height: string };
  children?: BuilderComponent[];
  parentId?: string;
  order: number;
}

export type ComponentType = 
  | 'aurora'
  | 'waves'
  | 'grid'
  | 'rolling-text'
  | 'split-text'
  | 'magic-bento'
  | 'spotlight-card'
  | 'click-spark'
  | 'bounce';

export interface BuilderState {
  components: BuilderComponent[];
  selectedId: string | null;
  history: BuilderComponent[][];
  historyIndex: number;
  activeBreakpoint: Breakpoint;
  isDragging: boolean;
}

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

export interface ComponentDefinition {
  type: ComponentType;
  name: string;
  category: 'backgrounds' | 'text' | 'components' | 'animations';
  icon: string;
  defaultProps: Record<string, any>;
  configSchema: ConfigSchema[];
}

export interface ConfigSchema {
  key: string;
  label: string;
  type: 'string' | 'number' | 'boolean' | 'color' | 'select';
  options?: { value: string; label: string }[];
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
}

export interface Project {
  id: string;
  name: string;
  userId: string;
  components: BuilderComponent[];
  settings: ProjectSettings;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectSettings {
  globalStyles?: {
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  seo?: {
    title: string;
    description: string;
    ogImage?: string;
  };
}