import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ShoppingBag, Menu, X, Phone, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    cart, 
    setIsCartOpen, 
    openCheckout, 
    settings,
    products
  } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navLinks = [
    { label: 'Home', href: '/#hero' },
    { label: 'About', href: '/#about' },
    { label: 'Benefits', href: '/#benefits' },
    { label: 'How to Use', href: '/#how-to-use' },
    { label: products.length > 1 ? `Products (${products.length})` : 'Products', href: '/#products' },
    { label: 'Ingredients', href: '/#ingredients' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Contact', href: '/#contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#174A3A] text-white py-2 px-4 text-xs sm:text-sm font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center">
            <span className="text-[#C49A4A]">✨</span>
            <span>100% Home-Made Herbal Oil • <strong>Home Delivery Across India</strong></span>
            <span className="hidden md:inline text-white/50">|</span>
            <span className="hidden md:inline text-white/80">COD Available (₹399) • Online (₹349)</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/90">
            <a 
              href={`tel:${settings.phone || '9373080098'}`}
              className="flex items-center gap-1.5 hover:text-[#C49A4A] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#C49A4A]" />
              <span>Call: {settings.phone || '9373080098'}</span>
            </a>
            <Link 
              to="/admin/login" 
              className="hidden lg:flex items-center gap-1 text-white/60 hover:text-white transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#F8F5EC]/95 backdrop-blur-md shadow-md border-b border-[#8FAF8F]/20 py-2.5'
            : 'bg-[#F8F5EC] border-b border-[#EEE8D8] py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex flex-col group">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl text-[#174A3A]">🌿</span>
                <span className="font-serif text-xl sm:text-2xl font-bold tracking-wider text-[#174A3A] group-hover:text-[#2F6B4F] transition-colors">
                  {settings.brandName?.toUpperCase() || 'MIRAKSHI BOTANICALS'}
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-[#2F6B4F] font-medium tracking-wider pl-7 -mt-0.5">
                Formerly {settings.previousBrandName || 'Meera Herbal Hair Oil'}
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-[#174A3A] ${
                    location.pathname === link.href ? 'text-[#174A3A] font-semibold' : 'text-[#24312B]/80'
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Cart Button */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2.5 rounded-full text-[#174A3A] hover:bg-[#8FAF8F]/15 transition-colors"
                aria-label="View Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#174A3A] text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#F8F5EC] animate-pulse">
                    {totalCartCount}
                  </span>
                )}
              </button>

              {/* Order Now CTA */}
              <button
                onClick={() => openCheckout()}
                className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-sm font-semibold tracking-wide text-white bg-[#174A3A] hover:bg-[#2F6B4F] active:scale-95 shadow-sm transition-all"
              >
                Order Now
              </button>

              {/* Mobile Menu Trigger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-[#174A3A] hover:bg-[#8FAF8F]/20 rounded-lg transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#F8F5EC] border-b border-[#EEE8D8] px-4 pt-3 pb-6 shadow-xl animate-fade-in">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2 px-3 rounded-lg text-base font-medium text-[#24312B] hover:bg-[#EEE8D8] hover:text-[#174A3A] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 border-t border-[#EEE8D8] flex flex-col gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openCheckout();
                  }}
                  className="w-full py-3 rounded-lg text-center font-semibold text-white bg-[#174A3A] hover:bg-[#2F6B4F] transition-all shadow-sm"
                >
                  Order Now (from ₹349)
                </button>
                <div className="flex justify-between items-center pt-2 text-xs text-[#24312B]/70 px-1">
                  <a href={`tel:${settings.phone || '9373080098'}`} className="flex items-center gap-1 text-[#174A3A] font-medium">
                    <Phone className="w-3.5 h-3.5 text-[#C49A4A]" /> {settings.phone || '9373080098'}
                  </a>
                  <Link to="/admin/login" onClick={() => setMobileMenuOpen(false)} className="text-[#2F6B4F]">
                    Admin Login
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
