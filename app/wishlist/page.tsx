"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useWishlist } from "@/components/WishlistProvider";
import { getTours, Tour } from "@/lib/data";
import { MapPin, Clock, Users, Star, ArrowRight, Heart, HeartOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getTours();
      setTours(data);
      setLoading(false);
    }
    load();
  }, []);

  const savedTours = tours.filter((t) => wishlist.includes(t.id));

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      <div className="relative bg-brand-navy pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #ffa801 0%, transparent 60%), radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-white mb-3">Your Wishlist</h1>
          <p className="text-white/60 font-medium text-lg">Keep track of your favorite adventures and planned journeys.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full flex-1">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
          </div>
        ) : savedTours.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border border-gray-100 max-w-3xl mx-auto">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <HeartOff className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="font-serif font-black text-3xl text-brand-navy mb-4">Your wishlist is empty</h3>
            <p className="text-gray-500 mb-8 max-w-md mx-auto text-lg">Looks like you haven't added any tours to your wishlist yet. Discover our amazing tours and save your favorites!</p>
            <Link href="/tours" className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 text-lg flex items-center gap-2">
              Explore Tours <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedTours.map((tour) => (
              <Link href={`/tours/${tour.id}`} key={tour.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className="relative overflow-hidden flex-shrink-0 h-64">
                  <Image src={tour.image} alt={tour.title} fill sizes="(max-width: 640px) 100vw, 320px" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {tour.badge && (
                    <span className="absolute top-4 left-4 bg-brand-orange text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">{tour.badge}</span>
                  )}
                  <button onClick={(e) => { e.preventDefault(); toggleWishlist(tour.id); }} className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-all z-10 hover:scale-110">
                    <Heart className={`w-5 h-5 transition-colors ${isInWishlist(tour.id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                  </button>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-brand-orange flex-shrink-0" />
                    <span className="text-sm font-semibold text-brand-orange">{tour.destination}, {tour.country}</span>
                  </div>
                  <h3 className="font-serif font-black text-brand-navy text-xl leading-snug mb-4 group-hover:text-brand-orange transition-colors">{tour.title}</h3>
                  <div className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-6">
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{tour.duration}</span>
                    <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />Max {tour.groupSize}</span>
                    <span className="flex items-center gap-1.5 text-amber-500"><Star className="w-4 h-4 fill-amber-400" />{tour.rating}</span>
                  </div>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                    <div>
                      <span className="text-sm text-gray-400 line-through mr-1.5">${tour.originalPrice}</span>
                      <span className="text-2xl font-black text-brand-navy">${tour.price}</span>
                    </div>
                    <div className="bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold px-5 py-2.5 rounded-full flex items-center gap-1.5 transition-all shadow hover:shadow-md">
                      View Tour
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
