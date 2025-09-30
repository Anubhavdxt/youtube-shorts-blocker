#!/usr/bin/env node

/**
 * Simple build script for YouTube Shorts Blocker
 * Bundles ES6 modules into a single file for browser compatibility
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, 'src');
const DIST_DIR = path.join(__dirname, 'dist');
const ASSETS_DIR = path.join(__dirname, 'assets');

// Clean dist directory
if (fs.existsSync(DIST_DIR)) {
  fs.rmSync(DIST_DIR, { recursive: true });
}
fs.mkdirSync(DIST_DIR, { recursive: true });

console.log('Building YouTube Shorts Blocker...');

// Read all module files
const config = fs.readFileSync(path.join(SRC_DIR, 'shared/config.js'), 'utf8');
const logger = fs.readFileSync(path.join(SRC_DIR, 'shared/logger.js'), 'utf8');
const detector = fs.readFileSync(path.join(SRC_DIR, 'content/detector.js'), 'utf8');
const blocker = fs.readFileSync(path.join(SRC_DIR, 'content/blocker.js'), 'utf8');
const overlay = fs.readFileSync(path.join(SRC_DIR, 'content/ui/overlay.js'), 'utf8');
const index = fs.readFileSync(path.join(SRC_DIR, 'content/index.js'), 'utf8');

// Simple module bundler - wrap in IIFE and remove import/export statements
function stripModuleSyntax(code) {
  return code
    .replace(/export\s+(const|class|function)/g, '$1')
    .replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, '')
    .replace(/import\s+\w+\s+from\s+['"][^'"]+['"];?\s*/g, '');
}

// Bundle all code
const bundledCode = `
(function() {
  'use strict';

  // ==================== Config Module ====================
  ${stripModuleSyntax(config)}

  // ==================== Logger Module ====================
  ${stripModuleSyntax(logger)}

  // ==================== Detector Module ====================
  ${stripModuleSyntax(detector)}

  // ==================== Blocker Module ====================
  ${stripModuleSyntax(blocker)}

  // ==================== Overlay Module ====================
  ${stripModuleSyntax(overlay)}

  // ==================== Main Entry Point ====================
  ${stripModuleSyntax(index)}
})();
`;

// Write bundled file
fs.writeFileSync(path.join(DIST_DIR, 'content.js'), bundledCode);
console.log('✓ Built content.js');

// Copy manifest
fs.copyFileSync(
  path.join(__dirname, 'manifest.json'),
  path.join(DIST_DIR, 'manifest.json')
);
console.log('✓ Copied manifest.json');

// Copy icons
const iconDir = path.join(DIST_DIR, 'icons');
fs.mkdirSync(iconDir, { recursive: true });

['icon16.png', 'icon48.png', 'icon128.png'].forEach(icon => {
  const src = path.join(ASSETS_DIR, 'icons', icon);
  const dest = path.join(iconDir, icon);

  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`✓ Copied ${icon}`);
  } else {
    // Fallback to root if not in assets yet
    const rootSrc = path.join(__dirname, icon);
    if (fs.existsSync(rootSrc)) {
      fs.copyFileSync(rootSrc, dest);
      console.log(`✓ Copied ${icon} from root`);
    }
  }
});

console.log('\n✨ Build complete! Extension ready in ./dist/');
console.log('\nTo load in Chrome:');
console.log('1. Go to chrome://extensions/');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked"');
console.log('4. Select the ./dist/ folder');