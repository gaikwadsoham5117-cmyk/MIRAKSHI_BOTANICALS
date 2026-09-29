import React from 'react';
import { Leaf, Home, Heart, Truck } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const highlights = [
    {
      icon: <Leaf className="w-6 h-6 text-[#2F6B4F]" />,
      emoji: '🌿',
      title: 'Natural Ingredients',
      description: 'Slow-infused with traditional herbs and pure botanical oils, free from harsh synthetic chemicals.'
    },
    {
      icon: <Home className="w-6 h-6 text-[#2F6B4F]" />,
      emoji: '🏠',
      title: 'Traditionally Prepared',
      description: 'Prepared in small home-style batches following authentic age-old Ayurvedic wisdom.'
    },
    {
      icon: <Heart className="w-6 h-6 text-[#2F6B4F]" />,
      emoji: '💚',
      title: 'Everyday Hair Care',
      description: 'Gentle, balanced nourishment suitable for men, women, and all hair types.'
    },
    {
      icon: <Truck className="w-6 h-6 text-[#2F6B4F]" />,
      emoji: '🚚',
      title: 'Home Delivery Available',
      description: 'Reliable doorstep shipping across India with Online Payment & Cash on Delivery options.'
    }
  ];

  return (
    <section className="py-8 bg-white border-y border-[#EEE8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {highlights.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 p-5 rounded-2xl bg-[#F8F5EC]/70 hover:bg-[#F8F5EC] border border-[#EEE8D8] transition-all hover:shadow-sm group"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-xs border border-[#8FAF8F]/20 text-xl group-hover:scale-105 transition-transform">
                {item.emoji}
              </div>
              <div className="space-y-1">
                <h4 className="font-serif font-bold text-base text-[#174A3A]">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-[#24312B]/75 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
