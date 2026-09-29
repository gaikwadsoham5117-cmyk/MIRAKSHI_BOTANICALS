import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { notificationService } from '../../services/notificationService';
import { Order, OrderStatus } from '../../types';
import { 
  Search, 
  Filter, 
  Eye, 
  Truck, 
  CheckCircle2, 
  X, 
  Edit3, 
  Phone, 
  MapPin, 
  Clock,
  Download,
  MessageCircle,
  Bell,
  Send,
  ExternalLink,
  Share2
} from 'lucide-react';

const STATUS_LIST: OrderStatus[] = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus, showToast } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Status update modal state
  const [isUpdating, setIsUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Order Placed');
  const [newTracking, setNewTracking] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.phone.includes(searchTerm) ||
      o.city.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenStatusModal = (ord: Order) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setNewTracking(ord.trackingNumber || '');
    setNewNotes(ord.notes || '');
    setIsUpdating(true);
  };

  const getWhatsAppNotificationUrl = (order: Order, statusOverride?: OrderStatus, trackingOverride?: string) => {
    const origin = window.location.origin;
    const trackUrl = `${origin}/track-order?id=${order.orderId}`;
    const targetStatus = statusOverride || order.orderStatus;
    const tracking = trackingOverride !== undefined ? trackingOverride : order.trackingNumber;

    const message = encodeURIComponent(
      `🌿 *Mirakshi Botanicals - Order Update*\n\n` +
      `Hello ${order.customerName},\n` +
      `Your order *#${order.orderId}* for ${order.quantity}× ${order.productTitle} is updated to status:\n` +
      `📦 *${targetStatus.toUpperCase()}*\n` +
      (tracking ? `\n🚚 Courier Tracking (AWB): ${tracking}\n` : '') +
      `\n👉 Track your package live & view invoice:\n${trackUrl}\n\n` +
      `Pure Ayurvedic care prepared for you. Thank you! 💚`
    );

    const cleanPhone = order.phone.replace(/\D/g, '');
    return `https://wa.me/91${cleanPhone}?text=${message}`;
  };

  const handleSendWhatsAppNotification = (order: Order, statusOverride?: OrderStatus, trackingOverride?: string) => {
    const url = getWhatsAppNotificationUrl(order, statusOverride, trackingOverride);
    window.open(url, '_blank');
  };

  const handleTriggerPushNotification = (order: Order) => {
    try {
      notificationService.notifyStatusUpdate(
        order.orderId,
        order.orderStatus,
        order.trackingNumber,
        order.customerName
      );
      showToast(`Push notification dispatched for #${order.orderId}!`, 'success');
    } catch {
      showToast('Could not trigger notification', 'error');
    }
  };

  const handleSaveStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      await updateOrderStatus(selectedOrder.orderId, newStatus, newTracking, newNotes);
      setIsUpdating(false);
      
      const updatedOrd = {
        ...selectedOrder,
        orderStatus: newStatus,
        trackingNumber: newTracking,
        notes: newNotes
      };
      
      setSelectedOrder(updatedOrd);
      showToast(`Status updated to "${newStatus}"! Customer notification sent.`, 'success');
    } catch {
      showToast('Failed to update order status.', 'error');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#174A3A]">
            Order Management
          </h1>
          <p className="text-xs sm:text-sm text-[#24312B]/75 mt-0.5">
            View, fulfill, track, and update all customer shipments.
          </p>
        </div>

        <div className="text-xs font-semibold text-[#174A3A] bg-white px-4 py-2 rounded-xl border border-[#EEE8D8] shadow-2xs">
          Total: {orders.length} orders
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EEE8D8] shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#24312B]/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by ID, Name, Phone..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EEE8D8] text-xs text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-[#2F6B4F] shrink-0" />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl border border-[#EEE8D8] text-xs font-medium text-[#174A3A] bg-[#F8F5EC]/60 focus:bg-white focus:outline-hidden"
          >
            <option value="all">All Statuses ({orders.length})</option>
            {STATUS_LIST.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-3xl border border-[#EEE8D8] shadow-xs overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center text-[#24312B]/60 text-sm">
            No matching orders found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F5EC] text-[#174A3A] font-bold uppercase tracking-wider text-[10px] border-b border-[#EEE8D8]">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Qty</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Payment</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE8D8] text-[#24312B]">
                {filteredOrders.map((ord) => (
                  <tr key={ord.orderId} className="hover:bg-[#F8F5EC]/40 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#174A3A]">
                      {ord.orderId}
                    </td>
                    <td className="py-3.5 px-4 font-semibold">
                      {ord.customerName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <a href={`tel:${ord.phone}`} className="hover:text-[#174A3A] underline">
                        {ord.phone}
                      </a>
                    </td>
                    <td className="py-3.5 px-4">{ord.productTitle}</td>
                    <td className="py-3.5 px-4 font-semibold">{ord.quantity}</td>
                    <td className="py-3.5 px-4 font-bold text-[#174A3A]">
                      ₹{ord.amount}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase ${
                        ord.paymentMethod === 'online'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {ord.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.orderStatus === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.orderStatus === 'Cancelled'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-[#8FAF8F]/25 text-[#174A3A]'
                      }`}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#24312B]/60">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleSendWhatsAppNotification(ord)}
                          className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 border border-emerald-200 transition-colors"
                          title="Send WhatsApp Status Notification to Customer"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-emerald-600 text-white" />
                        </button>
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded-lg text-[#174A3A] hover:bg-[#F8F5EC] border border-[#EEE8D8]"
                          title="View Order Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenStatusModal(ord)}
                          className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold text-white bg-[#174A3A] hover:bg-[#2F6B4F]"
                        >
                          Update Status
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details View Modal */}
      {selectedOrder && !isUpdating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-[#EEE8D8] shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEE8D8]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F6B4F]">Order Summary</span>
                <h3 className="font-mono text-xl font-bold text-[#174A3A]">{selectedOrder.orderId}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1.5 text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#24312B]">
              <div className="p-3 rounded-xl bg-[#F8F5EC] space-y-1">
                <span className="font-bold text-[#174A3A] block">Customer Information:</span>
                <p><strong>Name:</strong> {selectedOrder.customerName}</p>
                <p><strong>Phone:</strong> {selectedOrder.phone}</p>
                {selectedOrder.email && <p><strong>Email:</strong> {selectedOrder.email}</p>}
                <p><strong>Address:</strong> {selectedOrder.address}, {selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F5EC] space-y-1">
                <span className="font-bold text-[#174A3A] block">Product & Price Details:</span>
                <p><strong>Item:</strong> {selectedOrder.productTitle} (100ml)</p>
                <p><strong>Quantity:</strong> {selectedOrder.quantity}</p>
                <p><strong>Method:</strong> {selectedOrder.paymentMethod.toUpperCase()} ({selectedOrder.paymentStatus})</p>
                <p><strong>Total Amount:</strong> ₹{selectedOrder.amount}</p>
                <p><strong>Status:</strong> {selectedOrder.orderStatus}</p>
                {selectedOrder.trackingNumber && <p><strong>AWB Tracking:</strong> {selectedOrder.trackingNumber}</p>}
                {selectedOrder.notes && <p><strong>Notes:</strong> {selectedOrder.notes}</p>}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                onClick={() => handleOpenStatusModal(selectedOrder)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-[#174A3A] hover:bg-[#2F6B4F]"
              >
                Change Order Status
              </button>
              <button
                onClick={() => handleSendWhatsAppNotification(selectedOrder)}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-[#25D366] hover:bg-[#20ba59] flex items-center justify-center gap-1.5 shadow-2xs"
                title="Send WhatsApp update to customer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Customer</span>
              </button>
              <button
                onClick={() => handleTriggerPushNotification(selectedOrder)}
                className="px-3 py-2.5 rounded-xl text-xs font-semibold text-[#174A3A] bg-[#8FAF8F]/20 hover:bg-[#8FAF8F]/35 flex items-center justify-center gap-1"
                title="Trigger push notification alert on this device"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Test Alert</span>
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border border-[#EEE8D8]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {isUpdating && selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-4 border border-[#EEE8D8] shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEE8D8]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#2F6B4F]">Fulfillment Update</span>
                <h3 className="font-mono text-lg font-bold text-[#174A3A]">{selectedOrder.orderId}</h3>
              </div>
              <button onClick={() => setIsUpdating(false)} className="p-1.5 text-gray-500 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#174A3A] mb-1">
                  Change Fulfillment Status *
                </label>
                <select
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2.5 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] text-xs font-bold text-[#174A3A]"
                >
                  {STATUS_LIST.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#174A3A] mb-1">
                  Courier Tracking Number (AWB / Link)
                </label>
                <input
                  type="text"
                  value={newTracking}
                  onChange={e => setNewTracking(e.target.value)}
                  placeholder="e.g. DTDC18928372"
                  className="w-full px-3 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]"
                />
              </div>

              <div>
                <label className="block font-semibold text-[#174A3A] mb-1">
                  Internal Delivery / Customer Notes
                </label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="e.g. Dispatched via India Post / Handed to courier"
                  className="w-full px-3 py-2 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC] resize-none"
                />
              </div>

              <div className="p-3 bg-[#F8F5EC] rounded-xl border border-[#8FAF8F]/40 space-y-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#174A3A]">
                  <Bell className="w-3.5 h-3.5 text-[#2F6B4F]" />
                  <span>Automatic Customer Redirection Notification</span>
                </div>
                <p className="text-[10px] text-[#24312B]/75 leading-relaxed">
                  Saving will send an immediate real-time push alert with direct redirection to:
                  <span className="font-mono block text-[#2F6B4F] mt-0.5">/track-order?id={selectedOrder.orderId}</span>
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-xl font-bold text-xs text-white bg-[#174A3A] hover:bg-[#2F6B4F] shadow-sm"
                >
                  Save & Notify Customer
                </button>
                <button
                  type="button"
                  onClick={async (e) => {
                    await handleSaveStatus(e as any);
                    handleSendWhatsAppNotification(selectedOrder, newStatus, newTracking);
                  }}
                  className="py-3 px-4 rounded-xl font-bold text-xs text-white bg-[#25D366] hover:bg-[#20ba59] flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Save & WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsUpdating(false)}
                  className="px-4 py-3 rounded-xl text-xs font-semibold border border-[#EEE8D8]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
