import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Bell, X, ArrowRight, CheckCircle2, Truck, Package, Sparkles } from 'lucide-react';

export const NotificationPopup: React.FC = () => {
  const { activeBannerNotification, dismissBannerNotification } = useStore();
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (activeBannerNotification) {
      setVisible(true);
      // Auto-hide after 9 seconds if not clicked
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(dismissBannerNotification, 300);
      }, 9000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [activeBannerNotification, dismissBannerNotification]);

  if (!activeBannerNotification || !visible) return null;

  const handleClick = () => {
    dismissBannerNotification();
    if (activeBannerNotification.url) {
      navigate(activeBannerNotification.url);
    }
  };

  const isDelivered = activeBannerNotification.status === 'Delivered';
  const isShipped = activeBannerNotification.status === 'Shipped' || activeBannerNotification.status === 'Out for Delivery';
  const isBooked = activeBannerNotification.type === 'order_booked';

  return (
    <div className="fixed top-4 sm:top-6 right-4 sm:right-6 z-50 max-w-md w-full animate-bounce-short">
      <div 
        onClick={handleClick}
        className="cursor-pointer bg-white/95 backdrop-blur-md border-2 border-[#174A3A] p-4 sm:p-5 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-[1.02] flex items-start gap-3.5 group relative overflow-hidden"
      >
        {/* Accent bar */}
        <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-[#174A3A]" />

        {/* Icon based on status */}
        <div className="w-10 h-10 rounded-xl bg-[#174A3A] text-white flex items-center justify-center shrink-0 shadow-md">
          {isBooked ? (
            <Sparkles className="w-5 h-5 text-[#C49A4A]" />
          ) : isDelivered ? (
            <CheckCircle2 className="w-5 h-5 text-[#8FAF8F]" />
          ) : isShipped ? (
            <Truck className="w-5 h-5 text-white" />
          ) : (
            <Package className="w-5 h-5 text-white" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F6B4F] bg-[#8FAF8F]/20 px-2 py-0.5 rounded-full">
              Order Alert • Click to View
            </span>
          </div>
          <h4 className="font-serif font-bold text-sm sm:text-base text-[#174A3A] leading-snug">
            {activeBannerNotification.title}
          </h4>
          <p className="text-xs text-[#24312B]/85 mt-1 line-clamp-2 leading-relaxed font-normal">
            {activeBannerNotification.body}
          </p>

          <div className="mt-2.5 flex items-center gap-1 text-xs font-bold text-[#174A3A] group-hover:text-[#2F6B4F]">
            <span>Click here to open tracking & details</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setVisible(false);
            dismissBannerNotification();
          }}
          className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-black rounded-lg transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
