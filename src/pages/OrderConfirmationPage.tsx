import React, { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { notificationService } from '../services/notificationService';
import { Order } from '../types';
import { 
  CheckCircle2, 
  MessageCircle, 
  Package, 
  ArrowRight, 
  Truck, 
  MapPin, 
  Calendar, 
  CreditCard,
  Share2,
  Copy,
  Check,
  Sparkles,
  ExternalLink
} from 'lucide-react';

export const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const location = useLocation();
  const { orders, settings, showToast } = useStore();
  const [order, setOrder] = useState<Order | null>((location.state as { order?: Order })?.order || null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!order && orderId) {
      const found = orders.find(o => o.orderId.toUpperCase() === orderId.toUpperCase());
      if (found) setOrder(found);
    }
  }, [orderId, order, orders]);

  const activeOrderId = order?.orderId || orderId || '';
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const directLink = `${currentOrigin}/track-order?id=${activeOrderId}`;
  const customerCleanPhone = order?.phone ? order.phone.replace(/\D/g, '') : '';

  const shareText = `🌿 Mirakshi Botanicals Order Confirmation\n` +
    `Order ID: #${activeOrderId}\n` +
    `Product: ${order?.productTitle || 'Mira Herbal Hair Oil'} (100ml)\n` +
    `Quantity: ${order?.quantity || 1}\n` +
    `Total: ₹${order?.amount || 349}\n` +
    `Status: ${order?.orderStatus || 'Order Placed'}\n\n` +
    `👉 View and track live shipment:\n${directLink}`;

  const customerWhatsAppUrl = customerCleanPhone 
    ? `https://wa.me/91${customerCleanPhone}?text=${encodeURIComponent(shareText)}` 
    : `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  
  const customerSmsUrl = customerCleanPhone 
    ? `sms:+91${customerCleanPhone}?body=${encodeURIComponent(shareText)}` 
    : `sms:?body=${encodeURIComponent(shareText)}`;

  const handleShareWhatsApp = () => {
    window.open(customerWhatsAppUrl, '_blank');
  };

  const handleOpenSms = () => {
    window.location.href = customerSmsUrl;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directLink);
    setCopiedLink(true);
    showToast('Direct order tracking link copied to clipboard!', 'success');
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Mirakshi Botanicals Order #${activeOrderId}`,
          text: `Track your Mira Herbal Hair Oil shipment:`,
          url: directLink
        });
      } catch {
        // Cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const whatsapp = settings.whatsapp || '9373080098';
  const whatsappOrderMsg = encodeURIComponent(
    `Hello Mirakshi Botanicals, I placed order #${activeOrderId}. Please confirm my shipment details.`
  );

  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F5EC]">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Success Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EEE8D8] shadow-lg text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-[#174A3A]/10 text-[#174A3A] flex items-center justify-center mx-auto mb-2 animate-bounce-short">
            <CheckCircle2 className="w-12 h-12 text-[#2F6B4F]" />
          </div>

          <span className="text-xs font-bold uppercase tracking-wider text-[#2F6B4F]">
            Order Confirmed
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#174A3A]">
            🎉 Order Placed Successfully!
          </h1>
          <p className="text-sm sm:text-base text-[#24312B]/80 max-w-md mx-auto">
            Thank you for ordering from <strong>{settings.brandName || 'Mirakshi Botanicals'}</strong>. Your bottle of Mira Herbal Hair Oil is being prepared with natural care.
          </p>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F8F5EC] border border-[#EEE8D8] rounded-xl text-sm font-semibold text-[#174A3A]">
            <span>Order ID:</span>
            <span className="font-mono tracking-wider font-bold text-[#2F6B4F]">{order?.orderId || orderId}</span>
          </div>
        </div>

        {/* Order Details Breakdown */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EEE8D8] shadow-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-[#174A3A] pb-3 border-b border-[#EEE8D8] flex items-center gap-2">
              <Package className="w-5 h-5 text-[#2F6B4F]" />
              <span>Summary of Your Order</span>
            </h2>

            <div className="space-y-3 text-sm text-[#24312B]/85">
              <div className="flex justify-between py-1 border-b border-[#EEE8D8]/60">
                <span className="text-[#24312B]/60">Customer Name:</span>
                <span className="font-semibold text-[#174A3A]">{order.customerName}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#EEE8D8]/60">
                <span className="text-[#24312B]/60">Mobile Number:</span>
                <span className="font-semibold">{order.phone}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#EEE8D8]/60">
                <span className="text-[#24312B]/60">Product:</span>
                <span className="font-semibold">{order.productTitle} (100ml)</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#EEE8D8]/60">
                <span className="text-[#24312B]/60">Quantity:</span>
                <span className="font-semibold">{order.quantity} Bottle{order.quantity > 1 ? 's' : ''}</span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#EEE8D8]/60">
                <span className="text-[#24312B]/60">Payment Method:</span>
                <span className="font-bold text-[#174A3A] uppercase">
                  {order.paymentMethod === 'online' ? 'Online Payment (Paid)' : 'Cash on Delivery (Pending Doorstep Payment)'}
                </span>
              </div>

              <div className="flex justify-between py-1 border-b border-[#EEE8D8]/60">
                <span className="text-[#24312B]/60">Order Status:</span>
                <span className="font-bold text-[#2F6B4F] bg-[#8FAF8F]/20 px-2.5 py-0.5 rounded-full text-xs">
                  {order.orderStatus}
                </span>
              </div>

              <div className="pt-2">
                <span className="text-[#24312B]/60 text-xs block mb-1">Delivery Address:</span>
                <p className="font-medium text-xs sm:text-sm text-[#174A3A] bg-[#F8F5EC] p-3 rounded-xl border border-[#EEE8D8]">
                  {order.address}, {order.city}, {order.state} - {order.pincode}
                </p>
              </div>

              <div className="pt-4 border-t border-[#EEE8D8] flex justify-between items-center text-base sm:text-lg font-bold text-[#174A3A]">
                <span>Total Amount:</span>
                <span className="text-2xl text-[#174A3A]">₹{order.amount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Notification Dispatched Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#174A3A]/20 shadow-md space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-[#EEE8D8]">
            <div className="w-10 h-10 rounded-xl bg-[#174A3A] text-white flex items-center justify-center shrink-0">
              <Share2 className="w-5 h-5 text-[#C49A4A]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#174A3A]">
                Mobile Notification Dispatched
              </h3>
              <span className="text-xs text-[#2F6B4F] font-bold">
                📱 Customer Mobile: +91 {order?.phone || customerCleanPhone}
              </span>
            </div>
          </div>

          <div className="p-3.5 bg-[#F8F5EC] rounded-xl border border-[#EEE8D8] text-xs text-[#24312B]/85 space-y-1">
            <p className="font-medium text-[#174A3A]">
              ✅ Order details & live tracking link have been dispatched for mobile number <strong>+91 {order?.phone || customerCleanPhone}</strong>.
            </p>
            <p className="text-[#24312B]/70">
              Tap below to view or send your official WhatsApp receipt & SMS to your phone:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={handleShareWhatsApp}
              className="py-3 px-4 rounded-xl font-bold text-xs text-white bg-[#25D366] hover:bg-[#20ba59] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Open on WhatsApp (+91 {order?.phone || 'Mobile'})</span>
            </button>

            <button
              onClick={handleOpenSms}
              className="py-3 px-4 rounded-xl font-bold text-xs text-[#174A3A] bg-[#8FAF8F]/20 hover:bg-[#8FAF8F]/30 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <span>💬</span>
              <span>Open Mobile SMS (+91 {order?.phone || 'Mobile'})</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-3 px-4 rounded-xl font-bold text-xs text-[#174A3A] bg-[#F8F5EC] hover:bg-[#EEE8D8] border border-[#8FAF8F]/40 active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-[#2F6B4F]" />}
              <span>{copiedLink ? 'Tracking Link Copied!' : 'Copy Direct Tracking Link'}</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="py-3 px-4 rounded-xl font-bold text-xs text-white bg-[#174A3A] hover:bg-[#2F6B4F] active:scale-98 transition-all flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to Phone Apps</span>
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/91${whatsapp}?text=${whatsappOrderMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-4 px-6 rounded-xl font-bold text-sm text-white bg-[#25D366] hover:bg-[#20ba59] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <MessageCircle className="w-5 h-5 fill-white" />
            <span>Contact on WhatsApp</span>
          </a>

          <Link
            to="/track-order"
            className="flex-1 py-4 px-6 rounded-xl font-bold text-sm text-[#174A3A] bg-white border border-[#8FAF8F]/50 hover:bg-[#F8F5EC] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            <Truck className="w-5 h-5 text-[#2F6B4F]" />
            <span>Track Order</span>
          </Link>

          <Link
            to="/"
            className="flex-1 py-4 px-6 rounded-xl font-bold text-sm text-white bg-[#174A3A] hover:bg-[#2F6B4F] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};
