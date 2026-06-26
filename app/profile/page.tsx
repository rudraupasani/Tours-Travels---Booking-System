"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";
import { getTours, Tour } from "@/lib/data";
import { useWishlist } from "@/components/WishlistProvider";
import {
  User, BookOpen, Heart, Settings, LogOut, Edit3,
  MapPin, Clock, Star, DollarSign, CheckCircle,
  ChevronRight, Camera, Phone, Mail, Globe, Calendar,
  Save, X, Eye, EyeOff, AlertCircle, Loader2,
} from "lucide-react";

/* ─── Types ─────────────────────────────────────────────────────────────────── */

interface Booking {
  id: string;
  tour_id: string;
  start_date: string;
  end_date: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  amount: number;
  travellers: number;
  tour?: {
    title: string;
    image: string;
    country: string;
  };
}

interface ProfileForm {
  full_name: string;
  phone: string;
  nationality: string;
  city: string;
}

/* ─── Constants ──────────────────────────────────────────────────────────────── */

const STATUS_STYLES: Record<string, { badge: string; dot: string }> = {
  Confirmed: { badge: "bg-emerald-50 text-emerald-700 border border-emerald-200", dot: "bg-emerald-500" },
  Pending: { badge: "bg-amber-50 text-amber-700 border border-amber-200", dot: "bg-amber-500" },
  Cancelled: { badge: "bg-red-50 text-red-700 border border-red-200", dot: "bg-red-500" },
  Completed: { badge: "bg-blue-50 text-blue-700 border border-blue-200", dot: "bg-blue-500" },
};

const TABS = [
  { id: "overview", label: "Overview", icon: User },
  { id: "bookings", label: "My Bookings", icon: BookOpen },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "settings", label: "Settings", icon: Settings },
];

/* ─── Page ───────────────────────────────────────────────────────────────────── */

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const { wishlist, toggleWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState("overview");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [wishlistTours, setWishlistTours] = useState<Tour[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  /* Settings / edit state */
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileForm>({ full_name: "", phone: "", nationality: "", city: "" });
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* Password change */
  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState({ current: false, next: false, confirm: false });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  /* ── Redirect if not logged in ── */
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  /* ── Jump to tab from hash ── */
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (TABS.find((t) => t.id === hash)) setActiveTab(hash);
  }, []);

  /* ── Populate form from user metadata ── */
  useEffect(() => {
    if (user) {
      const m = user.user_metadata || {};
      setForm({
        full_name: m.full_name || "",
        phone: m.phone || "",
        nationality: m.nationality || "",
        city: m.city || "",
      });
    }
  }, [user]);

  /* ── Fetch bookings for this user ── */
  useEffect(() => {
    if (!user) return;
    async function load() {
      setDataLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select("*, tour:tours(title, image, country)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });

      if (!error && data) setBookings(data as Booking[]);
      setDataLoading(false);
    }
    load();
  }, [user]);

  /* ── Fetch wishlist tours ── */
  useEffect(() => {
    if (wishlist.length === 0) { setWishlistTours([]); return; }
    getTours().then((all) =>
      setWishlistTours(all.filter((t) => wishlist.includes(t.id)))
    );
  }, [wishlist]);

  /* ── Derived stats ── */
  const totalSpent = bookings.reduce((s, b) => s + b.amount, 0);
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;

  /* ── User display data ── */
  const meta = user?.user_metadata || {};
  const fullName = meta.full_name || user?.email?.split("@")[0] || "Traveller";
  const initials = fullName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  /* ── Save profile ── */
  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true); setSaveMsg(null);
    const { error } = await supabase.auth.updateUser({ data: { ...form } });
    setSaving(false);
    if (error) {
      setSaveMsg({ type: "error", text: error.message });
    } else {
      setSaveMsg({ type: "success", text: "Profile updated successfully!" });
      setEditing(false);
      setTimeout(() => setSaveMsg(null), 4000);
    }
  }

  /* ── Change password ── */
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMsg(null);
    if (pwForm.next !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "New passwords do not match." }); return;
    }
    if (pwForm.next.length < 6) {
      setPwMsg({ type: "error", text: "Password must be at least 6 characters." }); return;
    }
    setPwSaving(true);
    const { error } = await supabase.auth.updateUser({ password: pwForm.next });
    setPwSaving(false);
    if (error) {
      setPwMsg({ type: "error", text: error.message });
    } else {
      setPwMsg({ type: "success", text: "Password updated successfully!" });
      setPwForm({ current: "", next: "", confirm: "" });
      setTimeout(() => setPwMsg(null), 4000);
    }
  }

  /* ── Handle sign-out ── */
  async function handleSignOut() {
    await signOut();
    router.push("/login");
  }

  /* ── Loading / auth gate ── */
  if (authLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
        </div>
      </div>
    );
  }
  if (!user) return null;

  /* ═══════════════════════════════════════════════════════════════════════════ */
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Banner */}

      <div className="max-w-6xl mt-10 mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 -mt-16 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left Sidebar ── */}
          <div className="lg:w-72 flex-shrink-0">

            {/* Profile Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-5">
              <div className="flex flex-col items-center pt-8 pb-6 px-6 relative">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand-orange via-amber-400 to-amber-300 flex items-center justify-center text-white font-black text-3xl shadow-lg ring-4 ring-white select-none">
                    {initials}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-brand-orange text-white rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="font-serif font-black text-xl text-brand-navy text-center">{fullName}</h2>
                <p className="text-gray-400 text-sm font-medium mt-0.5 truncate max-w-full">{user.email}</p>

                {bookings.length >= 3 && (
                  <div className="flex items-center gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                    <span className="text-xs text-gray-500 font-semibold ml-1">Top Traveller</span>
                  </div>
                )}

                <button
                  onClick={() => { setActiveTab("settings"); setEditing(true); }}
                  className="mt-4 flex items-center gap-2 text-xs font-bold text-brand-orange border border-orange-200 hover:bg-orange-50 px-4 py-2 rounded-full transition-colors">
                  <Edit3 className="w-3.5 h-3.5" /> Edit Profile
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 border-t border-gray-100 divide-x divide-gray-100">
                {[
                  { label: "Trips", value: dataLoading ? "…" : bookings.length },
                  { label: "Wishlist", value: wishlist.length },
                  { label: "Confirmed", value: dataLoading ? "…" : confirmed },
                ].map(stat => (
                  <div key={stat.label} className="py-4 text-center">
                    <p className="font-black text-brand-navy text-lg">{stat.value}</p>
                    <p className="text-xs text-gray-400 font-semibold">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nav Menu */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-3">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${activeTab === id
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
                <button onClick={handleSignOut}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
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
                    { label: "Total Bookings", value: dataLoading ? "…" : bookings.length, icon: BookOpen, color: "bg-blue-50 text-blue-500" },
                    { label: "Upcoming", value: dataLoading ? "…" : confirmed, icon: Calendar, color: "bg-orange-50 text-brand-orange" },
                    { label: "Total Spent", value: dataLoading ? "…" : `$${totalSpent.toLocaleString()}`, icon: DollarSign, color: "bg-purple-50 text-purple-500" },
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
                    {bookings.length > 0 && (
                      <button onClick={() => setActiveTab("bookings")}
                        className="text-brand-orange text-sm font-bold flex items-center gap-1 hover:underline">
                        View All <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {dataLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="w-8 h-8 text-brand-orange animate-spin" />
                    </div>
                  ) : bookings.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 rounded-2xl">
                      <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-semibold">No bookings yet</p>
                      <Link href="/tours" className="text-brand-orange text-sm font-bold hover:underline mt-1 inline-block">
                        Browse Tours
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 3).map((b) => (
                        <div key={b.id} className="flex items-center gap-4 p-4 bg-gray-50 hover:bg-orange-50 rounded-2xl transition-colors group">
                          {b.tour?.image ? (
                            <div className="relative w-14 h-10 rounded-xl overflow-hidden flex-shrink-0">
                              <Image src={b.tour.image} alt={b.tour.title} fill sizes="56px" className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-14 h-10 rounded-xl bg-gray-200 flex-shrink-0 flex items-center justify-center">
                              <MapPin className="w-4 h-4 text-gray-400" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-brand-navy text-sm truncate">{b.tour?.title || "Tour"}</p>
                            <p className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3" />{b.start_date}
                            </p>
                          </div>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${STATUS_STYLES[b.status]?.badge}`}>
                            {b.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Personal Info */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="font-serif font-black text-xl text-brand-navy">Personal Info</h3>
                    <button
                      onClick={() => { setActiveTab("settings"); setEditing(true); }}
                      className="text-brand-orange text-sm font-bold flex items-center gap-1 hover:underline">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { icon: User, label: "Full Name", value: meta.full_name || fullName },
                      { icon: Mail, label: "Email", value: user.email || "—" },
                      { icon: Phone, label: "Phone", value: meta.phone || "—" },
                      { icon: Globe, label: "Nationality", value: meta.nationality || "—" },
                      { icon: MapPin, label: "City", value: meta.city || "—" },
                      { icon: Calendar, label: "Member Since", value: memberSince },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl">
                        <div className="w-9 h-9 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{label}</p>
                          <p className="text-sm font-semibold text-brand-navy truncate">{value}</p>
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
                {dataLoading ? (
                  <div className="flex justify-center py-16">
                    <Loader2 className="w-10 h-10 text-brand-orange animate-spin" />
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl">
                    <BookOpen className="w-14 h-14 text-gray-200 mx-auto mb-4" />
                    <h4 className="font-serif font-black text-xl text-brand-navy mb-2">No Bookings Yet</h4>
                    <p className="text-gray-400 mb-6">Explore our tours and plan your next adventure!</p>
                    <Link href="/tours" className="bg-brand-orange text-white font-bold px-6 py-3 rounded-full hover:bg-brand-orange-hover transition-all shadow-md">
                      Browse Tours
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((b) => (
                      <div key={b.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-all">
                        <div className="flex flex-col sm:flex-row">
                          {b.tour?.image ? (
                            <div className="relative w-full sm:w-40 h-32 sm:h-auto flex-shrink-0">
                              <Image src={b.tour.image} alt={b.tour?.title || ""} fill sizes="160px" className="object-cover" />
                            </div>
                          ) : (
                            <div className="w-full sm:w-40 h-32 bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-8 h-8 text-gray-300" />
                            </div>
                          )}
                          <div className="p-5 flex flex-1 flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex-1 min-w-0">
                              <span className={`text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-2 ${STATUS_STYLES[b.status]?.badge}`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${STATUS_STYLES[b.status]?.dot}`} />
                                {b.status}
                              </span>
                              <h4 className="font-bold text-brand-navy text-base">{b.tour?.title || "Tour"}</h4>
                              {b.tour?.country && (
                                <p className="text-xs text-brand-orange font-semibold flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3" />{b.tour.country}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 font-semibold mt-2">
                                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{b.start_date} → {b.end_date}</span>
                                <span className="flex items-center gap-1"><User className="w-3 h-3" />{b.travellers} Traveller{b.travellers !== 1 ? "s" : ""}</span>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-2xl font-black text-brand-navy">${b.amount.toLocaleString()}</p>
                              <p className="text-xs text-gray-400 font-medium">Total paid</p>
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
                    <Link href="/tours" className="bg-brand-orange text-white font-bold px-6 py-3 rounded-full hover:bg-brand-orange-hover transition-all shadow-md">
                      Explore Tours
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {wishlistTours.map((tour) => (
                      <Link href={`/tours/${tour.id}`} key={tour.id}
                        className="group border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5">
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

                {/* Profile Settings */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-serif font-black text-2xl text-brand-navy">Account Settings</h3>
                    {!editing && (
                      <button onClick={() => setEditing(true)}
                        className="flex items-center gap-2 text-brand-orange text-sm font-bold border border-orange-200 hover:bg-orange-50 px-4 py-2 rounded-full transition-colors">
                        <Edit3 className="w-3.5 h-3.5" /> Edit
                      </button>
                    )}
                  </div>

                  {saveMsg && (
                    <div className={`flex items-start gap-3 rounded-xl p-4 text-sm font-medium mb-5 ${saveMsg.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                      }`}>
                      {saveMsg.type === "success"
                        ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                      {saveMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile}>
                    <div className="space-y-5">
                      {/* Email (read-only) */}
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</label>
                        <div className="flex items-center gap-3 w-full border border-gray-200 bg-gray-50 rounded-xl px-4 py-3">
                          <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-sm font-semibold text-gray-500">{user.email}</span>
                          <span className="ml-auto text-xs bg-gray-200 text-gray-500 font-bold px-2 py-0.5 rounded-full">Read-only</span>
                        </div>
                      </div>

                      {[
                        { field: "full_name" as keyof ProfileForm, label: "Full Name", type: "text", placeholder: "Your full name", icon: User },
                        { field: "phone" as keyof ProfileForm, label: "Phone Number", type: "tel", placeholder: "+1 (555) 000-0000", icon: Phone },
                        { field: "nationality" as keyof ProfileForm, label: "Nationality", type: "text", placeholder: "e.g. American", icon: Globe },
                        { field: "city" as keyof ProfileForm, label: "City", type: "text", placeholder: "e.g. New York, USA", icon: MapPin },
                      ].map(({ field, label, type, placeholder, icon: Icon }) => (
                        <div key={field}>
                          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</label>
                          {editing ? (
                            <div className="relative">
                              <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                              <input
                                type={type}
                                value={form[field]}
                                placeholder={placeholder}
                                onChange={(e) => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                                className="w-full pl-10 pr-4 border border-gray-200 rounded-xl py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
                              />
                            </div>
                          ) : (
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <Icon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                              <span className="text-sm font-semibold text-brand-navy">
                                {form[field] || <span className="text-gray-400 italic">Not set</span>}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}

                      {editing && (
                        <div className="flex items-center gap-3 pt-2">
                          <button type="submit" disabled={saving}
                            className="flex items-center gap-2 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-8 py-3 rounded-full shadow-md hover:shadow-lg transition-all disabled:opacity-60">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? "Saving…" : "Save Changes"}
                          </button>
                          <button type="button" onClick={() => { setEditing(false); setSaveMsg(null); }}
                            className="flex items-center gap-2 border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-full hover:bg-gray-50 transition-all">
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  </form>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                  <h3 className="font-serif font-black text-xl text-brand-navy mb-5">Change Password</h3>

                  {pwMsg && (
                    <div className={`flex items-start gap-3 rounded-xl p-4 text-sm font-medium mb-5 ${pwMsg.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                      : "bg-red-50 border border-red-200 text-red-700"
                      }`}>
                      {pwMsg.type === "success"
                        ? <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        : <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />}
                      {pwMsg.text}
                    </div>
                  )}

                  <form onSubmit={handleChangePassword}>
                    <div className="space-y-4">
                      {(["current", "next", "confirm"] as const).map((key) => {
                        const labels = { current: "Current Password", next: "New Password", confirm: "Confirm New Password" };
                        return (
                          <div key={key}>
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{labels[key]}</label>
                            <div className="relative">
                              <input
                                type={showPw[key] ? "text" : "password"}
                                placeholder="••••••••"
                                value={pwForm[key]}
                                onChange={(e) => setPwForm(prev => ({ ...prev, [key]: e.target.value }))}
                                className="w-full border border-gray-200 rounded-xl px-4 pr-11 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange transition-all"
                              />
                              <button type="button"
                                onClick={() => setShowPw(prev => ({ ...prev, [key]: !prev[key] }))}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                {showPw[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      <div className="pt-2">
                        <button type="submit" disabled={pwSaving}
                          className="flex items-center gap-2 bg-brand-navy hover:bg-brand-navy/90 text-white font-bold px-8 py-3 rounded-full shadow-md transition-all disabled:opacity-60">
                          {pwSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                          {pwSaving ? "Updating…" : "Update Password"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-50 border border-red-100 rounded-3xl p-6">
                  <h3 className="font-serif font-black text-xl text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-red-400 text-sm font-medium mb-4">
                    Permanently delete your account and all your data. This action cannot be undone.
                  </p>
                  <button className="border border-red-300 text-red-500 hover:bg-red-100 font-bold px-6 py-2.5 rounded-full text-sm transition-all">
                    Delete Account
                  </button>
                </div>

                -10              </div>
            )}

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
