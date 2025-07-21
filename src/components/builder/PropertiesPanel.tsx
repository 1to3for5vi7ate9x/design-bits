'use client';

import { useBuilderStore } from '@/store/builder';
import { getComponentDefinition } from '@/lib/components/all-definitions';
import { X, Type, Palette } from 'lucide-react';

export function PropertiesPanel() {
  const { selectedId, components, updateComponent, selectComponent } = useBuilderStore();
  
  const selectedComponent = components.find((c) => c.id === selectedId);
  const definition = selectedComponent ? getComponentDefinition(selectedComponent.type) : null;

  if (!selectedComponent || !definition) {
    return (
      <div className="w-80 bg-surface border-l border-border p-4">
        <div className="text-center text-text-muted mt-8">
          <p className="text-sm">Select a component to edit its properties</p>
        </div>
      </div>
    );
  }

  const handlePropChange = (key: string, value: any) => {
    updateComponent(selectedComponent.id, {
      props: {
        ...selectedComponent.props,
        [key]: value,
      },
    });
  };

  // Check if this is a text component
  const isTextComponent = definition.category === 'text';

  return (
    <div className="w-80 bg-surface border-l border-border flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold">{definition.name}</h3>
        <button
          onClick={() => selectComponent(null)}
          className="p-1 hover:bg-surface-hover rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Text Styling (for text components) */}
          {isTextComponent && (
            <div>
              <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
                <Type className="w-4 h-4" />
                Text Styling
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-text-muted">Font Size</label>
                  <select
                    value={selectedComponent.props.fontSize || '16px'}
                    onChange={(e) => handlePropChange('fontSize', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded text-sm"
                  >
                    <option value="12px">Small (12px)</option>
                    <option value="14px">Normal (14px)</option>
                    <option value="16px">Medium (16px)</option>
                    <option value="20px">Large (20px)</option>
                    <option value="24px">X-Large (24px)</option>
                    <option value="32px">2X-Large (32px)</option>
                    <option value="48px">3X-Large (48px)</option>
                    <option value="64px">4X-Large (64px)</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-text-muted">Font Family</label>
                  <select
                    value={selectedComponent.props.fontFamily || 'sans-serif'}
                    onChange={(e) => handlePropChange('fontFamily', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded text-sm"
                  >
                    <option value="sans-serif">Sans Serif</option>
                    <option value="serif">Serif</option>
                    <option value="monospace">Monospace</option>
                    <option value="Inter, sans-serif">Inter</option>
                    <option value="Roboto, sans-serif">Roboto</option>
                    <option value="Poppins, sans-serif">Poppins</option>
                  </select>
                </div>
                
                <div>
                  <label className="text-xs text-text-muted">Text Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={selectedComponent.props.color || '#000000'}
                      onChange={(e) => handlePropChange('color', e.target.value)}
                      className="w-12 h-8 border border-border rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={selectedComponent.props.color || '#000000'}
                      onChange={(e) => handlePropChange('color', e.target.value)}
                      className="flex-1 px-2 py-1 border border-border rounded text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="text-xs text-text-muted">Font Weight</label>
                  <select
                    value={selectedComponent.props.fontWeight || 'normal'}
                    onChange={(e) => handlePropChange('fontWeight', e.target.value)}
                    className="w-full px-2 py-1 border border-border rounded text-sm"
                  >
                    <option value="normal">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                    <option value="800">Extra Bold</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Size Controls */}
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-2">Dimensions</h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-text-muted">Width</label>
                <input
                  type="text"
                  value={selectedComponent.size.width}
                  onChange={(e) =>
                    updateComponent(selectedComponent.id, {
                      size: {
                        ...selectedComponent.size,
                        width: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2 py-1 border border-border rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted">Height</label>
                <input
                  type="text"
                  value={selectedComponent.size.height}
                  onChange={(e) =>
                    updateComponent(selectedComponent.id, {
                      size: {
                        ...selectedComponent.size,
                        height: e.target.value,
                      },
                    })
                  }
                  className="w-full px-2 py-1 border border-border rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Component-Specific Properties */}
          <div>
            <h4 className="text-sm font-medium text-text-secondary mb-2 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Component Properties
            </h4>
            <div className="space-y-3">
              {definition.configSchema.map((config) => (
                <div key={config.key}>
                  <label className="text-xs text-text-muted">{config.label}</label>
                  
                  {config.type === 'string' && (
                    <input
                      type="text"
                      value={selectedComponent.props[config.key] || config.defaultValue}
                      onChange={(e) => {
                        // Special handling for array properties
                        if ((config.key === 'texts' && selectedComponent.type === 'rolling-text') ||
                            (config.key === 'text' && selectedComponent.type === 'text-type') ||
                            (config.key === 'words' && selectedComponent.type === 'rotating-text')) {
                          const textsArray = e.target.value.split(',').map(t => t.trim());
                          handlePropChange(config.key, textsArray);
                        } else {
                          handlePropChange(config.key, e.target.value);
                        }
                      }}
                      className="w-full px-2 py-1 border border-border rounded text-sm"
                    />
                  )}
                  
                  {config.type === 'number' && (
                    <input
                      type="number"
                      value={selectedComponent.props[config.key] || config.defaultValue}
                      onChange={(e) => handlePropChange(config.key, parseFloat(e.target.value))}
                      min={config.min}
                      max={config.max}
                      step={config.step}
                      className="w-full px-2 py-1 border border-border rounded text-sm"
                    />
                  )}
                  
                  {config.type === 'boolean' && (
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedComponent.props[config.key] ?? config.defaultValue}
                        onChange={(e) => handlePropChange(config.key, e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm">Enable</span>
                    </label>
                  )}
                  
                  {config.type === 'color' && (
                    <>
                      {/* Handle color arrays */}
                      {Array.isArray(config.defaultValue) ? (
                        <div className="space-y-2">
                          {(selectedComponent.props[config.key] || config.defaultValue).map((color: string, index: number) => (
                            <div key={index} className="flex gap-2 items-center">
                              <span className="text-xs text-text-muted w-12">{index + 1}:</span>
                              <input
                                type="color"
                                value={color}
                                onChange={(e) => {
                                  const colors = [...(selectedComponent.props[config.key] || config.defaultValue)];
                                  colors[index] = e.target.value;
                                  handlePropChange(config.key, colors);
                                }}
                                className="w-12 h-8 border border-border rounded cursor-pointer"
                              />
                              <input
                                type="text"
                                value={color}
                                onChange={(e) => {
                                  const colors = [...(selectedComponent.props[config.key] || config.defaultValue)];
                                  colors[index] = e.target.value;
                                  handlePropChange(config.key, colors);
                                }}
                                className="flex-1 px-2 py-1 border border-border rounded text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Handle single colors */
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={selectedComponent.props[config.key] || config.defaultValue}
                            onChange={(e) => handlePropChange(config.key, e.target.value)}
                            className="w-12 h-8 border border-border rounded cursor-pointer"
                          />
                          <input
                            type="text"
                            value={selectedComponent.props[config.key] || config.defaultValue}
                            onChange={(e) => handlePropChange(config.key, e.target.value)}
                            className="flex-1 px-2 py-1 border border-border rounded text-sm"
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  {config.type === 'select' && config.options && (
                    <select
                      value={selectedComponent.props[config.key] || config.defaultValue}
                      onChange={(e) => handlePropChange(config.key, e.target.value)}
                      className="w-full px-2 py-1 border border-border rounded text-sm"
                    >
                      {config.options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}