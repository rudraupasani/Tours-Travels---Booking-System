"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Tour, createTour, updateTour, deleteTour, getDestinations, Destination } from "@/lib/data";
import { Star, Check, X, Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

const EMPTY_TOUR = {
  title: "", country: "", image: "", price: 0, originalPrice: 0,
  rating: 0, reviews: 0, duration: "", days: 0, nights: 0,
  groupSize: 10, badge: "", isPopular: false, destination: "",
  destination_id: "",
  images: [] as string[], type: [] as string[],
  highlights: [] as string[], includes: [] as string[],
  itinerary: [] as { day: number; title: string; description: string }[],
};

type TourForm = typeof EMPTY_TOUR;

export default function AdminToursPage() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState<Tour | null>(null);
  const [form, setForm] = useState<TourForm>({ ...EMPTY_TOUR });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [destinations, setDestinations] = useState<Destination[]>([]);

  async function fetchTours() {
    const { data, error } = await supabase.from("tours").select("*, destination:destinations(name)").order("created_at", { ascending: false });
    if (!error && data) {
      const mapped = data.map(row => ({
        ...row,
        destination: row.destination?.name ?? row.destination ?? undefined,
        originalPrice: row.original_price,
        groupSize: row.group_size,
        isPopular: row.is_popular,
      }));
      setTours(mapped as Tour[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchTours();
    async function loadDestinations() {
      const dests = await getDestinations();
      setDestinations(dests);
    }
    loadDestinations();
  }, []);

  async function togglePopular(id: string, currentStatus: boolean) {
    const { error } = await supabase.from("tours").update({ is_popular: !currentStatus }).eq("id", id);
    if (!error) {
      setTours(tours.map(t => t.id === id ? { ...t, isPopular: !currentStatus } : t));
    }
  }

  function openAdd() {
    setEditingTour(null);
    setForm({ ...EMPTY_TOUR });
    setModalOpen(true);
  }

  function openEdit(tour: Tour) {
    setEditingTour(tour);
    setForm({
      title: tour.title, country: tour.country, image: tour.image,
      price: tour.price, originalPrice: tour.originalPrice,
      rating: tour.rating, reviews: tour.reviews, duration: tour.duration,
      days: tour.days, nights: tour.nights, groupSize: tour.groupSize,
      badge: tour.badge || "", isPopular: tour.isPopular || false,
      destination: tour.destination || "",
      destination_id: tour.destination_id || "",
      images: tour.images || [], type: tour.type || [],
      highlights: tour.highlights || [], includes: tour.includes || [],
      itinerary: tour.itinerary || [],
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editingTour) {
      const result = await updateTour(editingTour.id, form as any);
      if (result) {
        setTours(tours.map(t => t.id === editingTour.id ? { ...t, ...result } : t));
      }
    } else {
      const result = await createTour(form as any);
      if (result) {
        setTours([result, ...tours]);
      }
    }
    setSaving(false);
    setModalOpen(false);
  }

  async function handleDelete(id: string) {
    const success = await deleteTour(id);
    if (success) {
      setTours(tours.filter(t => t.id !== id));
    }
    setDeleteConfirm(null);
  }

  const updateField = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-black text-brand-navy mb-2">Manage Tours</h1>
          <p className="text-gray-500 font-medium">Add, edit, and manage all tour packages.</p>
        </div>
        <button onClick={openAdd} className="bg-brand-navy hover:bg-brand-navy/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Tour
        </button>
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
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Tour</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Price</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Popular (Homepage)</th>
                <th className="p-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tours.map((tour) => (
                <tr key={tour.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                      {tour.image && <Image src={tour.image} alt={tour.title} fill className="object-cover" />}
                    </div>
                    <div>
                      <p className="font-bold text-brand-navy">{tour.title}</p>
                      <p className="text-xs font-semibold text-gray-500">{tour.destination}, {tour.country}</p>
                    </div>
                  </td>
                  <td className="p-4 font-bold text-brand-navy">₹{tour.price.toLocaleString("en-IN")}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-sm text-brand-navy">{tour.rating}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => togglePopular(tour.id, !!tour.isPopular)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                        tour.isPopular
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {tour.isPopular ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      {tour.isPopular ? "Popular" : "Standard"}
                    </button>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(tour)} className="text-brand-orange hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirm(tour.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tours.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">No tours found in database. Click &quot;Add New Tour&quot; to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-serif font-black text-xl text-brand-navy mb-2">Delete Tour?</h3>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. All related bookings will also be deleted.</p>
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

      {/* ── Add/Edit Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full my-10" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-serif font-black text-xl text-brand-navy">
                {editingTour ? "Edit Tour" : "Add New Tour"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tour Title *</label>
                <input type="text" value={form.title} onChange={e => updateField("title", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  placeholder="e.g. Royal Rajasthan Heritage Tour" />
              </div>

              {/* Destination + Country */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Destination *</label>
                  <select
                    value={form.destination_id || ""}
                    onChange={(e) => {
                      const id = e.target.value;
                      const selectedDest = destinations.find((d) => d.id === id);
                      setForm((prev) => ({
                        ...prev,
                        destination_id: id,
                        destination: selectedDest ? selectedDest.name : "",
                        country: selectedDest ? selectedDest.country : prev.country,
                      }));
                    }}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange cursor-pointer bg-white"
                    required
                  >
                    <option value="">Select Destination</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.country})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Country *</label>
                  <input type="text" value={form.country} onChange={e => updateField("country", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="e.g. India" required />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image URL *</label>
                <input type="text" value={form.image} onChange={e => updateField("image", e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  placeholder="https://images.unsplash.com/..." />
                {form.image && (
                  <div className="relative h-32 mt-2 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={form.image} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Price + Original Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Price (₹ INR) *</label>
                  <input type="number" value={form.price || ""} onChange={e => updateField("price", Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="799" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Original Price (₹ INR)</label>
                  <input type="number" value={form.originalPrice || ""} onChange={e => updateField("originalPrice", Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="999" />
                </div>
              </div>

              {/* Duration + Days + Nights */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Duration *</label>
                  <input type="text" value={form.duration} onChange={e => updateField("duration", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="5D / 4N" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Days *</label>
                  <input type="number" value={form.days || ""} onChange={e => updateField("days", Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="5" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nights *</label>
                  <input type="number" value={form.nights || ""} onChange={e => updateField("nights", Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="4" />
                </div>
              </div>

              {/* Group Size + Badge */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Group Size</label>
                  <input type="number" value={form.groupSize || ""} onChange={e => updateField("groupSize", Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="10" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Badge</label>
                  <input type="text" value={form.badge} onChange={e => updateField("badge", e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="Best Seller" />
                </div>
              </div>

              {/* Highlights */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Highlights (comma separated)</label>
                <textarea
                  value={form.highlights.join(", ")}
                  onChange={e => updateField("highlights", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange resize-none"
                  rows={2} placeholder="Taj Mahal visit, Desert safari, Local food tour" />
              </div>

              {/* Includes */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Includes (comma separated)</label>
                <textarea
                  value={form.includes.join(", ")}
                  onChange={e => updateField("includes", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange resize-none"
                  rows={2} placeholder="Hotel, Breakfast, Transport, Guide" />
              </div>

              {/* Popular toggle */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => updateField("isPopular", !form.isPopular)}
                  className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${form.isPopular ? "bg-brand-orange" : "bg-gray-200"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.isPopular ? "translate-x-5.5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-bold text-brand-navy">Show on homepage as popular</span>
              </label>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="border border-gray-200 text-brand-navy font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.title || !form.country || !form.price}
                className="bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2"
              >
                {saving ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : null}
                {editingTour ? "Save Changes" : "Create Tour"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
