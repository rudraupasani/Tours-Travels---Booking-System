"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { createContactMessage } from "@/lib/data";

const CONTACT_INFO = [
  { icon: Phone, label: "Phone", value: "+1 234 567 8900", sub: "Mon–Sat, 9am–6pm EST", href: "tel:+12345678900" },
  { icon: Mail, label: "Email", value: "info@travelora.com", sub: "We reply within 24 hours", href: "mailto:info@travelora.com" },
  { icon: MapPin, label: "Address", value: "123 Travel Street", sub: "New York, USA – 10001", href: "#" },
  { icon: Clock, label: "Office Hours", value: "Mon–Sun 9:00 AM", sub: "to 6:00 PM (EST)", href: "#" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field: string, value: string) => setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const success = await createContactMessage(form);
    setLoading(false);
    if (success) {
      setSubmitted(true);
    } else {
      setError("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-brand-navy pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #ffa801 0%, transparent 55%), radial-gradient(circle at 80% 70%, #6366f1 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm mb-4">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Contact</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-white mb-3">Contact Us</h1>
          <p className="text-white/60 font-medium text-lg max-w-md mx-auto">We'd love to hear from you. Reach out anytime!</p>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">

          {/* ── Left: Contact Info ── */}
          <div>
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Get In Touch</span>
            <h2 className="font-serif font-black text-3xl text-brand-navy mt-2 mb-8 leading-snug">We're Always Here<br />to Help You</h2>
            <div className="space-y-5 mb-10">
              {CONTACT_INFO.map(({ icon: Icon, label, value, sub, href }) => (
                <a key={label} href={href} className="flex items-start gap-4 p-5 bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 rounded-2xl transition-all group">
                  <div className="w-12 h-12 bg-brand-orange/10 group-hover:bg-brand-orange rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-brand-orange group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                    <p className="font-bold text-brand-navy text-sm">{value}</p>
                    <p className="text-gray-500 text-xs font-medium">{sub}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="relative h-52 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
              <iframe
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.617!2d-73.9968!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjIiTiA3M8KwNTknNDguNiJX!5e0!3m2!1sen!2sus!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="rounded-2xl"
              />
            </div>
          </div>

          {/* ── Right: Form ── */}
          <div>
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
              {submitted ? (
                <div className="flex flex-col items-center text-center py-10">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="font-serif font-black text-2xl text-brand-navy mb-2">Message Sent!</h3>
                  <p className="text-gray-500 font-medium mb-6">Thank you for reaching out, {form.name.split(" ")[0] || "friend"}! We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-6 py-3 rounded-full transition-all shadow-md">
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="font-serif font-black text-2xl text-brand-navy mb-6">Send a Message</h3>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Name</label>
                        <input type="text" required placeholder="John Doe" value={form.name} onChange={(e) => update("name", e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                        <input type="email" required placeholder="john@example.com" value={form.email} onChange={(e) => update("email", e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Subject</label>
                      <input type="text" required placeholder="How can we help?" value={form.subject} onChange={(e) => update("subject", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Message</label>
                      <textarea required rows={5} placeholder="Tell us more about your travel plans or questions…" value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-colors resize-none" />
                    </div>
                    <button type="submit" disabled={loading}
                      className="w-full bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-60 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg">
                      {loading ? (
                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      ) : (
                        <><Send className="w-4 h-4" /> Send Message</>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
