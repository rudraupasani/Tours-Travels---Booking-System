import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTopDestinations } from "@/lib/data";

export default async function TopDestinations() {
  const displayDestinations = await getTopDestinations();
  return (
    <section className="py-24 bg-soft-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold text-brand-orange uppercase tracking-widest block mb-2">
              Top Destinations
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-navy">
              Explore Top Destinations
            </h2>
          </div>
          <div>
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 text-sm font-bold text-brand-navy hover:text-brand-orange transition-colors"
            >
              <span>View All Destinations</span>
              <div className="w-7 h-7 bg-white text-brand-orange rounded-full flex items-center justify-center shadow-sm group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {displayDestinations.map((item) => (
            <Link
              key={item.id}
              href={`/tours?search=${encodeURIComponent(item.name)}`}
              className="group relative h-[320px] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 block"
            >
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/20 to-transparent z-10"></div>

              {/* Destination Image */}
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-115 transition-transform duration-700 ease-out"
              />

              {/* Text Label */}
              <div className="absolute border-l-4 rounded-sm border-l-yellow-500 px-2  bottom-6 left-6 right-6 z-20 text-white">
                <h3 className="text-xl font-serif font-black tracking-wide mb-1 group-hover:text-brand-orange transition-colors">
                  {item.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
