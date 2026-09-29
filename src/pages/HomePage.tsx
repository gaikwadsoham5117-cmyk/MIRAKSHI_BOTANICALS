import React from 'react';
import { Hero } from '../components/Hero';
import { TrustBadges } from '../components/TrustBadges';
import { ProductCard } from '../components/ProductCard';
import { BenefitsSection } from '../components/BenefitsSection';
import { IngredientsSection } from '../components/IngredientsSection';
import { HowToUseSection } from '../components/HowToUseSection';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { ReviewsSection } from '../components/ReviewsSection';
import { ContactSection } from '../components/ContactSection';

export const HomePage: React.FC = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <TrustBadges />
      <ProductCard />
      <BenefitsSection />
      <IngredientsSection />
      <HowToUseSection />
      <WhyChooseUs />
      <ReviewsSection />
      <ContactSection />
    </main>
  );
};
