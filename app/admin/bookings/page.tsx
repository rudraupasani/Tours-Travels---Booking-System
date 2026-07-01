"use client";

import { useEffect, useState } from "react";
import { Booking, getBookings, updateBookingStatus, deleteBooking } from "@/lib/data";
import { CalendarDays, Users, DollarSign, Trash2, Clock, CheckCircle, XCircle, AlertCircle, Eye, X, Mail, Phone, User } from "lucide-react";

const STATUS_STYLES: Record<string, { bg: string; text: string; icon: any }> = {
  Confirmed: { bg: "bg-green-100", text: "text-green-700", icon: CheckCircle },
  Pending: { bg: "bg-amber-100", text: "text-amber-700", icon: Clock },
  Completed: { bg: "bg-blue-100", text: "text-blue-700", icon: CheckCircle },
  Cancelled: { bg: "bg-red-100", text: "text-red-700", icon: XCircle },
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [viewingBooking, setViewingBooking] = useState<Booking | null>(null);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    async function load() {
      const data = await getBookings();
      setBookings(data);
      setLoading(false);
    }
    load();
  }, []);

  async function changeStatus(id: string, status: string) {
    const success = await updateBookingStatus(id, status);
    if (success) {
      setBookings(bookings.map(b => b.id === id ? { ...b, status: status as Booking["status"] } : b));
    }
  }

  async function handleDelete(id: string) {
    const success = await deleteBooking(id);
    if (success) {
      setBookings(bookings.filter(b => b.id !== id));
    }
    setDeleteConfirm(null);
  }

  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);
  const totalRevenue = bookings.reduce((sum, b) => sum + b.amount, 0);
  const pendingCount = bookings.filter(b => b.status === "Pending").length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-black text-brand-navy mb-2">Manage Bookings</h1>
        <p className="text-gray-500 font-medium">View and manage all customer bookings.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Bookings</p>
            <p className="text-2xl font-black text-brand-navy">{bookings.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Revenue</p>
            <p className="text-2xl font-black text-brand-navy">₹{totalRevenue.toLocaleString("en-IN")}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pending</p>
            <p className="text-2xl font-black text-brand-navy">{pendingCount}</p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        {["All", "Confirmed", "Pending", "Completed", "Cancelled"].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
              filter === status
                ? "bg-brand-navy text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {status}
            {status !== "All" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({bookings.filter(b => b.status === status).length})
              </span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Booking ID</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tour</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Dates</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Travellers</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(booking => {
                const style = STATUS_STYLES[booking.status] || STATUS_STYLES.Pending;
                const StatusIcon = style.icon;
                return (
                  <tr key={booking.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <span className="text-xs font-bold text-brand-navy bg-gray-100 px-2 py-1 rounded-md">
                        #{booking.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-brand-navy text-sm">{(booking.tour as any)?.title || "—"}</p>
                      <p className="text-xs text-gray-400">{(booking.tour as any)?.destination || ""}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-brand-navy text-sm">{booking.customer_name || "Guest"}</p>
                      <p className="text-xs text-gray-400">{booking.customer_email || "—"}</p>
                    </td>
                    <td className="p-4 text-sm text-gray-600 font-medium">
                      <div className="flex items-center gap-1">
                        <CalendarDays className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(booking.start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                        {" → "}
                        {new Date(booking.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 text-sm font-bold text-gray-600">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        {booking.travellers}
                      </div>
                    </td>
                    <td className="p-4 font-black text-brand-navy">₹{booking.amount.toLocaleString("en-IN")}</td>
                    <td className="p-4">
                      <select
                        value={booking.status}
                        onChange={e => changeStatus(booking.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border-0 cursor-pointer ${style.bg} ${style.text} focus:outline-none focus:ring-2 focus:ring-brand-orange/30`}
                      >
                        <option value="Pending">⏳ Pending</option>
                        <option value="Confirmed">✅ Confirmed</option>
                        <option value="Completed">🎉 Completed</option>
                        <option value="Cancelled">❌ Cancelled</option>
                      </select>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setViewingBooking(booking)} className="text-blue-500 hover:bg-blue-50 p-2 rounded-lg transition-colors" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(booking.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-gray-500">
                    {filter === "All" ? "No bookings yet. Bookings will appear here once customers book tours." : `No ${filter.toLowerCase()} bookings.`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-serif font-black text-xl text-brand-navy mb-2">Delete Booking?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border border-gray-200 text-brand-navy font-bold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl transition-colors text-sm">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Booking Modal */}
      {viewingBooking && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setViewingBooking(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-10" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-serif font-black text-xl text-brand-navy">Booking Details</h2>
              <button onClick={() => setViewingBooking(null)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Tour Info */}
              <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tour Details</h3>
                <p className="text-lg font-black text-brand-navy">{(viewingBooking.tour as any)?.title || "Unknown Tour"}</p>
                <p className="text-sm font-medium text-gray-500">{(viewingBooking.tour as any)?.destination || "Unknown Destination"}</p>
                
                <div className="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Travel Dates</p>
                    <p className="text-sm font-bold text-brand-navy mt-1">
                      {new Date(viewingBooking.start_date).toLocaleDateString()} - {new Date(viewingBooking.end_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Travellers</p>
                    <p className="text-sm font-bold text-brand-navy mt-1">{viewingBooking.travellers} Pax</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amount Paid</p>
                    <p className="text-sm font-bold text-brand-navy mt-1">₹{viewingBooking.amount.toLocaleString("en-IN")}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Status</p>
                    <span className="text-sm font-bold text-brand-navy mt-1">{viewingBooking.status}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center text-brand-orange">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Full Name</p>
                      <p className="text-sm font-bold text-brand-navy">{viewingBooking.customer_name || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Email Address</p>
                      <p className="text-sm font-bold text-brand-navy">{viewingBooking.customer_email || "N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-500">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Phone Number</p>
                      <p className="text-sm font-bold text-brand-navy">{viewingBooking.customer_phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end">
              <button onClick={() => setViewingBooking(null)} className="border border-gray-200 text-brand-navy font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
