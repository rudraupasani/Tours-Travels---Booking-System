"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getBookings, Booking, getTours, Tour } from "@/lib/data";
import { useWishlist } from "@/components/WishlistProvider";
import {
  User, BookOpen, Heart, Bell, Settings, LogOut, Edit3,
  MapPin, Clock, Star, TrendingUp, DollarSign, CheckCircle,
  ChevronRight, Camera, Phone, Mail, Globe, Calendar,
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
  Completed: "bg-blue-100 text-blue-700",
};

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "bookings", label: "My Bookings", icon: BookOpen },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlistTours, setWishlistTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const { wishlist, toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    // Check for hash to jump to tab
    const hash = window.location.hash.replace("#", "");
    if (hash === "bookings") setActiveTab("bookings");
  }, []);

  useEffect(() => {
    async function load() {
      const [b, t] = await Promise.all([getBookings(), getTours()]);
      setBookings(b);
      setWishlistTours(t.filter((tour) => wishlist.includes(tour.id)));
      setLoading(false);
    }
    load();
  }, [wishlist]);

  const totalSpent = bookings.reduce((s, b) => s + b.amount, 0);
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative bg-brand-navy h-52 overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 60%, #ffa801 0%, transparent 55%), radial-gradient(circle at 80% 30%, #3b82f6 0%, transparent 50%)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 -mt-16 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left Sidebar ── */}
          <div className="lg:w-72 flex-shrink-0">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-5">
              {/* Avatar */}
              <div className="flex flex-col items-center pt-8 pb-6 px-6 relative">
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-orange via-amber-400 to-amber-300 flex items-center justify-center text-white font-black text-4xl shadow-lg ring-4 ring-white">
                    J
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
                <h2 className="font-serif font-black text-xl text-brand-navy">John Doe</h2>
                <p className="text-gray-400 text-sm font-medium">Gold Member ⭐</p>
                <div className="flex items-center gap-1 mt-2">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                  <span className="text-xs text-gray-500 font-semibold ml-1">Top Traveller</span>
                </div>
                <button className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-orange border border-orange-200 hover:bg-orange-50 px-4 py-2 rounded-full transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 border-t border-gray-100 divide-x divide-gray-100">
                {[
                  { label: "Trips", value: bookings.length || "0" },
                  { label: "Countries", value: "5" },
                  { label: "Reviews", value: "12" },
                ].map(stat => (
                  <div key={stat.label} className="py-4 text-center">
                    <p className="font-black text-brand-navy text-lg">{loading ? "…" : stat.value}</p>
                    <p className="text-xs text-gray-400 font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav Menu */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-3">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                    activeTab === id
                      ? "bg-brand-orange text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 hover:text-brand-navy"
                  }`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                  {id === "wishlist" && wishlist.length > 0 && (
                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === id ? "bg-white/20 text-white" : "bg-red-100 text-red-600"}`}>
                      {wishlist.length}
                    </span>
                  )}
                  {id === "bookings" && bookings.length > 0 && (
                    <span className={`ml-auto text-xs font-bold px-2 py-0.5 rounded-full ${activeTab === id ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600"}`}>
                      {bookings.length}
                    </span>
                  )}
                </button>
              ))}
              <div className="border-t border-gray-100 mt-2 pt-2">
                <Link href="/login" className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
                  <LogOut className="w-4 h-4" /> Sign Out
                </Link>
              </div>
            </div>
          </div>

          {/* ── Right Content ── */}
          <div className="flex-1 min-w-0 mt-4 lg:mt-20">

            {/* ── OVERVIEW TAB ── */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Stats Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Total Bookings", value: loading ? "…" : bookings.length, icon: BookOpen, color: "bg-blue-50 text-blue-500" },
                    { label: "Upcoming", value: loading ? "…" : confirmed, icon: Calendar, color: "bg-orange-50 text-brand-orange" },
                    { label: "Total Spent", value: loading ? "…" : `$${totalSpent.toLocaleString()}`, icon: DollarSign, color: "bg-purple-50 text-purple-500" },
                    { label: "Wishlisted", value: wishlist.length, icon: Heart, color: "bg-red-50 text-red-500" },
                  ].map(({ label, value, icon: Icon, color }) => (
                    <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xl font-black text-brand-navy">{value}</p>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-serif font-black text-xl text-brand-navy">Recent Bookings</h3>
                    <button onClick={() => setActiveTab("bookings")} className="text-brand-orange text-sm font-bold flex items-center gap-1 hover:underline">
                      View All <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  {loading ? (
                    <div className="flex justify-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange" /></div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl">
                      <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-semibold">No bookings yet</p>
                      <Link href="/tours" className="text-brand-orange text-sm font-bold hover:underline mt-1 inline-block">Browse Tours</Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 3).map((b) => (
                        <div key={b.id} className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-orange-50 rounded-2xl transition-colors">
                          {b.tour?.image && (
                            <div className="relative w-14 h-10 rounded-xl overflow-hidden flex-shrink-0">
                              <Image src={b.tour.image} alt={b.tour.title} fill sizes="56px" className="object-cover" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-brand-navy text-sm truncate">{b.tour?.title || "Tour"}</p>
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5"><Clock className="w-3 h-3" />{b.start_date}</p>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-serif font-black text-xl text-brand-navy">Personal Info</h3>
                    <button className="text-brand-orange text-sm font-bold flex items-center gap-1 hover:underline"><Edit3 className="w-3.5 h-3.5" /> Edit</button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: User, label: "Full Name", value: "John Doe" },
                      { icon: Mail, label: "Email", value: "john.doe@email.com" },
                      { icon: Phone, label: "Phone", value: "+1 (555) 000-0000" },
                      { icon: Globe, label: "Nationality", value: "American" },
                      { icon: MapPin, label: "City", value: "New York, USA" },
                      { icon: Calendar, label: "Member Since", value: "January 2025" },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                        <div className="w-9 h-9 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                          <p className="text-sm font-semibold text-brand-navy">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── BOOKINGS TAB ── */}
            {activeTab === "bookings" && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-serif font-black text-2xl text-brand-navy mb-6">My Bookings</h3>
                {loading ? (
                  <div className="flex justify-center py-16"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange" /></div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                    <h4 className="font-serif font-black text-xl text-brand-navy mb-2">No Bookings Yet</h4>
                    <p className="text-gray-400 mb-6">Explore our tours and plan your next adventure!</p>
                    <Link href="/tours" className="bg-brand-orange text-white font-bold px-6 py-3 rounded-full hover:bg-brand-orange-hover transition-all shadow-md">Browse Tours</Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div key={b.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row">
                          {b.tour?.image && (
                            <div className="relative w-full sm:w-40 h-32 sm:h-auto flex-shrink-0">
                              <Image src={b.tour.image} alt={b.tour?.title || ""} fill sizes="160px" className="object-cover" />
                            </div>
                          )}
                          <div className="p-5 flex flex-1 flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status]} inline-block mb-2`}>{b.status}</span>
                              <h4 className="font-bold text-brand-navy text-base">{b.tour?.title || "Tour"}</h4>
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-semibold mt-2">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.start_date} → {b.end_date}</span>
                                <span className="flex items-center gap-1"><User className="w-3 h-3" />{b.travellers} Travellers</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-2xl font-black text-brand-navy">${b.amount}</p>
                              <p className="text-xs text-gray-400 font-medium">Total paid</p>
                              <button className="mt-2 text-brand-orange border border-orange-200 hover:bg-orange-50 text-xs font-bold px-4 py-1.5 rounded-full transition-colors">
                                View Details
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── WISHLIST TAB ── */}
            {activeTab === "wishlist" && (
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-serif font-black text-2xl text-brand-navy mb-6">My Wishlist</h3>
                {wishlistTours.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <Heart className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                    <h4 className="font-serif font-black text-xl text-brand-navy mb-2">Nothing Wishlisted Yet</h4>
                    <p className="text-gray-400 mb-6">Save your favourite tours to your wishlist.</p>
                    <Link href="/tours" className="bg-brand-orange text-white font-bold px-6 py-3 rounded-full hover:bg-brand-orange-hover transition-all shadow-md">Explore Tours</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {wishlistTours.map((tour) => (
                      <Link href={`/tours/${tour.id}`} key={tour.id} className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5">
                        <div className="relative h-44">
                          <Image src={tour.image} alt={tour.title} fill sizes="400px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                          <button
                            onClick={(e) => { e.preventDefault(); toggleWishlist(tour.id); }}
                            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-all">
                            <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                          </button>
                          {tour.badge && <span className="absolute top-3 left-3 bg-brand-orange text-white text-xs font-bold px-2.5 py-1 rounded-full">{tour.badge}</span>}
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-1 mb-1">
                            <MapPin className="w-3 h-3 text-brand-orange flex-shrink-0" />
                            <span className="text-xs font-semibold text-brand-orange">{tour.country}</span>
                          </div>
                          <h4 className="font-bold text-brand-navy text-sm leading-snug group-hover:text-brand-orange transition-colors">{tour.title}</h4>
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
                              <Clock className="w-3 h-3" />{tour.duration}
                            </div>
                            <span className="font-black text-brand-navy">${tour.price} <span className="text-xs font-medium text-gray-400">/ person</span></span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── SETTINGS TAB ── */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-serif font-black text-2xl text-brand-navy mb-6">Account Settings</h3>
                  <div className="space-y-5">
                    {[
                      { label: "Full Name", value: "John Doe", type: "text" },
                      { label: "Email Address", value: "john.doe@email.com", type: "email" },
                      { label: "Phone Number", value: "+1 (555) 000-0000", type: "tel" },
                      { label: "Nationality", value: "American", type: "text" },
                    ].map(({ label, value, type }) => (
                      <div key={label}>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
                        <input type={type} defaultValue={value}
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all" />
                      </div>
                    ))}
                    <div className="pt-2">
                      <button className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all">Save Changes</button>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-serif font-black text-xl text-brand-navy mb-5">Change Password</h3>
                  <div className="space-y-4">
                    {["Current Password", "New Password", "Confirm New Password"].map(label => (
                      <div key={label}>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
                        <input type="password" placeholder="••••••••"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all" />
                      </div>
                    ))}
                    <div className="pt-2">
                      <button className="bg-brand-navy hover:bg-brand-navy/90 text-white font-bold px-8 py-3 rounded-full shadow-md transition-all">Update Password</button>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
                  <h3 className="font-serif font-black text-xl text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-red-400 text-sm font-medium mb-4">Permanently delete your account and all your data. This action cannot be undone.</p>
                  <button className="border border-red-300 text-red-500 hover:bg-red-100 font-bold px-6 py-2.5 rounded-full text-sm transition-all">Delete Account</button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
