import Image from "next/image";
import { getGalleryImages } from "@/lib/data";

export default async function TravelGallery() {
  const displayImages = await getGalleryImages();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold text-brand-orange uppercase tracking-widest block mb-2">
            Travel Gallery
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-navy">
            Moments From Our Travelers
          </h2>
        </div>

        {/* Gallery Grid */}
        {displayImages.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-3xl text-gray-400 font-semibold">
            No gallery images yet. Add some in the database.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {displayImages.map((img) => (
              <div
                key={img.id}
                className="relative h-64 md:h-80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <p className="text-xs font-extrabold uppercase tracking-wider text-brand-orange">
                    {img.category}
                  </p>
                  <p className="text-sm font-bold">{img.location}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
