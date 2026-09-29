import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ArrowLeft, Shield, FileText, Truck, RefreshCw } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const { settings } = useStore();
  const path = location.pathname;

  let title = 'Privacy Policy';
  let icon = <Shield className="w-6 h-6 text-[#2F6B4F]" />;
  let content = (
    <div className="space-y-4 text-sm text-[#24312B]/85 leading-relaxed">
      <p>
        At <strong>{settings.brandName || 'Mirakshi Botanicals'}</strong> (formerly known as {settings.previousBrandName || 'Meera Herbal Hair Oil'}), we respect your privacy and are committed to protecting your personal information.
      </p>
      <h3 className="font-serif font-bold text-base text-[#174A3A]">1. Information We Collect</h3>
      <p>
        When you place an order or submit an enquiry on our website, we collect your name, mobile phone number, delivery address, city, state, postal pincode, and optional email address. This information is used strictly to process orders, facilitate doorstep delivery, and provide customer support.
      </p>
      <h3 className="font-serif font-bold text-base text-[#174A3A]">2. How We Protect Your Data</h3>
      <p>
        We implement industry-standard encryption and security measures. We do not sell, rent, or trade your personal contact details to third-party marketing companies.
      </p>
      <h3 className="font-serif font-bold text-base text-[#174A3A]">3. Communication</h3>
      <p>
        We may use your mobile number to send order status notifications, shipping tracking updates, or respond to direct queries initiated by you via WhatsApp or phone call.
      </p>
    </div>
  );

  if (path.includes('terms')) {
    title = 'Terms & Conditions';
    icon = <FileText className="w-6 h-6 text-[#2F6B4F]" />;
    content = (
      <div className="space-y-4 text-sm text-[#24312B]/85 leading-relaxed">
        <p>
          Welcome to the official website of <strong>{settings.brandName || 'Mirakshi Botanicals'}</strong>. By placing an order or using our services, you agree to these Terms & Conditions.
        </p>
        <h3 className="font-serif font-bold text-base text-[#174A3A]">1. Product Description & Usage</h3>
        <p>
          Mira Herbal Hair Oil is a traditionally prepared home-style hair-care product crafted from 100% natural ingredients. It is intended for cosmetic personal hair and scalp care. Results may vary between individuals based on hair type and scalp condition.
        </p>
        <h3 className="font-serif font-bold text-base text-[#174A3A]">2. Product Disclaimer</h3>
        <p>
          This product is not intended to diagnose, treat, cure, or prevent any medical condition. Discontinue use if allergic sensitivity or irritation occurs. Avoid direct contact with eyes.
        </p>
        <h3 className="font-serif font-bold text-base text-[#174A3A]">3. Pricing & Payment</h3>
        <p>
          Online orders are priced at ₹{settings.onlinePrice || 349} with free standard delivery. Cash on Delivery orders incur an additional ₹{settings.codCharge || 50} handling charge (Total ₹{(settings.onlinePrice || 349) + (settings.codCharge || 50)}). All pricing is displayed in Indian Rupees (INR).
        </p>
      </div>
    );
  } else if (path.includes('shipping')) {
    title = 'Shipping Policy';
    icon = <Truck className="w-6 h-6 text-[#2F6B4F]" />;
    content = (
      <div className="space-y-4 text-sm text-[#24312B]/85 leading-relaxed">
        <p>
          We take pride in packaging each bottle of <strong>Mira Herbal Hair Oil</strong> securely to ensure it arrives fresh and intact.
        </p>
        <h3 className="font-serif font-bold text-base text-[#174A3A]">1. Dispatch Timeline</h3>
        <p>
          Orders are typically dispatched within 24 to 48 hours of order confirmation from our traditional preparation kitchen.
        </p>
        <h3 className="font-serif font-bold text-base text-[#174A3A]">2. Delivery Estimates</h3>
        <p>
          Standard delivery takes approximately 3 to 5 business days depending on your postal pincode across India. Remote or rural locations may take up to 7 business days.
        </p>
        <h3 className="font-serif font-bold text-base text-[#174A3A]">3. Tracking Your Order</h3>
        <p>
          Once dispatched, a tracking ID (AWB) is updated in your order details. You can track your shipment anytime on our <Link to="/track-order" className="text-[#174A3A] underline font-semibold">Track Order</Link> page using your Order ID and mobile number.
        </p>
      </div>
    );
  } else if (path.includes('refund') || path.includes('cancellation')) {
    title = 'Cancellation & Refund Policy';
    icon = <RefreshCw className="w-6 h-6 text-[#2F6B4F]" />;
    content = (
      <div className="space-y-4 text-sm text-[#24312B]/85 leading-relaxed">
        <p>
          Your satisfaction with <strong>{settings.brandName || 'Mirakshi Botanicals'}</strong> is our priority.
        </p>
        <h3 className="font-serif font-bold text-base text-[#174A3A]">1. Order Cancellation</h3>
        <p>
          You may cancel your order free of charge before the product has been dispatched by contacting our support team at +91 {settings.phone || '9373080098'} or via WhatsApp.
        </p>
        <h3 className="font-serif font-bold text-base text-[#174A3A]">2. Damaged or Leaking Items</h3>
        <p>
          In the rare event that your bottle arrives damaged or broken during transit, please take a clear photograph and contact us on WhatsApp within 48 hours of delivery. We will promptly dispatch a replacement free of cost.
        </p>
        <h3 className="font-serif font-bold text-base text-[#174A3A]">3. Refunds</h3>
        <p>
          For pre-paid orders cancelled prior to dispatch or approved for refund, the full amount will be credited back to your original payment method within 5–7 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F5EC]">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#174A3A] hover:text-[#2F6B4F] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EEE8D8] shadow-md space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-[#EEE8D8]">
            <div className="w-12 h-12 rounded-2xl bg-[#8FAF8F]/20 flex items-center justify-center shrink-0">
              {icon}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F6B4F]">
                Mirakshi Botanicals
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#174A3A]">
                {title}
              </h1>
            </div>
          </div>

          {content}

          <div className="pt-6 border-t border-[#EEE8D8] text-xs text-[#24312B]/70 flex flex-col sm:flex-row justify-between gap-2">
            <span>Last updated: {new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}</span>
            <span>Helpline: +91 {settings.phone || '9373080098'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
