import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, Sparkles, Building, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundManager } from './AudioEngine';

export const ContactSection = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    category: 'The Apex Tower (Commercial)',
    investmentBracket: '$5M — $15M',
    preferredDate: '',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const offices = [
    {
      city: 'Tokyo',
      title: 'Global Masterplan Studio & HQ',
      address: 'Toranomon Hills Tower, 48F, Minato-ku, Tokyo 105-6348',
      tel: '+81 3 5550 4900',
      hours: '09:00 — 19:00 JST'
    },
    {
      city: 'Zurich',
      title: 'European Private Client Atelier',
      address: 'Bahnhofstrasse 28, 8001 Zürich, Switzerland',
      tel: '+41 44 214 7800',
      hours: '08:30 — 18:00 CET'
    },
    {
      city: 'New York',
      title: 'Americas Institutional Gallery',
      address: '432 Park Avenue, 54th Fl, New York, NY 10022',
      tel: '+1 212 940 3200',
      hours: '09:00 — 18:00 EST'
    },
    {
      city: 'Dubai',
      title: 'Middle East Regional Pavilion',
      address: 'DIFC Gate Precinct 4, Level 08, Dubai, UAE',
      tel: '+971 4 362 8900',
      hours: '09:00 — 18:00 GST'
    }
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    soundManager.playClick();

    if (!formData.fullName.trim() || !formData.email.trim()) {
      setErrorMsg('Please enter your full name and confidential email address.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMsg('Please provide a valid corporate or private email address.');
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);

      // Trigger luxury confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#d4af37', '#f3df9b', '#ffffff', '#2c3340']
        });
      } catch (err) {}
    }, 1000);
  };

  return (
    <section id="contact" className="relative min-h-screen w-full py-32 px-6 md:px-16 pointer-events-auto">
      <div className="max-w-[1600px] mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono tracking-[0.2em] text-[#d4af37] uppercase mb-2">
              <span className="w-6 h-[1px] bg-[#d4af37]" />
              <span>Section 04 // Private Acquisition & Consultation</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-bold uppercase tracking-tight text-white">
              Reserve Your Place in History
            </h2>
          </div>

          <p className="max-w-md text-sm text-gray-300 font-body leading-relaxed">
            Due to the rare scale and limited inventory of masterplan developments, viewings and
            portfolio allocations are arranged strictly by private appointment.
          </p>
        </div>

        {/* Main Grid: Form & Global Studios */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mt-12">
          {/* Left Column: Private Consultation Booking Form */}
          <div className="lg:col-span-7 glass-panel p-8 md:p-12 rounded-sm border border-white/10 crosshair crosshair-tl crosshair-br shadow-2xl relative">
            <div className="flex items-center justify-between pb-6 mb-8 border-b border-white/10">
              <span className="text-xs font-mono text-[#d4af37] uppercase tracking-widest">
                Confidential Inquiry Form
              </span>
              <span className="text-[10px] font-mono text-gray-500 uppercase">
                End-to-End Encrypted
              </span>
            </div>

            {submitted ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border border-[#d4af37] bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] mb-6">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-display font-bold text-white uppercase tracking-wide">
                  Consultation Request Dispatched
                </h3>
                <p className="text-sm font-body text-gray-300 max-w-md mt-3 leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{formData.fullName}</span>.
                  Your private portfolio director has been assigned. You will receive an encrypted
                  dossier and calendar confirmation at <span className="text-[#d4af37]">{formData.email}</span>.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      fullName: '',
                      email: '',
                      phone: '',
                      category: 'The Apex Tower (Commercial)',
                      investmentBracket: '$5M — $15M',
                      preferredDate: '',
                      notes: ''
                    });
                  }}
                  className="mt-8 px-6 py-2.5 border border-white/20 text-xs font-mono tracking-widest uppercase text-gray-300 hover:text-white hover:border-[#d4af37]"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                  <div className="p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono">
                    {errorMsg}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Lord Alistair Thorne"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                      Private Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. thorne@familyoffice.com"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                      Direct Contact Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 019-2834"
                      className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                      Target Development Sector
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-[#0a0d14] border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    >
                      <option value="The Apex Tower (Commercial)">The Apex Tower (Commercial)</option>
                      <option value="Lumina Sky Residences (Residential)">Lumina Sky Residences (Residential)</option>
                      <option value="Elysium Waterfront Pavilions (Luxury Villas)">Elysium Waterfront Pavilions (Luxury Villas)</option>
                      <option value="Full Institutional Portfolio Acquisition">Full Institutional Portfolio Acquisition</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                      Anticipated Capital Allocation
                    </label>
                    <select
                      name="investmentBracket"
                      value={formData.investmentBracket}
                      onChange={handleChange}
                      className="w-full bg-[#0a0d14] border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    >
                      <option value="$2M — $5M">$2M — $5M (Executive Residence)</option>
                      <option value="$5M — $15M">$5M — $15M (Penthouses / Commercial Suite)</option>
                      <option value="$15M — $50M">$15M — $50M (Waterfront Sanctuary / Full Floorplate)</option>
                      <option value="$50M+">$50M+ (Institutional Multi-Asset Block)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                      Preferred Viewing Window
                    </label>
                    <input
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      className="w-full bg-[#0a0d14] border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-gray-400 mb-2">
                    Bespoke Architectural Specifications / Inquiries
                  </label>
                  <textarea
                    rows={4}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Specify any bespoke requirements (e.g. yacht draft specifications, private helipad landing permits, contiguous floorplate combinations)..."
                    className="w-full bg-white/[0.03] border border-white/10 rounded-sm px-4 py-3 text-sm text-white focus:outline-none focus:border-[#d4af37] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#aa8524] text-black font-mono text-xs uppercase tracking-[0.25em] font-semibold hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'Transmitting Encryption...' : 'Request Private Briefing'}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Global Presentation Studios */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <span className="text-xs font-mono tracking-widest text-[#d4af37] uppercase block mb-2">
                Global Masterplan Studios
              </span>

              {offices.map((office) => (
                <div
                  key={office.city}
                  className="glass-panel p-6 rounded-sm border border-white/10 hover:border-[#d4af37]/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-display font-bold text-white tracking-wide">
                      {office.city}
                    </h4>
                    <span className="text-[10px] font-mono text-[#d4af37] uppercase">
                      {office.hours}
                    </span>
                  </div>
                  <p className="text-xs font-body text-[#f3df9b] mb-2">{office.title}</p>
                  <div className="flex items-start gap-2 text-xs font-body text-gray-400 mb-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#d4af37] shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
                    <Phone className="w-3.5 h-3.5 text-[#d4af37] shrink-0" />
                    <span>{office.tel}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct VIP Hotline & Email Card */}
            <div className="p-6 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-sm">
              <span className="text-[10px] font-mono text-[#d4af37] uppercase tracking-widest block mb-1">
                Direct Institutional Relations
              </span>
              <div className="text-sm font-mono text-white font-semibold">
                acquisitions@aetheria-developments.com
              </div>
              <div className="text-xs font-mono text-gray-400 mt-1">
                Global Concierge: +1 (800) 849-2910
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
