/**
 * Configuration constants for Synaptimo Focus
 */

export const CONFIG = {
  // Branding
  PRODUCT_NAME: 'Synaptimo Focus',
  PRODUCT_URL: 'https://synaptimo.com',

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
  WARNING_OVERLAY_ID: 'synaptimo-focus-warning',
  BLOCKING_CSS_ID: 'synaptimo-focus-hide',
  COUNTDOWN_ELEMENT_ID: 'countdown',

  // Z-Index
  OVERLAY_Z_INDEX: 9999,

  // Brand Colors (from logo)
  BRAND_TEAL: '#5ea9a4',
  BRAND_DARK_TEAL: '#2d7971',
  BRAND_GRAY: '#3d4750',

  // Logging
  DEBUG: false, // Set to true for verbose logging
  LOG_PREFIX: 'Synaptimo Focus:',
};