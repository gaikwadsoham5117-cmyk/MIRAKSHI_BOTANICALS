import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerSummary } from '../../types';
import { Search, Phone, Mail, MapPin, ShoppingBag, ShieldCheck } from 'lucide-react';

export const AdminCustomers: React.FC = () => {
  const { orders } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Aggregate customers from orders
  const customers = useMemo(() => {
    const map = new Map<string, CustomerSummary>();

    orders.forEach(ord => {
      const cleanPhone = ord.phone.replace(/\D/g, '') || ord.customerName;
      const existing = map.get(cleanPhone);

      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += (ord.amount || 0);
        if (new Date(ord.createdAt) > new Date(existing.lastOrderDate)) {
          existing.lastOrderDate = ord.createdAt;
          existing.address = ord.address;
          existing.city = ord.city;
        }
      } else {
        map.set(cleanPhone, {
          name: ord.customerName,
          phone: ord.phone,
          email: ord.email,
          address: ord.address,
          city: ord.city,
          totalOrders: 1,
          totalSpent: ord.amount || 0,
          lastOrderDate: ord.createdAt
        });
      }
    });

    return Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent);
  }, [orders]);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#174A3A]">
            Customer CRM Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#24312B]/75 mt-0.5">
            Aggregated order history and contact records for verified buyers.
          </p>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#EEE8D8] text-xs font-semibold text-[#174A3A]">
          <ShieldCheck className="w-4 h-4 text-[#2F6B4F]" />
          <span>{customers.length} Registered Buyers</span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#EEE8D8] shadow-xs flex items-center gap-3">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#24312B]/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by customer name, phone, city..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#EEE8D8] text-xs text-[#24312B] bg-[#F8F5EC]/50 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F]"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-[#EEE8D8] shadow-xs overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <div className="p-12 text-center text-[#24312B]/60 text-sm">
            No customers found matching search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F5EC] text-[#174A3A] font-bold uppercase tracking-wider text-[10px] border-b border-[#EEE8D8]">
                <tr>
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Orders</th>
                  <th className="py-3 px-4">Total Spent</th>
                  <th className="py-3 px-4">Latest Order</th>
                  <th className="py-3 px-4 text-right">Contact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEE8D8] text-[#24312B]">
                {filteredCustomers.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-[#F8F5EC]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#174A3A]">
                      {cust.name}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium">
                      {cust.phone}
                    </td>
                    <td className="py-3.5 px-4 text-[#24312B]/70">
                      {cust.email || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {cust.city || cust.address?.slice(0, 20) || 'India'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold bg-[#8FAF8F]/20 text-[#174A3A] px-2 py-0.5 rounded-full text-[10px]">
                        {cust.totalOrders} order{cust.totalOrders > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#174A3A]">
                      ₹{cust.totalSpent}
                    </td>
                    <td className="py-3.5 px-4 text-[#24312B]/60">
                      {new Date(cust.lastOrderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <a
                        href={`https://wa.me/91${cust.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${cust.name}, greetings from Mirakshi Botanicals!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-[10px] font-bold inline-block"
                      >
                        WhatsApp
                      </a>
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
