/**
 * Stats Panel Overlay
 * Injected into the page when user clicks extension icon
 */

import { StorageManager } from '../../shared/storage.js';
import { Analytics } from '../../shared/analytics.js';

export class StatsPanel {
  static isOpen = false;

  /**
   * Toggle the stats panel
   */
  static async toggle() {
    if (this.isOpen) {
      this.hide();
    } else {
      await this.show();
    }
  }

  /**
   * Show the stats panel
   */
  static async show() {
    if (this.isOpen) return;

    // Load stats
    const stats = await Analytics.getStats();
    const enabled = await StorageManager.get('extension_enabled');

    // Format time saved
    const timeSaved = stats.timeSavedHours < 1
      ? `${stats.timeSavedMinutes}m`
      : `${stats.timeSavedHours}h`;

    // Create overlay
    const overlay = document.createElement('div');
    overlay.id = 'synaptimo-stats-panel';
    overlay.innerHTML = this.getHTML(stats, timeSaved, enabled);

    document.body.appendChild(overlay);
    this.isOpen = true;

    // Setup event listeners
    this.setupEventListeners();

    // Animate in
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });
  }

  /**
   * Hide the stats panel
   */
  static hide() {
    const panel = document.getElementById('synaptimo-stats-panel');
    if (!panel) return;

    panel.classList.remove('visible');
    setTimeout(() => {
      panel.remove();
      this.isOpen = false;
    }, 300);
  }

  /**
   * Setup event listeners
   */
  static setupEventListeners() {
    // Close button
    const closeBtn = document.querySelector('#synaptimo-stats-panel .sf-close-btn');
    closeBtn?.addEventListener('click', () => this.hide());

    // Toggle button
    const toggleBtn = document.querySelector('#synaptimo-stats-panel .sf-toggle-btn');
    toggleBtn?.addEventListener('click', async () => {
      const currentState = await StorageManager.get('extension_enabled');
      const newState = !currentState;
      await StorageManager.set('extension_enabled', newState);

      // Update UI
      const toggleSwitch = document.querySelector('#synaptimo-stats-panel .sf-toggle-switch');
      const container = document.querySelector('#synaptimo-stats-panel .sf-container');
      const statusText = document.querySelector('#synaptimo-stats-panel .sf-toggle-status');

      if (newState) {
        toggleSwitch?.classList.add('sf-active');
        container?.classList.remove('sf-disabled');
        if (statusText) {
          statusText.textContent = 'Active';
          statusText.classList.remove('sf-disabled-status');
          statusText.classList.add('sf-enabled');
        }
      } else {
        toggleSwitch?.classList.remove('sf-active');
        container?.classList.add('sf-disabled');
        if (statusText) {
          statusText.textContent = 'Paused';
          statusText.classList.remove('sf-enabled');
          statusText.classList.add('sf-disabled-status');
        }
      }
    });
  }

  /**
   * Get HTML for the panel
   */
  static getHTML(stats, timeSaved, enabled) {
    return `
      ${this.getStyles()}
      <div class="sf-panel">
        <div class="sf-container ${enabled ? '' : 'sf-disabled'}">
          <!-- Header -->
          <header class="sf-header">
            <div class="sf-brand">
              <div class="sf-brand-icon">
                <svg width="40" height="40" viewBox="0 0 128 128" fill="none">
                  <rect width="128" height="128" rx="24" fill="white"/>
                  <path d="M64 32C64 32 48 48 48 64C48 80 64 96 64 96C64 96 80 80 80 64C80 48 64 32 64 32Z" fill="url(#iconGradient)"/>
                  <circle cx="64" cy="64" r="8" fill="white"/>
                  <defs>
                    <linearGradient id="iconGradient" x1="48" y1="32" x2="80" y2="96">
                      <stop offset="0%" stop-color="#5ea9a4"/>
                      <stop offset="100%" stop-color="#2d7971"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div class="sf-brand-text">
                <div class="sf-brand-name">Synaptimo Focus</div>
                <div class="sf-brand-tagline">Reclaim Your Attention</div>
              </div>
            </div>
            <button class="sf-close-btn" aria-label="Close panel">
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </header>

          <!-- Toggle Section -->
          <div class="sf-toggle-section">
            <div class="sf-toggle-label">Extension Status: <span class="sf-toggle-status ${enabled ? 'sf-enabled' : 'sf-disabled-status'}">${enabled ? 'Active' : 'Paused'}</span></div>
            <button class="sf-toggle-btn" aria-label="Toggle extension">
              <div class="sf-toggle-switch ${enabled ? 'sf-active' : ''}">
                <div class="sf-toggle-slider"></div>
              </div>
            </button>
          </div>

          <!-- Stats Grid -->
          <div class="sf-stats-section">
            <svg width="0" height="0" style="position: absolute;">
              <defs>
                <linearGradient id="statIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#5ea9a4"/>
                  <stop offset="100%" stop-color="#2d7971"/>
                </linearGradient>
                <linearGradient id="highlightIconGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#fbbf24"/>
                  <stop offset="100%" stop-color="#d97706"/>
                </linearGradient>
              </defs>
            </svg>
            <div class="sf-stats-header">Your Progress</div>
            <div class="sf-stats-grid">
              <div class="sf-stat-card">
                <div class="sf-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                  </svg>
                </div>
                <div class="sf-stat-content">
                  <div class="sf-stat-value">${stats.today}</div>
                  <div class="sf-stat-label">Blocked Today</div>
                </div>
              </div>
              <div class="sf-stat-card">
                <div class="sf-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <circle cx="12" cy="12" r="6"/>
                    <circle cx="12" cy="12" r="2"/>
                  </svg>
                </div>
                <div class="sf-stat-content">
                  <div class="sf-stat-value">${stats.total.toLocaleString()}</div>
                  <div class="sf-stat-label">Total Blocked</div>
                </div>
              </div>
              <div class="sf-stat-card sf-highlight">
                <div class="sf-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div class="sf-stat-content">
                  <div class="sf-stat-value">${timeSaved}</div>
                  <div class="sf-stat-label">Time Saved</div>
                </div>
              </div>
              <div class="sf-stat-card">
                <div class="sf-stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 2L15 8L22 9L17 14L18 21L12 18L6 21L7 14L2 9L9 8Z"/>
                  </svg>
                </div>
                <div class="sf-stat-content">
                  <div class="sf-stat-value">${stats.currentStreak}</div>
                  <div class="sf-stat-label">Day Streak</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="sf-footer">
            <a href="https://github.com/Anubhavdxt/youtube-shorts-blocker" target="_blank" class="sf-footer-link">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
              </svg>
              View on GitHub
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Get styles for the panel
   */
  static getStyles() {
    return `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

        #synaptimo-stats-panel {
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          z-index: 999999999;
          pointer-events: none;
        }

        #synaptimo-stats-panel .sf-panel {
          position: absolute;
          top: 20px;
          right: 20px;
          width: 380px;
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 12px 48px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          opacity: 0;
          transform: translateY(-10px);
          transition: opacity 0.3s ease, transform 0.3s ease;
          pointer-events: all;
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        #synaptimo-stats-panel.visible .sf-panel {
          opacity: 1;
          transform: translateY(0);
        }

        #synaptimo-stats-panel .sf-container {
          display: flex;
          flex-direction: column;
        }

        /* Header */
        #synaptimo-stats-panel .sf-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px;
          background: linear-gradient(135deg, #5ea9a4 0%, #2d7971 100%);
        }

        #synaptimo-stats-panel .sf-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        #synaptimo-stats-panel .sf-brand-icon {
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #synaptimo-stats-panel .sf-brand-icon svg {
          border-radius: 8px;
        }

        #synaptimo-stats-panel .sf-brand-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        #synaptimo-stats-panel .sf-brand-name {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 16px;
          font-weight: 700;
          color: white;
          line-height: 1.2;
        }

        #synaptimo-stats-panel .sf-brand-tagline {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 12px;
          font-weight: 400;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.2;
        }

        /* Close Button */
        #synaptimo-stats-panel .sf-close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          cursor: pointer;
          padding: 8px;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          transition: all 0.2s ease;
          backdrop-filter: blur(10px);
        }

        #synaptimo-stats-panel .sf-close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        /* Toggle Section */
        #synaptimo-stats-panel .sf-toggle-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          background: #f9fafb;
          border-bottom: 1px solid #e5e7eb;
        }

        #synaptimo-stats-panel .sf-toggle-label {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
        }

        #synaptimo-stats-panel .sf-toggle-status {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 13px;
          font-weight: 600;
        }

        #synaptimo-stats-panel .sf-toggle-status.sf-enabled {
          color: #10b981;
        }

        #synaptimo-stats-panel .sf-toggle-status.sf-disabled-status {
          color: #ef4444;
        }

        /* Toggle Button */
        #synaptimo-stats-panel .sf-toggle-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }

        #synaptimo-stats-panel .sf-toggle-switch {
          width: 52px;
          height: 28px;
          background: #e5e7eb;
          border-radius: 14px;
          position: relative;
          transition: background-color 0.2s ease;
        }

        #synaptimo-stats-panel .sf-toggle-switch.sf-active {
          background: #10b981;
        }

        #synaptimo-stats-panel .sf-toggle-slider {
          width: 24px;
          height: 24px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 2px;
          left: 2px;
          transition: transform 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }

        #synaptimo-stats-panel .sf-toggle-switch.sf-active .sf-toggle-slider {
          transform: translateX(24px);
        }

        /* Stats Section */
        #synaptimo-stats-panel .sf-stats-section {
          padding: 20px;
        }

        #synaptimo-stats-panel .sf-stats-header {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 13px;
          font-weight: 600;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 16px;
        }

        #synaptimo-stats-panel .sf-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        #synaptimo-stats-panel .sf-stat-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 16px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }

        #synaptimo-stats-panel .sf-stat-card:hover {
          background: #f3f4f6;
          border-color: #d1d5db;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }

        #synaptimo-stats-panel .sf-stat-card.sf-highlight {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border-color: #fbbf24;
        }

        #synaptimo-stats-panel .sf-stat-card.sf-highlight:hover {
          background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%);
        }

        #synaptimo-stats-panel .sf-stat-icon {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        #synaptimo-stats-panel .sf-stat-icon svg {
          stroke: url(#statIconGradient);
        }

        #synaptimo-stats-panel .sf-stat-card.sf-highlight .sf-stat-icon svg {
          stroke: url(#highlightIconGradient);
        }

        #synaptimo-stats-panel .sf-stat-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        #synaptimo-stats-panel .sf-stat-value {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #111827;
          line-height: 1;
        }

        #synaptimo-stats-panel .sf-stat-label {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 11px;
          font-weight: 500;
          color: #6b7280;
          line-height: 1.2;
        }

        /* Footer */
        #synaptimo-stats-panel .sf-footer {
          padding: 16px 20px;
          border-top: 1px solid #e5e7eb;
          text-align: center;
        }

        #synaptimo-stats-panel .sf-footer-link {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          color: #6b7280;
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          transition: color 0.2s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        #synaptimo-stats-panel .sf-footer-link:hover {
          color: #2d7971;
        }

        /* Disabled State */
        #synaptimo-stats-panel .sf-container.sf-disabled .sf-stats-section {
          opacity: 0.5;
        }
      </style>
    `;
  }
}
