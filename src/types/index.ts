export type OrderStatus = 
  | 'Order Placed' 
  | 'Confirmed' 
  | 'Processing' 
  | 'Shipped' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Cancelled';

export type PaymentMethod = 'online' | 'cod';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

export interface Product {
  id: string;
  name: string;
  brand: string;
  previousBrand: string;
  size: string;
  price: number;
  codCharge: number;
  codTotal: number;
  inStock: boolean;
  stockCount: number;
  description: string;
  badge: string;
  benefits: string[];
  imageUrl: string;
  sku: string;
  category: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id?: string;
  orderId: string;
  customerName: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  quantity: number;
  productTitle: string;
  unitPrice: number;
  codCharge: number;
  amount: number; // total calculated
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerSummary {
  name: string;
  phone: string;
  email?: string;
  address: string;
  city: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  verifiedPurchase: boolean;
  active: boolean;
  createdAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  description: string;
  benefits: string;
  imageUrl?: string;
  active: boolean;
  order?: number;
}

export interface WebsiteSettings {
  brandName: string;
  previousBrandName: string;
  phone: string;
  whatsapp: string;
  onlinePrice: number;
  codCharge: number;
  productSize: string;
  heroHeading: string;
  heroSubheading: string;
  ctaText: string;
  address: string;
  email: string;
  deliveryDays: string;
  // Mobile Phone SMS & WhatsApp Notification Settings
  smsProvider?: 'fast2sms' | 'twilio' | 'webhook' | 'whatsapp_direct';
  smsApiKey?: string;
  smsSenderId?: string;
  smsWebhookUrl?: string;
  autoSendSmsOnBooking?: boolean;
  autoSendSmsOnStatusChange?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export interface CustomerNotification {
  id: string;
  orderId: string;
  title: string;
  body: string;
  url: string;
  type: 'order_booked' | 'status_update' | 'custom';
  status?: OrderStatus;
  read: boolean;
  createdAt: string;
  phone?: string;
}
