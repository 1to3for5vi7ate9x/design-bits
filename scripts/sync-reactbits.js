#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Paths
const REACTBITS_SRC = path.join(__dirname, '../../designbits/react-bits/src/ts-tailwind');
const DEST_PATH = path.join(__dirname, '../src/components/reactbits');

// Component categories
const CATEGORIES = {
  'TextAnimations': 'text',
  'Animations': 'animations',
  'Components': 'components',
  'Backgrounds': 'backgrounds'
};

// Components to sync
const COMPONENTS_TO_SYNC = [
  // Text Animations
  'TextAnimations/SplitText',
  'TextAnimations/BlurText',
  'TextAnimations/CircularText',
  'TextAnimations/ShinyText',
  'TextAnimations/GradientText',
  'TextAnimations/GlitchText',
  'TextAnimations/ScrambleText',
  'TextAnimations/RollingText',
  'TextAnimations/CountUp',
  'TextAnimations/RotatingText',
  'TextAnimations/FuzzyText',
  'TextAnimations/FallingText',
  
  // Animations
  'Animations/ClickSpark',
  'Animations/Bounce',
  'Animations/Magnet',
  'Animations/StarBorder',
  'Animations/PixelTrail',
  'Animations/MetaBalls',
  'Animations/Noise',
  'Animations/Crosshair',
  
  // Components
  'Components/MagicBento',
  'Components/SpotlightCard',
  'Components/Dock',
  'Components/Counter',
  'Components/Stepper',
  'Components/ProfileCard',
  'Components/Carousel',
  'Components/InfiniteScroll',
  'Components/TiltedCard',
  'Components/GlassSurface',
  
  // Backgrounds
  'Backgrounds/Aurora',
  'Backgrounds/Waves',
  'Backgrounds/Grid',
  'Backgrounds/Particles',
  'Backgrounds/DotGrid',
  'Backgrounds/Beams',
  'Backgrounds/Hyperspeed',
  'Backgrounds/Lightning',
  'Backgrounds/Silk',
  'Backgrounds/Orb',
];

// Ensure destination directories exist
Object.values(CATEGORIES).forEach(dir => {
  const fullPath = path.join(DEST_PATH, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

// Function to update imports in component files
function updateImports(content) {
  // Update cn import path
  content = content.replace(
    /import\s+{\s*cn\s*}\s+from\s+["']@\/lib\/utils["']/g,
    'import { cn } from "@/lib/utils/cn"'
  );
  
  return content;
}

// Sync components
COMPONENTS_TO_SYNC.forEach(componentPath => {
  const [category, componentName] = componentPath.split('/');
  const destCategory = CATEGORIES[category];
  
  const srcFile = path.join(REACTBITS_SRC, componentPath, `${componentName}.tsx`);
  const destFile = path.join(DEST_PATH, destCategory, `${componentName}.tsx`);
  
  if (fs.existsSync(srcFile)) {
    let content = fs.readFileSync(srcFile, 'utf8');
    content = updateImports(content);
    
    fs.writeFileSync(destFile, content);
    console.log(`✅ Synced ${componentName} to ${destCategory}/`);
  } else {
    console.log(`❌ Source not found: ${srcFile}`);
  }
});

console.log('\n✨ ReactBits components sync complete!');
console.log('\nNext steps:');
console.log('1. Update ComponentRenderer to include new components');
console.log('2. Update component definitions with proper props');
console.log('3. Test components in the builder');