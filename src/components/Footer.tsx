import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Phone, MessageCircle, Mail, MapPin, Heart, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings } = useStore();
  const phone = settings.phone || '9373080098';
  const whatsapp = settings.whatsapp || '9373080098';

  return (
    <footer className="bg-[#174A3A] text-white border-t border-[#8FAF8F]/20 pt-16 pb-24 md:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Col 1: Brand Info (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌿</span>
              <span className="font-serif text-2xl font-bold tracking-wider text-white">
                {settings.brandName?.toUpperCase() || 'MIRAKSHI BOTANICALS'}
              </span>
            </div>
            <p className="text-xs text-[#8FAF8F] font-medium tracking-wide">
              Formerly known as {settings.previousBrandName || 'Meera Herbal Hair Oil'}
            </p>
            <p className="text-sm text-white/80 max-w-sm leading-relaxed font-light">
              Home-made botanical hair oil handcrafted with 100% natural herbs and traditional cold-pressed oils for everyday scalp care and healthy-looking hair.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href={`tel:${phone}`}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C49A4A]" />
                <span>Call {phone}</span>
              </a>

              <a
                href={`https://wa.me/91${whatsapp}?text=${encodeURIComponent('Hello, I would like to order Mira Herbal Hair Oil (100ml).')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-xs font-semibold text-white transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider uppercase text-[#C49A4A]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><a href="/#hero" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/#product" className="hover:text-white transition-colors">Mira Hair Oil</a></li>
              <li><a href="/#benefits" className="hover:text-white transition-colors">Benefits</a></li>
              <li><a href="/#how-to-use" className="hover:text-white transition-colors">How to Use</a></li>
              <li><a href="/#ingredients" className="hover:text-white transition-colors">Ingredients</a></li>
              <li><Link to="/track-order" className="hover:text-white transition-colors font-medium text-[#8FAF8F]">Track Your Order</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & Policies (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider uppercase text-[#C49A4A]">
              Policies
            </h4>
            <ul className="space-y-2 text-sm text-white/80">
              <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/shipping-policy" className="hover:text-white transition-colors">Shipping Policy</Link></li>
              <li><Link to="/cancellation-and-refund" className="hover:text-white transition-colors">Refund & Cancellation</Link></li>
              <li><Link to="/admin/login" className="text-white/40 hover:text-white/70 transition-colors text-xs">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Kitchen (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-sm font-bold tracking-wider uppercase text-[#C49A4A]">
              Contact Details
            </h4>
            <div className="space-y-2.5 text-xs sm:text-sm text-white/80">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C49A4A] shrink-0" />
                <span>+91 {phone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C49A4A] shrink-0" />
                <span>{settings.email || 'care@mirakshibotanicals.com'}</span>
              </p>
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C49A4A] shrink-0 mt-0.5" />
                <span>Traditional Ayurvedic Preparation Unit, India</span>
              </p>
              <p className="text-xs text-[#8FAF8F] pt-2">
                🚚 Home Delivery Across India • Online & COD Available
              </p>
            </div>
          </div>

        </div>

        {/* Product Disclaimer Box */}
        <div className="py-6 border-b border-white/10 text-xs text-white/60 leading-relaxed space-y-1">
          <p className="font-medium text-white/80">
            🌿 Product Disclaimer:
          </p>
          <p>
            Product results may vary from person to person. The product is intended for personal hair-care use. Avoid contact with eyes and discontinue use if irritation occurs. This product does not make guaranteed medical treatment claims.
          </p>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-white/60 gap-4">
          <p>
            © {new Date().getFullYear()} {settings.brandName || 'Mirakshi Botanicals'}. All rights reserved. Formerly Meera Herbal Hair Oil.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/track-order" className="hover:text-white transition-colors">
              Order Tracking
            </Link>
            <span>•</span>
            <Link to="/terms-and-conditions" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
