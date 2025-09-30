/**
 * YouTube Shorts Blocker - Main Entry Point
 *
 * This is the orchestrator that coordinates all modules:
 * - ShortsDetector: Detects Shorts URLs and monitors changes
 * - ContentBlocker: Injects CSS to hide Shorts content
 * - WarningOverlay: Shows the warning UI with countdown
 */

import { CONFIG } from '../shared/config.js';
import { Logger } from '../shared/logger.js';
import { ShortsDetector } from './detector.js';
import { ContentBlocker } from './blocker.js';
import { WarningOverlay } from './ui/overlay.js';

class YouTubeShortsBlocker {
  constructor() {
    this.initialized = false;
  }

  /**
   * Initialize the extension
   */
  init() {
    if (this.initialized) {
      Logger.warn('Already initialized');
      return;
    }

    Logger.info('Initializing YouTube Shorts Blocker');

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
  blockShorts() {
    // Step 1: Inject blocking CSS immediately
    ContentBlocker.injectBlockingCSS();

    // Step 2: Show warning overlay
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

// Early blocking for document_start
if (ShortsDetector.isShortsUrl() && document.readyState === 'loading') {
  Logger.log('Early blocking at document_start');
  ContentBlocker.injectBlockingCSS();
}

// Initialize the blocker
blocker.init();