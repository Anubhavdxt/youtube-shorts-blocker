/**
 * URL detection module for YouTube Shorts
 */

import { CONFIG } from '../shared/config.js';
import { Logger } from '../shared/logger.js';

export class ShortsDetector {
  /**
   * Check if the current URL is a Shorts URL
   * @returns {boolean}
   */
  static isShortsUrl() {
    return window.location.pathname.startsWith(CONFIG.SHORTS_PATH);
  }

  /**
   * Setup observers to detect URL changes in YouTube's SPA
   * @param {Function} callback - Function to call when URL changes
   */
  static setupUrlObserver(callback) {
    // Method 1: MutationObserver for DOM changes
    this.setupMutationObserver(callback);

    // Method 2: History API monitoring
    this.setupHistoryMonitoring(callback);

    // Method 3: popstate event
    window.addEventListener('popstate', () => {
      Logger.log('popstate event detected');
      callback();
    });
  }

  /**
   * Setup MutationObserver to detect URL changes
   * @private
   */
  static setupMutationObserver(callback) {
    const waitForBody = () => {
      if (document.body) {
        let lastUrl = location.href;

        const observer = new MutationObserver(() => {
          const currentUrl = location.href;
          if (currentUrl !== lastUrl) {
            Logger.log('URL changed:', lastUrl, '->', currentUrl);
            lastUrl = currentUrl;
            callback();
          }
        });

        observer.observe(document.body, {
          subtree: true,
          childList: true,
        });

        Logger.log('MutationObserver initialized');
      } else {
        setTimeout(waitForBody, CONFIG.OBSERVER_RETRY_DELAY);
      }
    };

    waitForBody();
  }

  /**
   * Setup History API monitoring
   * @private
   */
  static setupHistoryMonitoring(callback) {
    // Override pushState
    const originalPushState = history.pushState;
    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      Logger.log('pushState called');
      setTimeout(callback, 0);
    };

    // Override replaceState
    const originalReplaceState = history.replaceState;
    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      Logger.log('replaceState called');
      setTimeout(callback, 0);
    };

    Logger.log('History API monitoring initialized');
  }
};