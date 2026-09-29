import React from 'react';
import { useStore } from '../context/StoreContext';
import { Star, MessageSquareHeart, CheckCircle2 } from 'lucide-react';

export const ReviewsSection: React.FC = () => {
  const { reviews, settings } = useStore();
  const activeReviews = reviews.filter(r => r.active !== false);

  return (
    <section id="reviews" className="py-16 sm:py-24 bg-white border-t border-[#EEE8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#2F6B4F] uppercase">
            Genuine Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#174A3A] mt-2">
            Customer Reviews
          </h2>
          <p className="text-sm sm:text-base text-[#24312B]/75 mt-2">
            Real customer stories and experiences. We strictly avoid fake or auto-generated testimonials.
          </p>
        </div>

        {activeReviews.length === 0 ? (
          /* Honest Empty State */
          <div className="max-w-xl mx-auto text-center p-8 sm:p-10 rounded-3xl bg-[#F8F5EC] border border-[#EEE8D8]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 text-[#174A3A] shadow-xs">
              <MessageSquareHeart className="w-8 h-8 text-[#2F6B4F]" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#174A3A] mb-2">
              Customer reviews coming soon 🌿
            </h3>
            <p className="text-sm text-[#24312B]/75 leading-relaxed mb-6 font-normal">
              At Mirakshi Botanicals, we believe in 100% authentic transparency. Verified customer feedback will be published here as real users share their journeys.
            </p>
            <a
              href={`https://wa.me/91${settings.whatsapp || '9373080098'}?text=${encodeURIComponent('Hello Mirakshi Botanicals, I would like to share my feedback on Mira Herbal Hair Oil.')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white bg-[#174A3A] hover:bg-[#2F6B4F] transition-all shadow-xs"
            >
              <span>Share Your Feedback on WhatsApp</span>
            </a>
          </div>
        ) : (
          /* Active Real Reviews */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeReviews.map((rev) => (
              <div
                key={rev.id}
                className="p-6 rounded-2xl bg-[#F8F5EC] border border-[#EEE8D8] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-[#C49A4A] mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < rev.rating ? 'fill-[#C49A4A]' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-[#24312B]/85 italic mb-4">
                    "{rev.review}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EEE8D8] flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-[#174A3A]">
                    {rev.customerName}
                  </span>
                  {rev.verifiedPurchase && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#2F6B4F]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified Purchase
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
