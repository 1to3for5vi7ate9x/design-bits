import { BuilderComponent } from '@/types/builder';

export function generateReactCode(components: BuilderComponent[], format: 'react' | 'nextjs'): string {
  const imports = generateImports(components, format);
  const componentCode = generateComponentCode(components);
  const mainComponent = generateMainComponent(componentCode, format);

  return `${imports}\n\n${mainComponent}`;
}

function generateImports(components: BuilderComponent[], format: 'react' | 'nextjs'): string {
  const imports: string[] = [];
  
  if (format === 'react') {
    imports.push("import React from 'react';");
  }

  // Group components by type
  const componentTypes = new Set(components.map(c => c.type));
  const importGroups: Record<string, string[]> = {
    backgrounds: [],
    text: [],
    components: [],
    animations: [],
  };

  componentTypes.forEach(type => {
    const componentName = getComponentName(type);
    const category = getComponentCategory(type);
    if (category && importGroups[category]) {
      importGroups[category].push(componentName);
    }
  });

  // Generate import statements
  Object.entries(importGroups).forEach(([category, components]) => {
    if (components.length > 0) {
      imports.push(`// ${category.charAt(0).toUpperCase() + category.slice(1)}`);
      components.forEach(component => {
        imports.push(`import { ${component} } from '@/components/reactbits/${category}/${component}';`);
      });
    }
  });

  imports.push(`\n// Utilities\nimport { cn } from '@/lib/utils/cn';`);

  return imports.join('\n');
}

function generateComponentCode(components: BuilderComponent[]): string {
  return components.map(component => {
    const componentName = getComponentName(component.type);
    const props = generatePropsString(component.props);
    const style = generateStyleString(component);
    
    return `        <div
          key="${component.id}"
          style={{
            position: 'absolute',
            left: ${component.position.x},
            top: ${component.position.y},
            width: '${component.size.width}',
            height: '${component.size.height}',
          }}
        >
          <${componentName}${props ? ' ' + props : ''} />
        </div>`;
  }).join('\n');
}

function generateMainComponent(componentCode: string, format: 'react' | 'nextjs'): string {
  const exportStatement = format === 'nextjs' ? 'export default' : 'export';
  
  return `${exportStatement} function LandingPage() {
  return (
    <div className="relative min-h-screen bg-white">
${componentCode}
    </div>
  );
}`;
}

function getComponentName(type: string): string {
  const nameMap: Record<string, string> = {
    'aurora': 'Aurora',
    'waves': 'Waves',
    'grid': 'Grid',
    'rolling-text': 'RollingText',
    'split-text': 'SplitText',
    'magic-bento': 'MagicBento',
    'spotlight-card': 'SpotlightCard',
    'click-spark': 'ClickSpark',
    'bounce': 'Bounce',
  };
  return nameMap[type] || type;
}

function getComponentCategory(type: string): string {
  const categoryMap: Record<string, string> = {
    'aurora': 'backgrounds',
    'waves': 'backgrounds',
    'grid': 'backgrounds',
    'rolling-text': 'text',
    'split-text': 'text',
    'magic-bento': 'components',
    'spotlight-card': 'components',
    'click-spark': 'animations',
    'bounce': 'animations',
  };
  return categoryMap[type] || '';
}

function generatePropsString(props: Record<string, any>): string {
  const propsArray = Object.entries(props).map(([key, value]) => {
    if (typeof value === 'string') {
      return `${key}="${value}"`;
    } else if (typeof value === 'boolean') {
      return value ? key : `${key}={false}`;
    } else if (Array.isArray(value)) {
      return `${key}={${JSON.stringify(value)}}`;
    } else {
      return `${key}={${value}}`;
    }
  });
  
  return propsArray.join(' ');
}

function generateStyleString(component: BuilderComponent): string {
  const style: Record<string, any> = {
    position: 'absolute',
    left: component.position.x,
    top: component.position.y,
    width: component.size.width,
    height: component.size.height,
  };
  
  return JSON.stringify(style, null, 2)
    .replace(/"([^"]+)":/g, '$1:')
    .replace(/"/g, "'");
}