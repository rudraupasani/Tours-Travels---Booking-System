"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTours, Tour, createBooking } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { Check, ChevronRight, User, CreditCard, Shield, CheckCircle, MapPin, Clock, Users, Lock, LogIn } from "lucide-react";
import { Suspense } from "react";

const STEPS = [
  { id: 1, label: "Tour Details", icon: MapPin },
  { id: 2, label: "Traveller Info", icon: User },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Confirmation", icon: CheckCircle },
];

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    nationality: "", gender: "",
    cardNumber: "", cardExpiry: "", cardCVV: "", cardName: "",
    guests: 2,
  });

  // ── Auth check ──────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setAuthChecked(true);
    });
  }, []);

  // ── Load tours ──────────────────────────────────────────────────────────────
  useEffect(() => {
    async function load() {
      const tourIdParam = searchParams.get("tourId");
      const data = await getTours();
      if (data.length > 0) {
        const found = tourIdParam ? data.find(t => t.id === tourIdParam) : null;
        setSelectedTour(found ?? data[0]);
      }
      setLoading(false);
    }
    load();
  }, [searchParams]);

  const update = (field: string, value: string | number) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const subtotal = selectedTour ? selectedTour.price * form.guests : 0;
  const taxes = Math.round(subtotal * 0.1);
  const discount = selectedTour ? (selectedTour.originalPrice - selectedTour.price) : 0;
  const total = subtotal + taxes;




  // ── Loading spinner ──────────────────────────────────────────────────────────
  if (!authChecked || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange" />
        </div>
        <Footer />
      </div>
    );
  }

  // ── Not logged in → show gated screen ───────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-20 px-4">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-10 text-center">
            <div className="w-20 h-20 bg-brand-orange/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-10 h-10 text-brand-orange" />
            </div>
            <h2 className="font-serif font-black text-2xl text-brand-navy mb-3">Login Required</h2>
            <p className="text-gray-500 font-medium mb-8">
              You need to be signed in to book a tour. Create a free account or log in to continue.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/login?redirect=/booking"
                className="flex items-center justify-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-7 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
              <Link
                href="/register"
                className="flex items-center justify-center gap-2 border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white font-bold px-7 py-3.5 rounded-xl transition-all"
              >
                Create Account
              </Link>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Link href="/tours" className="text-sm text-brand-orange hover:underline font-semibold">
                ← Back to Tours
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ── No tours available ───────────────────────────────────────────────────────
  if (!selectedTour) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
          <div className="text-5xl mb-4">🗺️</div>
          <h2 className="font-serif font-black text-2xl text-brand-navy mb-2">No Tours Available</h2>
          <p className="text-gray-500 mb-6">Please add tours in the database first.</p>
          <Link href="/tours" className="bg-brand-orange text-white font-bold px-6 py-3 rounded-full">Browse Tours</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Header */}
      <div className="bg-brand-navy pt-28 pb-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tours" className="hover:text-brand-orange transition-colors">Tours</Link>
            <span>/</span>
            <span className="text-white">Booking</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-white mb-6">Complete Your Booking</h1>

          {/* Stepper */}
          <div className="flex items-center gap-0">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all font-bold text-sm ${step > s.id ? "bg-green-500 border-green-500 text-white" :
                    step === s.id ? "bg-brand-orange border-brand-orange text-white" :
                      "bg-white/10 border-white/30 text-white/40"
                    }`}>
                    {step > s.id ? <Check className="w-5 h-5" /> : <s.icon className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block ${step >= s.id ? "text-white" : "text-white/40"}`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 rounded transition-all ${step > s.id ? "bg-green-500" : "bg-white/20"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Form Area ── */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

              {step === 1 && (
                <div>
                  <h2 className="font-serif font-black text-2xl text-brand-navy mb-6">Tour Details</h2>
                  <div className="flex items-center gap-4 p-5 bg-orange-50 rounded-2xl border border-orange-100 mb-8">
                    <div className="relative w-24 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <Image src={selectedTour.image} alt={selectedTour.title} fill sizes="96px" className="object-cover" />
                    </div>
                    <div>
                      <p className="font-black text-brand-navy text-base">{selectedTour.title}</p>
                      <div className="flex items-center gap-3 text-sm text-gray-500 font-medium mt-1">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-orange" />{selectedTour.destination}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{selectedTour.duration}</span>
                      </div>
                      {/* Show tour date range if admin set it */}
                      {(selectedTour.tourStartDate || selectedTour.tourEndDate) && (
                        <p className="text-xs text-brand-orange font-semibold mt-1.5">
                          📅 Available:{" "}
                          {selectedTour.tourStartDate ? new Date(selectedTour.tourStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Now"}
                          {" → "}
                          {selectedTour.tourEndDate ? new Date(selectedTour.tourEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Open"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Number of Guests</label>
                      <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-2.5">
                        <Users className="w-4 h-4 text-gray-400" />
                        <button onClick={() => update("guests", Math.max(1, form.guests - 1))} className="w-7 h-7 bg-gray-100 rounded-full font-bold hover:bg-brand-orange hover:text-white transition-colors">−</button>
                        <span className="font-black text-brand-navy w-6 text-center">{form.guests}</span>
                        <button onClick={() => update("guests", Math.min(selectedTour.groupSize, form.guests + 1))} className="w-7 h-7 bg-gray-100 rounded-full font-bold hover:bg-brand-orange hover:text-white transition-colors">+</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="font-serif font-black text-2xl text-brand-navy mb-6">Primary Traveller</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { label: "First Name", field: "firstName", placeholder: "John" },
                      { label: "Last Name", field: "lastName", placeholder: "Doe" },
                      { label: "Email Address", field: "email", placeholder: "john@example.com" },
                      { label: "Phone Number", field: "phone", placeholder: "+1 234 567 8900" },
                      { label: "Nationality", field: "nationality", placeholder: "American" },
                    ].map(({ label, field, placeholder }) => (
                      <div key={field} className={field === "email" || field === "phone" ? "sm:col-span-1" : ""}>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
                        <input type="text" placeholder={placeholder} value={form[field as keyof typeof form] as string}
                          onChange={(e) => update(field, e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Gender</label>
                      <select value={form.gender} onChange={(e) => update("gender", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange">
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="font-serif font-black text-2xl text-brand-navy mb-2">Secure Payment</h2>
                  <p className="text-gray-500 text-sm font-medium mb-6 flex items-center gap-2"><Shield className="w-4 h-4 text-green-500" /> 256-bit SSL encrypted and secure</p>
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Cardholder Name</label>
                      <input type="text" placeholder="John Doe" value={form.cardName} onChange={(e) => update("cardName", e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Card Number</label>
                      <input type="text" placeholder="4242 4242 4242 4242" maxLength={19} value={form.cardNumber}
                        onChange={(e) => update("cardNumber", e.target.value.replace(/\D/g, "").replace(/(\d{4})/g, "$1 ").trim())}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Expiry Date</label>
                        <input type="text" placeholder="MM / YY" maxLength={7} value={form.cardExpiry}
                          onChange={(e) => update("cardExpiry", e.target.value)}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">CVV</label>
                        <input type="text" placeholder="•••" maxLength={4} value={form.cardCVV}
                          onChange={(e) => update("cardCVV", e.target.value.replace(/\D/g, ""))}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col items-center text-center py-8">
                  <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </div>
                  <h2 className="font-serif font-black text-3xl text-brand-navy mb-3">Booking Confirmed!</h2>
                  <p className="text-gray-500 font-medium mb-2">Your booking ID is <span className="text-brand-orange font-black">#TRV-{bookingId || "00000"}</span></p>
                  <p className="text-gray-400 text-sm mb-8">A confirmation email has been sent to {form.email || "your email address"}.</p>
                  <div className="flex gap-4">
                    <Link href="/profile" className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-6 py-3 rounded-full transition-all shadow-md">
                      View Profile
                    </Link>
                    <Link href="/tours" className="border border-gray-200 text-brand-navy font-bold px-6 py-3 rounded-full hover:bg-gray-50 transition-all">
                      Browse More Tours
                    </Link>
                  </div>
                </div>
              )}

              {step < 4 && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                  {step > 1 && (
                    <button onClick={() => setStep(step - 1)} className="border border-gray-200 text-brand-navy font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                      Back
                    </button>
                  )}
                  <button
                    disabled={submitting}
                    onClick={async () => {
                      if (step === 1) {
                        setStep(2);
                      } else if (step === 2) {
                        if (!form.firstName || !form.lastName || !form.email || !form.phone) {
                          alert("Please fill in all personal details to continue.");
                          return;
                        }
                        setStep(3);
                      } else if (step === 3 && selectedTour) {
                        if (!form.cardName || !form.cardNumber || !form.cardExpiry || !form.cardCVV) {
                          alert("Please fill in your payment details to confirm booking.");
                          return;
                        }
                        setSubmitting(true);
                        const startDate = selectedTour.tourStartDate || new Date().toISOString().split("T")[0];
                        const endDate = selectedTour.tourEndDate
                          || new Date(new Date(startDate).getTime() + selectedTour.days * 86400000).toISOString().split("T")[0];
                        const result = await createBooking({
                          tour_id: selectedTour.id,
                          start_date: startDate,
                          end_date: endDate,
                          amount: total,
                          travellers: form.guests,
                          customer_name: `${form.firstName} ${form.lastName}`,
                          customer_email: form.email,
                          customer_phone: form.phone,
                        });
                        setSubmitting(false);
                        if (result) {
                          setBookingId(result.id.slice(0, 8).toUpperCase());
                          setStep(4);
                        } else {
                          alert("Booking failed. Please try again.");
                        }
                      } else {
                        setStep(step + 1);
                      }
                    }}
                    className="ml-auto bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-60 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg"
                  >
                    {submitting ? (
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                    ) : (
                      <>{step === 3 ? "Pay & Confirm" : "Continue"} <ChevronRight className="w-4 h-4" /></>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Order Summary ── */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-36">
                <Image src={selectedTour.image} alt={selectedTour.title} fill sizes="320px" className="object-cover" />
                <div className="absolute inset-0 bg-brand-navy/50" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white font-black text-base leading-tight">{selectedTour.title}</p>
                  <p className="text-white/70 text-xs font-medium mt-1">{selectedTour.destination} · {selectedTour.duration}</p>
                </div>
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-serif font-black text-brand-navy text-lg mb-4">Order Summary</h3>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>₹{selectedTour.price.toLocaleString("en-IN")} × {form.guests} guests</span>
                  <span>₹{subtotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-green-600">
                  <span>Savings</span>
                  <span>-₹{(discount * form.guests).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-gray-600">
                  <span>Taxes & fees (10%)</span>
                  <span>₹{taxes.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-black text-brand-navy border-t border-gray-100 pt-3 text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-xl p-3 mt-2">
                  <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-semibold">Secure booking. Free cancellation up to 7 days before departure.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange" />
        </div>
        <Footer />
      </div>
    }>
      <BookingContent />
    </Suspense>
  );
}
