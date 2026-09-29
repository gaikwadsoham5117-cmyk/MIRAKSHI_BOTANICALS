import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Enquiry } from '../../types';
import { MessageSquare, Phone, Mail, CheckCircle2, Clock, Trash2, Check } from 'lucide-react';

export const AdminEnquiries: React.FC = () => {
  const { enquiries, updateEnquiryStatus, deleteEnquiry } = useStore();
  const [filter, setFilter] = useState<'all' | 'new' | 'contacted' | 'resolved'>('all');

  const filteredEnquiries = enquiries.filter(e => filter === 'all' || e.status === filter);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#174A3A]">
            Customer Inquiries & Support
          </h1>
          <p className="text-xs sm:text-sm text-[#24312B]/75 mt-0.5">
            Manage inquiries submitted via the website contact form.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#EEE8D8] text-xs">
          {(['all', 'new', 'contacted', 'resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all ${
                filter === tab
                  ? 'bg-[#174A3A] text-white'
                  : 'text-[#24312B]/70 hover:text-[#174A3A]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Enquiries Grid */}
      {filteredEnquiries.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EEE8D8] text-[#24312B]/60 text-sm">
          No customer inquiries found under this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredEnquiries.map((enq) => (
            <div
              key={enq.id}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EEE8D8] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-[#EEE8D8]">
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#174A3A]">
                      {enq.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#24312B]/70 mt-1">
                      <a href={`tel:${enq.phone}`} className="flex items-center gap-1 hover:text-[#174A3A] font-medium">
                        <Phone className="w-3.5 h-3.5 text-[#2F6B4F]" /> {enq.phone}
                      </a>
                      {enq.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5 text-[#2F6B4F]" /> {enq.email}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase shrink-0 ${
                    enq.status === 'resolved'
                      ? 'bg-emerald-100 text-emerald-800'
                      : enq.status === 'contacted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {enq.status}
                  </span>
                </div>

                <div className="mt-3 text-xs sm:text-sm text-[#24312B]/85 bg-[#F8F5EC] p-3.5 rounded-xl border border-[#EEE8D8] leading-relaxed">
                  "{enq.message}"
                </div>

                <span className="text-[10px] text-[#24312B]/50 mt-2 block">
                  Received on {new Date(enq.createdAt).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-3 border-t border-[#EEE8D8] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs">
                  {enq.status !== 'contacted' && (
                    <button
                      onClick={() => updateEnquiryStatus(enq.id, 'contacted')}
                      className="px-2.5 py-1 rounded-lg bg-[#EEE8D8] hover:bg-[#8FAF8F]/30 text-[#174A3A] font-semibold text-[11px]"
                    >
                      Mark Contacted
                    </button>
                  )}
                  {enq.status !== 'resolved' && (
                    <button
                      onClick={() => updateEnquiryStatus(enq.id, 'resolved')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1"
                    >
                      <Check className="w-3 h-3" /> Mark Resolved
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`https://wa.me/91${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${enq.name}, thanking you for contacting Mirakshi Botanicals.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 bg-[#25D366] text-white rounded-lg"
                    title="Reply on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 fill-white" />
                  </a>

                  <button
                    onClick={() => deleteEnquiry(enq.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                    title="Delete enquiry"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
