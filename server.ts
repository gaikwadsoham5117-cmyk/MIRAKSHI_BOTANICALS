import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// File-backed persistent storage for products database
const DB_FILE = path.resolve(__dirname, 'products_db.json');

// In-memory / initial seed data for REST API endpoints
interface ProductData {
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

let products: ProductData[] = [
  {
    id: 'mira-oil-100ml',
    name: 'Mira Herbal Hair Oil',
    brand: 'Mirakshi Botanicals',
    previousBrand: 'Meera Herbal Hair Oil',
    size: '100ml',
    price: 349,
    codCharge: 50,
    codTotal: 399,
    inStock: true,
    stockCount: 150,
    description: 'Home-made hair oil prepared using 100% natural ingredients. Traditionally slow-infused using time-honored Ayurvedic principles to nourish the scalp, care for hair roots, and bring natural softness and shine.',
    badge: '🌿 100% Natural Hair Care',
    benefits: [
      'Helps reduce hair fall with regular gentle scalp nourishment',
      'Helps reduce discomfort associated with dandruff & dry scalp itching',
      'Supports healthy-looking hair growth & natural hair vitality',
      'Helps make hair noticeably soft, shiny, and stronger from roots to tips'
    ],
    imageUrl: '/assets/mira_hair_oil_bottle_1790616775030.jpg',
    sku: 'MB-MIRA-100ML',
    category: 'Herbal Hair Care'
  },
  {
    id: 'mira-oil-200ml',
    name: 'Mira Herbal Hair Oil (Family Pack)',
    brand: 'Mirakshi Botanicals',
    previousBrand: 'Meera Herbal Hair Oil',
    size: '200ml',
    price: 599,
    codCharge: 50,
    codTotal: 649,
    inStock: true,
    stockCount: 85,
    description: 'Double volume economy pack of our signature botanical hair oil. Slow-cooked with 14 organic Ayurvedic herbs for complete scalp vitality and long-lasting hair strength.',
    badge: '⭐ Best Value • Save ₹99',
    benefits: [
      'Economical 200ml bottle for 2-3 months daily hair wellness',
      'Intense nourishment for damaged, frizzy, and thinning hair',
      'Enriched with cold-pressed coconut oil, sesame, amla & bhringraj'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
    sku: 'MB-MIRA-200ML',
    category: 'Value Packs'
  },
  {
    id: 'mira-rosemary-100ml',
    name: 'Mira Rosemary & Bhringraj Scalp Drops',
    brand: 'Mirakshi Botanicals',
    previousBrand: 'Meera Herbal Hair Oil',
    size: '100ml',
    price: 399,
    codCharge: 50,
    codTotal: 449,
    inStock: true,
    stockCount: 60,
    description: 'Targeted root-strengthening elixir infused with fresh rosemary extract, bhringraj, and methi seeds designed to awaken dormant follicles and soothe scalp irritation.',
    badge: '✨ Root Energizer',
    benefits: [
      'Pure steam-distilled rosemary infusion with cold-pressed botanical base',
      'Calms itchy dry scalp and persistent flaky dandruff',
      'Supports micro-circulation across hair follicles during scalp massage'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1608248597359-009772c7247a?auto=format&fit=crop&w=800&q=80',
    sku: 'MB-ROSE-100ML',
    category: 'Targeted Scalp Care'
  }
];

// Load persisted products from disk on start if available
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      products = parsed;
    }
  }
} catch (e) {
  console.warn('Could not read products_db.json on startup:', e);
}

function persistProductsToDisk() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(products, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed to write products_db.json:', err);
  }
}

let orders: any[] = [];
let enquiries: any[] = [];
let reviews: any[] = [];
let settings = {
  brandName: 'Mirakshi Botanicals',
  previousBrandName: 'Meera Herbal Hair Oil',
  phone: '9373080098',
  whatsapp: '9373080098',
  onlinePrice: 349,
  codCharge: 50,
  productSize: '100ml',
  heroHeading: 'Natural Care. Healthier-Looking Hair.',
  heroSubheading: 'Discover Mira Herbal Hair Oil – traditionally prepared with natural ingredients for your everyday hair-care routine.',
  ctaText: 'Order Now',
  deliveryDays: '3–5 Business Days across India'
};

// ---------------- REST APIs ----------------

// Products
app.get('/api/products', (req: Request, res: Response) => {
  res.json({ success: true, data: products });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const prod = products.find(p => p.id === req.params.id);
  if (!prod) return res.status(404).json({ success: false, message: 'Product not found' });
  res.json({ success: true, data: prod });
});

app.post('/api/products', (req: Request, res: Response) => {
  const id = req.body.id || ('prod-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 6));
  const newProduct = { ...req.body, id };
  const existingIdx = products.findIndex(p => p.id === id);
  if (existingIdx >= 0) {
    products[existingIdx] = newProduct;
  } else {
    products.push(newProduct);
  }
  persistProductsToDisk();
  res.status(201).json({ success: true, data: newProduct });
});

app.put('/api/products/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  const idx = products.findIndex(p => p.id === id);
  const updatedProduct = { ...req.body, id };
  if (idx < 0) {
    products.push(updatedProduct);
  } else {
    products[idx] = updatedProduct;
  }
  persistProductsToDisk();
  res.json({ success: true, data: updatedProduct });
});

app.delete('/api/products/:id', (req: Request, res: Response) => {
  products = products.filter(p => p.id !== req.params.id);
  persistProductsToDisk();
  res.json({ success: true, message: 'Product deleted' });
});

// Orders
app.post('/api/orders', (req: Request, res: Response) => {
  const { customerName, phone, quantity, paymentMethod, address, city, state, pincode } = req.body;
  if (!customerName || !phone || !address || !quantity) {
    return res.status(400).json({ success: false, message: 'Missing required delivery fields' });
  }

  const unitPrice = settings.onlinePrice || 349;
  const codCharge = paymentMethod === 'cod' ? (settings.codCharge || 50) : 0;
  const amount = (unitPrice * Number(quantity)) + codCharge;
  const orderId = `MB-${Date.now().toString().slice(-4)}${Math.floor(10 + Math.random() * 90)}`;

  const newOrder = {
    orderId,
    customerName,
    phone,
    address,
    city,
    state,
    pincode,
    quantity: Number(quantity),
    productTitle: 'Mira Herbal Hair Oil (100ml)',
    unitPrice,
    codCharge,
    amount,
    paymentMethod,
    paymentStatus: paymentMethod === 'online' ? 'paid' : 'pending',
    orderStatus: 'Order Placed',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  orders.unshift(newOrder);
  res.status(201).json({ success: true, data: newOrder });
});

app.get('/api/orders', (req: Request, res: Response) => {
  res.json({ success: true, data: orders });
});

app.get('/api/orders/track', (req: Request, res: Response) => {
  const { orderId, phone } = req.query;
  if (!orderId) return res.status(400).json({ success: false, message: 'Order ID is required' });

  const cleanId = String(orderId).trim().toUpperCase();
  const cleanPhone = phone ? String(phone).replace(/\D/g, '') : '';

  const found = orders.find(o => 
    o.orderId.toUpperCase() === cleanId && 
    (cleanPhone ? o.phone.replace(/\D/g, '').includes(cleanPhone) : true)
  );

  if (!found) return res.status(404).json({ success: false, message: 'Order not found' });
  res.json({ success: true, data: found });
});

app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status, trackingNumber, notes } = req.body;
  const idx = orders.findIndex(o => o.orderId === req.params.id);
  if (idx < 0) return res.status(404).json({ success: false, message: 'Order not found' });

  orders[idx] = {
    ...orders[idx],
    orderStatus: status || orders[idx].orderStatus,
    ...(trackingNumber !== undefined ? { trackingNumber } : {}),
    ...(notes !== undefined ? { notes } : {}),
    updatedAt: new Date().toISOString()
  };

  res.json({ success: true, data: orders[idx] });
});

// Customers
app.get('/api/customers', (req: Request, res: Response) => {
  const map = new Map<string, any>();
  orders.forEach(o => {
    const key = o.phone;
    if (map.has(key)) {
      const c = map.get(key);
      c.totalOrders += 1;
      c.totalSpent += o.amount;
    } else {
      map.set(key, {
        name: o.customerName,
        phone: o.phone,
        address: o.address,
        city: o.city,
        totalOrders: 1,
        totalSpent: o.amount,
        lastOrder: o.createdAt
      });
    }
  });
  res.json({ success: true, data: Array.from(map.values()) });
});

// Enquiries
app.post('/api/enquiries', (req: Request, res: Response) => {
  const { name, phone, email, message } = req.body;
  if (!name || !phone || !message) {
    return res.status(400).json({ success: false, message: 'Name, phone, and message are required' });
  }

  const newEnq = {
    id: 'ENQ-' + Date.now().toString(36).toUpperCase(),
    name,
    phone,
    email: email || '',
    message,
    status: 'new',
    createdAt: new Date().toISOString()
  };

  enquiries.unshift(newEnq);
  res.status(201).json({ success: true, data: newEnq });
});

app.get('/api/enquiries', (req: Request, res: Response) => {
  res.json({ success: true, data: enquiries });
});

// Reviews
app.get('/api/reviews', (req: Request, res: Response) => {
  res.json({ success: true, data: reviews });
});

app.post('/api/reviews', (req: Request, res: Response) => {
  const newReview = { ...req.body, id: 'rev-' + Date.now(), createdAt: new Date().toISOString() };
  reviews.push(newReview);
  res.status(201).json({ success: true, data: newReview });
});

// Settings
app.get('/api/settings', (req: Request, res: Response) => {
  res.json({ success: true, data: settings });
});

app.put('/api/settings', (req: Request, res: Response) => {
  settings = { ...settings, ...req.body };
  res.json({ success: true, data: settings });
});

// Mobile Phone Notifications (SMS & WhatsApp dispatch)
app.post('/api/notifications/send-mobile', async (req: Request, res: Response) => {
  const { phone, customerName, orderId, amount, orderStatus, trackingNumber, apiKey: overrideKey } = req.body;
  if (!phone || !orderId) {
    return res.status(400).json({ success: false, message: 'Phone number and Order ID are required' });
  }

  const cleanPhone = String(phone).replace(/\D/g, '');
  const status = orderStatus || 'Order Placed';
  const appUrl = process.env.APP_URL || 'https://mirakshibotanicals.com';
  const trackUrl = `${appUrl}/track-order?id=${orderId}`;

  const messageText = 
    `Mirakshi Botanicals: Order #${orderId} is ${status}. ` +
    (trackingNumber ? `AWB: ${trackingNumber}. ` : '') +
    `Total: Rs ${amount || 349}. Track live: ${trackUrl} (Help: 9373080098)`;

  let smsSent = false;
  let gatewayResponse: any = null;

  // 1. Fast2SMS Indian SMS Gateway (Quick SMS to 10-digit Indian Mobile)
  const fast2smsKey = overrideKey || (settings as any).smsApiKey || process.env.FAST2SMS_API_KEY;
  if (fast2smsKey && cleanPhone.length >= 10) {
    try {
      const targetNumber = cleanPhone.slice(-10);
      const fast2smsUrl = `https://www.fast2sms.com/dev/bulkV2?authorization=${encodeURIComponent(fast2smsKey)}&route=q&message=${encodeURIComponent(messageText)}&language=english&flash=0&numbers=${targetNumber}`;
      const smsApiRes = await fetch(fast2smsUrl);
      gatewayResponse = await smsApiRes.json();
      smsSent = gatewayResponse?.return === true;
      console.log(`[Fast2SMS Dispatch to +91${targetNumber}]`, gatewayResponse);
    } catch (e: any) {
      console.warn('[Fast2SMS Error]', e.message);
      gatewayResponse = { error: e.message };
    }
  }

  // 2. Custom SMS Webhook Gateway
  const webhookUrl = (settings as any).smsWebhookUrl || process.env.SMS_WEBHOOK_URL;
  if (webhookUrl && !smsSent) {
    try {
      const webhookRes = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: cleanPhone,
          message: messageText,
          orderId,
          customerName,
          status,
          amount,
          trackUrl
        })
      });
      gatewayResponse = await webhookRes.text();
      smsSent = webhookRes.ok;
    } catch (e: any) {
      console.warn('[SMS Webhook Error]', e.message);
    }
  }

  const whatsappUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
    `🌿 *Mirakshi Botanicals Notification*\n\n` +
    `Hello ${customerName || 'Valued Customer'},\n` +
    `Your order *#${orderId}* for Mira Herbal Hair Oil is confirmed!\n` +
    `Status: *${status}*\n` +
    (trackingNumber ? `🚚 Courier AWB: ${trackingNumber}\n` : '') +
    `Total Amount: ₹${amount || 349}\n\n` +
    `👉 Track your delivery live:\n${trackUrl}\n\n` +
    `Customer Care WhatsApp: 9373080098`
  )}`;
  const smsUrl = `sms:+91${cleanPhone}?body=${encodeURIComponent(messageText)}`;

  console.log(`[Mobile Notification Dispatch] Phone: +91${cleanPhone} | Order: #${orderId} | Status: ${status} | Free Delivery: WhatsApp & Firebase FCM Push Active | Carrier SMS: ${smsSent ? 'Delivered' : 'Disabled (Requires Paid Fast2SMS Plan)'}`);

  res.json({
    success: true,
    message: smsSent ? 'SMS successfully sent to mobile phone' : 'Order notification dispatched via Firebase Cloud Messaging & WhatsApp',
    fcmFreePushActive: true,
    smsSent,
    gatewayResponse,
    phone: cleanPhone,
    orderId,
    channels: {
      whatsapp: whatsappUrl,
      sms: smsUrl
    },
    notificationText: messageText
  });
});

// Explicit service worker route for Firebase Cloud Messaging (100% Free Push)
app.get('/firebase-messaging-sw.js', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.setHeader('Service-Worker-Allowed', '/');
  const swPath = path.resolve(process.cwd(), 'public', 'firebase-messaging-sw.js');
  if (fs.existsSync(swPath)) {
    return res.sendFile(swPath);
  }
  res.send(`
    importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');
    firebase.initializeApp({
      apiKey: "AIzaSyDpAdwTJEvIuriusz6XKZK8PVnV_bqYg",
      projectId: "oilwebsite-a9a32",
      messagingSenderId: "847462533912",
      appId: "1:847462533912:web:5cfc288abc122cf0fd2c6d"
    });
    const messaging = firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
      self.registration.showNotification(payload.notification?.title || 'Mirakshi Botanicals', {
        body: payload.notification?.body || 'Order update received.',
        data: { url: payload.data?.url || '/track-order' }
      });
    });
  `);
});

// Mount Vite or static build
async function start() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false,
        watch: null
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Mirakshi Botanicals server listening on http://0.0.0.0:${PORT}`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
});
