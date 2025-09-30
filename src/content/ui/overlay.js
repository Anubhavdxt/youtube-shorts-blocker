/**
 * Warning overlay UI module
 */

import { CONFIG } from '../../shared/config.js';
import { Logger } from '../../shared/logger.js';

// Import will be handled by build process - these are embedded as strings
const HTML_TEMPLATE = `<div class="shorts-blocker-overlay">
  <div class="shorts-blocker-card">
    <div class="shorts-blocker-accent"></div>

    <div class="shorts-blocker-icon">⚠️</div>

    <h2 class="shorts-blocker-title">YouTube Shorts Blocked</h2>

    <p class="shorts-blocker-message">
      You're being redirected away from YouTube Shorts to help you stay focused.
    </p>

    <div class="shorts-blocker-countdown-container">
      <p class="shorts-blocker-countdown-text">
        Redirecting in <span class="shorts-blocker-countdown-number" id="countdown">3</span> seconds...
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

.shorts-blocker-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.95) 100%);
  backdrop-filter: blur(12px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  animation: fadeIn 0.3s ease-out;
}

.shorts-blocker-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 48px 56px;
  border-radius: 24px;
  text-align: center;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: fadeIn 0.4s ease-out 0.1s both;
  position: relative;
  overflow: hidden;
}

.shorts-blocker-accent {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #3b82f6);
  background-size: 200% 200%;
  animation: gradient 3s ease infinite;
}

.shorts-blocker-icon {
  font-size: 64px;
  margin-bottom: 24px;
  animation: breathe 2s ease-in-out infinite;
  filter: drop-shadow(0 4px 12px rgba(239, 68, 68, 0.3));
}

.shorts-blocker-title {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 16px 0;
  letter-spacing: -0.02em;
}

.shorts-blocker-message {
  color: #475569;
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 32px 0;
  font-weight: 500;
}

.shorts-blocker-countdown-container {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  padding: 20px 28px;
  border-radius: 16px;
  display: inline-block;
}

.shorts-blocker-countdown-text {
  color: #64748b;
  font-size: 14px;
  margin: 0;
  font-weight: 500;
}

.shorts-blocker-countdown-number {
  color: #0c54fc;
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