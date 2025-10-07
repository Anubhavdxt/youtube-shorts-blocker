/**
 * Analytics Manager - Tracks user statistics locally
 * All data stored in chrome.storage.local, never leaves the device
 */

import { CONFIG } from './config.js';
import { Logger } from './logger.js';
import { StorageManager } from './storage.js';

export class Analytics {
  /**
   * Record a Shorts block event
   */
  static async recordBlock() {
    try {
      // Increment counters
      await StorageManager.increment('shorts_blocked_today');
      await StorageManager.increment('shorts_blocked_total');

      // Update by-date tracking
      const today = StorageManager.getTodayDateString();
      const byDate = (await StorageManager.get('shorts_blocked_by_date')) || {};
      byDate[today] = (byDate[today] || 0) + 1;
      await StorageManager.set('shorts_blocked_by_date', byDate);

      // Estimate time saved (average Short is ~30 seconds)
      const TIME_PER_SHORT_MINUTES = 0.5;
      await StorageManager.increment('time_saved_minutes', TIME_PER_SHORT_MINUTES);

      const stats = await this.getStats();
      Logger.log('Block recorded', stats);

      return stats;
    } catch (error) {
      Logger.error('Failed to record block', error);
    }
  }

  /**
   * Get current statistics
   */
  static async getStats() {
    const data = await StorageManager.getAll();

    return {
      today: data.shorts_blocked_today || 0,
      total: data.shorts_blocked_total || 0,
      timeSavedMinutes: Math.round(data.time_saved_minutes || 0),
      timeSavedHours: Math.round((data.time_saved_minutes || 0) / 60 * 10) / 10,
      currentStreak: data.current_streak || 0,
      longestStreak: data.longest_streak || 0,
      byDate: data.shorts_blocked_by_date || {},
    };
  }

  /**
   * Get statistics for a specific date range
   */
  static async getStatsForRange(startDate, endDate) {
    const byDate = (await StorageManager.get('shorts_blocked_by_date')) || {};
    const start = new Date(startDate);
    const end = new Date(endDate);

    let total = 0;
    const dates = [];

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const count = byDate[dateStr] || 0;
      total += count;
      dates.push({ date: dateStr, count });
    }

    return { total, dates };
  }

  /**
   * Get last 7 days statistics
   */
  static async getWeekStats() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6); // Last 7 days including today

    return await this.getStatsForRange(
      weekAgo.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }

  /**
   * Get last 30 days statistics
   */
  static async getMonthStats() {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 29); // Last 30 days including today

    return await this.getStatsForRange(
      monthAgo.toISOString().split('T')[0],
      today.toISOString().split('T')[0]
    );
  }

  /**
   * Reset all statistics (for testing or user request)
   */
  static async reset() {
    await StorageManager.setAll({
      shorts_blocked_today: 0,
      shorts_blocked_total: 0,
      shorts_blocked_by_date: {},
      time_saved_minutes: 0,
      longest_streak: 0,
      current_streak: 0,
    });

    Logger.log('Analytics reset');
  }
}
