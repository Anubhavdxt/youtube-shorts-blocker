/**
 * Synaptimo Focus - Main Entry Point
 *
 * This is the orchestrator that coordinates all modules:
 * - ShortsDetector: Detects Shorts URLs and monitors changes
 * - ContentBlocker: Injects CSS to hide Shorts content
 * - WarningOverlay: Shows the warning UI with countdown
 * - Analytics: Tracks statistics locally
 * - StorageManager: Handles persistent storage
 */

import { CONFIG } from '../shared/config.js';
import { Logger } from '../shared/logger.js';
import { StorageManager } from '../shared/storage.js';
import { Analytics } from '../shared/analytics.js';
import { ShortsDetector } from './detector.js';
import { ContentBlocker } from './blocker.js';
import { WarningOverlay } from './ui/overlay.js';
import { StatsPanel } from './ui/stats-panel.js';

class YouTubeShortsBlocker {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the extension
   */
  async init() {
    if (this.initialized) {
      Logger.warn('Already initialized');
      return;
    }

    Logger.info('Initializing Synaptimo Focus');

    // Initialize storage
    await StorageManager.initialize();

    // Check if extension is enabled
    const enabled = await StorageManager.get('extension_enabled');
    if (!enabled) {
      Logger.info('Extension is disabled');
      return;
    }

    // Immediate check and block if on Shorts page
    this.checkAndBlock();

    // Setup fallback redirect for edge cases
    this.setupFallbackRedirect();

    // Setup URL change observers
    ShortsDetector.setupUrlObserver(() => this.checkAndBlock());

    this.initialized = true;
    Logger.info('Initialization complete');
  }

  /**
   * Check if current URL is Shorts and block if needed
   */
  checkAndBlock() {
    Logger.log('Checking URL:', window.location.href);

    if (ShortsDetector.isShortsUrl()) {
      Logger.info('Shorts URL detected, blocking');
      this.blockShorts();
    }
  }

  /**
   * Block Shorts content and show warning
   */
  async blockShorts() {
    // Step 1: Inject blocking CSS immediately
    ContentBlocker.injectBlockingCSS();

    // Step 2: Record analytics
    await Analytics.recordBlock();

    // Step 3: Show warning overlay
    WarningOverlay.show();
  }

  /**
   * Setup fallback redirect as last resort
   * This ensures redirect happens even if all other mechanisms fail
   */
  setupFallbackRedirect() {
    if (ShortsDetector.isShortsUrl()) {
      setTimeout(() => {
        if (ShortsDetector.isShortsUrl()) {
          Logger.warn('Fallback redirect triggered');
          window.location.replace(CONFIG.REDIRECT_URL);
        }
      }, CONFIG.FALLBACK_REDIRECT_DELAY);
    }
  }
}

// Auto-initialize when script loads
const blocker = new YouTubeShortsBlocker();

// Early blocking for document_start (only if enabled)
(async () => {
  await StorageManager.initialize();
  const enabled = await StorageManager.get('extension_enabled');

  if (enabled && ShortsDetector.isShortsUrl() && document.readyState === 'loading') {
    Logger.log('Early blocking at document_start');
    ContentBlocker.injectBlockingCSS();
  }

  // Initialize the blocker
  await blocker.init();
})();

// Listen for messages from background script (extension icon click)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleStatsPanel') {
    StatsPanel.toggle();
  }
});