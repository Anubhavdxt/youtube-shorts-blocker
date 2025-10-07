/**
 * Storage Manager - Handles all chrome.storage interactions
 */

import { CONFIG } from './config.js';
import { Logger } from './logger.js';

export class StorageManager {
  /**
   * Initialize storage with default values
   */
  static async initialize() {
    const data = await this.getAll();

    const defaults = {
      // Analytics
      shorts_blocked_today: 0,
      shorts_blocked_total: 0,
      shorts_blocked_by_date: {},
      last_reset_date: this.getTodayDateString(),
      time_saved_minutes: 0,
      longest_streak: 0,
      current_streak: 0,

      // Settings
      extension_enabled: true,
      countdown_duration: CONFIG.COUNTDOWN_DURATION,
      redirect_url: CONFIG.REDIRECT_URL,

      // Pro (future)
      is_pro: false,
      pro_license_key: null,
      pro_expiry_date: null,
    };

    // Merge defaults with existing data
    const initialData = { ...defaults, ...data };

    // Reset daily counter if new day
    if (data.last_reset_date !== this.getTodayDateString()) {
      initialData.shorts_blocked_today = 0;
      initialData.last_reset_date = this.getTodayDateString();

      // Update streak
      if (data.shorts_blocked_today > 0) {
        initialData.current_streak = (data.current_streak || 0) + 1;
        if (initialData.current_streak > (data.longest_streak || 0)) {
          initialData.longest_streak = initialData.current_streak;
        }
      } else {
        initialData.current_streak = 0;
      }
    }

    await this.setAll(initialData);
    Logger.log('Storage initialized', initialData);

    return initialData;
  }

  /**
   * Get today's date as string (YYYY-MM-DD)
   */
  static getTodayDateString() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  /**
   * Get all storage data
   */
  static async getAll() {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (data) => {
        resolve(data || {});
      });
    });
  }

  /**
   * Set multiple storage values
   */
  static async setAll(data) {
    return new Promise((resolve) => {
      chrome.storage.local.set(data, () => {
        resolve();
      });
    });
  }

  /**
   * Get specific storage value
   */
  static async get(key) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (data) => {
        resolve(data[key]);
      });
    });
  }

  /**
   * Set specific storage value
   */
  static async set(key, value) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, () => {
        resolve();
      });
    });
  }

  /**
   * Increment a counter
   */
  static async increment(key, amount = 1) {
    const current = (await this.get(key)) || 0;
    await this.set(key, current + amount);
    return current + amount;
  }
}
