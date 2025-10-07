/**
 * Background Service Worker for Synaptimo Focus
 */

// Toggle stats panel when extension icon is clicked
chrome.action.onClicked.addListener(async (tab) => {
  // Send message to content script to toggle stats panel
  try {
    await chrome.tabs.sendMessage(tab.id, { action: 'toggleStatsPanel' });
  } catch (error) {
    // Content script might not be loaded yet, ignore error
    console.log('Content script not ready:', error);
  }
});
