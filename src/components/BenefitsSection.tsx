import React from 'react';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      emoji: '🌿',
      title: 'Helps Reduce Hair Fall',
      description: 'Supports a regular hair-care routine and helps maintain healthier-looking, more resilient hair strands.'
    },
    {
      emoji: '🍃',
      title: 'Scalp Care',
      description: 'Helps reduce the discomfort associated with dandruff, dryness, and common scalp itching.'
    },
    {
      emoji: '🌱',
      title: 'Supports Hair Growth',
      description: 'Provides gentle botanical nourishment that supports healthy-looking hair growth and scalp vitality.'
    },
    {
      emoji: '✨',
      title: 'Soft & Shiny Hair',
      description: 'Deep herbal slow-infusion helps hair feel naturally softer, smoother, and look radiant.'
    },
    {
      emoji: '💚',
      title: 'Suitable for Different Hair Types',
      description: 'Lightweight, easily absorbed formula designed for everyday hair-care routines across different textures.'
    },
    {
      emoji: '🏡',
      title: 'Traditionally Prepared',
      description: 'Slow-cooked in small authentic batches using a traditional home-style process with 100% natural ingredients.'
    }
  ];

  return (
    <section id="benefits" className="py-16 sm:py-24 bg-white border-t border-[#EEE8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#2F6B4F] uppercase">
            Ayurvedic-Inspired Hair Wellness
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#174A3A] mt-2">
            Why Choose Mira Herbal Hair Oil?
          </h2>
          <p className="text-sm sm:text-base text-[#24312B]/75 mt-3">
            Pure botanical care formulated without compromise. Designed to nurture your scalp and elevate your everyday routine.
          </p>
        </div>

        {/* 6 Benefit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#F8F5EC]/60 hover:bg-[#F8F5EC] border border-[#EEE8D8] transition-all duration-300 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between group"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-2xl shadow-xs border border-[#8FAF8F]/30 mb-6 group-hover:scale-110 transition-transform">
                  {item.emoji}
                </div>
                <h3 className="font-serif font-bold text-xl text-[#174A3A] mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-[#24312B]/80 leading-relaxed font-normal">
                  {item.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#EEE8D8] text-xs font-medium text-[#2F6B4F] flex items-center gap-1.5">
                <span>Natural Care Principle</span>
                <span>•</span>
                <span>Gentle Everyday Care</span>
              </div>
            </div>
          ))}
        </div>

        {/* Ethical Transparency Disclaimer */}
        <div className="mt-12 text-center text-xs text-[#24312B]/60 max-w-2xl mx-auto">
          *Note: Results may vary depending on individual scalp condition, lifestyle, and consistency of use. Mira Herbal Hair Oil is formulated as a cosmetic botanical hair oil and does not make guaranteed medical treatment claims.
        </div>

      </div>
    </section>
  );
};
