"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, Search } from "lucide-react";

const SLIDER_IMAGES = [
  "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?q=80&w=1600&auto=format&fit=crop", // Kerala
  "https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1600&auto=format&fit=crop", // Taj Mahal
  "https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?q=80&w=1600&auto=format&fit=crop", // Kashmir
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=1600&auto=format&fit=crop", // Goa
];

const DESTINATIONS = ["", "Kerala", "Goa", "Rajasthan", "Kashmir", "Himachal Pradesh", "Andaman"];

export default function Hero() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [destination, setDestination] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prevIdx) => (prevIdx + 1) % SLIDER_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    else if (destination) params.set("destination", destination);
    router.push(`/tours${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="relative min-h-[100vh] flex flex-col justify-between -mt-20">
      {/* Background Image Slider with Crossfade Transition */}
      <div className="absolute inset-0 z-0 overflow-hidden bg-brand-navy">
        {SLIDER_IMAGES.map((src, index) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentIdx ? "opacity-100" : "opacity-0"
              }`}
          >
            <Image
              src={src}
              alt={`Scenic India Destination ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center scale-105 transition-transform duration-[5000ms] ease-out"
              style={{
                transform: index === currentIdx ? "scale(1)" : "scale(1.05)",
              }}
            />
          </div>
        ))}
        {/* Soft dark-blue gradient overlay for high text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/70 via-brand-navy/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/30 via-transparent to-white/10"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 flex flex-col justify-center items-start pt-36 pb-28">
        <div className="max-w-2xl text-left">
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-serif font-black text-white leading-tight tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            Explore India
            <br />
            With{" "}
            <span className="font-script text-brand-orange text-5xl sm:text-6xl md:text-7xl lg:text-8xl inline-block rotate-[-3deg] ml-2 select-none relative animate-pulse">
              Us
              {/* Handwritten style underline */}
              <span className="absolute bottom-1 left-0 w-full h-[6px] bg-brand-orange rounded-full opacity-80"></span>
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/90 font-medium max-w-lg mb-8 leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100">
            Discover breathtaking landscapes, historic heritage, and cultural colors across India with our exclusive local tours.
          </p>

          {/* Search Box */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-3 mb-6 flex flex-col sm:flex-row gap-2 max-w-xl animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search tours, destinations…"
                className="w-full pl-10 pr-3 py-2.5 bg-transparent text-white placeholder-white/50 text-sm font-medium focus:outline-none"
              />
            </div>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-white/10 text-white text-sm font-semibold px-3 py-2.5 rounded-xl border border-white/20 focus:outline-none cursor-pointer"
            >
              {DESTINATIONS.map((d) => (
                <option key={d} value={d} className="text-brand-navy bg-white">
                  {d || "All Destinations"}
                </option>
              ))}
            </select>
            <button
              onClick={handleSearch}
              className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg whitespace-nowrap"
            >
              Search <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
            <button
              onClick={() => router.push("/tours")}
              className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transform hover:-translate-y-0.5 transition-all duration-200"
            >
              Explore All Tours
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-4 text-white/80 text-sm font-medium">
              <span className="flex items-center gap-1.5">✅ Best Price Guarantee</span>
              <span className="flex items-center gap-1.5">🛡️ Free Cancellation</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
