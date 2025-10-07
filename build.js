#!/usr/bin/env node

/**
 * Build script for Synaptimo Focus
 * Bundles ES6 modules into browser-compatible files
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

console.log('Building Synaptimo Focus v2.1.0...\n');

// Simple module bundler - wrap in IIFE and remove import/export statements
function stripModuleSyntax(code) {
  return code
    .replace(/export\s+(const|class|function)/g, '$1')
    .replace(/import\s+{[^}]+}\s+from\s+['"][^'"]+['"];?\s*/g, '')
    .replace(/import\s+\w+\s+from\s+['"][^'"]+['"];?\s*/g, '');
}

// Read all module files for content script
const config = fs.readFileSync(path.join(SRC_DIR, 'shared/config.js'), 'utf8');
const logger = fs.readFileSync(path.join(SRC_DIR, 'shared/logger.js'), 'utf8');
const storage = fs.readFileSync(path.join(SRC_DIR, 'shared/storage.js'), 'utf8');
const analytics = fs.readFileSync(path.join(SRC_DIR, 'shared/analytics.js'), 'utf8');
const detector = fs.readFileSync(path.join(SRC_DIR, 'content/detector.js'), 'utf8');
const blocker = fs.readFileSync(path.join(SRC_DIR, 'content/blocker.js'), 'utf8');
const overlay = fs.readFileSync(path.join(SRC_DIR, 'content/ui/overlay.js'), 'utf8');
const statsPanel = fs.readFileSync(path.join(SRC_DIR, 'content/ui/stats-panel.js'), 'utf8');
const contentIndex = fs.readFileSync(path.join(SRC_DIR, 'content/index.js'), 'utf8');

// Bundle content script
const contentBundle = `
(function() {
  'use strict';

  // ==================== Config Module ====================
  ${stripModuleSyntax(config)}

  // ==================== Logger Module ====================
  ${stripModuleSyntax(logger)}

  // ==================== Storage Module ====================
  ${stripModuleSyntax(storage)}

  // ==================== Analytics Module ====================
  ${stripModuleSyntax(analytics)}

  // ==================== Detector Module ====================
  ${stripModuleSyntax(detector)}

  // ==================== Blocker Module ====================
  ${stripModuleSyntax(blocker)}

  // ==================== Overlay Module ====================
  ${stripModuleSyntax(overlay)}

  // ==================== Stats Panel Module ====================
  ${stripModuleSyntax(statsPanel)}

  // ==================== Main Entry Point ====================
  ${stripModuleSyntax(contentIndex)}
})();
`;

fs.writeFileSync(path.join(DIST_DIR, 'content.js'), contentBundle);
console.log('✓ Built content.js');

// Copy background script
fs.copyFileSync(
  path.join(SRC_DIR, 'background.js'),
  path.join(DIST_DIR, 'background.js')
);
console.log('✓ Copied background.js');

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
  }
});

console.log('\n✨ Build complete! Extension ready in ./dist/');
console.log('\n📦 New in v2.1.0:');
console.log('  • Local analytics tracking');
console.log('  • Extension popup with stats');
console.log('  • Enable/disable toggle');
console.log('  • Streak tracking');
console.log('\nTo load in Chrome:');
console.log('1. Go to chrome://extensions/');
console.log('2. Enable "Developer mode"');
console.log('3. Click "Load unpacked"');
console.log('4. Select the ./dist/ folder');
