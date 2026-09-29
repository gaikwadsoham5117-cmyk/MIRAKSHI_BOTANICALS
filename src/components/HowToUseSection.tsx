import React from 'react';
import { Droplet, Sparkles, Moon, ShowerHead as Shower, Calendar, CheckCircle2 } from 'lucide-react';

export const HowToUseSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Apply',
      instruction: 'Apply Mira Hair Oil directly to a clean, dry scalp section by section.',
      icon: <Droplet className="w-6 h-6 text-[#174A3A]" />,
      tip: 'Focus on root areas'
    },
    {
      num: '02',
      title: 'Massage',
      instruction: 'Gently massage the scalp using your fingertips in circular motions for 5–10 minutes.',
      icon: <Sparkles className="w-6 h-6 text-[#174A3A]" />,
      tip: 'Stimulates circulation'
    },
    {
      num: '03',
      title: 'Leave It On',
      instruction: 'Keep the oil for 1–2 hours, or leave it on overnight for deep absorption.',
      icon: <Moon className="w-6 h-6 text-[#174A3A]" />,
      tip: 'Overnight for best results'
    },
    {
      num: '04',
      title: 'Wash',
      instruction: 'Wash your hair gently with a mild herbal or sulphate-free shampoo.',
      icon: <Shower className="w-6 h-6 text-[#174A3A]" />,
      tip: 'Rinse with lukewarm water'
    }
  ];

  return (
    <section id="how-to-use" className="py-16 sm:py-24 bg-white border-t border-[#EEE8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#2F6B4F] uppercase">
            Simple 4-Step Hair Care Ritual
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#174A3A] mt-2">
            How to Use Mira Hair Oil
          </h2>
          <p className="text-sm sm:text-base text-[#24312B]/75 mt-3">
            Incorporate our Ayurvedic-inspired oil into your weekly routine for optimal scalp care.
          </p>
          
          {/* Recommended Usage Highlight Badge */}
          <div className="mt-6 inline-flex items-center gap-2.5 bg-[#174A3A]/8 border border-[#174A3A]/20 px-5 py-2 rounded-full text-sm font-semibold text-[#174A3A]">
            <Calendar className="w-4 h-4 text-[#C49A4A]" />
            <span>Recommended Usage: <strong>2–3 times per week</strong></span>
          </div>
        </div>

        {/* 4 Steps Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-7 rounded-3xl bg-[#F8F5EC] border border-[#EEE8D8] hover:border-[#8FAF8F]/50 transition-all duration-300 hover:shadow-lg flex flex-col justify-between group"
            >
              <div>
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-3xl sm:text-4xl font-bold text-[#8FAF8F]/60 group-hover:text-[#2F6B4F] transition-colors">
                    {step.num}
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-[#8FAF8F]/30 group-hover:scale-110 transition-transform">
                    {step.icon}
                  </div>
                </div>

                {/* Step Title */}
                <h3 className="font-serif font-bold text-xl text-[#174A3A] mb-2">
                  Step {idx + 1} – {step.title}
                </h3>

                {/* Instruction */}
                <p className="text-sm text-[#24312B]/80 leading-relaxed font-normal">
                  {step.instruction}
                </p>
              </div>

              {/* Sub-tip */}
              <div className="mt-6 pt-4 border-t border-[#EEE8D8] flex items-center gap-1.5 text-xs font-medium text-[#2F6B4F]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C49A4A]" />
                <span>{step.tip}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Third wash difference reassurance banner */}
        <div className="mt-12 bg-gradient-to-r from-[#174A3A] to-[#2F6B4F] text-white p-6 sm:p-8 rounded-3xl shadow-lg flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-serif text-xl sm:text-2xl font-bold">
              Consistency is the key to natural hair vitality
            </h4>
            <p className="text-sm text-white/80 max-w-xl">
              Many of our customers begin to notice softer hair and calmer scalp conditions from approximately the third wash onwards.
            </p>
          </div>
          <a
            href="#product"
            className="px-6 py-3 rounded-xl bg-white text-[#174A3A] hover:bg-[#F8F5EC] font-bold text-sm tracking-wide shrink-0 shadow-md transition-all active:scale-95"
          >
            Order Your Bottle
          </a>
        </div>

      </div>
    </section>
  );
};
