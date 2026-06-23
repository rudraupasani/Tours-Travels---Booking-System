"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getGalleryImages, GalleryImage } from "@/lib/data";
import { MapPin, X } from "lucide-react";

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const [categories, setCategories] = useState<string[]>(["All"]);

  useEffect(() => {
    async function load() {
      const data = await getGalleryImages();
      setImages(data);
      // Build unique categories from DB data
      const cats = ["All", ...Array.from(new Set(data.map((g) => g.category).filter(Boolean)))];
      setCategories(cats);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = active === "All" ? images : images.filter((g) => g.category === active);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-brand-navy pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 50%, #ffa801 0%, transparent 55%), radial-gradient(circle at 20% 80%, #3b82f6 0%, transparent 45%)" }} />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-white/50 text-sm mb-4">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Gallery</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-black text-white mb-3">Travel Gallery</h1>
          <p className="text-white/60 font-medium text-lg max-w-xl mx-auto">Explore breathtaking moments from around the world</p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1">
        {/* Category Tabs — built from DB */}
        {!loading && (
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${active === cat ? "bg-brand-orange text-white border-brand-orange shadow-md" : "bg-white text-gray-600 border-gray-200 hover:border-brand-orange hover:text-brand-orange"}`}>
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-orange" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-3xl text-gray-400 font-semibold">
            No images found. Add gallery images in the database.
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
            {filtered.map((img, i) => (
              <div key={img.id}
                onClick={() => setLightbox(img)}
                className="relative break-inside-avoid rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
                style={{ aspectRatio: i % 3 === 0 ? "3/4" : i % 3 === 1 ? "4/3" : "1/1" }}>
                <Image src={img.src} alt={img.alt} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-bold text-sm">{img.alt}</p>
                  <p className="text-white/70 text-xs font-medium flex items-center gap-1 mt-1"><MapPin className="w-3 h-3" />{img.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightbox(null)}>
          <button className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="relative max-w-4xl w-full max-h-[80vh] rounded-2xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <Image src={lightbox.src} alt={lightbox.alt} width={1200} height={800} className="object-contain w-full h-full max-h-[80vh]" />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <p className="text-white font-bold">{lightbox.alt}</p>
              <p className="text-white/60 text-sm flex items-center gap-1 mt-1"><MapPin className="w-3.5 h-3.5" />{lightbox.location}</p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
