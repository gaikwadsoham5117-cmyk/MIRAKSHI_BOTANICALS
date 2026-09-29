import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from '../firebase';
import { 
  Product, 
  Order, 
  Enquiry, 
  Review, 
  Ingredient, 
  WebsiteSettings, 
  OrderStatus 
} from '../types';
import { 
  INITIAL_PRODUCT,
  INITIAL_PRODUCTS, 
  INITIAL_SETTINGS, 
  INITIAL_INGREDIENTS, 
  INITIAL_REVIEWS 
} from '../constants/initialData';

const STORAGE_KEYS = {
  PRODUCTS: 'mb_products',
  ORDERS: 'mb_orders',
  SETTINGS: 'mb_settings',
  INGREDIENTS: 'mb_ingredients',
  REVIEWS: 'mb_reviews',
  ENQUIRIES: 'mb_enquiries'
};

// Safe LocalStorage helpers
function getLocal<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
}

export const firestoreService = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    // 1. Try Firestore database collection
    try {
      const snap = await getDocs(collection(db, 'products'));
      if (!snap.empty) {
        const products = snap.docs.map(d => ({ ...d.data(), id: d.id } as Product));
        setLocal(STORAGE_KEYS.PRODUCTS, products);
        return products;
      }
    } catch (err) {
      console.info('Firestore getProducts connecting to fallback:', err);
    }

    // 2. Try backend REST API endpoint
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setLocal(STORAGE_KEYS.PRODUCTS, json.data);
          return json.data;
        }
      }
    } catch (apiErr) {
      // Backend api offline or fallback
    }

    // 3. Fallback to localStorage / initial preset products
    return getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async saveProduct(product: Product): Promise<void> {
    // 1. Persist to Firestore database
    try {
      await setDoc(doc(db, 'products', product.id), product, { merge: true });
    } catch (err) {
      console.info('Firestore saveProduct sync note:', err);
    }

    // 2. Persist to backend server API
    try {
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      });
    } catch (apiErr) {
      console.info('Backend API save product note:', apiErr);
    }

    // 3. Persist to local storage
    const current = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const idx = current.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      current[idx] = product;
    } else {
      current.push(product);
    }
    setLocal(STORAGE_KEYS.PRODUCTS, current);
  },

  async deleteProduct(productId: string): Promise<void> {
    // 1. Delete from Firestore database
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      console.info('Firestore deleteProduct sync note:', err);
    }

    // 2. Delete from backend server API
    try {
      await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });
    } catch (apiErr) {
      console.info('Backend API delete product note:', apiErr);
    }

    // 3. Delete from local storage
    const current = getLocal<Product[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const filtered = current.filter(p => p.id !== productId);
    setLocal(STORAGE_KEYS.PRODUCTS, filtered);
  },

  /**
   * Real-time Firebase Firestore listener for products
   */
  subscribeToProducts(callback: (products: Product[]) => void): () => void {
    try {
      const q = query(collection(db, 'products'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const prods = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Product));
          setLocal(STORAGE_KEYS.PRODUCTS, prods);
          callback(prods);
        }
      }, (error) => {
        console.warn('Real-time products subscription note:', error.message);
      });
      return unsubscribe;
    } catch (e) {
      return () => {};
    }
  },

  // SETTINGS
  async getSettings(): Promise<WebsiteSettings> {
    try {
      const snap = await getDoc(doc(db, 'settings', 'global'));
      if (snap.exists()) {
        const data = snap.data() as WebsiteSettings;
        setLocal(STORAGE_KEYS.SETTINGS, data);
        return data;
      }
    } catch (err) {
      console.info('Firestore getSettings using local state:', err);
    }
    return getLocal<WebsiteSettings>(STORAGE_KEYS.SETTINGS, INITIAL_SETTINGS);
  },

  async saveSettings(settings: WebsiteSettings): Promise<void> {
    try {
      await setDoc(doc(db, 'settings', 'global'), settings, { merge: true });
    } catch (err) {
      console.info('Firestore saveSettings sync error:', err);
    }
    setLocal(STORAGE_KEYS.SETTINGS, settings);
  },

  // ORDERS
  async createOrder(order: Order): Promise<Order> {
    try {
      await setDoc(doc(db, 'orders', order.orderId), order);
    } catch (err) {
      console.info('Firestore createOrder sync fallback:', err);
    }
    const currentOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    // check if already exists
    const idx = currentOrders.findIndex(o => o.orderId === order.orderId);
    if (idx >= 0) {
      currentOrders[idx] = order;
    } else {
      currentOrders.unshift(order);
    }
    setLocal(STORAGE_KEYS.ORDERS, currentOrders);
    return order;
  },

  async getOrders(): Promise<Order[]> {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      if (!snap.empty) {
        const orders = snap.docs.map(d => ({ ...d.data(), id: d.id } as Order));
        // Sort newest first
        orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLocal(STORAGE_KEYS.ORDERS, orders);
        return orders;
      }
    } catch (err) {
      console.info('Firestore getOrders using local fallback:', err);
    }
    return getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
  },

  async getOrderByIdAndPhone(orderId: string, phone: string): Promise<Order | null> {
    const cleanId = orderId.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');

    try {
      const snap = await getDoc(doc(db, 'orders', cleanId));
      if (snap.exists()) {
        const data = snap.data() as Order;
        const dataPhone = (data.phone || '').replace(/\D/g, '');
        if (dataPhone.includes(cleanPhone) || cleanPhone.includes(dataPhone) || !cleanPhone) {
          return data;
        }
      }
    } catch (err) {
      console.info('Firestore order search query failed:', err);
    }

    // Check local fallback
    const localOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    const found = localOrders.find(o => 
      o.orderId.toUpperCase() === cleanId && 
      (cleanPhone ? o.phone.replace(/\D/g, '').includes(cleanPhone) : true)
    );
    return found || null;
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, trackingNumber?: string, notes?: string): Promise<void> {
    const updatePayload: Partial<Order> = {
      orderStatus: status,
      updatedAt: new Date().toISOString()
    };
    if (trackingNumber !== undefined) updatePayload.trackingNumber = trackingNumber;
    if (notes !== undefined) updatePayload.notes = notes;

    try {
      await updateDoc(doc(db, 'orders', orderId), updatePayload);
    } catch (err) {
      console.info('Firestore updateOrderStatus sync error:', err);
    }

    const currentOrders = getLocal<Order[]>(STORAGE_KEYS.ORDERS, []);
    const idx = currentOrders.findIndex(o => o.orderId === orderId);
    if (idx >= 0) {
      currentOrders[idx] = { ...currentOrders[idx], ...updatePayload };
      setLocal(STORAGE_KEYS.ORDERS, currentOrders);
    }
  },

  /**
   * Real-time Firebase Firestore listener for orders
   */
  subscribeToAllOrders(callback: (orders: Order[]) => void): () => void {
    try {
      const q = query(collection(db, 'orders'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const orders = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Order));
          orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          setLocal(STORAGE_KEYS.ORDERS, orders);
          callback(orders);
        }
      }, (error) => {
        console.warn('Real-time order subscription note:', error.message);
      });
      return unsubscribe;
    } catch (e) {
      console.warn('Could not register onSnapshot listener:', e);
      return () => {};
    }
  },

  /**
   * Real-time listener for a single order by ID
   */
  subscribeToOrder(orderId: string, callback: (order: Order) => void): () => void {
    try {
      const unsubscribe = onSnapshot(doc(db, 'orders', orderId), (snapshot) => {
        if (snapshot.exists()) {
          const order = { ...snapshot.data(), id: snapshot.id } as Order;
          callback(order);
        }
      }, (error) => {
        console.warn('Real-time single order subscription note:', error.message);
      });
      return unsubscribe;
    } catch (e) {
      console.warn('Could not register single order listener:', e);
      return () => {};
    }
  },

  // ENQUIRIES
  async createEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt'>): Promise<Enquiry> {
    const id = 'ENQ-' + Date.now().toString(36).toUpperCase();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id,
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'enquiries', id), newEnquiry);
    } catch (err) {
      console.info('Firestore createEnquiry error:', err);
    }

    const enquiries = getLocal<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    enquiries.unshift(newEnquiry);
    setLocal(STORAGE_KEYS.ENQUIRIES, enquiries);
    return newEnquiry;
  },

  async getEnquiries(): Promise<Enquiry[]> {
    try {
      const snap = await getDocs(collection(db, 'enquiries'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Enquiry));
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setLocal(STORAGE_KEYS.ENQUIRIES, list);
        return list;
      }
    } catch (err) {
      console.info('Firestore getEnquiries using local list:', err);
    }
    return getLocal<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
  },

  async updateEnquiryStatus(id: string, status: 'new' | 'contacted' | 'resolved'): Promise<void> {
    try {
      await updateDoc(doc(db, 'enquiries', id), { status });
    } catch (err) {
      console.info('Firestore updateEnquiryStatus error:', err);
    }
    const current = getLocal<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    const idx = current.findIndex(e => e.id === id);
    if (idx >= 0) {
      current[idx].status = status;
      setLocal(STORAGE_KEYS.ENQUIRIES, current);
    }
  },

  async deleteEnquiry(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'enquiries', id));
    } catch (err) {
      console.info('Firestore deleteEnquiry error:', err);
    }
    const current = getLocal<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, []);
    setLocal(STORAGE_KEYS.ENQUIRIES, current.filter(e => e.id !== id));
  },

  // INGREDIENTS
  async getIngredients(): Promise<Ingredient[]> {
    try {
      const snap = await getDocs(collection(db, 'ingredients'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Ingredient));
        list.sort((a, b) => (a.order || 0) - (b.order || 0));
        setLocal(STORAGE_KEYS.INGREDIENTS, list);
        return list;
      }
    } catch (err) {
      console.info('Firestore getIngredients using local fallback:', err);
    }
    return getLocal<Ingredient[]>(STORAGE_KEYS.INGREDIENTS, INITIAL_INGREDIENTS);
  },

  async saveIngredient(ingredient: Ingredient): Promise<void> {
    try {
      await setDoc(doc(db, 'ingredients', ingredient.id), ingredient, { merge: true });
    } catch (err) {
      console.info('Firestore saveIngredient error:', err);
    }
    const current = getLocal<Ingredient[]>(STORAGE_KEYS.INGREDIENTS, INITIAL_INGREDIENTS);
    const idx = current.findIndex(i => i.id === ingredient.id);
    if (idx >= 0) current[idx] = ingredient;
    else current.push(ingredient);
    setLocal(STORAGE_KEYS.INGREDIENTS, current);
  },

  async deleteIngredient(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'ingredients', id));
    } catch (err) {
      console.info('Firestore deleteIngredient error:', err);
    }
    const current = getLocal<Ingredient[]>(STORAGE_KEYS.INGREDIENTS, INITIAL_INGREDIENTS);
    setLocal(STORAGE_KEYS.INGREDIENTS, current.filter(i => i.id !== id));
  },

  // REVIEWS
  async getReviews(): Promise<Review[]> {
    try {
      const snap = await getDocs(collection(db, 'reviews'));
      if (!snap.empty) {
        const list = snap.docs.map(d => ({ ...d.data(), id: d.id } as Review));
        setLocal(STORAGE_KEYS.REVIEWS, list);
        return list;
      }
    } catch (err) {
      console.info('Firestore getReviews fallback:', err);
    }
    return getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  },

  async saveReview(review: Review): Promise<void> {
    try {
      await setDoc(doc(db, 'reviews', review.id), review, { merge: true });
    } catch (err) {
      console.info('Firestore saveReview error:', err);
    }
    const current = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    const idx = current.findIndex(r => r.id === review.id);
    if (idx >= 0) current[idx] = review;
    else current.push(review);
    setLocal(STORAGE_KEYS.REVIEWS, current);
  },

  async deleteReview(id: string): Promise<void> {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (err) {
      console.info('Firestore deleteReview error:', err);
    }
    const current = getLocal<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    setLocal(STORAGE_KEYS.REVIEWS, current.filter(r => r.id !== id));
  }
};
