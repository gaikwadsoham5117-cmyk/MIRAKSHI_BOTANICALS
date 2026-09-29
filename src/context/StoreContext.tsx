import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  Product, 
  CartItem, 
  Order, 
  Enquiry, 
  Review, 
  Ingredient, 
  WebsiteSettings, 
  ToastMessage,
  CustomerNotification,
  PaymentMethod,
  OrderStatus 
} from '../types';
import { firestoreService } from '../services/firestoreService';
import { notificationService } from '../services/notificationService';
import { requestFCMToken } from '../firebase/messaging';
import { INITIAL_PRODUCT, INITIAL_PRODUCTS, INITIAL_SETTINGS, INITIAL_INGREDIENTS, INITIAL_REVIEWS } from '../constants/initialData';

interface PlaceOrderParams {
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  quantity: number;
  paymentMethod: PaymentMethod;
  notes?: string;
}

interface StoreContextType {
  products: Product[];
  mainProduct: Product;
  settings: WebsiteSettings;
  ingredients: Ingredient[];
  reviews: Review[];
  enquiries: Enquiry[];
  orders: Order[];
  cart: CartItem[];
  isCartOpen: boolean;
  isCheckoutOpen: boolean;
  checkoutProduct: Product;
  checkoutQuantity: number;
  isLoading: boolean;
  toasts: ToastMessage[];
  notifications: CustomerNotification[];
  activeBannerNotification: CustomerNotification | null;
  dismissBannerNotification: () => void;
  markNotificationsAsRead: () => void;
  requestNotificationPermission: () => Promise<NotificationPermission>;

  // Actions
  setIsCartOpen: (open: boolean) => void;
  openCheckout: (product?: Product, quantity?: number) => void;
  closeCheckout: () => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Order & Enquiry operations
  placeOrder: (params: PlaceOrderParams) => Promise<Order>;
  submitEnquiry: (data: { name: string; phone: string; email?: string; message: string }) => Promise<void>;
  trackOrder: (orderId: string, phone: string) => Promise<Order | null>;

  // Admin sync helpers
  updateSettings: (newSettings: WebsiteSettings) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, notes?: string) => Promise<void>;
  updateEnquiryStatus: (id: string, status: 'new' | 'contacted' | 'resolved') => Promise<void>;
  deleteEnquiry: (id: string) => Promise<void>;
  saveIngredient: (ingredient: Ingredient) => Promise<void>;
  deleteIngredient: (id: string) => Promise<void>;
  saveReview: (review: Review) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  reloadAllData: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<WebsiteSettings>(INITIAL_SETTINGS);
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<Product>(INITIAL_PRODUCT);
  const [checkoutQuantity, setCheckoutQuantity] = useState<number>(1);
  const [isLoading, setIsLoading] = useState(true);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Notification States
  const [notifications, setNotifications] = useState<CustomerNotification[]>(() => {
    return notificationService.getNotifications();
  });
  const [activeBannerNotification, setActiveBannerNotification] = useState<CustomerNotification | null>(null);

  // Synchronize notifications across tabs and internal events
  useEffect(() => {
    const handleNewNotif = (e: any) => {
      const notif = e.detail as CustomerNotification;
      setNotifications(prev => [notif, ...prev.filter(n => n.id !== notif.id)]);
      setActiveBannerNotification(notif);
    };

    const handleReadNotif = () => {
      setNotifications(notificationService.getNotifications());
    };

    window.addEventListener('mb:new_notification', handleNewNotif);
    window.addEventListener('mb:notifications_read', handleReadNotif);
    return () => {
      window.removeEventListener('mb:new_notification', handleNewNotif);
      window.removeEventListener('mb:notifications_read', handleReadNotif);
    };
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem('mb_cart', JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Load initial store data
  const reloadAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedProducts, fetchedSettings, fetchedIngredients, fetchedReviews, fetchedEnquiries, fetchedOrders] = await Promise.all([
        firestoreService.getProducts(),
        firestoreService.getSettings(),
        firestoreService.getIngredients(),
        firestoreService.getReviews(),
        firestoreService.getEnquiries(),
        firestoreService.getOrders()
      ]);

      if (fetchedProducts.length > 0) setProducts(fetchedProducts);
      if (fetchedSettings) setSettings(fetchedSettings);
      if (fetchedIngredients.length > 0) setIngredients(fetchedIngredients);
      setReviews(fetchedReviews);
      setEnquiries(fetchedEnquiries);
      setOrders(fetchedOrders);
    } catch (err) {
      console.warn('Initial store load error, using fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reloadAllData();
  }, [reloadAllData]);

  // Connect real-time Firebase Firestore order status listener
  useEffect(() => {
    const prevStatusMap = new Map<string, string>();

    const unsubscribeOrders = firestoreService.subscribeToAllOrders((liveOrders) => {
      liveOrders.forEach(order => {
        const previousStatus = prevStatusMap.get(order.orderId);
        // If an existing order changed status in Firebase, trigger immediate notification
        if (previousStatus && previousStatus !== order.orderStatus) {
          notificationService.notifyStatusUpdate(
            order.orderId,
            order.orderStatus,
            order.trackingNumber,
            order.customerName
          );
        }
        prevStatusMap.set(order.orderId, order.orderStatus);
      });

      setOrders(liveOrders);
    });

    const unsubscribeProducts = firestoreService.subscribeToProducts((liveProducts) => {
      if (liveProducts && liveProducts.length > 0) {
        setProducts(liveProducts);
      }
    });

    return () => {
      unsubscribeOrders();
      unsubscribeProducts();
    };
  }, []);

  const mainProduct = products[0] || INITIAL_PRODUCT;

  // Cart Management
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`Added ${quantity} × ${product.name} to cart 🌿`, 'success');
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev => prev.map(item => 
      item.product.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
    showToast('Removed item from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const openCheckout = (product?: Product, quantity: number = 1) => {
    setCheckoutProduct(product || mainProduct);
    setCheckoutQuantity(Math.max(1, quantity));
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
  };

  // Place Order with Dynamic Calculation
  const placeOrder = async (params: PlaceOrderParams): Promise<Order> => {
    const unitPrice = checkoutProduct.price || settings.onlinePrice || 349;
    const codChargePerOrder = params.paymentMethod === 'cod' ? (checkoutProduct.codCharge || settings.codCharge || 50) : 0;
    const baseTotal = unitPrice * params.quantity;
    const totalAmount = baseTotal + codChargePerOrder;

    // Unique readable order ID e.g. MB-892415
    const timestampDigits = Date.now().toString().slice(-4);
    const randomDigits = Math.floor(10 + Math.random() * 90);
    const orderId = `MB-${timestampDigits}${randomDigits}`;

    const newOrder: Order = {
      orderId,
      customerName: params.customerName.trim(),
      phone: params.phone.trim(),
      email: params.email?.trim() || '',
      address: params.address.trim(),
      city: params.city.trim(),
      state: params.state.trim(),
      pincode: params.pincode.trim(),
      quantity: params.quantity,
      productTitle: checkoutProduct.name,
      unitPrice,
      codCharge: codChargePerOrder,
      amount: totalAmount,
      paymentMethod: params.paymentMethod,
      paymentStatus: params.paymentMethod === 'online' ? 'paid' : 'pending',
      orderStatus: 'Order Placed',
      notes: params.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const savedOrder = await firestoreService.createOrder(newOrder);
    setOrders(prev => [savedOrder, ...prev]);

    // Save order ID to customer local order tracker
    try {
      const myOrderIds: string[] = JSON.parse(localStorage.getItem('mb_customer_order_ids') || '[]');
      if (!myOrderIds.includes(savedOrder.orderId)) {
        myOrderIds.unshift(savedOrder.orderId);
        localStorage.setItem('mb_customer_order_ids', JSON.stringify(myOrderIds.slice(0, 20)));
      }
    } catch {
      // safe fallback
    }

    // Automatically trigger notification with direct redirection link
    try {
      notificationService.notifyBookingCompleted(savedOrder);
      notificationService.sendMobileNotification({
        phone: savedOrder.phone,
        customerName: savedOrder.customerName,
        orderId: savedOrder.orderId,
        amount: savedOrder.amount,
        orderStatus: savedOrder.orderStatus
      });
      requestFCMToken({ phone: savedOrder.phone, customerName: savedOrder.customerName });
    } catch (notifErr) {
      console.warn('Booking notification error:', notifErr);
    }

    // Clear cart item if ordered that product
    removeFromCart(checkoutProduct.id);
    closeCheckout();

    return savedOrder;
  };

  const submitEnquiry = async (data: { name: string; phone: string; email?: string; message: string }) => {
    const enquiry = await firestoreService.createEnquiry({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || '',
      message: data.message.trim(),
      status: 'new'
    });
    setEnquiries(prev => [enquiry, ...prev]);
    showToast('Thank you! Your enquiry has been received. We will contact you soon.', 'success');
  };

  const trackOrder = async (orderId: string, phone: string): Promise<Order | null> => {
    return await firestoreService.getOrderByIdAndPhone(orderId, phone);
  };

  // Admin operations
  const updateSettings = async (newSettings: WebsiteSettings) => {
    await firestoreService.saveSettings(newSettings);
    setSettings(newSettings);
    showToast('Website settings updated successfully', 'success');
  };

  const updateProduct = async (product: Product) => {
    await firestoreService.saveProduct(product);
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    showToast('Product updated successfully', 'success');
  };

  const addProduct = async (product: Product) => {
    await firestoreService.saveProduct(product);
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = product;
        return next;
      }
      return [...prev, product];
    });
    showToast(`Product "${product.name}" added to catalog 🌿`, 'success');
  };

  const deleteProduct = async (id: string) => {
    await firestoreService.deleteProduct(id);
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Product removed', 'info');
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, trackingNumber?: string, notes?: string) => {
    await firestoreService.updateOrderStatus(orderId, status, trackingNumber, notes);
    
    let matchedCustomerName = '';
    setOrders(prev => prev.map(o => {
      if (o.orderId === orderId) {
        matchedCustomerName = o.customerName;
        return {
          ...o,
          orderStatus: status,
          ...(trackingNumber !== undefined ? { trackingNumber } : {}),
          ...(notes !== undefined ? { notes } : {}),
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));

    // Trigger customer notification for status update with direct redirection
    try {
      notificationService.notifyStatusUpdate(orderId, status, trackingNumber, matchedCustomerName);
      const targetOrder = orders.find(o => o.orderId === orderId);
      if (targetOrder) {
        notificationService.sendMobileNotification({
          phone: targetOrder.phone,
          customerName: matchedCustomerName || targetOrder.customerName,
          orderId,
          amount: targetOrder.amount,
          orderStatus: status,
          trackingNumber
        });
      }
    } catch (notifErr) {
      console.warn('Status notification error:', notifErr);
    }

    showToast(`Order ${orderId} status updated to ${status}`, 'success');
  };

  const updateEnquiryStatus = async (id: string, status: 'new' | 'contacted' | 'resolved') => {
    await firestoreService.updateEnquiryStatus(id, status);
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
    showToast('Enquiry status updated', 'success');
  };

  const deleteEnquiry = async (id: string) => {
    await firestoreService.deleteEnquiry(id);
    setEnquiries(prev => prev.filter(e => e.id !== id));
    showToast('Enquiry deleted', 'info');
  };

  const saveIngredient = async (ingredient: Ingredient) => {
    await firestoreService.saveIngredient(ingredient);
    setIngredients(prev => {
      const idx = prev.findIndex(i => i.id === ingredient.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = ingredient;
        return next;
      }
      return [...prev, ingredient];
    });
    showToast('Ingredient saved', 'success');
  };

  const deleteIngredient = async (id: string) => {
    await firestoreService.deleteIngredient(id);
    setIngredients(prev => prev.filter(i => i.id !== id));
    showToast('Ingredient removed', 'info');
  };

  const saveReview = async (review: Review) => {
    await firestoreService.saveReview(review);
    setReviews(prev => {
      const idx = prev.findIndex(r => r.id === review.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = review;
        return next;
      }
      return [...prev, review];
    });
    showToast('Review saved successfully', 'success');
  };

  const deleteReview = async (id: string) => {
    await firestoreService.deleteReview(id);
    setReviews(prev => prev.filter(r => r.id !== id));
    showToast('Review deleted', 'info');
  };

  const dismissBannerNotification = () => {
    setActiveBannerNotification(null);
  };

  const markNotificationsAsRead = () => {
    notificationService.markAllAsRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const requestNotificationPermission = async () => {
    const res = await notificationService.requestPermission();
    if (res === 'granted') {
      showToast('Notifications enabled! You will receive live updates on your orders 🌿', 'success');
      notificationService.sendBrowserNotification(
        '🌿 Mirakshi Botanicals Notifications Active',
        'You will receive instant alerts when your booking completes or when your order is dispatched!',
        window.location.origin
      );
      // Register Firebase Cloud Messaging Service Worker & Device Token (100% Free)
      requestFCMToken();
    } else {
      showToast('Notification permission was not granted.', 'info');
    }
    return res;
  };

  return (
    <StoreContext.Provider value={{
      products,
      mainProduct,
      settings,
      ingredients,
      reviews,
      enquiries,
      orders,
      cart,
      isCartOpen,
      isCheckoutOpen,
      checkoutProduct,
      checkoutQuantity,
      isLoading,
      toasts,
      notifications,
      activeBannerNotification,
      dismissBannerNotification,
      markNotificationsAsRead,
      requestNotificationPermission,

      setIsCartOpen,
      openCheckout,
      closeCheckout,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      showToast,
      removeToast,

      placeOrder,
      submitEnquiry,
      trackOrder,

      updateSettings,
      updateProduct,
      addProduct,
      deleteProduct,
      updateOrderStatus,
      updateEnquiryStatus,
      deleteEnquiry,
      saveIngredient,
      deleteIngredient,
      saveReview,
      deleteReview,
      reloadAllData
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
