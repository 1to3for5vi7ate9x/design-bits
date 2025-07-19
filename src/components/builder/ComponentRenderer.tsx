'use client';

import dynamic from 'next/dynamic';
import { BuilderComponent } from '@/types/builder';
import { cn } from '@/lib/utils/cn';
import { useCanvasContext } from '@/lib/contexts/CanvasContext';

// Dynamically import ReactBits components
const componentMap = {
  // ===== TEXT ANIMATIONS =====
  'rolling-text': dynamic(() => import('@/components/reactbits/text/RollingText')),
  'split-text': dynamic(() => import('@/components/reactbits/text/SplitText')),
  'blur-text': dynamic(() => import('@/components/reactbits/text/BlurText')),
  'gradient-text': dynamic(() => import('@/components/reactbits/text/GradientText')),
  'glitch-text': dynamic(() => import('@/components/reactbits/text/GlitchText')),
  'scramble-text': dynamic(() => import('@/components/reactbits/text/ScrambleText')),
  'count-up': dynamic(() => import('@/components/reactbits/text/CountUp')),
  'shiny-text': dynamic(() => import('@/components/reactbits/text/ShinyText')),
  'circular-text': dynamic(() => import('@/components/reactbits/text/CircularText')),
  'falling-text': dynamic(() => import('@/components/reactbits/text/FallingText')),
  'fuzzy-text': dynamic(() => import('@/components/reactbits/text/FuzzyText')),
  'rotating-text': dynamic(() => import('@/components/reactbits/text/RotatingText')),
  'ascii-text': dynamic(() => import('@/components/reactbits/text/ASCIIText')),
  'curved-loop': dynamic(() => import('@/components/reactbits/text/CurvedLoop')),
  'decrypted-text': dynamic(() => import('@/components/reactbits/text/DecryptedText')),
  'scroll-float': dynamic(() => import('@/components/reactbits/text/ScrollFloat')),
  'scroll-reveal': dynamic(() => import('@/components/reactbits/text/ScrollReveal')),
  'scroll-velocity': dynamic(() => import('@/components/reactbits/text/ScrollVelocity')),
  'text-cursor': dynamic(() => import('@/components/reactbits/text/TextCursor')),
  'text-pressure': dynamic(() => import('@/components/reactbits/text/TextPressure')),
  'text-trail': dynamic(() => import('@/components/reactbits/text/TextTrail')),
  'true-focus': dynamic(() => import('@/components/reactbits/text/TrueFocus')),
  'variable-proximity': dynamic(() => import('@/components/reactbits/text/VariableProximity')),
  
  // ===== ANIMATIONS =====
  'click-spark': dynamic(() => import('@/components/reactbits/animations/ClickSpark')),
  'bounce': dynamic(() => import('@/components/reactbits/animations/Bounce')),
  'magnet': dynamic(() => import('@/components/reactbits/animations/Magnet')),
  'star-border': dynamic(() => import('@/components/reactbits/animations/StarBorder')),
  'animated-content': dynamic(() => import('@/components/reactbits/animations/AnimatedContent')),
  'blob-cursor': dynamic(() => import('@/components/reactbits/animations/BlobCursor')),
  'crosshair': dynamic(() => import('@/components/reactbits/animations/Crosshair')),
  'cubes': dynamic(() => import('@/components/reactbits/animations/Cubes')),
  'fade-content': dynamic(() => import('@/components/reactbits/animations/FadeContent')),
  'glare-hover': dynamic(() => import('@/components/reactbits/animations/GlareHover')),
  'image-trail': dynamic(() => import('@/components/reactbits/animations/ImageTrail')),
  'magnet-lines': dynamic(() => import('@/components/reactbits/animations/MagnetLines')),
  'meta-balls': dynamic(() => import('@/components/reactbits/animations/MetaBalls')),
  'metallic-paint': dynamic(() => import('@/components/reactbits/animations/MetallicPaint')),
  'noise': dynamic(() => import('@/components/reactbits/animations/Noise')),
  'pixel-trail': dynamic(() => import('@/components/reactbits/animations/PixelTrail')),
  'pixel-transition': dynamic(() => import('@/components/reactbits/animations/PixelTransition')),
  'ribbons': dynamic(() => import('@/components/reactbits/animations/Ribbons')),
  'shape-blur': dynamic(() => import('@/components/reactbits/animations/ShapeBlur')),
  'splash-cursor': dynamic(() => import('@/components/reactbits/animations/SplashCursor')),
  'target-cursor': dynamic(() => import('@/components/reactbits/animations/TargetCursor')),
  
  // ===== COMPONENTS =====
  'magic-bento': dynamic(() => import('@/components/reactbits/components/MagicBento')),
  'spotlight-card': dynamic(() => import('@/components/reactbits/components/SpotlightCard')),
  'dock': dynamic(() => import('@/components/reactbits/components/Dock')),
  'counter': dynamic(() => import('@/components/reactbits/components/Counter')),
  'stepper': dynamic(() => import('@/components/reactbits/components/Stepper')),
  'animated-list': dynamic(() => import('@/components/reactbits/components/AnimatedList')),
  'bounce-cards': dynamic(() => import('@/components/reactbits/components/BounceCards')),
  'card-swap': dynamic(() => import('@/components/reactbits/components/CardSwap')),
  'carousel': dynamic(() => import('@/components/reactbits/components/Carousel')),
  'chroma-grid': dynamic(() => import('@/components/reactbits/components/ChromaGrid')),
  'circular-gallery': dynamic(() => import('@/components/reactbits/components/CircularGallery')),
  'decay-card': dynamic(() => import('@/components/reactbits/components/DecayCard')),
  'elastic-slider': dynamic(() => import('@/components/reactbits/components/ElasticSlider')),
  'flowing-menu': dynamic(() => import('@/components/reactbits/components/FlowingMenu')),
  'fluid-glass': dynamic(() => import('@/components/reactbits/components/FluidGlass')),
  'flying-posters': dynamic(() => import('@/components/reactbits/components/FlyingPosters')),
  'folder': dynamic(() => import('@/components/reactbits/components/Folder')),
  'glass-icons': dynamic(() => import('@/components/reactbits/components/GlassIcons')),
  'glass-surface': dynamic(() => import('@/components/reactbits/components/GlassSurface')),
  'gooey-nav': dynamic(() => import('@/components/reactbits/components/GooeyNav')),
  'infinite-menu': dynamic(() => import('@/components/reactbits/components/InfiniteMenu')),
  'infinite-scroll': dynamic(() => import('@/components/reactbits/components/InfiniteScroll')),
  'lanyard': dynamic(() => import('@/components/reactbits/components/Lanyard')),
  'masonry': dynamic(() => import('@/components/reactbits/components/Masonry')),
  'model-viewer': dynamic(() => import('@/components/reactbits/components/ModelViewer')),
  'pixel-card': dynamic(() => import('@/components/reactbits/components/PixelCard')),
  'rolling-gallery': dynamic(() => import('@/components/reactbits/components/RollingGallery')),
  'scroll-stack': dynamic(() => import('@/components/reactbits/components/ScrollStack')),
  'stack': dynamic(() => import('@/components/reactbits/components/Stack')),
  'tilted-card': dynamic(() => import('@/components/reactbits/components/TiltedCard')),
  
  // ===== BACKGROUNDS =====
  'aurora': dynamic(() => import('@/components/reactbits/backgrounds/Aurora')),
  'waves': dynamic(() => import('@/components/reactbits/backgrounds/Waves')),
  'grid': dynamic(() => import('@/components/reactbits/backgrounds/Grid')),
  'particles': dynamic(() => import('@/components/reactbits/backgrounds/Particles')),
  'dot-grid': dynamic(() => import('@/components/reactbits/backgrounds/DotGrid')),
  'balatro': dynamic(() => import('@/components/reactbits/backgrounds/Balatro')),
  'ballpit': dynamic(() => import('@/components/reactbits/backgrounds/Ballpit')),
  'beams': dynamic(() => import('@/components/reactbits/backgrounds/Beams')),
  'dark-veil': dynamic(() => import('@/components/reactbits/backgrounds/DarkVeil')),
  'dither': dynamic(() => import('@/components/reactbits/backgrounds/Dither')),
  'grid-distortion': dynamic(() => import('@/components/reactbits/backgrounds/GridDistortion')),
  'grid-motion': dynamic(() => import('@/components/reactbits/backgrounds/GridMotion')),
  'hyperspeed': dynamic(() => import('@/components/reactbits/backgrounds/Hyperspeed')),
  'iridescence': dynamic(() => import('@/components/reactbits/backgrounds/Iridescence')),
  'letter-glitch': dynamic(() => import('@/components/reactbits/backgrounds/LetterGlitch')),
  'lightning': dynamic(() => import('@/components/reactbits/backgrounds/Lightning')),
  'liquid-chrome': dynamic(() => import('@/components/reactbits/backgrounds/LiquidChrome')),
  'orb': dynamic(() => import('@/components/reactbits/backgrounds/Orb')),
  'ripple-grid': dynamic(() => import('@/components/reactbits/backgrounds/RippleGrid')),
  'silk': dynamic(() => import('@/components/reactbits/backgrounds/Silk')),
  'squares': dynamic(() => import('@/components/reactbits/backgrounds/Squares')),
  'threads': dynamic(() => import('@/components/reactbits/backgrounds/Threads')),
};

interface ComponentRendererProps {
  component: BuilderComponent;
  isPreview?: boolean;
}

export function ComponentRenderer({ component, isPreview = false }: ComponentRendererProps) {
  const Component = componentMap[component.type as keyof typeof componentMap];
  
  // Get canvas context for components that need containerRef
  let canvasContext;
  try {
    canvasContext = useCanvasContext();
  } catch (e) {
    // In preview mode or outside canvas, containerRef won't be available
    canvasContext = null;
  }
  
  if (!Component) {
    return (
      <div className="w-full h-full bg-error/10 border-2 border-error/30 rounded-lg flex items-center justify-center text-error p-4">
        <div className="text-center">
          <p className="font-semibold">Component Not Found</p>
          <p className="text-sm">"{component.type}"</p>
        </div>
      </div>
    );
  }

  // Check if this is a background component
  const backgroundTypes = [
    'aurora', 'waves', 'grid', 'particles', 'dot-grid', 'balatro', 'ballpit',
    'beams', 'dark-veil', 'dither', 'grid-distortion', 'grid-motion', 'hyperspeed',
    'iridescence', 'letter-glitch', 'lightning', 'liquid-chrome', 'orb',
    'ripple-grid', 'silk', 'squares', 'threads'
  ];
  const isBackground = backgroundTypes.includes(component.type);
  
  // Add text styling props if it's a text component
  const componentProps = {
    ...component.props,
  };

  // Apply text styling for text components
  if (!isBackground) {
    const style: React.CSSProperties = {};
    if (component.props.fontSize) style.fontSize = component.props.fontSize;
    if (component.props.fontFamily) style.fontFamily = component.props.fontFamily;
    if (component.props.color) style.color = component.props.color;
    if (component.props.fontWeight) style.fontWeight = component.props.fontWeight;
    
    componentProps.style = { ...componentProps.style, ...style };
  }
  
  // Add containerRef for components that need it
  if (component.type === 'variable-proximity' && canvasContext) {
    componentProps.containerRef = canvasContext.containerRef;
  }

  return (
    <div className={cn(
      'w-full h-full',
      isBackground && 'relative overflow-hidden'
    )}>
      <Component 
        {...componentProps}
        className={cn(
          component.props.className,
          isBackground && 'absolute inset-0'
        )}
      />
    </div>
  );
}