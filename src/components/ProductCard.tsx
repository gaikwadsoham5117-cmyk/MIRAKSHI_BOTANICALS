import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ProductBottleImage } from '../assets/images';
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  Zap, 
  Truck, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  Star, 
  Info, 
  X, 
  ArrowRight,
  Layers,
  Heart
} from 'lucide-react';

export const ProductCard: React.FC = () => {
  const { products, mainProduct, settings, addToCart, openCheckout } = useStore();
  
  // Selected variant for the featured hero showcase
  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || mainProduct.id);
  // Quantity states for each product { [productId]: number }
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  // Filter category
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Active product for detailed spotlight
  const activeProduct = products.find(p => p.id === selectedProductId) || products[0] || mainProduct;
  const activeQty = quantities[activeProduct.id] || 1;

  const unitPrice = activeProduct.price || settings.onlinePrice || 349;
  const codCharge = activeProduct.codCharge || settings.codCharge || 50;
  const onlineTotal = unitPrice * activeQty;
  const codTotal = onlineTotal + codCharge;

  const getProductQty = (prodId: string) => quantities[prodId] || 1;

  const updateQuantity = (prodId: string, delta: number) => {
    setQuantities(prev => {
      const current = prev[prodId] || 1;
      const next = Math.max(1, Math.min(10, current + delta));
      return { ...prev, [prodId]: next };
    });
  };

  // Derive categories
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category || 'Herbal Hair Care')))];

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => (p.category || 'Herbal Hair Care') === selectedCategory);

  return (
    <section id="products" className="py-16 sm:py-24 bg-[#F8F5EC] scroll-mt-20 relative">
      <div id="product" className="absolute -top-24" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#174A3A]/10 text-[#174A3A] text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#C49A4A]" />
            <span>Handcrafted Botanical Formulations</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#174A3A]">
            Our Herbal Hair Care Collection
          </h2>

          <p className="text-sm sm:text-base text-[#24312B]/75 leading-relaxed">
            Traditionally prepared in small batches with 100% natural herbs and cold-pressed botanical oils. Explore our complete range of herbal hair oils and targeted scalp treatments.
          </p>

          {/* Product Count & Filter Tabs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all capitalize ${
                  selectedCategory === cat
                    ? 'bg-[#174A3A] text-white shadow-md'
                    : 'bg-white text-[#24312B]/70 border border-[#EEE8D8] hover:border-[#174A3A] hover:text-[#174A3A]'
                }`}
              >
                {cat === 'all' ? `All Products (${products.length})` : cat}
              </button>
            ))}
          </div>
        </div>

        {/* ---------------- MULTI-PRODUCT CATALOG GRID ---------------- */}
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#EEE8D8]">
            <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-[#174A3A]">
              <Layers className="w-4 h-4 text-[#2F6B4F]" />
              <span>Available Formulations ({filteredProducts.length})</span>
            </div>
            <span className="text-xs text-[#24312B]/60">
              ⚡ Free Delivery On All Online Orders
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProducts.map((prod) => {
              const qty = getProductQty(prod.id);
              const cardUnitPrice = prod.price;
              const cardCodCharge = prod.codCharge || 50;
              const cardOnlineTotal = cardUnitPrice * qty;
              const cardCodTotal = cardOnlineTotal + cardCodCharge;
              const mrp = Math.round(cardUnitPrice * 1.35);
              const savings = mrp - cardUnitPrice;

              return (
                <div
                  key={prod.id}
                  className="bg-white rounded-3xl border border-[#EEE8D8] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-[#8FAF8F]"
                >
                  {/* Top Image Container */}
                  <div className="relative aspect-square w-full bg-[#F8F5EC] overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={prod.imageUrl || ProductBottleImage}
                      alt={prod.name}
                      className="w-full h-full object-cover object-center rounded-2xl group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ProductBottleImage;
                      }}
                    />

                    {/* Overlay Badges */}
                    <div className="absolute top-6 left-6 flex flex-col gap-1.5 z-10">
                      <span className="bg-[#174A3A] text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                        {prod.size || '100ml'}
                      </span>
                      {prod.badge && (
                        <span className="bg-[#C49A4A] text-white text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-md backdrop-blur-xs">
                          {prod.badge}
                        </span>
                      )}
                    </div>

                    {/* Stock status pill */}
                    <div className="absolute bottom-6 right-6 z-10">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold shadow-xs ${
                        prod.inStock !== false 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}>
                        {prod.inStock !== false ? '● In Stock' : 'Out of Stock'}
                      </span>
                    </div>

                    {/* Quick View Button Overlay */}
                    <button
                      onClick={() => setQuickViewProduct(prod)}
                      className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-2 backdrop-blur-2xs cursor-pointer"
                    >
                      <span className="bg-white text-[#174A3A] px-4 py-2 rounded-xl shadow-lg flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5 text-[#2F6B4F]" />
                        <span>Quick View Details</span>
                      </span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#2F6B4F] uppercase tracking-wider">
                          {prod.brand || 'Mirakshi Botanicals'}
                        </span>
                        <div className="flex items-center gap-1 text-[#C49A4A] font-bold">
                          <Star className="w-3.5 h-3.5 fill-[#C49A4A]" />
                          <span>4.9</span>
                          <span className="text-[#24312B]/50 font-normal">(120+)</span>
                        </div>
                      </div>

                      <h3 className="font-serif font-bold text-xl text-[#174A3A] group-hover:text-[#2F6B4F] transition-colors line-clamp-1">
                        {prod.name}
                      </h3>

                      <p className="text-xs text-[#24312B]/75 line-clamp-2 leading-relaxed">
                        {prod.description}
                      </p>

                      {/* Benefits Bullets */}
                      {prod.benefits && prod.benefits.length > 0 && (
                        <div className="space-y-1.5 pt-2">
                          {prod.benefits.slice(0, 2).map((b, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-[11px] text-[#24312B]/85">
                              <Check className="w-3.5 h-3.5 text-[#2F6B4F] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{b}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pricing Box */}
                    <div className="pt-3 border-t border-[#EEE8D8] space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-[#174A3A]">
                              ₹{cardUnitPrice}
                            </span>
                            <span className="text-xs text-[#24312B]/40 line-through">
                              ₹{mrp}
                            </span>
                          </div>
                          <span className="text-[10px] text-[#2F6B4F] font-semibold block">
                            Save ₹{savings} • Free Delivery
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-[10px] text-[#24312B]/60 block uppercase font-medium">COD Price</span>
                          <span className="text-xs font-bold text-[#24312B]/85">
                            ₹{cardUnitPrice + cardCodCharge}
                          </span>
                        </div>
                      </div>

                      {/* Quantity Selector */}
                      <div className="flex items-center justify-between bg-[#F8F5EC] p-1.5 rounded-xl border border-[#EEE8D8]">
                        <span className="text-xs font-semibold text-[#174A3A] px-2">Quantity:</span>
                        <div className="flex items-center border border-[#8FAF8F]/40 rounded-lg bg-white overflow-hidden shadow-2xs">
                          <button
                            onClick={() => updateQuantity(prod.id, -1)}
                            disabled={qty <= 1}
                            className="p-1.5 text-[#174A3A] hover:bg-[#F8F5EC] disabled:opacity-30 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-8 text-center font-bold text-xs text-[#174A3A]">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQuantity(prod.id, 1)}
                            disabled={qty >= 10}
                            className="p-1.5 text-[#174A3A] hover:bg-[#F8F5EC] disabled:opacity-30 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Action CTA Buttons */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          onClick={() => openCheckout(prod, qty)}
                          disabled={prod.inStock === false}
                          className="py-2.5 px-3 rounded-xl font-bold text-xs text-white bg-[#174A3A] hover:bg-[#2F6B4F] active:scale-98 shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                        >
                          <Zap className="w-3.5 h-3.5 text-[#C49A4A] fill-[#C49A4A]" />
                          <span>Buy – ₹{cardOnlineTotal}</span>
                        </button>

                        <button
                          onClick={() => addToCart(prod, qty)}
                          disabled={prod.inStock === false}
                          className="py-2.5 px-3 rounded-xl font-semibold text-xs text-[#174A3A] bg-[#8FAF8F]/20 hover:bg-[#8FAF8F]/30 border border-[#8FAF8F]/40 active:scale-98 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedProductId(prod.id);
                          const el = document.getElementById('featured-product-showcase');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="w-full text-center text-[11px] font-semibold text-[#2F6B4F] hover:text-[#174A3A] pt-1 flex items-center justify-center gap-1"
                      >
                        <span>View In Signature Showcase</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---------------- FEATURED SIGNATURE SHOWCASE CONTAINER ---------------- */}
        <div id="featured-product-showcase" className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border border-[#EEE8D8] relative scroll-mt-24">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#EEE8D8]">
            <div>
              <span className="text-xs font-bold text-[#2F6B4F] uppercase tracking-wider block">
                Highlighted Product Showcase
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#174A3A]">
                {activeProduct.name} ({activeProduct.size || '100ml'})
              </h3>
            </div>

            {/* Quick Switcher dropdown or buttons if multiple products */}
            {products.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#174A3A] hidden sm:inline">Select Formula:</span>
                <select
                  value={activeProduct.id}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] text-xs font-bold text-[#174A3A] focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F]"
                >
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.size || '100ml'}) – ₹{p.price}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left: Product Image & Gallery */}
            <div className="lg:col-span-6 flex flex-col items-center">
              <div className="relative w-full aspect-square max-w-md rounded-2xl overflow-hidden bg-[#F8F5EC] border border-[#EEE8D8] shadow-inner group">
                <img
                  src={activeProduct.imageUrl || ProductBottleImage}
                  alt={activeProduct.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = ProductBottleImage;
                  }}
                />
                
                {/* Floating Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span className="bg-[#174A3A] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                    {activeProduct.badge || '🌿 Natural Hair Care'}
                  </span>
                  <span className="bg-[#C49A4A] text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                    {activeProduct.size || '100ml Bottle'}
                  </span>
                </div>

                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1.5 rounded-lg text-xs font-medium text-[#174A3A] shadow-xs">
                  ✨ Handcrafted Batch
                </div>
              </div>

              {/* Delivery notice */}
              <div className="mt-4 flex items-center gap-2 text-xs sm:text-sm text-[#2F6B4F] font-medium bg-[#8FAF8F]/15 px-4 py-2 rounded-xl">
                <Truck className="w-4 h-4 text-[#174A3A]" />
                <span><strong>🚚 Home Delivery Available</strong> Across India (3-5 Days)</span>
              </div>
            </div>

            {/* Right: Product Details, Pricing, & Actions */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-medium text-[#C49A4A]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Formerly known as Meera Herbal Hair Oil • Mirakshi Botanicals</span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#174A3A] mt-1">
                  {activeProduct.name} ({activeProduct.size || '100ml'})
                </h3>
                <p className="text-sm sm:text-base text-[#24312B]/80 mt-2 leading-relaxed">
                  {activeProduct.description}
                </p>
              </div>

              {/* Pricing Cards with clear online vs COD breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Online Payment Card */}
                <div className="p-4 rounded-2xl border-2 border-[#174A3A] bg-[#174A3A]/5 relative">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#174A3A]">
                      Online Payment
                    </span>
                    <span className="text-[10px] font-bold bg-[#174A3A] text-white px-2 py-0.5 rounded-full">
                      Save ₹50
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold text-[#174A3A]">
                      ₹{onlineTotal}
                    </span>
                    <span className="text-xs text-[#24312B]/60">
                      ({activeQty} × ₹{unitPrice})
                    </span>
                  </div>
                  <p className="text-xs text-[#2F6B4F] mt-1 font-medium">
                    UPI, Cards, Netbanking • Free Delivery
                  </p>
                </div>

                {/* Cash on Delivery Card */}
                <div className="p-4 rounded-2xl border border-[#EEE8D8] bg-[#F8F5EC]">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#24312B]/80">
                      Cash on Delivery
                    </span>
                    <span className="text-[10px] font-semibold text-[#24312B]/60">
                      +₹{codCharge} COD
                    </span>
                  </div>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-bold text-[#24312B]">
                      ₹{codTotal}
                    </span>
                    <span className="text-xs text-[#24312B]/60">
                      (₹{onlineTotal} + ₹{codCharge})
                    </span>
                  </div>
                  <p className="text-xs text-[#24312B]/60 mt-1">
                    Pay at your doorstep upon arrival
                  </p>
                </div>
              </div>

              {/* Benefits Checklist */}
              {activeProduct.benefits && activeProduct.benefits.length > 0 && (
                <div className="space-y-2.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#174A3A]">
                    Key Herbal Benefits:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-[#24312B]/85">
                    {activeProduct.benefits.slice(0, 4).map((benefit, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#2F6B4F] shrink-0 mt-0.5" />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-[#24312B]/60 pt-1 italic">
                    *Customers may start noticing a difference from approximately the third wash.
                  </div>
                </div>
              )}

              {/* Quantity Selector and Action Buttons */}
              <div className="space-y-4 pt-4 border-t border-[#EEE8D8]">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-[#174A3A]">Quantity:</span>
                  <div className="flex items-center border border-[#8FAF8F]/50 rounded-xl bg-white shadow-2xs overflow-hidden">
                    <button
                      onClick={() => updateQuantity(activeProduct.id, -1)}
                      disabled={activeQty <= 1}
                      className="p-2.5 text-[#174A3A] hover:bg-[#F8F5EC] disabled:opacity-40 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-base text-[#174A3A]">
                      {activeQty}
                    </span>
                    <button
                      onClick={() => updateQuantity(activeProduct.id, 1)}
                      disabled={activeQty >= 10}
                      className="p-2.5 text-[#174A3A] hover:bg-[#F8F5EC] disabled:opacity-40 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-xs text-[#2F6B4F] font-medium">
                    (Total: {activeQty} × {activeProduct.size || 'Bottle'})
                  </span>
                </div>

                {/* Primary CTA Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => openCheckout(activeProduct, activeQty)}
                    disabled={activeProduct.inStock === false}
                    className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-[#174A3A] hover:bg-[#2F6B4F] active:scale-98 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-40"
                  >
                    <Zap className="w-5 h-5 text-[#C49A4A] fill-[#C49A4A]" />
                    <span>Buy Now – ₹{onlineTotal}</span>
                  </button>

                  <button
                    onClick={() => addToCart(activeProduct, activeQty)}
                    disabled={activeProduct.inStock === false}
                    className="w-full py-4 px-6 rounded-xl font-semibold text-base text-[#174A3A] bg-[#8FAF8F]/20 hover:bg-[#8FAF8F]/30 border border-[#8FAF8F]/40 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-40"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>

              {/* Trust Micro-Pill */}
              <div className="pt-2 flex items-center gap-4 text-xs text-[#24312B]/70">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-[#2F6B4F]" /> 100% Genuine Quality
                </span>
                <span>•</span>
                <span>Direct from Traditional Kitchen</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ---------------- QUICK VIEW MODAL ---------------- */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 border border-[#EEE8D8] shadow-2xl relative">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-6 right-6 p-2 text-gray-400 hover:text-black rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-5 items-start">
              <div className="w-24 h-24 rounded-2xl bg-[#F8F5EC] overflow-hidden shrink-0 border border-[#EEE8D8]">
                <img
                  src={quickViewProduct.imageUrl || ProductBottleImage}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0 pr-6">
                <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-wider block">
                  {quickViewProduct.brand} • {quickViewProduct.size}
                </span>
                <h3 className="font-serif font-bold text-xl text-[#174A3A] mt-0.5">
                  {quickViewProduct.name}
                </h3>
                <div className="mt-2 flex items-center gap-3">
                  <span className="font-bold text-xl text-[#174A3A]">₹{quickViewProduct.price}</span>
                  <span className="text-xs text-[#24312B]/60">COD: ₹{quickViewProduct.price + quickViewProduct.codCharge}</span>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {quickViewProduct.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-[#24312B]/85">
              <div>
                <h4 className="font-bold text-[#174A3A] mb-1">About This Formulation</h4>
                <p className="leading-relaxed text-[#24312B]/80">{quickViewProduct.description}</p>
              </div>

              {quickViewProduct.benefits && quickViewProduct.benefits.length > 0 && (
                <div>
                  <h4 className="font-bold text-[#174A3A] mb-1">Benefits</h4>
                  <div className="space-y-1.5">
                    {quickViewProduct.benefits.map((b, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#2F6B4F] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#EEE8D8] flex gap-3">
              <button
                onClick={() => {
                  const qty = getProductQty(quickViewProduct.id);
                  setQuickViewProduct(null);
                  openCheckout(quickViewProduct, qty);
                }}
                className="flex-1 py-3.5 rounded-xl font-bold text-xs text-white bg-[#174A3A] hover:bg-[#2F6B4F] shadow-md flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-[#C49A4A] fill-[#C49A4A]" />
                <span>Buy Now (₹{quickViewProduct.price})</span>
              </button>
              <button
                onClick={() => {
                  const qty = getProductQty(quickViewProduct.id);
                  addToCart(quickViewProduct, qty);
                  setQuickViewProduct(null);
                }}
                className="px-5 py-3.5 rounded-xl font-semibold text-xs text-[#174A3A] bg-[#8FAF8F]/20 hover:bg-[#8FAF8F]/30 border border-[#8FAF8F]/40"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
