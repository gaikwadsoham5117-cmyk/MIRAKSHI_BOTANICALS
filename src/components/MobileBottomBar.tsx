import React from 'react';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, MessageCircle, Phone } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const { openCheckout, settings } = useStore();
  const phone = settings.phone || '9373080098';
  const whatsapp = settings.whatsapp || '9373080098';
  const message = encodeURIComponent('Hello, I would like to order Mira Herbal Hair Oil (100ml).');
  const whatsappUrl = `https://wa.me/91${whatsapp}?text=${message}`;

  return (
    <nav 
      aria-label="Mobile quick actions"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EEE8D8] p-2.5 px-3 shadow-2xl"
    >
      <div className="flex items-center gap-2">
        {/* Call Quick Action */}
        <a
          href={`tel:${phone}`}
          className="p-3 bg-[#F8F5EC] text-[#174A3A] border border-[#8FAF8F]/30 rounded-xl flex items-center justify-center shrink-0 active:scale-95 transition-all"
          aria-label={`Call us directly at ${phone}`}
        >
          <Phone className="w-5 h-5 text-[#2F6B4F]" />
        </a>

        {/* WhatsApp Direct */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
        >
          <MessageCircle className="w-4 h-4 fill-white" />
          <span>💬 WhatsApp</span>
        </a>

        {/* Order Now CTA */}
        <button
          onClick={() => openCheckout()}
          className="flex-1 py-3 px-3 rounded-xl bg-[#174A3A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>🛒 Order (₹{settings.onlinePrice || 349})</span>
        </button>
      </div>
    </nav>
  );
};
