// Notification service supporting Web Push Notification API, in-app rich alert, audio chime, and redirection
import { CustomerNotification, Order, OrderStatus } from '../types';

const NOTIFICATIONS_STORAGE_KEY = 'mb_customer_notifications';

export const notificationService = {
  /**
   * Request browser notification permission
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        return permission;
      } catch (e) {
        console.warn('Notification permission request error:', e);
        return 'denied';
      }
    }
    return 'default';
  },

  /**
   * Check current permission
   */
  getPermission(): NotificationPermission {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'denied';
  },

  /**
   * Send a browser notification that redirects to website page on click
   */
  sendBrowserNotification(title: string, body: string, targetUrl: string) {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const notif = new Notification(title, {
          body,
          icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌿</text></svg>',
          badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🌿</text></svg>',
          tag: targetUrl,
          requireInteraction: true // keep on screen until user interacts
        });

        notif.onclick = function (event) {
          event.preventDefault();
          window.focus();
          if (targetUrl) {
            window.location.href = targetUrl;
          }
          notif.close();
        };
      } catch (err) {
        console.warn('Browser system notification dispatch error:', err);
      }
    }
  },

  /**
   * Play subtle chime audio when notification fires
   */
  playNotificationSound() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15); // A5
      gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.4);
    } catch {
      // AudioContext policy fallback, safe ignore
    }
  },

  /**
   * Store notification in customer history
   */
  saveNotification(notification: CustomerNotification): void {
    try {
      const existing = notificationService.getNotifications();
      // Prepend newest
      const updated = [notification, ...existing.filter(n => n.id !== notification.id)].slice(0, 30);
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('mb:new_notification', { detail: notification }));
    } catch (e) {
      console.warn('Failed to save notification locally:', e);
    }
  },

  /**
   * Get all customer notifications
   */
  getNotifications(): CustomerNotification[] {
    try {
      const raw = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Mark all as read
   */
  markAllAsRead(): void {
    try {
      const notifs = notificationService.getNotifications().map(n => ({ ...n, read: true }));
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifs));
      window.dispatchEvent(new CustomEvent('mb:notifications_read'));
    } catch (e) {
      console.warn('Failed to mark notifications read:', e);
    }
  },

  /**
   * Trigger Booking Completed Notification
   */
  notifyBookingCompleted(order: Order, baseUrl = window.location.origin) {
    const targetUrl = `${baseUrl}/order-confirmation/${order.orderId}`;
    const title = `🌿 Booking Confirmed: #${order.orderId}`;
    const body = `Thank you ${order.customerName}! Your order for ${order.quantity} × Mira Herbal Hair Oil (₹${order.amount}) is booked. Click to view order details & receipt.`;

    const notifItem: CustomerNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      orderId: order.orderId,
      title,
      body,
      url: `/order-confirmation/${order.orderId}`,
      type: 'order_booked',
      status: order.orderStatus,
      read: false,
      createdAt: new Date().toISOString(),
      phone: order.phone
    };

    notificationService.saveNotification(notifItem);
    notificationService.playNotificationSound();
    notificationService.sendBrowserNotification(title, body, targetUrl);

    return notifItem;
  },

  /**
   * Trigger Status Update Notification (Shipped, Out for Delivery, Delivered, etc.)
   */
  notifyStatusUpdate(orderId: string, status: OrderStatus, trackingNumber?: string, customerName?: string, baseUrl = window.location.origin) {
    const targetUrl = `${baseUrl}/track-order?id=${orderId}`;
    let title = `📦 Order Status Update: #${orderId}`;
    let body = `Your order is now "${status}". Click here to track your package live!`;

    if (status === 'Confirmed') {
      title = `✨ Order Confirmed: #${orderId}`;
      body = `Great news${customerName ? ' ' + customerName : ''}! Your Mira Herbal Hair Oil order #${orderId} is confirmed and scheduled for fresh batch preparation. Click to track.`;
    } else if (status === 'Processing') {
      title = `🌿 Batch Prepared: #${orderId}`;
      body = `Your botanical hair oil has been freshly bottled and packed with natural care. Click to track shipment progress.`;
    } else if (status === 'Shipped') {
      title = `🚚 Shipped: #${orderId}`;
      body = `Your order has been handed to the courier${trackingNumber ? ` (AWB: ${trackingNumber})` : ''}! Click to track live delivery.`;
    } else if (status === 'Out for Delivery') {
      title = `🛵 Out for Delivery Today: #${orderId}`;
      body = `Your Mira Herbal Hair Oil package is out with the delivery agent and will reach your doorstep today! Click to view details.`;
    } else if (status === 'Delivered') {
      title = `🎉 Order Delivered: #${orderId}`;
      body = `Your package has been delivered! Enjoy pure botanical nourishment for your hair care ritual. Click to view order.`;
    } else if (status === 'Cancelled') {
      title = `⚠️ Order Cancelled: #${orderId}`;
      body = `Order #${orderId} has been cancelled. Click here if you have questions or wish to contact support on WhatsApp.`;
    }

    const notifItem: CustomerNotification = {
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
      orderId,
      title,
      body,
      url: `/track-order?id=${orderId}`,
      type: 'status_update',
      status,
      read: false,
      createdAt: new Date().toISOString()
    };

    notificationService.saveNotification(notifItem);
    notificationService.playNotificationSound();
    notificationService.sendBrowserNotification(title, body, targetUrl);

    return notifItem;
  },

  /**
   * Send notification directly targeted to customer's mobile number
   */
  async sendMobileNotification(params: {
    phone: string;
    customerName: string;
    orderId: string;
    amount: number;
    orderStatus?: OrderStatus;
    trackingNumber?: string;
  }) {
    try {
      const res = await fetch('/api/notifications/send-mobile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params)
      });
      return await res.json();
    } catch (e) {
      console.warn('Backend mobile notification dispatch note:', e);
      const cleanPhone = params.phone.replace(/\D/g, '');
      const trackUrl = `${window.location.origin}/track-order?id=${params.orderId}`;
      const text = encodeURIComponent(
        `🌿 Mirakshi Botanicals Order Notification:\n` +
        `Hello ${params.customerName},\n` +
        `Your Mira Herbal Hair Oil order #${params.orderId} (₹${params.amount}) is confirmed!\n` +
        `Status: ${params.orderStatus || 'Order Placed'}\n` +
        `👉 Live Tracking: ${trackUrl}\n` +
        `Helpline WhatsApp: 9373080098`
      );
      return {
        success: true,
        channels: {
          whatsapp: `https://wa.me/91${cleanPhone}?text=${text}`,
          sms: `sms:+91${cleanPhone}?body=${text}`
        }
      };
    }
  }
};
