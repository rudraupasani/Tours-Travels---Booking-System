"use client";

import { Tag, Hotel, Headphones, ShieldCheck } from "lucide-react";

interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  bgClass: string;
}

const featuresData: FeatureItem[] = [
  {
    id: 1,
    title: "Best Price Guarantee",
    description: "Get the best deals and offers on all your bookings.",
    icon: <Tag className="w-8 h-8" />,
    bgClass: "bg-blue-50 text-blue-600",
  },
  {
    id: 2,
    title: "Handpicked Hotels",
    description: "Stay in the best hotels with top-notch service.",
    icon: <Hotel className="w-8 h-8" />,
    bgClass: "bg-emerald-50 text-emerald-600",
  },
  {
    id: 3,
    title: "24/7 Customer Support",
    description: "We are here to help you anytime, anywhere.",
    icon: <Headphones className="w-8 h-8" />,
    bgClass: "bg-amber-50 text-amber-600",
  },
  {
    id: 4,
    title: "Safe & Secure Travel",
    description: "Your safety is our top priority on every trip.",
    icon: <ShieldCheck className="w-8 h-8" />,
    bgClass: "bg-teal-50 text-teal-600",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold text-brand-orange uppercase tracking-widest block mb-2">
            Why Choose Us
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-navy">
            Travel Made Easy & Memorable
          </h2>
        </div>

        {/* Features List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {featuresData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center text-center p-6 rounded-3xl hover:bg-soft-gray transition-colors duration-300 group"
            >
              {/* Rounded soft icon container */}
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform duration-300 ${item.bgClass}`}
              >
                {item.icon}
              </div>

              {/* Title */}
              <h3 className="font-serif text-lg font-black text-brand-navy mb-3">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm font-medium text-gray-500 max-w-[240px] leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
