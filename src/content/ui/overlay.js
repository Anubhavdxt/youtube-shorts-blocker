/**
 * Warning overlay UI module
 */

import { CONFIG } from '../../shared/config.js';
import { Logger } from '../../shared/logger.js';

// Import will be handled by build process - these are embedded as strings
const HTML_TEMPLATE = `<div class="synaptimo-focus-overlay">
  <div class="synaptimo-focus-card">
    <div class="synaptimo-focus-accent"></div>

    <svg width="0" height="0" style="position: absolute;">
      <defs>
        <linearGradient id="overlayIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#f87171"/>
          <stop offset="100%" stop-color="#dc2626"/>
        </linearGradient>
      </defs>
    </svg>

    <svg class="synaptimo-focus-icon" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="url(#overlayIconGradient)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
    </svg>

    <h2 class="synaptimo-focus-title">Synaptimo Focus</h2>
    <p class="synaptimo-focus-subtitle">Distraction Blocked</p>

    <p class="synaptimo-focus-message">
      In an age of endless distraction, focus is a superpower. Redirecting you to intentional content.
    </p>

    <div class="synaptimo-focus-countdown-container">
      <p class="synaptimo-focus-countdown-text">
        Redirecting in <span class="synaptimo-focus-countdown-number" id="countdown">3</span> seconds...
      </p>
    </div>
  </div>
</div>`;

const CSS_STYLES = `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.synaptimo-focus-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(45, 121, 113, 0.95) 0%, rgba(61, 71, 80, 0.95) 100%);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  animation: fadeIn 0.3s ease-out;
}

.synaptimo-focus-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 48px 56px;
  border-radius: 24px;
  text-align: center;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(94, 169, 164, 0.2);
  animation: fadeIn 0.4s ease-out 0.1s both;
  position: relative;
  overflow: hidden;
}

.synaptimo-focus-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #5ea9a4, #2d7971, #5ea9a4);
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

.synaptimo-focus-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 24px;
  display: block;
  animation: breathe 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(248, 113, 113, 0.3));
}

.synaptimo-focus-title {
  background: linear-gradient(135deg, #5ea9a4 0%, #2d7971 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 32px;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: -0.02em;
}

.synaptimo-focus-subtitle {
  color: #3d4750;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 24px 0;
}

.synaptimo-focus-message {
  color: #475569;
  font-size: 15px;
  line-height: 1.6;
  margin: 0 0 32px 0;
  font-weight: 400;
}

.synaptimo-focus-countdown-container {
  background: linear-gradient(135deg, #e8f5f4 0%, #d4ebe9 100%);
  padding: 20px 28px;
  border-radius: 16px;
  display: inline-block;
}

.synaptimo-focus-countdown-text {
  color: #2d7971;
  font-size: 14px;
  margin: 0;
  font-weight: 600;
}

.synaptimo-focus-countdown-number {
  color: #2d7971;
  font-weight: 700;
  font-size: 18px;
  display: inline-block;
  min-width: 12px;
}`;

export class WarningOverlay {
  /**
   * Show the warning overlay with countdown
   */
  static show() {
    // Wait for body if it doesn't exist
    if (!document.body) {
      this.waitForBody();
      return;
    }

    // Remove existing overlay if present
    this.remove();

    // Create overlay container
    const container = document.createElement('div');
    container.id = CONFIG.WARNING_OVERLAY_ID;

    // Inject styles
    const styleElement = document.createElement('style');
    styleElement.textContent = CSS_STYLES;
    container.appendChild(styleElement);

    // Inject HTML
    container.innerHTML += HTML_TEMPLATE;

    // Append to body
    document.body.appendChild(container);

    Logger.log('Warning overlay displayed');

    // Start countdown
    this.startCountdown();
  }

  /**
   * Wait for document.body to be available
   * @private
   */
  static waitForBody() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.show(), { once: true });
    } else {
      setTimeout(() => this.show(), CONFIG.BODY_CHECK_RETRY_DELAY);
    }
  }

  /**
   * Start countdown timer
   * @private
   */
  static startCountdown() {
    let countdown = CONFIG.COUNTDOWN_DURATION;
    const countdownElement = document.getElementById(CONFIG.COUNTDOWN_ELEMENT_ID);

    const timer = setInterval(() => {
      countdown--;

      if (countdownElement) {
        countdownElement.textContent = countdown;
      }

      if (countdown <= 0) {
        clearInterval(timer);
        Logger.log('Countdown completed, redirecting');
        this.redirect();
      }
    }, CONFIG.COUNTDOWN_INTERVAL);
  }

  /**
   * Redirect to YouTube homepage
   * @private
   */
  static redirect() {
    window.location.replace(CONFIG.REDIRECT_URL);
  }

  /**
   * Remove the warning overlay
   */
  static remove() {
    const existingOverlay = document.getElementById(CONFIG.WARNING_OVERLAY_ID);
    if (existingOverlay) {
      existingOverlay.remove();
      Logger.log('Warning overlay removed');
    }
  }
};