"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTourById, Tour } from "@/lib/data";
import {
  Star, Clock, Users, MapPin, Heart, ArrowRight,
  ChevronLeft, ChevronRight, Check, ChevronDown,
  Wifi, Car, Utensils, Camera,
} from "lucide-react";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [guests, setGuests] = useState(2);
  const [date, setDate] = useState("");
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getTourById(id);
      setTour(data);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tour) notFound();

  const tabs = ["Overview", "Highlights", "Itinerary", "Reviews"];
  const discount = Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-brand-navy/5 border-b border-gray-100 pt-24 pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tours" className="hover:text-brand-orange transition-colors">Tours</Link>
            <span>/</span>
            <span className="text-brand-navy font-semibold">{tour.title}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Left Column ── */}
          <div className="flex-1 min-w-0">

            {/* Image Gallery */}
            <div className="relative rounded-3xl overflow-hidden mb-3 h-72 sm:h-96 shadow-lg">
              <Image src={tour.images[activeImage]} alt={tour.title} fill sizes="(max-width: 1024px) 100vw, 700px" className="object-cover transition-opacity duration-300" priority />
              {tour.badge && (
                <span className="absolute top-4 left-4 bg-brand-orange text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">{tour.badge}</span>
              )}
              <span className="absolute top-4 right-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{discount}% OFF</span>
              <button onClick={() => setActiveImage((p) => (p - 1 + tour.images.length) % tour.images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                <ChevronLeft className="w-5 h-5 text-brand-navy" />
              </button>
              <button onClick={() => setActiveImage((p) => (p + 1) % tour.images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                <ChevronRight className="w-5 h-5 text-brand-navy" />
              </button>
            </div>

            {/* Thumbnail strip */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
              {tour.images.map((img, i) => (
                <button key={i} onClick={() => setActiveImage(i)} className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? "border-brand-orange scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}>
                  <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>

            {/* Title & Meta */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-brand-orange" />
                  <span className="text-sm font-semibold text-brand-orange">{tour.destination}, {tour.country}</span>
                </div>
                <h1 className="font-serif font-black text-3xl text-brand-navy leading-tight">{tour.title}</h1>
              </div>
              <button onClick={() => setWishlisted(!wishlisted)}
                className={`flex-shrink-0 flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-semibold transition-all ${wishlisted ? "border-red-400 text-red-500 bg-red-50" : "border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500"}`}>
                <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500" : ""}`} /> {wishlisted ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Star, label: "Rating", value: `${tour.rating} (${tour.reviews} reviews)`, color: "text-amber-500" },
                { icon: Clock, label: "Duration", value: tour.duration, color: "text-blue-500" },
                { icon: Users, label: "Group Size", value: `Max ${tour.groupSize} people`, color: "text-purple-500" },
                { icon: MapPin, label: "Destination", value: `${tour.destination}, ${tour.country}`, color: "text-brand-orange" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <Icon className={`w-5 h-5 mb-2 ${color}`} />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-brand-navy leading-snug">{value}</p>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? "border-brand-orange text-brand-orange" : "border-transparent text-gray-500 hover:text-brand-navy"}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "Overview" && (
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed font-medium">
                  Experience the beauty of {tour.destination} with our expertly crafted {tour.duration} tour package.
                  Visit iconic landmarks, immerse yourself in local culture, and create memories that will last a lifetime.
                  With a small group of up to {tour.groupSize} travellers, enjoy a truly personalised experience.
                </p>
                <div>
                  <h3 className="font-serif font-black text-xl text-brand-navy mb-4">What's Included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tour.includes.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[{ icon: Wifi, label: "Free WiFi" }, { icon: Car, label: "Transfers" }, { icon: Utensils, label: "Meals" }, { icon: Camera, label: "Photo Ops" }].map(({ icon: Icon, label }) => (
                    <div key={label} className="flex flex-col items-center gap-2 p-4 bg-orange-50 rounded-2xl text-center">
                      <Icon className="w-6 h-6 text-brand-orange" />
                      <span className="text-xs font-bold text-brand-navy">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Highlights" && (
              <ul className="space-y-4">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-2xl border-l-4 border-brand-orange">
                    <span className="w-7 h-7 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{i + 1}</span>
                    <span className="text-sm font-semibold text-gray-700 leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "Itinerary" && (
              <div className="space-y-3">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">D{day.day}</span>
                        <span className="font-bold text-brand-navy">{day.title}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openDay === day.day ? "rotate-180" : ""}`} />
                    </button>
                    {openDay === day.day && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed font-medium pt-4">{day.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Reviews" && (
              <div className="space-y-5">
                <div className="flex items-center gap-6 p-6 bg-brand-navy rounded-2xl text-white">
                  <div className="text-center">
                    <p className="text-6xl font-black font-serif">{tour.rating}</p>
                    <div className="flex items-center justify-center gap-0.5 my-1">
                      {[1,2,3,4,5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= Math.round(tour.rating) ? "fill-amber-400 text-amber-400" : "text-white/30"}`} />)}
                    </div>
                    <p className="text-white/60 text-xs font-semibold">{tour.reviews} Reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {[["Excellent", 78], ["Good", 14], ["Average", 5], ["Poor", 3]].map(([label, pct]) => (
                      <div key={label as string} className="flex items-center gap-3 text-sm">
                        <span className="w-16 text-white/60 font-medium text-xs">{label}</span>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-white/60 text-xs w-8">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                {[{ name: "Sarah M.", rating: 5, date: "June 2026", text: "Absolutely magical! Every detail was perfect, from the accommodation to the guided tours. Highly recommend!" },
                  { name: "James T.", rating: 5, date: "May 2026", text: "Best trip of our lives! The guides were knowledgeable and friendly. Will definitely book again." },
                  { name: "Priya K.", rating: 4, date: "April 2026", text: "Great experience overall. The itinerary was well-planned and the group size was perfect." }
                ].map((r) => (
                  <div key={r.name} className="p-5 border border-gray-100 rounded-2xl">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-amber-300 rounded-full flex items-center justify-center text-white font-black text-sm">{r.name[0]}</div>
                      <div>
                        <p className="font-bold text-brand-navy text-sm">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.date}</p>
                      </div>
                      <div className="ml-auto flex gap-0.5">{[1,2,3,4,5].map((s) => <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />)}</div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Sticky Booking Sidebar ── */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-brand-navy p-6 text-white">
                <p className="text-white/60 text-sm font-medium mb-1">Starting from</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black font-serif">{formatINR(tour.price)}</span>
                  <span className="text-white/50 line-through text-lg mb-1">{formatINR(tour.originalPrice)}</span>
                </div>
                <p className="text-white/60 text-xs mt-1">per person · all inclusive</p>
                <span className="inline-block mt-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Save {formatINR(tour.originalPrice - tour.price)}</span>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Select Date</label>
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange cursor-pointer" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Guests</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-colors font-bold text-lg">−</button>
                    <span className="font-black text-brand-navy text-lg w-8 text-center">{guests}</span>
                    <button onClick={() => setGuests(Math.min(tour.groupSize, guests + 1))} className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-colors font-bold text-lg">+</button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 font-medium"><span>{formatINR(tour.price)} × {guests} guests</span><span>{formatINR(tour.price * guests)}</span></div>
                  <div className="flex justify-between text-gray-600 font-medium"><span>Taxes & fees</span><span>{formatINR(Math.round(tour.price * guests * 0.1))}</span></div>
                  <div className="flex justify-between font-black text-brand-navy border-t border-gray-200 pt-2 mt-2">
                    <span>Total</span><span>{formatINR(tour.price * guests + Math.round(tour.price * guests * 0.1))}</span>
                  </div>
                </div>
                <Link href="/booking" className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg">
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-gray-400 font-medium">Free cancellation up to 7 days before departure</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
