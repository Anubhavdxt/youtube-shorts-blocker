/**
 * Configuration constants for YouTube Shorts Blocker
 */

export const CONFIG = {
  // URL Detection
  SHORTS_PATH: '/shorts',
  REDIRECT_URL: 'https://www.youtube.com/',

  // Timing
  COUNTDOWN_DURATION: 3, // seconds
  COUNTDOWN_INTERVAL: 500, // milliseconds
  FALLBACK_REDIRECT_DELAY: 1500, // milliseconds
  OBSERVER_RETRY_DELAY: 100, // milliseconds
  BODY_CHECK_RETRY_DELAY: 10, // milliseconds

  // DOM IDs
  WARNING_OVERLAY_ID: 'shorts-blocker-warning',
  BLOCKING_CSS_ID: 'shorts-blocker-hide',
  COUNTDOWN_ELEMENT_ID: 'countdown',

  // Z-Index
  OVERLAY_Z_INDEX: 9999,

  // Logging
  DEBUG: false, // Set to true for verbose logging
  LOG_PREFIX: 'YouTube Shorts Blocker:',
};