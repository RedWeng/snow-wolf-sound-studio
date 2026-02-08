/**
 * Design System Verification Script
 * 
 * This script verifies that all design tokens are properly configured
 * in the Tailwind config and can be accessed.
 */

import tailwindConfig from '../tailwind.config';

interface VerificationResult {
  category: string;
  passed: boolean;
  details: string[];
}

const results: VerificationResult[] = [];

// Verify Brand Colors
const brandColors = ['navy', 'midnight', 'slate', 'frost', 'snow'];
const brandColorCheck = brandColors.every(color => {
  const colors = tailwindConfig.theme?.extend?.colors as any;
  return colors?.brand?.[color];
});
results.push({
  category: 'Brand Colors',
  passed: brandColorCheck,
  details: brandColors.map(c => `brand.${c}`)
});

// Verify Accent Colors
const accentColors = ['moon', 'ice', 'aurora'];
const accentColorCheck = accentColors.every(color => {
  const colors = tailwindConfig.theme?.extend?.colors as any;
  return colors?.accent?.[color];
});
results.push({
  category: 'Accent Colors',
  passed: accentColorCheck,
  details: accentColors.map(c => `accent.${c}`)
});

// Verify Semantic Colors
const semanticColors = ['success', 'warning', 'error', 'info'];
const semanticColorCheck = semanticColors.every(color => {
  const colors = tailwindConfig.theme?.extend?.colors as any;
  return colors?.semantic?.[color];
});
results.push({
  category: 'Semantic Colors',
  passed: semanticColorCheck,
  details: semanticColors.map(c => `semantic.${c}`)
});

// Verify Font Families
const fontFamilies = ['heading', 'body', 'mono'];
const fontFamilyCheck = fontFamilies.every(font => {
  const fontFamily = tailwindConfig.theme?.extend?.fontFamily as any;
  return fontFamily?.[font];
});
results.push({
  category: 'Font Families',
  passed: fontFamilyCheck,
  details: fontFamilies
});

// Verify Type Scale
const typeSizes = ['display', 'h1', 'h2', 'h3', 'h4', 'body-lg', 'body', 'body-sm', 'caption'];
const typeSizeCheck = typeSizes.every(size => {
  const fontSize = tailwindConfig.theme?.extend?.fontSize as any;
  return fontSize?.[size];
});
results.push({
  category: 'Type Scale',
  passed: typeSizeCheck,
  details: typeSizes
});

// Verify Spacing Scale
const spacingSizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'];
const spacingCheck = spacingSizes.every(size => {
  const spacing = tailwindConfig.theme?.extend?.spacing as any;
  return spacing?.[size];
});
results.push({
  category: 'Spacing Scale',
  passed: spacingCheck,
  details: spacingSizes
});

// Verify Breakpoints
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
const breakpointCheck = breakpoints.every(bp => {
  const screens = tailwindConfig.theme?.extend?.screens as any;
  return screens?.[bp];
});
results.push({
  category: 'Responsive Breakpoints',
  passed: breakpointCheck,
  details: breakpoints
});

// Verify Transition Durations
const durations = ['fast', 'base', 'slow', 'slower'];
const durationCheck = durations.every(d => {
  const transitionDuration = tailwindConfig.theme?.extend?.transitionDuration as any;
  return transitionDuration?.[d];
});
results.push({
  category: 'Transition Durations',
  passed: durationCheck,
  details: durations
});

// Verify Easing Functions
const easings = ['smooth', 'bounce', 'ease-in-out'];
const easingCheck = easings.every(e => {
  const transitionTimingFunction = tailwindConfig.theme?.extend?.transitionTimingFunction as any;
  return transitionTimingFunction?.[e];
});
results.push({
  category: 'Easing Functions',
  passed: easingCheck,
  details: easings
});

// Print Results
console.log('\n🎨 Design System Verification\n');
console.log('═'.repeat(50));

let allPassed = true;
results.forEach(result => {
  const icon = result.passed ? '✅' : '❌';
  console.log(`\n${icon} ${result.category}`);
  if (result.passed) {
    console.log(`   ${result.details.length} tokens configured`);
  } else {
    console.log(`   Missing tokens: ${result.details.join(', ')}`);
    allPassed = false;
  }
});

console.log('\n' + '═'.repeat(50));
if (allPassed) {
  console.log('✨ All design tokens are properly configured!\n');
  process.exit(0);
} else {
  console.log('⚠️  Some design tokens are missing or misconfigured.\n');
  process.exit(1);
}
