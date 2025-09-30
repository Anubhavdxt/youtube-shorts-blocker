/**
 * Logging utility for YouTube Shorts Blocker
 */

import { CONFIG } from './config.js';

export const Logger = {
  log(...args) {
    if (CONFIG.DEBUG) {
      console.log(CONFIG.LOG_PREFIX, ...args);
    }
  },

  info(...args) {
    console.log(CONFIG.LOG_PREFIX, ...args);
  },

  warn(...args) {
    console.warn(CONFIG.LOG_PREFIX, ...args);
  },

  error(...args) {
    console.error(CONFIG.LOG_PREFIX, ...args);
  },
};