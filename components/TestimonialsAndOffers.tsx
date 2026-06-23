"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight, Quote, ArrowRight } from "lucide-react";

interface Testimonial {
  id: number;
  text: string;
  name: string;
  location: string;
  rating: number;
  avatar: string;
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    text: "Our trip to Kerala was absolutely amazing! Excellent service, beautiful houseboats, and a well-organized itinerary. Highly recommended! We can't wait to book our next adventure in Rajasthan with Travelora.",
    name: "John Smith",
    location: "New York, USA",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 2,
    text: "The Kashmir tour exceeded all our expectations. The snow-covered valleys of Gulmarg were breathtaking, and the houseboat stay on Dal Lake was spectacular. Perfect planning down to the smallest detail!",
    name: "Sarah Miller",
    location: "London, UK",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
  },
  {
    id: 3,
    text: "Booking with Travelora was so seamless. Their customer support was available 24/7 to adjust our hotel reservations when flight times changed. Outstanding hospitality and price value across India.",
    name: "David Chen",
    location: "Sydney, Australia",
    rating: 5,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop",
  },
];

export default function TestimonialsAndOffers() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonialsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonialsData.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="py-24 bg-soft-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-stretch">
          
          {/* Left Column: Testimonials */}
          <div className="flex flex-col justify-between">
            {/* Header with Slider Buttons */}
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-xs font-extrabold text-brand-orange uppercase tracking-widest block mb-2">
                  What Our Travelers Say
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-navy">
                  Customer Testimonials
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrev}
                  className="w-10 h-10 border border-gray-200 text-brand-navy bg-white hover:bg-brand-orange hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
                  aria-label="Previous Testimonial"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNext}
                  className="w-10 h-10 border border-gray-200 text-brand-navy bg-white hover:bg-brand-orange hover:text-white rounded-full flex items-center justify-center transition-all duration-300 shadow-sm"
                  aria-label="Next Testimonial"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Testimonial Active Slide */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-lg border border-gray-50 flex-1 flex flex-col justify-between relative overflow-hidden">
              {/* Giant Quote Icon background */}
              <Quote className="absolute top-8 right-8 w-24 h-24 text-gray-50 opacity-80 pointer-events-none" />

              <div className="relative z-10">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {Array.from({ length: testimonialsData[activeIndex].rating }).map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-brand-orange text-brand-orange" />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-base md:text-lg font-medium text-brand-navy/90 leading-relaxed italic mb-8">
                  &ldquo;{testimonialsData[activeIndex].text}&rdquo;
                </p>
              </div>

              {/* User Bio Profile */}
              <div className="flex items-center gap-4 border-t border-gray-100 pt-6 relative z-10">
                <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-md">
                  <Image
                    src={testimonialsData[activeIndex].avatar}
                    alt={testimonialsData[activeIndex].name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-serif font-black text-brand-navy">
                    {testimonialsData[activeIndex].name}
                  </h4>
                  <span className="text-xs font-bold text-gray-400">
                    {testimonialsData[activeIndex].location}
                  </span>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {testimonialsData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeIndex ? "w-6 bg-brand-orange" : "w-2.5 bg-gray-200"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Special Offer Card */}
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-brand-orange uppercase tracking-widest block mb-2">
              Exclusive Offers
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-black text-brand-navy mb-8">
              Special Offers & Discounts
            </h2>

            {/* Offer Banner Card */}
            <div className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex-1 flex flex-col justify-end min-h-[350px] group">
              {/* Background image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop"
                  alt="Summer Offer Banner"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-black/20"></div>
              </div>

              {/* Offer Text Overlay */}
              <div className="relative z-10 p-8 md:p-10 text-white">
                <span className="text-xs font-black bg-brand-orange text-white px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-4 inline-block shadow-md">
                  Up To 35% Off
                </span>
                
                <h3 className="text-3xl md:text-4xl font-serif font-black leading-tight mb-3">
                  Festive Season
                  <br />
                  Special Offer
                </h3>
                
                <p className="text-sm font-semibold text-white/90 max-w-sm mb-6 leading-relaxed">
                  Book now and get up to 35% off on selected travel packages across India.
                </p>

                <button className="bg-brand-orange hover:bg-brand-orange-hover text-white text-sm font-bold px-8 py-3.5 rounded-full flex items-center gap-2 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg transition-all duration-200">
                  <span>Book Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
