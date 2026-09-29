import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Phone, MessageCircle, Mail, MapPin, Send, CheckCircle2, Clock } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { settings, submitEnquiry } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const phone = settings.phone || '9373080098';
  const whatsapp = settings.whatsapp || '9373080098';
  const whatsappPreFilled = encodeURIComponent('Hello, I would like to order Mira Herbal Hair Oil (100ml).');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Please enter your name.');
      return;
    }
    const cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!formData.message.trim()) {
      setError('Please enter your query or message.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitEnquiry(formData);
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch {
      setError('Could not submit enquiry. Please call or WhatsApp us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#F8F5EC] border-t border-[#EEE8D8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs sm:text-sm font-semibold tracking-wider text-[#2F6B4F] uppercase">
            We Are Here to Assist You
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#174A3A] mt-2">
            Get in Touch
          </h2>
          <p className="text-sm sm:text-base text-[#24312B]/75 mt-3">
            Have questions about Mira Herbal Hair Oil or your order? Connect directly with us via call, WhatsApp, or the form below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Contact Info & Direct Actions */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#EEE8D8] shadow-sm space-y-6">
              <h3 className="font-serif text-2xl font-bold text-[#174A3A]">
                Direct Contacts
              </h3>

              {/* Direct Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <a
                  href={`tel:${phone}`}
                  className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[#174A3A] text-white font-semibold text-sm hover:bg-[#2F6B4F] transition-all shadow-xs"
                >
                  <Phone className="w-4 h-4 text-[#C49A4A]" />
                  <span>Call {phone}</span>
                </a>

                <a
                  href={`https://wa.me/91${whatsapp}?text=${whatsappPreFilled}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 py-3.5 px-4 rounded-xl bg-[#25D366] text-white font-semibold text-sm hover:bg-[#20ba59] transition-all shadow-xs"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>WhatsApp Us</span>
                </a>
              </div>

              {/* Details List */}
              <div className="space-y-4 pt-4 border-t border-[#EEE8D8] text-sm text-[#24312B]/80">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#2F6B4F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#174A3A] block">Customer Helpline:</span>
                    <a href={`tel:${phone}`} className="hover:text-[#174A3A] transition-colors font-medium">
                      +91 {phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#2F6B4F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#174A3A] block">Email:</span>
                    <span>{settings.email || 'care@mirakshibotanicals.com'}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#2F6B4F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#174A3A] block">Support Hours:</span>
                    <span>Monday – Saturday: 9:00 AM – 7:30 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#2F6B4F] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-[#174A3A] block">Authentic Formulation Unit:</span>
                    <span>Mirakshi Botanicals, Traditional Ayurvedic Prep Kitchen, India</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Contact / Enquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EEE8D8] shadow-sm">
              <h3 className="font-serif text-2xl font-bold text-[#174A3A] mb-2">
                Send an Enquiry
              </h3>
              <p className="text-xs sm:text-sm text-[#24312B]/75 mb-6">
                Fill in your details below and our team will get in touch with you promptly.
              </p>

              {submitted ? (
                <div className="text-center py-10 space-y-3 bg-[#F8F5EC] rounded-2xl border border-[#8FAF8F]/30 p-6">
                  <CheckCircle2 className="w-12 h-12 text-[#2F6B4F] mx-auto" />
                  <h4 className="font-serif text-xl font-bold text-[#174A3A]">
                    Enquiry Submitted Successfully!
                  </h4>
                  <p className="text-sm text-[#24312B]/80 max-w-md mx-auto">
                    Thank you for reaching out to Mirakshi Botanicals. We will contact you at <strong>{formData.phone || 'your phone number'}</strong> shortly.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 px-5 py-2 text-xs font-semibold text-[#174A3A] bg-white border border-[#8FAF8F]/40 rounded-lg hover:bg-[#F8F5EC]"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#174A3A] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Sharma"
                        className="w-full px-4 py-3 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]/50 text-sm text-[#24312B] focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F] focus:bg-white transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#174A3A] mb-1.5">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full px-4 py-3 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]/50 text-sm text-[#24312B] focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#174A3A] mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. you@example.com"
                      className="w-full px-4 py-3 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]/50 text-sm text-[#24312B] focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F] focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#174A3A] mb-1.5">
                      Your Message or Hair Care Question *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Ask about ingredients, delivery times, or hair concerns..."
                      className="w-full px-4 py-3 rounded-xl border border-[#EEE8D8] bg-[#F8F5EC]/50 text-sm text-[#24312B] focus:outline-hidden focus:ring-2 focus:ring-[#2F6B4F] focus:bg-white transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 rounded-xl font-bold text-sm text-white bg-[#174A3A] hover:bg-[#2F6B4F] active:scale-98 shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Submitting Enquiry...</span>
                    ) : (
                      <>
                        <span>Submit Enquiry</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
