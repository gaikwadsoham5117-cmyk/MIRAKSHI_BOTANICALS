import React from 'react';
import { useStore } from '../context/StoreContext';
import { BotanicalBannerImage } from '../assets/images';
import { Sparkles, Leaf } from 'lucide-react';

export const IngredientsSection: React.FC = () => {
  const { ingredients } = useStore();
  const activeIngredients = ingredients.filter(i => i.active !== false);

  return (
    <section id="ingredients" className="py-16 sm:py-24 bg-[#EEE8D8]/40 border-t border-[#EEE8D8] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Banner with botanical flat lay */}
        <div className="relative rounded-3xl overflow-hidden mb-16 shadow-lg border border-[#EEE8D8]">
          <div className="h-64 sm:h-80 w-full relative">
            <img 
              src={BotanicalBannerImage} 
              alt="Ayurvedic Botanical Ingredients" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#174A3A]/90 via-[#174A3A]/70 to-transparent flex items-center p-6 sm:p-12">
              <div className="max-w-xl text-white space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-semibold tracking-wider uppercase text-[#F8F5EC]">
                  <Leaf className="w-3.5 h-3.5 text-[#C49A4A]" />
                  <span>Pure Herbal Heritage</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                  Nature-Inspired Hair Care
                </h2>
                <p className="text-sm sm:text-base text-white/90 leading-relaxed font-light">
                  Our oil is slow-crafted with revered botanicals known in Indian tradition for centuries to gently nurture hair roots without heavy synthetics.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Ingredients Grid (Admin Managed) */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#2F6B4F] uppercase">
                Active Botanical Infusions
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#174A3A] mt-1">
                Hand-Selected Ingredients
              </h3>
            </div>
            <p className="text-xs text-[#24312B]/70 max-w-sm sm:text-right">
              Admin-curated authentic botanicals sourced for quality and freshness.
            </p>
          </div>

          {activeIngredients.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-[#EEE8D8]">
              <Sparkles className="w-8 h-8 text-[#C49A4A] mx-auto mb-2" />
              <p className="text-sm text-[#24312B]/80 font-medium">Botanical ingredient profiles managed directly by Mirakshi Botanicals.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {activeIngredients.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-6 border border-[#EEE8D8] shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-[#8FAF8F]/20 flex items-center justify-center text-[#174A3A] mb-4">
                      <Leaf className="w-5 h-5 text-[#2F6B4F]" />
                    </div>
                    <h4 className="font-serif font-bold text-lg text-[#174A3A] mb-2">
                      {item.name}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#24312B]/75 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  {item.benefits && (
                    <div className="pt-3 border-t border-[#EEE8D8] text-xs font-medium text-[#2F6B4F]">
                      <span className="text-[#C49A4A] font-bold">Benefit: </span>
                      {item.benefits}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
