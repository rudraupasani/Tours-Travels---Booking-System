"use client";

import { useState, useMemo, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/components/WishlistProvider";
import { getTours, Tour } from "@/lib/data";
import {
  Search, SlidersHorizontal, Star, Clock, Users,
  MapPin, Heart, ArrowRight, ChevronDown, X, Grid, List,
} from "lucide-react";

const DURATIONS = ["1-3 Days", "4-6 Days", "7-10 Days", "10+ Days"];

// Format price in INR
function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function ToursContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  const initialDestination = searchParams.get("destination") || "";

  const [search, setSearch] = useState(initialSearch || initialDestination);
  const [selectedDuration, setSelectedDuration] = useState("");
  const [priceMax, setPriceMax] = useState(150000);
  const [sortBy, setSortBy] = useState("Popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTours() {
      const data = await getTours();
      setTours(data);
      setLoading(false);
    }
    loadTours();
  }, []);

  // Sync search param changes (when navigating from home page filter)
  useEffect(() => {
    const q = searchParams.get("search") || searchParams.get("destination") || "";
    if (q) setSearch(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    let result = tours.filter((t) => {
      const searchLower = search.toLowerCase();
      if (
        search &&
        !t.title.toLowerCase().includes(searchLower) &&
        !(t.destination || "").toLowerCase().includes(searchLower) &&
        !(t.country || "").toLowerCase().includes(searchLower)
      ) return false;
      if (t.price > priceMax) return false;
      if (selectedDuration) {
        if (selectedDuration === "1-3 Days" && t.days > 3) return false;
        if (selectedDuration === "4-6 Days" && (t.days < 4 || t.days > 6)) return false;
        if (selectedDuration === "7-10 Days" && (t.days < 7 || t.days > 10)) return false;
        if (selectedDuration === "10+ Days" && t.days <= 10) return false;
      }
      return true;
    });
    if (sortBy === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price);
    if (sortBy === "Top Rated") result = [...result].sort((a, b) => b.rating - a.rating);
    return result;
  }, [tours, search, priceMax, selectedDuration, sortBy]);

  const clearFilters = () => {
    setSelectedDuration("");
    setPriceMax(150000);
    setSearch("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Page Hero */}
      <div className="relative bg-brand-navy/100 pt-15 pb-15 overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://plus.unsplash.com/premium_vector-1718387200475-959cd38d9b04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1pbi1zYW1lLXNlcmllc3wyfHx8ZW58MHx8fHx8')]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-white/50 text-sm mb-4">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Tours</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-white mb-3">Explore All Tours</h1>
          <p className="text-white/60 font-medium text-lg">Handpicked journeys to the world's most breathtaking destinations</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full flex-1">
        <div className="flex flex-col gap-6">
          {/* ── Filters panel ── */}
          <div className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-in-out ${sidebarOpen ? 'grid-rows-[1fr] opacity-100 mb-2' : 'grid-rows-[0fr] opacity-0 mb-0'}`}>
            <div className="overflow-hidden">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-serif font-black text-xl text-brand-navy">Filters</h2>
                  <div className="flex items-center gap-3">
                    <button onClick={clearFilters} className="text-sm text-brand-orange font-semibold hover:underline">Clear All</button>
                    <button onClick={() => setSidebarOpen(false)} className="p-1 text-gray-500 hover:text-brand-navy"><X className="w-5 h-5" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {/* Search */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Tour name or place…"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  {/* Price (INR) */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Max Price: <span className="text-brand-orange">{formatINR(priceMax)}</span>
                    </label>
                    <input
                      type="range" min={5000} max={150000} step={5000} value={priceMax}
                      onChange={(e) => setPriceMax(Number(e.target.value))}
                      className="w-full accent-brand-orange cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                      <span>₹5,000</span>
                      <span>₹1,50,000</span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Duration</label>
                    <div className="flex flex-wrap gap-y-2 gap-x-4">
                      {DURATIONS.map((d) => (
                        <label key={d} className="flex items-center gap-2 cursor-pointer group">
                          <input type="radio" name="duration" checked={selectedDuration === d} onChange={() => setSelectedDuration(selectedDuration === d ? "" : d)}
                            className="accent-brand-orange w-4 h-4" />
                          <span className="text-sm font-medium text-gray-600 group-hover:text-brand-orange transition-colors whitespace-nowrap">{d}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Main Content ── */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="flex items-center gap-2 text-sm font-semibold text-brand-navy bg-white border border-gray-200 px-4 py-2.5 rounded-xl shadow-sm hover:border-gray-300 transition-colors">
                  <SlidersHorizontal className="w-4 h-4" /> Filters
                </button>
                <p className="text-sm font-medium text-gray-500">
                  <span className="text-brand-navy font-black text-lg">{filtered.length}</span> tours found
                </p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <div className="relative w-full sm:w-auto">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-auto appearance-none bg-white border border-gray-200 rounded-xl pl-4 pr-10 py-2.5 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange cursor-pointer shadow-sm transition-all">
                    {["Popular", "Top Rated", "Price: Low to High", "Price: High to Low"].map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
                <div className="hidden sm:flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
                  <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-brand-orange text-white shadow-sm" : "text-gray-400 hover:text-brand-navy hover:bg-gray-50"}`}><Grid className="w-5 h-5" /></button>
                  <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-brand-orange text-white shadow-sm" : "text-gray-400 hover:text-brand-navy hover:bg-gray-50"}`}><List className="w-5 h-5" /></button>
                </div>
              </div>
            </div>

            {/* Tour Cards */}
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50 rounded-2xl border border-gray-100">
                <div className="text-6xl mb-4">🗺️</div>
                <h3 className="font-serif font-black text-2xl text-brand-navy mb-2">No tours found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters to discover more adventures.</p>
                <button onClick={clearFilters} className="bg-brand-orange text-white font-bold px-6 py-3 rounded-full hover:bg-brand-orange-hover transition-colors shadow hover:shadow-md">Clear Filters</button>
              </div>
            ) : (
              <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-6"}>
                {filtered.map((tour) => (
                  <Link href={`/tours/${tour.id}`} key={tour.id} className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex ${viewMode === "list" ? "flex-col sm:flex-row" : "flex-col"}`}>
                    <div className={`relative overflow-hidden flex-shrink-0 ${viewMode === "list" ? "w-full sm:w-72 h-60 sm:h-auto min-h-[240px]" : "h-60"}`}>
                      <Image src={tour.image} alt={tour.title} fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      {tour.badge && (
                        <span className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">{tour.badge}</span>
                      )}
                      <button onClick={(e) => { e.preventDefault(); toggleWishlist(tour.id); }} className="absolute top-4 right-4 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10 hover:scale-110">
                        <Heart className={`w-5 h-5 transition-colors ${isInWishlist(tour.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                      </button>
                    </div>
                    <div className={`p-6 flex flex-col flex-1 ${viewMode === "list" ? "justify-center" : ""}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="w-3.5 h-3.5 text-brand-orange flex-shrink-0" />
                        <span className="text-xs font-semibold text-brand-orange">{tour.destination}, {tour.country}</span>
                      </div>
                      <h3 className="font-serif font-black text-brand-navy text-lg leading-snug mb-3 group-hover:text-brand-orange transition-colors">{tour.title}</h3>
                      <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-4">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{tour.duration}</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />Max {tour.groupSize}</span>
                        <span className="flex items-center gap-1 text-amber-500"><Star className="w-3.5 h-3.5 fill-amber-400" />{tour.rating} ({tour.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                        <div>
                          <span className="text-xs text-gray-400 line-through mr-1">{formatINR(tour.originalPrice)}</span>
                          <span className="text-xl font-black text-brand-navy">{formatINR(tour.price)}</span>
                          <span className="text-xs text-gray-400 ml-1">/ person</span>
                        </div>
                        <div className="bg-brand-orange hover:bg-brand-orange-hover text-white text-xs font-bold px-4 py-2 rounded-full flex items-center gap-1.5 transition-all shadow hover:shadow-md">
                          Book Now <ArrowRight className="w-3.5 h-3.5" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default function ToursPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-white"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div></div>}>
      <ToursContent />
    </Suspense>
  );
}
