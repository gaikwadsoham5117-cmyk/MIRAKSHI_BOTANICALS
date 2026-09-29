import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    isCartOpen, 
    setIsCartOpen, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    openCheckout,
    settings 
  } = useStore();

  if (!isCartOpen) return null;

  const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);
  const onlineSubtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const codSubtotal = onlineSubtotal + (settings.codCharge || 50);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F8F5EC] shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-white border-b border-[#EEE8D8] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#174A3A]" />
              <h2 className="font-serif text-xl font-bold text-[#174A3A]">
                Your Shopping Cart ({totalQty})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-[#24312B]/60 hover:text-[#174A3A] hover:bg-[#F8F5EC] rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Content */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              /* Empty State */
              <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
                <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-3xl shadow-xs border border-[#EEE8D8] mb-4">
                  🌿
                </div>
                <h3 className="font-serif text-xl font-bold text-[#174A3A] mb-1">
                  Your cart is waiting for something natural 🌿
                </h3>
                <p className="text-sm text-[#24312B]/70 max-w-xs mb-6">
                  Add Mira Herbal Hair Oil to your routine for healthier-looking hair and calm scalp.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    const el = document.getElementById('product');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-[#174A3A] hover:bg-[#2F6B4F] shadow-sm transition-all"
                >
                  Explore Mira Herbal Hair Oil
                </button>
              </div>
            ) : (
              /* Items List */
              <>
                <div className="flex justify-between items-center pb-2 text-xs text-[#24312B]/70">
                  <span>Selected Products</span>
                  <button
                    onClick={clearCart}
                    className="text-rose-600 hover:text-rose-800 font-medium flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Cart
                  </button>
                </div>

                {cart.map((item) => {
                  const itemPrice = item.product.price || 349;
                  const itemLineTotal = itemPrice * item.quantity;

                  return (
                    <div
                      key={item.product.id}
                      className="p-4 rounded-2xl bg-white border border-[#EEE8D8] shadow-2xs flex gap-4 items-center"
                    >
                      <div className="w-16 h-16 rounded-xl bg-[#F8F5EC] overflow-hidden shrink-0 border border-[#EEE8D8]">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-serif font-bold text-sm text-[#174A3A] truncate">
                          {item.product.name}
                        </h4>
                        <span className="text-xs text-[#2F6B4F] font-medium block">
                          {item.product.size || '100ml'} • ₹{itemPrice} each
                        </span>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center border border-[#8FAF8F]/40 rounded-lg bg-[#F8F5EC] text-xs">
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-[#174A3A] hover:bg-white rounded-l transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-6 text-center font-bold text-xs">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-[#174A3A] hover:bg-white rounded-r transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-rose-500 hover:text-rose-700 ml-auto"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-bold text-sm text-[#174A3A] block">
                          ₹{itemLineTotal}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-5 sm:p-6 bg-white border-t border-[#EEE8D8] space-y-4">
              <div className="space-y-1.5 text-xs text-[#24312B]/80">
                <div className="flex justify-between">
                  <span>Online Payment Total:</span>
                  <span className="font-bold text-sm text-[#174A3A]">₹{onlineSubtotal}</span>
                </div>
                <div className="flex justify-between text-xs text-[#24312B]/70">
                  <span>Cash on Delivery Total (+₹{settings.codCharge || 50} COD):</span>
                  <span className="font-semibold text-xs text-[#24312B]">₹{codSubtotal}</span>
                </div>
                <div className="text-[11px] text-[#2F6B4F] pt-0.5">
                  🚚 Home Delivery Included across India
                </div>
              </div>

              <button
                onClick={() => {
                  const firstItem = cart[0];
                  openCheckout(firstItem.product, totalQty);
                }}
                className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-[#174A3A] hover:bg-[#2F6B4F] active:scale-98 shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
