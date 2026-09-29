import React from 'react';
import { useStore } from '../context/StoreContext';
import { MessageCircle } from 'lucide-react';

export const FloatingWhatsApp: React.FC = () => {
  const { settings } = useStore();
  const phone = settings.whatsapp || '9373080098';
  const message = encodeURIComponent('Hello, I would like to order Mira Herbal Hair Oil (100ml).');
  const url = `https://wa.me/91${phone}?text=${message}`;

  return (
    <aside 
      aria-label="Contact options"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center group"
    >
      {/* Tooltip on desktop hover */}
      <span className="hidden md:inline-block mr-3 px-3 py-1.5 bg-[#174A3A] text-white text-xs font-medium rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        Order on WhatsApp 💬
      </span>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Order or chat on WhatsApp"
        className="w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-hidden focus:ring-4 focus:ring-[#25D366]/40"
      >
        <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white text-[#25D366]" />
      </a>
    </aside>
  );
};
