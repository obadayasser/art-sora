'use client';

// Helper function to generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Initialize IDs automatically when the file loads
(function initializeIds() {
  if (typeof window !== 'undefined') {
    // Initialize App ID
    let appId = localStorage.getItem('app_id');
    if (!appId) {
      appId = generateUUID();
      localStorage.setItem('app_id', appId);
      console.log('🔵 App ID generated:', appId);
    }

    // Initialize Device ID
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = generateUUID();
      localStorage.setItem('device_id', deviceId);
      console.log('🔵 Device ID generated:', deviceId);
    }
  }
})();

// Helper function to get App ID (runs on client side)
export function getAppId(): string {
  if (typeof window !== 'undefined') {
    const appId = localStorage.getItem('app_id');
    if (!appId) {
      const newId = generateUUID();
      localStorage.setItem('app_id', newId);
      return newId;
    }
    return appId;
  }
  return '';
}

// Helper function to generate Device ID
export function getDeviceId(): string {
  if (typeof window !== 'undefined') {
    const deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      const newId = generateUUID();
      localStorage.setItem('device_id', newId);
      return newId;
    }
    return deviceId;
  }
  return '';
}

// Helper function to get headers
export function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-App-ID': getAppId(),
    'X-Device-ID': getDeviceId()
  };
}

