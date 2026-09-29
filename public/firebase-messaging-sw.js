// Firebase Cloud Messaging Service Worker (100% Free Google Push Notifications)
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker
firebase.initializeApp({
  apiKey: "AIzaSyDpAdwTJEvIuriusz6XKZK8PVnV_bqYg",
  authDomain: "oilwebsite-a9a32.firebaseapp.com",
  projectId: "oilwebsite-a9a32",
  storageBucket: "oilwebsite-a9a32.firebasestorage.app",
  messagingSenderId: "847462533912",
  appId: "1:847462533912:web:5cfc288abc122cf0fd2c6d"
});

const messaging = firebase.messaging();

// Background push notification handler
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background notification: ', payload);
  
  const notificationTitle = payload.notification?.title || payload.data?.title || 'Mirakshi Botanicals';
  const notificationOptions = {
    body: payload.notification?.body || payload.data?.body || 'Order update received.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: {
      url: payload.data?.url || payload.notification?.click_action || '/track-order'
    },
    actions: [
      { action: 'open_order', title: 'View Order Details' }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Click listener to redirect directly to website page
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/track-order';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window is already open, focus it and navigate
      for (let client of windowClients) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      // Otherwise open a fresh window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
