"use client";

import { useEffect, useState } from "react";
import { GalleryImage, getGalleryImagesAll, createGalleryImage, deleteGalleryImage, uploadGalleryFile } from "@/lib/data";
import { Plus, Trash2, X, ImageIcon, MapPin, Tag, Upload } from "lucide-react";
import Image from "next/image";

const CATEGORIES = ["All", "Nature", "City", "Beach", "Mountain", "Cultural", "Adventure", "Food"];

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ src: "", alt: "", location: "", category: "Nature" });
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");

  // Storage upload states
  const [uploadMode, setUploadMode] = useState<"file" | "url">("file");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getGalleryImagesAll();
      setImages(data);
      setLoading(false);
    }
    load();
  }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(URL.createObjectURL(file));
      if (!form.alt) {
        const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
        setForm(prev => ({ ...prev, alt: baseName }));
      }
    }
  }

  function closeModal() {
    setModalOpen(false);
    setForm({ src: "", alt: "", location: "", category: "Nature" });
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadMode("file");
  }

  async function handleSave() {
    setSaving(true);
    let finalSrc = form.src;

    if (uploadMode === "file") {
      if (!selectedFile) {
        alert("Please select a file to upload.");
        setSaving(false);
        return;
      }
      const uploadedUrl = await uploadGalleryFile(selectedFile);
      if (!uploadedUrl) {
        alert("Failed to upload image. Please try again.");
        setSaving(false);
        return;
      }
      finalSrc = uploadedUrl;
    }

    const result = await createGalleryImage({ ...form, src: finalSrc });
    if (result) {
      setImages([result, ...images]);
      closeModal();
    } else {
      alert("Failed to save gallery image.");
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    const success = await deleteGalleryImage(id);
    if (success) {
      setImages(images.filter(img => img.id !== id));
    }
    setDeleteConfirm(null);
  }


  const filtered = activeCategory === "All" ? images : images.filter(img => img.category === activeCategory);

  return (
    <div className="p-8">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-serif font-black text-brand-navy mb-2">Manage Gallery</h1>
          <p className="text-gray-500 font-medium">Add and manage photos displayed in the gallery section.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="bg-brand-navy hover:bg-brand-navy/90 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Image
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? "bg-brand-navy text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}
          >
            {cat}
            {cat !== "All" && (
              <span className="ml-1.5 text-xs opacity-70">
                ({images.filter(img => img.category === cat).length})
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(img => (
            <div key={img.id} className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="relative h-48 w-full bg-gray-100">
                <Image src={img.src} alt={img.alt} fill className="object-cover" />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-brand-navy/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => setDeleteConfirm(img.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className="font-bold text-brand-navy text-sm mb-1 truncate">{img.alt}</p>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                    <MapPin className="w-3 h-3 text-brand-orange" />
                    {img.location}
                  </span>
                  <span className="text-[10px] font-bold bg-orange-50 text-brand-orange px-2 py-0.5 rounded-full uppercase">
                    {img.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-gray-100">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 font-semibold">No images found. Click &quot;Add Image&quot; to upload one.</p>
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
            <h3 className="font-serif font-black text-xl text-brand-navy mb-2">Delete Image?</h3>
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

      {/* ── Add Image Modal ── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-serif font-black text-xl text-brand-navy">Add Gallery Image</h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Mode Switcher Tabs */}
            <div className="px-6 pt-5 flex border-b border-gray-100">
              <button
                onClick={() => setUploadMode("file")}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                  uploadMode === "file"
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Upload File
              </button>
              <button
                onClick={() => setUploadMode("url")}
                className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
                  uploadMode === "url"
                    ? "border-brand-orange text-brand-orange"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                Image URL
              </button>
            </div>

            <div className="p-6 space-y-5">
              {uploadMode === "file" ? (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image File *</label>
                  <div className="border-2 border-dashed border-gray-200 hover:border-brand-orange rounded-2xl p-6 text-center transition-colors cursor-pointer relative group bg-gray-50/50">
                    <input type="file" accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer z-10" />
                    {previewUrl ? (
                      <div className="relative h-40 w-full rounded-xl overflow-hidden bg-white border border-gray-100">
                        <Image src={previewUrl} alt="Preview" fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-4">
                        <Upload className="w-10 h-10 text-gray-300 group-hover:text-brand-orange transition-colors mb-2" />
                        <p className="text-sm font-bold text-brand-navy">Choose or drag an image</p>
                        <p className="text-xs text-gray-400 font-medium mt-1">PNG, JPG, JPEG, WEBP or GIF</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Image URL *</label>
                  <input type="text" value={form.src} onChange={e => setForm({ ...form, src: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                    placeholder="https://images.unsplash.com/..." />
                  {form.src && (
                    <div className="relative h-32 mt-2 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={form.src} alt="Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Alt Text / Description *</label>
                <input type="text" value={form.alt} onChange={e => setForm({ ...form, alt: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  placeholder="e.g. Sunset over Bali rice terraces" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Location *</label>
                <input type="text" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                  placeholder="e.g. Ubud, Bali" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category *</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange">
                  {CATEGORIES.filter(c => c !== "All").map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={closeModal} className="border border-gray-200 text-brand-navy font-bold px-6 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !form.alt || !form.location || (uploadMode === "file" ? !selectedFile : !form.src)}
                className="bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl transition-all text-sm flex items-center gap-2"
              >
                {saving ? (
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                ) : null}
                {saving && uploadMode === "file" ? "Uploading..." : "Add Image"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
