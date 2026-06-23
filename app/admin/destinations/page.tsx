"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Destination, createDestination, updateDestination, deleteDestination } from "@/lib/data";
import { MapPin, Check, X, Plus, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState<Destination | null>(null);
  const [form, setForm] = useState({ name: "", country: "", image: "", is_top_destination: false });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function fetchDestinations() {
    const { data, error } = await supabase.from("destinations").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      const mapped = data.map(row => ({ ...row, isTopDestination: row.is_top_destination }));
      setDestinations(mapped as Destination[]);
    }
    setLoading(false);
  }

  useEffect(() => { fetchDestinations(); }, []);

  async function toggleTopDestination(id: string, currentStatus: boolean) {
    const { error } = await supabase.from("destinations").update({ is_top_destination: !currentStatus }).eq("id", id);
    if (!error) {
      setDestinations(destinations.map(d => d.id === id ? { ...d, isTopDestination: !currentStatus, is_top_destination: !currentStatus } : d));
    }
  }

  function openAdd() {
    setEditingDest(null);
    setForm({ name: "", country: "", image: "", is_top_destination: false });
    setModalOpen(true);
  }

  function openEdit(dest: Destination) {
    setEditingDest(dest);
    setForm({
      name: dest.name,
      country: dest.country,
      image: dest.image,
      is_top_destination: dest.isTopDestination || dest.is_top_destination || false,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    setSaving(true);
    if (editingDest) {
      const result = await updateDestination(editingDest.id, form);
      if (result) {
        setDestinations(destinations.map(d => d.id === editingDest.id ? { ...d, ...result, isTopDestination: result.is_top_destination } : d));
      }
    } else {
      const result = await createDestination(form);
      if (result) {
        setDestinations([{ ...result, isTopDestination: result.is_top_destination }, ...destinations]);
      }
    }
    setSaving(false);
    setModalOpen(false);
  }

  async function handleDelete(id: string) {
    const success = await deleteDestination(id);
    if (success) {
      setDestinations(destinations.filter(d => d.id !== id));
    }
    setDeleteConfirm(null);
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-black text-brand-navy mb-2">Manage Destinations</h1>
          <p className="text-gray-500 font-medium">Add, edit, and feature top destinations on the homepage.</p>
        </div>
        <button onClick={openAdd} className="bg-brand-navy hover:bg-brand-navy/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add New Destination
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <div key={dest.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group">
              <div className="relative h-48 w-full bg-gray-100">
                {dest.image && <Image src={dest.image} alt={dest.name} fill className="object-cover" />}
                <button
                  onClick={() => toggleTopDestination(dest.id, !!dest.isTopDestination)}
                  className={`absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold shadow-md transition-colors ${
                    dest.isTopDestination
                      ? "bg-brand-orange text-white"
                      : "bg-white/90 text-gray-500 hover:bg-white"
                  }`}
                >
                  {dest.isTopDestination ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  {dest.isTopDestination ? "Top Destination" : "Standard"}
                </button>
              </div>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-black text-xl text-brand-navy">{dest.name}</h3>
                  <div className="flex items-center gap-1 text-sm font-semibold text-gray-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 text-brand-orange" /> {dest.country}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(dest)} className="text-brand-orange hover:bg-orange-50 p-2 rounded-lg transition-colors" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => setDeleteConfirm(dest.id)} className="text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {destinations.length === 0 && (
            <div className="col-span-full p-8 text-center bg-white rounded-2xl border border-gray-100 text-gray-500">
              No destinations found. Click &quot;Add New Destination&quot; to create one.
            </div>
          )}
        </div>
      )}

      {/* ── Delete Confirmation ── */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteConfirm(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center" onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-serif font-black text-xl text-brand-navy mb-2">Delete Destination?</h3>
            <p className="text-gray-500 text-sm mb-6">This will also remove all tours linked to this destination.</p>
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-serif font-black text-xl text-brand-navy">
                {editingDest ? "Edit Destination" : "Add New Destination"}
              </h2>
              <button onClick={() => setModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Destination Name *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  placeholder="e.g. Bali" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Country *</label>
                <input type="text" value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  placeholder="e.g. Indonesia" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image URL *</label>
                <input type="text" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  placeholder="https://images.unsplash.com/..." />
                {form.image && (
                  <div className="relative h-32 mt-2 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={form.image} alt="Preview" fill className="object-cover" />
                  </div>
                )}
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div
                  onClick={() => setForm({ ...form, is_top_destination: !form.is_top_destination })}
                  className={`w-11 h-6 rounded-full relative transition-colors cursor-pointer ${form.is_top_destination ? "bg-brand-orange" : "bg-gray-200"}`}
                >
                  <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${form.is_top_destination ? "translate-x-5.5" : "translate-x-0.5"}`} />
                </div>
                <span className="text-sm font-bold text-brand-navy">Feature as Top Destination</span>
              </label>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setModalOpen(false)} className="border border-gray-200 text-brand-navy font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.name || !form.country || !form.image}
                className="bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2"
              >
                {saving ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : null}
                {editingDest ? "Save Changes" : "Create Destination"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
