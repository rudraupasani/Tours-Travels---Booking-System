import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Coffee, Star, ArrowRight } from "lucide-react";
import { getPopularTours } from "@/lib/data";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function PopularPackages() {
  const displayPackages = await getPopularTours();

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Grid */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-extrabold text-brand-orange uppercase tracking-widest block mb-2">
              Popular Packages
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-navy">
              Popular Tour Packages
            </h2>
          </div>
          <div>
            <Link
              href="/tours"
              className="group inline-flex items-center gap-2 text-sm font-bold text-brand-navy hover:text-brand-orange transition-colors"
            >
              <span>View All Packages</span>
              <div className="w-7 h-7 bg-orange-50 text-brand-orange rounded-full flex items-center justify-center group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                <ArrowRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>

        {/* Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayPackages.map((item) => {
            const discountPercentage = Math.round(
              ((item.originalPrice - item.price) / item.originalPrice) * 100
            );

            return (
              <Link
                href={`/tours/${item.id}`}
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
              >
                {/* Image Container */}
                <div className="relative h-64 w-full overflow-hidden bg-gray-100">
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4 z-10 bg-brand-orange text-white text-[11px] font-black tracking-wide px-3.5 py-1.5 rounded-full shadow-md">
                    {discountPercentage}% OFF
                  </div>
                  {/* Photo */}
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Card Details */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    {/* Location */}
                    <div className="flex items-center gap-1 text-sm font-semibold text-gray-500 mb-2">
                      <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
                      <span>{item.destination}, India</span>
                    </div>

                    {/* Title */}
                    <h3 className="font-serif text-lg font-bold text-brand-navy mb-4 group-hover:text-brand-orange transition-colors">
                      {item.title}
                    </h3>

                    {/* Amenities */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 mb-6">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-brand-orange shrink-0" />
                        <span>{item.duration}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coffee className="w-4 h-4 text-brand-orange shrink-0" />
                        <span>Breakfast Included</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {/* Divider */}
                    <div className="border-t border-gray-100 pt-5 flex items-center justify-between">
                      {/* Price */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-2xl font-black text-brand-navy">
                          {formatINR(item.price)}
                        </span>
                        <span className="text-xs font-bold text-gray-400 line-through">
                          {formatINR(item.originalPrice)}
                        </span>
                      </div>

                      {/* Star Rating */}
                      {item.rating > 0 && (
                        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1.5 rounded-full text-brand-navy">
                          <Star className="w-3.5 h-3.5 fill-brand-orange text-brand-orange" />
                          <span className="text-xs font-extrabold">
                            {item.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
