import { getMessaging, getToken, onMessage, isSupported, Messaging } from 'firebase/messaging';
import { app, db, FIREBASE_VAPID_KEY } from './index';
import { doc, setDoc } from 'firebase/firestore';

let messagingInstance: Messaging | null = null;

/**
 * Check if Firebase Cloud Messaging is supported in this browser/device
 */
export async function isMessagingSupported(): Promise<boolean> {
  try {
    if (typeof window === 'undefined') return false;
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return false;
    return await isSupported();
  } catch {
    return false;
  }
}

/**
 * Initialize Firebase Cloud Messaging safely
 */
export async function getFirebaseMessaging(): Promise<Messaging | null> {
  if (messagingInstance) return messagingInstance;
  const supported = await isMessagingSupported();
  if (supported) {
    try {
      messagingInstance = getMessaging(app);
      return messagingInstance;
    } catch (e) {
      console.info('Firebase messaging initialization note:', e);
      return null;
    }
  }
  return null;
}

/**
 * Register Service Worker & Request FCM Push Registration Token (100% Free)
 */
export async function requestFCMToken(options?: { phone?: string; customerName?: string }): Promise<string | null> {
  try {
    const supported = await isMessagingSupported();
    if (!supported) {
      console.info('FCM is not supported in this browser environment.');
      return null;
    }

    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.info('Notification permission was not granted:', permission);
      return null;
    }

    // Register service worker if not already registered
    let swRegistration: ServiceWorkerRegistration | undefined;
    if ('serviceWorker' in navigator) {
      try {
        swRegistration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: '/'
        });
        await navigator.serviceWorker.ready;
      } catch (swErr) {
        console.warn('Service worker registration note:', swErr);
      }
    }

    const messaging = await getFirebaseMessaging();
    if (!messaging) return null;

    const vapidKey = 
      localStorage.getItem('mb_fcm_vapid_key') || 
      import.meta.env.VITE_FIREBASE_VAPID_KEY || 
      FIREBASE_VAPID_KEY;

    // Get FCM Token (Google Firebase Cloud Messaging is 100% Free)
    const token = await getToken(messaging, {
      serviceWorkerRegistration: swRegistration,
      vapidKey: vapidKey || undefined
    });

    if (token) {
      console.log('✅ Firebase Cloud Messaging Token generated (100% Free Push):', token);
      
      // Save token to Firestore so backend can target this mobile phone anytime
      try {
        await setDoc(doc(db, 'fcm_tokens', token), {
          token,
          phone: options?.phone || '',
          customerName: options?.customerName || '',
          userAgent: navigator.userAgent,
          updatedAt: new Date().toISOString()
        }, { merge: true });
      } catch (saveErr) {
        console.info('Note saving FCM token to Firestore:', saveErr);
      }

      // Also store locally
      try {
        localStorage.setItem('mb_fcm_token', token);
      } catch {}

      return token;
    }
    return null;
  } catch (err) {
    console.warn('Error obtaining Firebase Cloud Messaging token:', err);
    return null;
  }
}

/**
 * Setup foreground listener for incoming FCM notifications
 */
export async function setupFCMForegroundListener(onNotification: (payload: any) => void): Promise<(() => void) | null> {
  const messaging = await getFirebaseMessaging();
  if (!messaging) return null;

  try {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log('Foreground FCM notification received:', payload);
      onNotification(payload);
    });
    return unsubscribe;
  } catch {
    return null;
  }
}
