import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { paymentService } from '../services/paymentService';
import { PaymentMethod } from '../types';
import { X, ShieldCheck, Truck, Lock, CreditCard, Banknote, Plus, Minus, AlertCircle, CheckCircle2 } from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    closeCheckout, 
    checkoutProduct, 
    checkoutQuantity, 
    settings, 
    placeOrder, 
    showToast 
  } = useStore();

  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(checkoutQuantity || 1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online');

  // Customer Delivery Details
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: ''
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStepText, setPaymentStepText] = useState('');

  useEffect(() => {
    if (checkoutQuantity) {
      setQuantity(checkoutQuantity);
    }
  }, [checkoutQuantity]);

  if (!isCheckoutOpen) return null;

  // DYNAMIC PRICING CALCULATIONS
  const unitPrice = checkoutProduct.price || settings.onlinePrice || 349;
  const codCharge = checkoutProduct.codCharge || settings.codCharge || 50;

  const baseProductTotal = unitPrice * quantity;
  const codChargeAmount = paymentMethod === 'cod' ? codCharge : 0;
  const grandTotal = baseProductTotal + codChargeAmount;

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!formData.customerName.trim()) {
      errors.customerName = 'Please enter your full name.';
    }
    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      errors.phone = 'Please enter a valid 10-digit mobile number.';
    }
    if (!formData.address.trim()) {
      errors.address = 'Please enter complete delivery address.';
    }
    if (!formData.city.trim()) {
      errors.city = 'Please enter city.';
    }
    if (!formData.state.trim()) {
      errors.state = 'Please enter state.';
    }
    const cleanPin = formData.pincode.trim().replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      errors.pincode = 'Please enter a 6-digit postal pincode.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      showToast('Please fill all required delivery fields.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === 'online') {
        setPaymentStepText('Connecting to Secure Payment Gateway...');
        await new Promise(r => setTimeout(r, 600));

        // Create online payment session
        const session = await paymentService.createOnlinePaymentOrder({
          orderId: 'TEMP_' + Date.now(),
          amount: grandTotal,
          customerName: formData.customerName,
          phone: formData.phone,
          email: formData.email
        });

        setPaymentStepText('Verifying Payment & Authorizing Transaction...');
        await new Promise(r => setTimeout(r, 800));

        // Backend payment verification
        const verifyRes = await paymentService.verifyPayment(session.paymentSessionId, 'TXN_' + Date.now());
        if (!verifyRes.success) {
          throw new Error('Payment verification could not be completed.');
        }
      } else {
        setPaymentStepText('Confirming Cash on Delivery Order...');
        await new Promise(r => setTimeout(r, 500));
      }

      // Save order
      const order = await placeOrder({
        customerName: formData.customerName,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        quantity,
        paymentMethod,
        notes: formData.notes
      });

      showToast(`Order placed! Confirmation notification sent to +91 ${formData.phone} 🎉`, 'success');
      navigate(`/order-confirmation/${order.orderId}`, { state: { order } });
    } catch (err) {
      console.error('Order placement error:', err);
      showToast('Payment could not be completed. Please try again or choose Cash on Delivery.', 'error');
    } finally {
      setIsProcessing(false);
      setPaymentStepText('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#F8F5EC] rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-[#EEE8D8] overflow-hidden animate-scale-up">
        
        {/* Header */}
        <div className="bg-white p-5 sm:p-6 border-b border-[#EEE8D8] flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#2F6B4F]">
              Direct Brand Checkout
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#174A3A]">
              Complete Your Order
            </h2>
          </div>
          <button
            onClick={closeCheckout}
            disabled={isProcessing}
            className="p-2 text-[#24312B]/60 hover:text-[#174A3A] hover:bg-[#F8F5EC] rounded-full transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handlePlaceOrder} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Order Item Summary Card */}
          <div className="p-4 rounded-2xl bg-white border border-[#EEE8D8] flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#F8F5EC] overflow-hidden shrink-0 border border-[#EEE8D8]">
              <img
                src={checkoutProduct.imageUrl}
                alt={checkoutProduct.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-serif font-bold text-base text-[#174A3A] truncate">
                {checkoutProduct.name} ({checkoutProduct.size || '100ml'})
              </h4>
              <p className="text-xs text-[#2F6B4F]">
                100% Home-Made Ayurvedic Botanical Hair Oil
              </p>
              <div className="text-xs font-semibold text-[#174A3A] mt-1">
                ₹{unitPrice} per bottle
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center border border-[#8FAF8F]/50 rounded-xl bg-[#F8F5EC] shrink-0">
              <button
                type="button"
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                disabled={quantity <= 1 || isProcessing}
                className="p-1.5 text-[#174A3A] hover:bg-white rounded-l transition-colors disabled:opacity-30"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center font-bold text-sm text-[#174A3A]">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity(q => Math.min(10, q + 1))}
                disabled={quantity >= 10 || isProcessing}
                className="p-1.5 text-[#174A3A] hover:bg-white rounded-r transition-colors disabled:opacity-30"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Delivery Details Fields */}
          <div className="bg-white p-5 rounded-2xl border border-[#EEE8D8] space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-[#174A3A] pb-2 border-b border-[#EEE8D8]">
              <Truck className="w-4 h-4 text-[#2F6B4F]" />
              <span>Customer Delivery Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#174A3A] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customerName}
                  onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="e.g. Anjali Verma"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F] ${
                    formErrors.customerName ? 'border-rose-400' : 'border-[#EEE8D8]'
                  }`}
                />
                {formErrors.customerName && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.customerName}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#174A3A] mb-1">
                  Mobile Number * (Order confirmation & delivery notifications sent here)
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="10-digit number (e.g. 9876543210)"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F] ${
                    formErrors.phone ? 'border-rose-400' : 'border-[#EEE8D8]'
                  }`}
                />
                {formErrors.phone && (
                  <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.phone}</span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#174A3A] mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="For order invoice copy (optional)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEE8D8] text-sm text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#174A3A] mb-1">
                Complete Delivery Address *
              </label>
              <textarea
                rows={2}
                required
                value={formData.address}
                onChange={e => setFormData({ ...formData, address: e.target.value })}
                placeholder="House/Flat No., Street, Landmark, Colony"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F] resize-none ${
                  formErrors.address ? 'border-rose-400' : 'border-[#EEE8D8]'
                }`}
              />
              {formErrors.address && (
                <span className="text-[11px] text-rose-600 mt-1 block">{formErrors.address}</span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#174A3A] mb-1">
                  City *
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={e => setFormData({ ...formData, city: e.target.value })}
                  placeholder="e.g. Pune"
                  className={`w-full px-3 py-2 rounded-xl border text-sm text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F] ${
                    formErrors.city ? 'border-rose-400' : 'border-[#EEE8D8]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#174A3A] mb-1">
                  State *
                </label>
                <input
                  type="text"
                  required
                  value={formData.state}
                  onChange={e => setFormData({ ...formData, state: e.target.value })}
                  placeholder="e.g. Maharashtra"
                  className={`w-full px-3 py-2 rounded-xl border text-sm text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F] ${
                    formErrors.state ? 'border-rose-400' : 'border-[#EEE8D8]'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#174A3A] mb-1">
                  Pincode *
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={formData.pincode}
                  onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                  placeholder="6 digits"
                  className={`w-full px-3 py-2 rounded-xl border text-sm text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F] ${
                    formErrors.pincode ? 'border-rose-400' : 'border-[#EEE8D8]'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-5 rounded-2xl border border-[#EEE8D8] space-y-3">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#174A3A]">
              Choose Payment Method
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Online Payment Option */}
              <label
                className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'online'
                    ? 'border-[#174A3A] bg-[#174A3A]/5 shadow-xs'
                    : 'border-[#EEE8D8] hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="online"
                      checked={paymentMethod === 'online'}
                      onChange={() => setPaymentMethod('online')}
                      className="accent-[#174A3A]"
                    />
                    <span className="font-bold text-sm text-[#174A3A]">Online Payment</span>
                  </div>
                  <span className="text-[10px] font-bold bg-[#174A3A] text-white px-2 py-0.5 rounded-full">
                    Save ₹50
                  </span>
                </div>
                <div className="mt-2 text-xs text-[#24312B]/75 space-y-0.5">
                  <p className="font-medium text-[#174A3A]">₹{baseProductTotal} Total</p>
                  <p className="text-[11px] text-[#2F6B4F]">UPI / Cards / Netbanking</p>
                </div>
              </label>

              {/* Cash on Delivery Option */}
              <label
                className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'cod'
                    ? 'border-[#174A3A] bg-[#174A3A]/5 shadow-xs'
                    : 'border-[#EEE8D8] hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#174A3A]"
                    />
                    <span className="font-bold text-sm text-[#24312B]">Cash on Delivery</span>
                  </div>
                  <span className="text-[10px] font-semibold text-[#24312B]/70">
                    +₹{codCharge} COD
                  </span>
                </div>
                <div className="mt-2 text-xs text-[#24312B]/75 space-y-0.5">
                  <p className="font-medium text-[#24312B]">₹{baseProductTotal + codCharge} Total</p>
                  <p className="text-[11px]">Pay upon physical doorstep arrival</p>
                </div>
              </label>
            </div>
          </div>

          {/* Dynamic Price Calculation Breakdown */}
          <div className="bg-[#EEE8D8]/50 p-4 rounded-2xl border border-[#EEE8D8] space-y-1.5 text-xs text-[#24312B]">
            <div className="flex justify-between">
              <span>Product ({quantity} × ₹{unitPrice}):</span>
              <span className="font-semibold">₹{baseProductTotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Home Delivery:</span>
              <span className="text-[#2F6B4F] font-bold">FREE</span>
            </div>
            {paymentMethod === 'cod' && (
              <div className="flex justify-between text-[#C49A4A] font-medium">
                <span>Cash on Delivery Handling:</span>
                <span>+₹{codCharge}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#EEE8D8] flex justify-between items-center text-sm font-bold text-[#174A3A]">
              <span>Final Total Payable:</span>
              <span className="text-xl text-[#174A3A]">₹{grandTotal}</span>
            </div>
          </div>

          {/* Security Assurance */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#2F6B4F]">
            <Lock className="w-3.5 h-3.5" />
            <span>256-bit Secure Encryption • 100% Genuine Herbal Formulation</span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-4 px-6 rounded-xl font-bold text-base text-white bg-[#174A3A] hover:bg-[#2F6B4F] active:scale-98 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{paymentStepText || 'Processing Order...'}</span>
              </div>
            ) : (
              <span>
                Confirm & Place Order – ₹{grandTotal} ({paymentMethod === 'online' ? 'Online Pay' : 'Pay on Delivery'})
              </span>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
