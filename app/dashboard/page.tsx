"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBookings, Booking } from "@/lib/data";
import {
  LayoutDashboard, BookOpen, CalendarDays, Heart, Users,
  Bell, Settings, LogOut, ChevronRight, TrendingUp,
  Star, DollarSign, Map, Clock, Menu, X,
} from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BookOpen, label: "My Bookings" },
  { icon: CalendarDays, label: "Upcoming Trips" },
  { icon: Heart, label: "Wishlist", href: "/wishlist" },
  { icon: Users, label: "Travellers" },
  { icon: Bell, label: "Notifications", badge: 3 },
  { icon: Settings, label: "Profile Settings" },
];

const STATUS_STYLES: Record<string, string> = {
  Confirmed: "bg-green-100 text-green-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-red-100 text-red-700",
  Completed: "bg-blue-100 text-blue-700",
};

export default function DashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getBookings();
      setBookings(data);
      setLoading(false);
    }
    load();
  }, []);

  const totalSpent = bookings.reduce((s, b) => s + b.amount, 0);
  const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
  const upcoming = bookings.filter((b) => b.status === "Confirmed" || b.status === "Pending");

  const stats = [
    { label: "Total Bookings", value: loading ? "…" : bookings.length, icon: BookOpen, color: "bg-blue-500", change: "All time" },
    { label: "Upcoming Trips", value: loading ? "…" : confirmed, icon: CalendarDays, color: "bg-brand-orange", change: "Confirmed" },
    { label: "Total Spent", value: loading ? "…" : `$${totalSpent.toLocaleString()}`, icon: DollarSign, color: "bg-purple-500", change: "All time" },
    { label: "Loyalty Points", value: "1,240", icon: Star, color: "bg-amber-500", change: "Gold Member" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-brand-navy flex flex-col transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-brand-orange p-2 rounded-lg">
              <Map className="w-5 h-5 text-white" />
            </div>
            <span className="font-serif text-xl font-black text-white">Travelora</span>
          </Link>
        </div>

        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-orange to-amber-300 flex items-center justify-center text-white font-black text-lg">J</div>
            <div>
              <p className="text-white font-bold text-sm">John Doe</p>
              <p className="text-white/50 text-xs">john.doe@email.com</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, active, badge, href }) => (
            href ? (
              <Link key={label} href={href} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all">
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
              </Link>
            ) : (
              <button key={label} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${active ? "bg-brand-orange text-white shadow-md" : "text-white/60 hover:bg-white/10 hover:text-white"}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{label}</span>
                {badge && <span className="bg-red-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center">{badge}</span>}
              </button>
            )
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link href="/" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-white/60 hover:bg-white/10 hover:text-white transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </Link>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── Main ── */}
      <main className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-gray-500 hover:text-brand-navy rounded-lg hover:bg-gray-100 transition-colors">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div>
              <h1 className="font-serif font-black text-xl text-brand-navy">Dashboard</h1>
              <p className="text-gray-400 text-xs font-medium">Welcome back, John! 👋</p>
            </div>
          </div>
          <Link href="/tours" className="bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-sm">
            + New Booking
          </Link>
        </header>

        <div className="p-6 space-y-8 overflow-y-auto flex-1">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map(({ label, value, icon: Icon, color, change }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-start gap-4">
                <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-black text-brand-navy">{value}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5">{label}</p>
                  <p className="text-xs text-green-600 font-semibold mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />{change}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Trips */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-serif font-black text-xl text-brand-navy">Upcoming Trips</h2>
                <button className="text-brand-orange text-sm font-bold hover:underline flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></button>
              </div>
              {loading ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange" /></div>
              ) : upcoming.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl text-gray-400 text-sm font-semibold">No upcoming trips. <Link href="/tours" className="text-brand-orange hover:underline">Browse tours</Link> to get started!</div>
              ) : (
                <div className="space-y-4">
                  {upcoming.map((b) => (
                    <div key={b.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-orange-50 transition-colors group">
                      {b.tour?.image && (
                        <div className="relative w-16 h-12 rounded-xl overflow-hidden flex-shrink-0">
                          <Image src={b.tour.image} alt={b.tour.title} fill sizes="64px" className="object-cover" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-brand-navy text-sm truncate">{b.tour?.title || "Tour"}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{b.start_date} → {b.end_date}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                        <p className="text-xs text-gray-400 font-medium mt-1">{b.travellers} travellers</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Refer & Earn */}
            <div className="bg-gradient-to-br from-brand-navy to-brand-navy-light rounded-2xl p-6 flex flex-col justify-between text-white overflow-hidden relative">
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-brand-orange/20 rounded-full" />
              <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-white/5 rounded-full" />
              <div className="relative">
                <Star className="w-8 h-8 text-brand-orange mb-3" />
                <h3 className="font-serif font-black text-xl mb-2">Refer & Earn</h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed">Refer your friends and earn up to <span className="text-brand-orange font-black">$50</span> in travel credits.</p>
              </div>
              <button className="relative mt-4 bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-3 rounded-xl transition-all text-sm shadow-md">Refer Now</button>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="font-serif font-black text-xl text-brand-navy">Recent Bookings</h2>
              <button className="text-brand-orange text-sm font-bold hover:underline flex items-center gap-1">View All <ChevronRight className="w-4 h-4" /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {["Booking ID", "Tour", "Date", "Travellers", "Amount", "Status"].map((h) => (
                      <th key={h} className="text-left px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan={6} className="text-center py-10 text-gray-400"><div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-brand-orange" /></td></tr>
                  ) : bookings.length === 0 ? (
                    <tr><td colSpan={6} className="text-center py-10 text-gray-400 text-sm font-semibold">No bookings found in the database.</td></tr>
                  ) : (
                    bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-brand-navy text-xs">{b.id.slice(0, 8)}…</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {b.tour?.image && (
                              <div className="relative w-10 h-7 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={b.tour.image} alt={b.tour.title} fill sizes="40px" className="object-cover" />
                              </div>
                            )}
                            <span className="font-semibold text-gray-700 text-xs">{b.tour?.title || "N/A"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-medium">{b.start_date}</td>
                        <td className="px-6 py-4 text-gray-500 font-medium">{b.travellers}</td>
                        <td className="px-6 py-4 font-bold text-brand-navy">${b.amount}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[b.status]}`}>{b.status}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
