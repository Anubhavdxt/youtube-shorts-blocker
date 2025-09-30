/**
 * Content blocking module - Injects CSS to hide Shorts content
 */

import { CONFIG } from '../shared/config.js';
import { Logger } from '../shared/logger.js';

export class ContentBlocker {
  /**
   * Inject blocking CSS to hide page content immediately
   */
  static injectBlockingCSS() {
    // Check if already injected
    if (document.getElementById(CONFIG.BLOCKING_CSS_ID)) {
      Logger.log('Blocking CSS already injected');
      return;
    }

    const style = document.createElement('style');
    style.id = CONFIG.BLOCKING_CSS_ID;
    style.textContent = `
      html, body {
        overflow: hidden !important;
      }
      body > *:not(#${CONFIG.WARNING_OVERLAY_ID}) {
        display: none !important;
      }
    `;

    // Append to head or documentElement (works even before body exists)
    const target = document.head || document.documentElement;
    target.appendChild(style);

    Logger.log('Blocking CSS injected');
  }

  /**
   * Remove blocking CSS
   */
  static removeBlockingCSS() {
    const style = document.getElementById(CONFIG.BLOCKING_CSS_ID);
    if (style) {
      style.remove();
      Logger.log('Blocking CSS removed');
    }
  }
};