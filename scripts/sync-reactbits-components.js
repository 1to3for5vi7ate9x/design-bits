#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');

const REACTBITS_SOURCE = path.join(__dirname, '../react-bits/src/ts-tailwind');
const DESTINATION = path.join(__dirname, '../src/components/reactbits');

const CATEGORIES = {
  'TextAnimations': 'text',
  'Animations': 'animations',
  'Components': 'components',
  'Backgrounds': 'backgrounds'
};

const COMPONENT_METADATA = {
  // Text Animations
  'ASCIIText': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'BlurText': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'CircularText': { category: 'text', defaultWidth: 300, defaultHeight: 300 },
  'CountUp': { category: 'text', defaultWidth: 200, defaultHeight: 60 },
  'CurvedLoop': { category: 'text', defaultWidth: 600, defaultHeight: 400 },
  'DecryptedText': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'FallingText': { category: 'text', defaultWidth: 400, defaultHeight: 200 },
  'FuzzyText': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'GlitchText': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'GradientText': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'RollingText': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'RotatingText': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'ScrambleText': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'ScrollFloat': { category: 'text', defaultWidth: 400, defaultHeight: 300 },
  'ScrollReveal': { category: 'text', defaultWidth: 400, defaultHeight: 300 },
  'ScrollVelocity': { category: 'text', defaultWidth: 600, defaultHeight: 100 },
  'ShinyText': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'SplitText': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'TextCursor': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'TextPressure': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'TextTrail': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'TextType': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'TrueFocus': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  'VariableProximity': { category: 'text', defaultWidth: 400, defaultHeight: 100 },
  
  // Animations
  'AnimatedContent': { category: 'animations', defaultWidth: 400, defaultHeight: 300 },
  'BlobCursor': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'Bounce': { category: 'animations', defaultWidth: 400, defaultHeight: 400 },
  'ClickSpark': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'Crosshair': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'Cubes': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'FadeContent': { category: 'animations', defaultWidth: 400, defaultHeight: 300 },
  'GlareHover': { category: 'animations', defaultWidth: 300, defaultHeight: 300 },
  'ImageTrail': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'Magnet': { category: 'animations', defaultWidth: 200, defaultHeight: 60 },
  'MagnetLines': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'MetaBalls': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'MetallicPaint': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'Noise': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'PixelTrail': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'PixelTransition': { category: 'animations', defaultWidth: 400, defaultHeight: 300 },
  'Ribbons': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'ShapeBlur': { category: 'animations', defaultWidth: 300, defaultHeight: 300 },
  'SplashCursor': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  'StarBorder': { category: 'animations', defaultWidth: 300, defaultHeight: 300 },
  'TargetCursor': { category: 'animations', defaultWidth: 600, defaultHeight: 400 },
  
  // Components
  'AnimatedList': { category: 'components', defaultWidth: 400, defaultHeight: 400 },
  'BounceCards': { category: 'components', defaultWidth: 600, defaultHeight: 400 },
  'CardSwap': { category: 'components', defaultWidth: 400, defaultHeight: 500 },
  'Carousel': { category: 'components', defaultWidth: 600, defaultHeight: 400 },
  'ChromaGrid': { category: 'components', defaultWidth: 600, defaultHeight: 400 },
  'CircularGallery': { category: 'components', defaultWidth: 600, defaultHeight: 600 },
  'Counter': { category: 'components', defaultWidth: 200, defaultHeight: 100 },
  'DecayCard': { category: 'components', defaultWidth: 350, defaultHeight: 500 },
  'Dock': { category: 'components', defaultWidth: 400, defaultHeight: 100 },
  'ElasticSlider': { category: 'components', defaultWidth: 600, defaultHeight: 400 },
  'FlowingMenu': { category: 'components', defaultWidth: 600, defaultHeight: 80 },
  'FluidGlass': { category: 'components', defaultWidth: 350, defaultHeight: 450 },
  'FlyingPosters': { category: 'components', defaultWidth: 600, defaultHeight: 600 },
  'Folder': { category: 'components', defaultWidth: 300, defaultHeight: 300 },
  'GlassIcons': { category: 'components', defaultWidth: 400, defaultHeight: 100 },
  'GlassSurface': { category: 'components', defaultWidth: 400, defaultHeight: 300 },
  'GooeyNav': { category: 'components', defaultWidth: 500, defaultHeight: 100 },
  'InfiniteMenu': { category: 'components', defaultWidth: 600, defaultHeight: 300 },
  'InfiniteScroll': { category: 'components', defaultWidth: 600, defaultHeight: 400 },
  'MagicBento': { category: 'components', defaultWidth: 600, defaultHeight: 600 },
  'Masonry': { category: 'components', defaultWidth: 600, defaultHeight: 600 },
  'ModelViewer': { category: 'components', defaultWidth: 400, defaultHeight: 400 },
  'PixelCard': { category: 'components', defaultWidth: 350, defaultHeight: 450 },
  'RollingGallery': { category: 'components', defaultWidth: 600, defaultHeight: 400 },
  'ScrollStack': { category: 'components', defaultWidth: 400, defaultHeight: 600 },
  'SpotlightCard': { category: 'components', defaultWidth: 350, defaultHeight: 450 },
  'Stack': { category: 'components', defaultWidth: 400, defaultHeight: 600 },
  'Stepper': { category: 'components', defaultWidth: 400, defaultHeight: 300 },
  'TiltedCard': { category: 'components', defaultWidth: 350, defaultHeight: 450 },
  
  // Backgrounds
  'Aurora': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Balatro': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Ballpit': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Beams': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'DarkVeil': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Dither': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'DotGrid': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Galaxy': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Grid': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'GridDistortion': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'GridMotion': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Hyperspeed': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Iridescence': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'LetterGlitch': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Lightning': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'LiquidChrome': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Orb': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Particles': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'RippleGrid': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Silk': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Squares': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Threads': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 },
  'Waves': { category: 'backgrounds', defaultWidth: 800, defaultHeight: 600 }
};

async function copyFile(src, dest) {
  try {
    await fs.mkdir(path.dirname(dest), { recursive: true });
    await fs.copyFile(src, dest);
    console.log(`✓ Copied ${path.basename(src)} to ${path.relative(process.cwd(), dest)}`);
  } catch (error) {
    console.error(`✗ Failed to copy ${src}: ${error.message}`);
  }
}

async function syncComponent(componentName, sourceCategory) {
  const metadata = COMPONENT_METADATA[componentName];
  if (!metadata) {
    console.warn(`⚠ No metadata found for ${componentName}`);
    return;
  }

  const sourcePath = path.join(REACTBITS_SOURCE, sourceCategory, componentName);
  const destPath = path.join(DESTINATION, metadata.category);
  
  try {
    const files = await fs.readdir(sourcePath);
    
    for (const file of files) {
      const srcFile = path.join(sourcePath, file);
      const stats = await fs.stat(srcFile);
      
      if (stats.isFile()) {
        if (file.endsWith('.tsx') || file.endsWith('.ts')) {
          // For TypeScript files, rename to component name
          const destFile = file === 'HyperSpeedPresets.ts' 
            ? path.join(destPath, file)
            : path.join(destPath, `${componentName}.tsx`);
          await copyFile(srcFile, destFile);
        } else {
          // For assets (like .glb, .png), keep original filename
          const destFile = path.join(destPath, file);
          await copyFile(srcFile, destFile);
        }
      }
    }
  } catch (error) {
    console.error(`✗ Error syncing ${componentName}: ${error.message}`);
  }
}

async function syncAllComponents() {
  console.log('🔄 Starting ReactBits component sync...\n');
  
  for (const [sourceCategory, destCategory] of Object.entries(CATEGORIES)) {
    const sourcePath = path.join(REACTBITS_SOURCE, sourceCategory);
    
    try {
      const components = await fs.readdir(sourcePath);
      console.log(`\n📁 Syncing ${sourceCategory}...`);
      
      for (const component of components) {
        const componentPath = path.join(sourcePath, component);
        const stats = await fs.stat(componentPath);
        
        if (stats.isDirectory()) {
          await syncComponent(component, sourceCategory);
        }
      }
    } catch (error) {
      console.error(`✗ Error reading ${sourceCategory}: ${error.message}`);
    }
  }
  
  console.log('\n✅ Sync complete!');
  console.log('\n📝 Next steps:');
  console.log('1. Run "npm run build" to check for any TypeScript errors');
  console.log('2. Update component definitions if needed');
  console.log('3. Test the new components in the builder');
}

async function generateComponentExports() {
  console.log('\n📦 Generating barrel exports...');
  
  for (const [category, categoryPath] of Object.entries({
    'text': 'text',
    'animations': 'animations',
    'components': 'components',
    'backgrounds': 'backgrounds'
  })) {
    const componentsInCategory = Object.entries(COMPONENT_METADATA)
      .filter(([_, meta]) => meta.category === category)
      .map(([name]) => name);
    
    const indexContent = componentsInCategory
      .map(name => `export { default as ${name} } from './${name}';`)
      .join('\n');
    
    const indexPath = path.join(DESTINATION, categoryPath, 'index.ts');
    
    try {
      await fs.writeFile(indexPath, indexContent + '\n');
      console.log(`✓ Created barrel export for ${category}`);
    } catch (error) {
      console.error(`✗ Failed to create barrel export for ${category}: ${error.message}`);
    }
  }
}

// Run the sync
(async () => {
  await syncAllComponents();
  await generateComponentExports();
})();