import React from 'react';
import { Leaf, Truck, ShoppingCart, MessageCircle, Banknote, ShieldCheck } from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: <Leaf className="w-6 h-6 text-[#2F6B4F]" />,
      title: 'Natural-Focused Formulation',
      description: 'Slow-infused without harsh parabens, mineral oils, or synthetic silicones.'
    },
    {
      icon: <Truck className="w-6 h-6 text-[#2F6B4F]" />,
      title: 'Reliable Home Delivery',
      description: 'Direct door-to-door shipment safely packed and dispatched across India.'
    },
    {
      icon: <ShoppingCart className="w-6 h-6 text-[#2F6B4F]" />,
      title: 'Easy, Direct Ordering',
      description: 'Quick online order in under 60 seconds with instant order tracking.'
    },
    {
      icon: <MessageCircle className="w-6 h-6 text-[#2F6B4F]" />,
      title: 'Direct WhatsApp Support',
      description: 'Speak directly with our team for hair-care advice or order inquiries.'
    },
    {
      icon: <Banknote className="w-6 h-6 text-[#2F6B4F]" />,
      title: 'Cash on Delivery Available',
      description: 'Convenient COD option (₹399 total) to pay when your package arrives.'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#2F6B4F]" />,
      title: 'Secure Online Payment',
      description: 'Discounted online payment (₹349) via verified UPI, cards, and netbanking.'
    }
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#F8F5EC] border-t border-[#EEE8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#2F6B4F] uppercase">
            Our Commitments to You
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#174A3A] mt-2">
            Why Customers Choose Us
          </h2>
          <p className="text-sm sm:text-base text-[#24312B]/75 mt-2">
            Honest formulations, transparent pricing, and personal support you can rely on.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((pt, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white border border-[#EEE8D8] shadow-xs hover:shadow-md transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-[#8FAF8F]/20 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                {pt.icon}
              </div>
              <h3 className="font-serif font-bold text-lg text-[#174A3A] mb-1.5">
                {pt.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#24312B]/75 leading-relaxed">
                {pt.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
