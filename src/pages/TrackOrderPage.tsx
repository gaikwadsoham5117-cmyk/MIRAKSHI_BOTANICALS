import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Order, OrderStatus } from '../types';
import { Search, Package, CheckCircle2, Clock, Truck, Home, AlertCircle, ArrowLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const ALL_STATUSES: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered'
];

export const TrackOrderPage: React.FC = () => {
  const { trackOrder } = useStore();
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('id') || searchParams.get('orderId') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-search if navigated with ?id=MB-XXXX
  useEffect(() => {
    if (initialOrderId) {
      setOrderId(initialOrderId);
      (async () => {
        setIsSearching(true);
        setHasSearched(true);
        try {
          const res = await trackOrder(initialOrderId.trim(), initialPhone.trim());
          setOrder(res);
          if (!res) {
            setErrorMsg(`Order #${initialOrderId} not found.`);
          }
        } catch {
          setErrorMsg('Could not fetch tracking details. Please try again.');
        } finally {
          setIsSearching(false);
        }
      })();
    }
  }, [initialOrderId, initialPhone, trackOrder]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setErrorMsg('Please enter your Order ID.');
      return;
    }
    setErrorMsg('');
    setIsSearching(true);
    setHasSearched(true);

    try {
      const res = await trackOrder(orderId.trim(), phone.trim());
      setOrder(res);
      if (!res) {
        setErrorMsg('Order not found. Please check your Order ID and mobile number.');
      }
    } catch {
      setErrorMsg('Could not fetch tracking details. Please try again or WhatsApp us.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIndex = (currentStatus: OrderStatus) => {
    return ALL_STATUSES.indexOf(currentStatus);
  };

  return (
    <div className="min-h-screen py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#F8F5EC]">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Back Link */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#174A3A] hover:text-[#2F6B4F] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Store</span>
          </Link>
        </div>

        {/* Search Box Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EEE8D8] shadow-md space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#2F6B4F]">
              Direct Shipment Tracking
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#174A3A]">
              Track Your Order
            </h1>
            <p className="text-sm text-[#24312B]/75 max-w-md mx-auto">
              Enter your Order ID and contact mobile number to view real-time shipping status and delivery updates.
            </p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4 max-w-xl mx-auto pt-2">
            {errorMsg && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#174A3A] mb-1">
                  Order ID *
                </label>
                <input
                  type="text"
                  required
                  value={orderId}
                  onChange={e => setOrderId(e.target.value)}
                  placeholder="e.g. MB-892415"
                  className="w-full px-4 py-3 rounded-xl border border-[#EEE8D8] text-sm text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F] uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#174A3A] mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full px-4 py-3 rounded-xl border border-[#EEE8D8] text-sm text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSearching}
              className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-[#174A3A] hover:bg-[#2F6B4F] active:scale-98 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSearching ? (
                <span>Searching tracking records...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Shipment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Tracking Result Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#EEE8D8] shadow-lg space-y-8 animate-fade-in">
            {/* Top Info */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-6 border-b border-[#EEE8D8]">
              <div>
                <span className="text-xs font-semibold text-[#2F6B4F]">Order ID</span>
                <h3 className="font-mono text-2xl font-bold text-[#174A3A]">{order.orderId}</h3>
                <p className="text-xs text-[#24312B]/70 mt-0.5">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-[#24312B]/60 block">Current Status</span>
                <span className={`inline-block font-bold px-3 py-1 rounded-full text-xs sm:text-sm mt-1 ${
                  order.orderStatus === 'Cancelled'
                    ? 'bg-rose-100 text-rose-800'
                    : order.orderStatus === 'Delivered'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-[#8FAF8F]/25 text-[#174A3A]'
                }`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Cancelled Banner if applicable */}
            {order.orderStatus === 'Cancelled' ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <h4 className="font-bold">This order has been cancelled</h4>
                  <p className="text-xs text-rose-700 mt-0.5">Please contact customer support on WhatsApp for any refund or re-order queries.</p>
                </div>
              </div>
            ) : (
              /* Step-by-Step Progress Timeline */
              <div className="py-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#174A3A] mb-8">
                  Shipment Progress Timeline
                </h4>

                <div className="relative">
                  {/* Connecting Line */}
                  <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-1 bg-[#EEE8D8] -translate-y-1/2 z-0" />

                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-6 relative z-10">
                    {ALL_STATUSES.map((statusName, idx) => {
                      const currentIdx = getStatusIndex(order.orderStatus);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={statusName} className="flex flex-col items-center text-center space-y-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                              isCompleted
                                ? 'bg-[#174A3A] text-white shadow-md'
                                : 'bg-white border-2 border-[#EEE8D8] text-[#24312B]/40'
                            } ${isCurrent ? 'ring-4 ring-[#8FAF8F]/40 scale-110' : ''}`}
                          >
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                          </div>
                          <span className={`text-xs font-semibold leading-tight ${
                            isCurrent ? 'text-[#174A3A] font-bold' : isCompleted ? 'text-[#2F6B4F]' : 'text-[#24312B]/50'
                          }`}>
                            {statusName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tracking Number and Notes */}
            {(order.trackingNumber || order.notes) && (
              <div className="p-4 rounded-2xl bg-[#F8F5EC] border border-[#EEE8D8] space-y-2 text-xs">
                {order.trackingNumber && (
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#2F6B4F]" />
                    <span>Courier Tracking AWB: <strong>{order.trackingNumber}</strong></span>
                  </div>
                )}
                {order.notes && (
                  <div className="text-[#24312B]/75">
                    <strong>Delivery Note:</strong> {order.notes}
                  </div>
                )}
              </div>
            )}

            {/* Product & Address Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#EEE8D8] text-xs sm:text-sm text-[#24312B]/85">
              <div>
                <span className="text-xs text-[#24312B]/60 block mb-1 font-semibold uppercase tracking-wider">
                  Item Details
                </span>
                <p className="font-bold text-[#174A3A]">{order.productTitle} (100ml)</p>
                <p className="text-xs text-[#2F6B4F]">Quantity: {order.quantity} | Total: ₹{order.amount}</p>
                <p className="text-xs text-[#24312B]/70 mt-1 capitalize">
                  Payment: {order.paymentMethod === 'online' ? 'Online (Paid)' : 'Cash on Delivery'}
                </p>
              </div>

              <div>
                <span className="text-xs text-[#24312B]/60 block mb-1 font-semibold uppercase tracking-wider">
                  Destination Address
                </span>
                <p className="font-medium text-[#174A3A]">{order.customerName}</p>
                <p className="text-xs text-[#24312B]/80">{order.address}, {order.city}, {order.state} - {order.pincode}</p>
                <p className="text-xs text-[#24312B]/70 mt-0.5">Phone: {order.phone}</p>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
