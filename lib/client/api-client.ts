'use client';

// Helper function to generate UUID
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper function to generate device fingerprint
function generateFingerprint(): string {
  if (typeof window === 'undefined') return '';

  try {
    // Create a fingerprint based on available browser features
    const nav = navigator as any;
    const screen = window.screen;
    
    const components = [
      nav.userAgent,
      nav.language,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      nav.hardwareConcurrency || 1,
      nav.deviceMemory || 4,
    ].join('|');

    // Create a simple hash from the components
    let hash = 0;
    for (let i = 0; i < components.length; i++) {
      const char = components.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(16);
  } catch (error) {
    return generateUUID();
  }
}

// Helper function to get User Agent
export function getUserAgent(): string {
  if (typeof window !== 'undefined') {
    return navigator.userAgent;
  }
  return '';
}

// Helper function to get App ID (runs on client side)
export function getAppId(): string {
  if (typeof window !== 'undefined') {
    try {
      const appId = localStorage.getItem('app_id');
      if (!appId) {
        const newId = generateUUID();
        localStorage.setItem('app_id', newId);
        return newId;
      }
      return appId;
    } catch (error) {
      // If localStorage is not available (e.g., in private mode), generate a temporary UUID
      return generateUUID();
    }
  }
  return '';
}

// Helper function to generate Device ID
/* export function getDeviceId(): string {
  if (typeof window !== 'undefined') {
    try {
      const deviceId = localStorage.getItem('device_id');
      if (!deviceId) {
        const newId = generateUUID();
        localStorage.setItem('device_id', newId);
        return newId;
      }
      return deviceId;
    } catch (error) {
      // If localStorage is not available (e.g., in private mode), generate a temporary UUID
      return generateUUID();
    }
  }
  return '';
} */

// Helper function to get Device Fingerprint
export function getDeviceFingerprint(): string {
  if (typeof window !== 'undefined') {
    try {
      const fingerprint = localStorage.getItem('device_fingerprint');
      if (!fingerprint) {
        const newFingerprint = generateFingerprint();
        localStorage.setItem('device_fingerprint', newFingerprint);
        return newFingerprint;
      }
      return fingerprint;
    } catch (error) {
      return generateFingerprint();
    }
  }
  return '';
}

// Helper function to get headers
export function getHeaders(): HeadersInit {
  return {
    'Content-Type': 'application/json',
    'X-App-ID': getAppId(),
   /*  'X-Device-ID': getDeviceId() */
  };
}

// Store verified device ID
let isDeviceVerified = false;
let verificationPromise: Promise<{ success: boolean; deviceId?: number; isTrusted?: boolean }> | null = null;

 
/* export async function verifyDevice(): Promise<{ success: boolean; deviceId?: number; isTrusted?: boolean }> {
   if (verificationPromise) {
    await verificationPromise;
  }

  if (isDeviceVerified) {
    return { success: true, isTrusted: true };
  }

  verificationPromise = (async () => {
    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://76.13.135.206:5000/api/v1';
      
      const response = await fetch(`${API_BASE_URL}/auth/verify-device`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-App-ID': getAppId(),
         },
        body: JSON.stringify({
          userAgent: getUserAgent(),
          fingerprint: getDeviceFingerprint()
        }),
         redirect: 'manual'
      });

       if (response.type === 'opaqueredirect' || response.status >= 300 && response.status < 400) {
        isDeviceVerified = true;
        return { success: true, isTrusted: true };
      }

      if (response.ok) {
        const data = await response.json();
        isDeviceVerified = true;
        return {
          success: true,
          deviceId: data.data?.deviceId,
          isTrusted: data.data?.isTrusted
        };
      }

      // If verification fails, still mark as verified to avoid blocking the app
      // The app should work even if device verification fails
      isDeviceVerified = true;
      return { success: false };
    } catch (error) {
      // On any error, still allow the app to function
      // Device verification is optional for basic functionality
      isDeviceVerified = true;
      return { success: false };
    } finally {
      verificationPromise = null;
    }
  })();

  return verificationPromise;
} */

// Initialize device verification (call this once on app load)
/* export function initializeDevice() {
   verifyDevice().catch(err => {
    console.warn('Device verification failed:', err);
  });
} */

