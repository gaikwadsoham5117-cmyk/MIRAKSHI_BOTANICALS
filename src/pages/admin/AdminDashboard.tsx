import React from 'react';
import { useStore } from '../../context/StoreContext';
import { notificationService } from '../../services/notificationService';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  PackageCheck, 
  XCircle, 
  IndianRupee, 
  Users, 
  Package, 
  MessageSquare,
  ArrowRight,
  TrendingUp,
  Bell,
  Sparkles,
  Radio,
  ExternalLink,
  MessageCircle
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { orders, products, enquiries, showToast } = useStore();

  const handleTestCustomerNotification = () => {
    const sampleId = orders[0]?.orderId || 'MB-' + Math.floor(1000 + Math.random() * 9000);
    notificationService.notifyStatusUpdate(
      sampleId,
      'Shipped',
      'DTDC' + Math.floor(10000000 + Math.random() * 90000000),
      orders[0]?.customerName || 'Valued Customer'
    );
    showToast(`Test order alert triggered for #${sampleId}! Click it to test direct page redirection.`, 'success');
  };

  // Metrics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.orderStatus === 'Order Placed' || o.paymentStatus === 'pending').length;
  const confirmedOrders = orders.filter(o => o.orderStatus === 'Confirmed').length;
  const processingOrders = orders.filter(o => o.orderStatus === 'Processing').length;
  const shippedOrders = orders.filter(o => o.orderStatus === 'Shipped' || o.orderStatus === 'Out for Delivery').length;
  const deliveredOrders = orders.filter(o => o.orderStatus === 'Delivered').length;
  const cancelledOrders = orders.filter(o => o.orderStatus === 'Cancelled').length;

  const totalSales = orders
    .filter(o => o.orderStatus !== 'Cancelled')
    .reduce((sum, o) => sum + (o.amount || 0), 0);

  // Distinct customers by phone
  const distinctPhones = new Set(orders.map(o => o.phone.replace(/\D/g, '')));
  const totalCustomers = distinctPhones.size;

  const newEnquiries = enquiries.filter(e => e.status === 'new').length;

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${totalSales.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
      subtitle: `${totalOrders - cancelledOrders} successful orders`
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      color: 'bg-[#174A3A]/10 text-[#174A3A] border-[#8FAF8F]/30',
      subtitle: `${pendingOrders} need fulfillment`
    },
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      color: 'bg-blue-500/10 text-blue-700 border-blue-200',
      subtitle: 'Distinct client phone records'
    },
    {
      title: 'New Enquiries',
      value: newEnquiries,
      icon: MessageSquare,
      color: 'bg-amber-500/10 text-amber-700 border-amber-200',
      subtitle: 'Customer queries awaiting response'
    }
  ];

  const statusBreakdown = [
    { label: 'Order Placed / Pending', count: pendingOrders, icon: Clock, color: 'text-amber-600 bg-amber-50' },
    { label: 'Confirmed', count: confirmedOrders, icon: CheckCircle2, color: 'text-blue-600 bg-blue-50' },
    { label: 'Processing', count: processingOrders, icon: Package, color: 'text-indigo-600 bg-indigo-50' },
    { label: 'Shipped / Out', count: shippedOrders, icon: Truck, color: 'text-purple-600 bg-purple-50' },
    { label: 'Delivered', count: deliveredOrders, icon: PackageCheck, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Cancelled', count: cancelledOrders, icon: XCircle, color: 'text-rose-600 bg-rose-50' },
  ];

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#174A3A]">
            Executive Store Overview
          </h1>
          <p className="text-xs sm:text-sm text-[#24312B]/75 mt-0.5">
            Real-time analytics for Mirakshi Botanicals (Mira Herbal Hair Oil).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/orders"
            className="px-4 py-2 rounded-xl bg-[#174A3A] hover:bg-[#2F6B4F] text-white text-xs sm:text-sm font-semibold shadow-xs transition-all"
          >
            Manage All Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-[#EEE8D8] shadow-xs flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-semibold text-[#24312B]/60 uppercase tracking-wider block">
                    {stat.title}
                  </span>
                  <span className="font-serif font-bold text-2xl sm:text-3xl text-[#174A3A] mt-1 block">
                    {stat.value}
                  </span>
                </div>
                <div className={`p-3 rounded-xl border ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <span className="text-[11px] text-[#24312B]/70 mt-3 pt-2 border-t border-[#EEE8D8] block">
                {stat.subtitle}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status Pipeline Grid */}
      <div className="bg-white p-6 rounded-3xl border border-[#EEE8D8] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-[#174A3A]">
            Order Fulfillment Pipeline
          </h2>
          <span className="text-xs text-[#2F6B4F] font-semibold">
            {totalOrders} Total Life-Time Orders
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statusBreakdown.map((sb, idx) => {
            const Icon = sb.icon;
            return (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]/60 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <div className={`p-1.5 rounded-lg ${sb.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-bold text-lg text-[#174A3A]">
                    {sb.count}
                  </span>
                </div>
                <span className="text-xs font-medium text-[#24312B]/80 mt-2 block truncate">
                  {sb.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Firebase Real-Time Notification Engine Status Card */}
      <div className="bg-gradient-to-br from-[#174A3A] to-[#2F6B4F] text-white p-6 sm:p-8 rounded-3xl shadow-lg border border-[#8FAF8F]/30 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
              <Radio className="w-6 h-6 text-[#C49A4A] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#C49A4A] bg-black/20 px-2.5 py-0.5 rounded-full border border-[#C49A4A]/30">
                  Firebase Connected & Live
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold mt-0.5">
                Real-Time Customer Redirection Notification System
              </h3>
            </div>
          </div>

          <button
            onClick={handleTestCustomerNotification}
            className="px-4 py-2.5 bg-white text-[#174A3A] hover:bg-[#F8F5EC] active:scale-98 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all shrink-0"
          >
            <Bell className="w-4 h-4 text-[#174A3A]" />
            <span>Test Customer Alert & Redirection</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#C49A4A]">
              <Sparkles className="w-4 h-4" />
              <span>1. Booking Completed</span>
            </div>
            <p className="text-white/80 leading-relaxed text-[11px]">
              When customer books an order, an immediate confirmation push alert & chime are triggered. Clicking it redirects directly to <code className="bg-black/20 px-1 py-0.5 rounded">/order-confirmation/:id</code>.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#8FAF8F]">
              <Truck className="w-4 h-4" />
              <span>2. Status Updates in Admin</span>
            </div>
            <p className="text-white/80 leading-relaxed text-[11px]">
              When you update order status (Shipped, Out for Delivery, etc.), Firebase onSnapshot broadcasts it in real-time, popping up an alert on the customer's browser with direct link to <code className="bg-black/20 px-1 py-0.5 rounded">/track-order?id=...</code>.
            </p>
          </div>

          <div className="bg-white/10 p-4 rounded-2xl border border-white/10 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <MessageCircle className="w-4 h-4" />
              <span>3. 1-Click WhatsApp Notification</span>
            </div>
            <p className="text-white/80 leading-relaxed text-[11px]">
              In Orders tab, click the WhatsApp icon on any order to instantly send an automated update directly to the buyer's phone with their live tracking URL.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-[#EEE8D8] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#EEE8D8] flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-[#174A3A]">
              Recent Customer Orders
            </h2>
            <p className="text-xs text-[#24312B]/65">Latest transactions and fulfillment statuses</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-[#2F6B4F] hover:text-[#174A3A] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-8 text-center text-[#24312B]/60 text-sm">
            No orders placed yet. Orders received through the store will display here in real time.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F5EC] text-[#174A3A] font-bold uppercase tracking-wider text-[10px] border-b border-[#EEE8D8]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE8D8] text-[#24312B]">
                {recentOrders.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-[#F8F5EC]/50 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#174A3A]">{ord.orderId}</td>
                    <td className="py-3.5 px-4 font-semibold">{ord.customerName}</td>
                    <td className="py-3.5 px-4 font-mono">{ord.phone}</td>
                    <td className="py-3.5 px-4">{ord.quantity} × 100ml</td>
                    <td className="py-3.5 px-4 font-bold text-[#174A3A]">₹{ord.amount}</td>
                    <td className="py-3.5 px-4 capitalize">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        ord.paymentMethod === 'online' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[11px] text-[#2F6B4F]">
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#24312B]/60">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
