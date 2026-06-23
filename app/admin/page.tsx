"use client";

import { useEffect, useState } from "react";
import { getAdminStats, getRevenueByMonth, getTopBookedDestinations, getUnreadMessageCount } from "@/lib/data";
import { CreditCard, Compass, Star, BarChart3, BookOpen, MessageSquare, Map, CalendarDays, ImageIcon } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, totalTours: 0, totalBookings: 0, avgRating: "0.0", unreadMessages: 0 });
  const [revenueData, setRevenueData] = useState<{ month: string; value: number }[]>([]);
  const [topDests, setTopDests] = useState<{ name: string; bookings: number; percentage: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [s, r, d, m] = await Promise.all([
        getAdminStats(),
        getRevenueByMonth(),
        getTopBookedDestinations(),
        getUnreadMessageCount(),
      ]);
      setStats({ ...s, unreadMessages: m });
      setRevenueData(r);
      setTopDests(d);
      setLoading(false);
    }
    load();
  }, []);

  const statCards = [
    { title: "Total Revenue", value: `₹${stats.revenue.toLocaleString("en-IN")}`, icon: CreditCard, color: "text-green-500", bg: "bg-green-50" },
    { title: "Active Tours", value: stats.totalTours, icon: Compass, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Total Bookings", value: stats.totalBookings, icon: BookOpen, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "Avg Rating", value: stats.avgRating, icon: Star, color: "text-brand-orange", bg: "bg-orange-50" },
    { title: "Unread Mail", value: stats.unreadMessages, icon: MessageSquare, color: "text-red-500", bg: "bg-red-50" },
  ];

  const maxRevenue = revenueData.length ? Math.max(...revenueData.map((d) => d.value)) || 1 : 1;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-black text-brand-navy mb-2">Dashboard Overview</h1>
        <p className="text-gray-500 font-medium">Real-time data from your Supabase database.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange" />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {statCards.map((stat, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${stat.bg} ${stat.color} flex-shrink-0`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">{stat.title}</p>
                  <p className="text-2xl font-black text-brand-navy">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-brand-navy">Revenue by Month</h2>
                <BarChart3 className="w-5 h-5 text-gray-400" />
              </div>
              {revenueData.length === 0 ? (
                <div className="h-64 flex items-center justify-center text-gray-400 text-sm font-semibold bg-gray-50 rounded-2xl">
                  No booking data yet. Revenue will appear here once bookings are added.
                </div>
              ) : (
                <div className="h-64 flex items-end gap-2 sm:gap-4 pt-4">
                  {revenueData.map((data, i) => {
                    const height = Math.round((data.value / maxRevenue) * 100);
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                        <div
                          className="w-full relative bg-orange-50 rounded-t-lg group-hover:bg-brand-orange/20 transition-all"
                          style={{ height: `${height}%`, minHeight: "4px" }}
                        >
                          <div className="absolute inset-0 bg-brand-orange rounded-t-lg opacity-80" />
                          <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                            ₹{data.value.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-gray-500">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Top Destinations */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-bold text-brand-navy mb-6">Top Destinations</h2>
              {topDests.length === 0 ? (
                <div className="text-gray-400 text-sm font-semibold text-center py-10 bg-gray-50 rounded-2xl">
                  No bookings yet. Data will appear after bookings are added.
                </div>
              ) : (
                <div className="space-y-6">
                  {topDests.map((dest, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-gray-700">{dest.name}</span>
                        <span className="font-bold text-brand-navy">{dest.bookings} Bookings</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-brand-orange rounded-full transition-all" style={{ width: `${dest.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Link href="/admin/tours" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-brand-orange transition-colors group">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors flex-shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-brand-navy">Tours</p>
                <p className="text-xs text-gray-400 font-medium">Manage packages</p>
              </div>
            </Link>
            <Link href="/admin/destinations" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-brand-orange transition-colors group">
              <div className="w-12 h-12 bg-orange-50 text-brand-orange rounded-xl flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors flex-shrink-0">
                <Map className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-brand-navy">Destinations</p>
                <p className="text-xs text-gray-400 font-medium">Top getaways</p>
              </div>
            </Link>
            <Link href="/admin/bookings" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-brand-orange transition-colors group">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors flex-shrink-0">
                <CalendarDays className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-brand-navy">Bookings</p>
                <p className="text-xs text-gray-400 font-medium">Manage orders</p>
              </div>
            </Link>
            <Link href="/admin/gallery" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-brand-orange transition-colors group">
              <div className="w-12 h-12 bg-green-50 text-green-500 rounded-xl flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors flex-shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-brand-navy">Gallery</p>
                <p className="text-xs text-gray-400 font-medium">Manage media</p>
              </div>
            </Link>
            <Link href="/admin/messages" className="flex items-center gap-4 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-brand-orange transition-colors group">
              <div className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-colors flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <p className="font-bold text-brand-navy">Messages</p>
                <p className="text-xs text-gray-400 font-medium">View inquiries</p>
              </div>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
