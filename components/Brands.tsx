"use client";

export default function Brands() {
  return (
    <section className="py-12 bg-white border-t border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center lg:justify-between gap-10 md:gap-16 opacity-40 hover:opacity-70 transition-opacity duration-300">
          
          {/* Qatar Airways */}
          <div className="flex items-center font-serif font-black text-xl tracking-tight text-brand-navy">
            QATAR
            <span className="font-sans font-light text-xs tracking-[0.2em] ml-1 text-gray-500 uppercase">
              Airways
            </span>
          </div>

          {/* Emirates */}
          <div className="font-serif text-2xl font-black tracking-wide text-brand-navy">
            Emirates
          </div>

          {/* Booking.com */}
          <div className="font-sans font-extrabold text-xl text-brand-navy">
            Booking<span className="text-gray-500 font-light">.com</span>
          </div>

          {/* Expedia */}
          <div className="flex items-center gap-1 font-sans font-black text-xl text-brand-navy">
            {/* Expedia Globe Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-5 h-5 text-gray-500"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
            Expedia
          </div>

          {/* Tripadvisor */}
          <div className="flex items-center gap-1 font-sans font-bold text-lg text-brand-navy">
            {/* Tripadvisor Owl Eyes SVG */}
            <span className="bg-brand-navy text-white px-1.5 py-0.5 rounded-md text-xs font-black mr-1">
              O O
            </span>
            tripadvisor
          </div>

          {/* Airbnb */}
          <div className="flex items-center gap-1.5 font-sans font-black text-xl text-brand-navy">
            {/* Airbnb Loop SVG */}
            <svg
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-gray-500 fill-current"
            >
              <path d="M16 1c-2.008 0-3.616 1.488-4.084 3.756C11.516 6.64 8.76 13.568 4.736 22.368 4.148 23.636 3.668 25.108 3.668 26.5c0 3.032 2.468 5.5 5.5 5.5 2.112 0 4.108-1.22 5.092-3.136L16 25.428l1.74 3.436c.984 1.916 2.98 3.136 5.092 3.136 3.032 0 5.5-2.468 5.5-5.5 0-1.392-.48-2.864-1.068-4.132-4.024-8.8-6.78-15.728-7.18-17.612C19.616 2.488 18.008 1 16 1zm0 2c1.176 0 2.216.892 2.508 2.304.384 1.832 2.956 8.352 7.02 17.24.504 1.092.904 2.352.904 3.456 0 1.932-1.568 3.5-3.5 3.5-1.348 0-2.628-.788-3.26-2.016L16 21.044l-3.672 6.44c-.632 1.228-1.912 2.016-3.26 2.016-1.932 0-3.5-1.568-3.5-3.5 0-1.104.4-2.364.904-3.456 4.064-8.888 6.636-15.408 7.02-17.24C13.784 3.892 14.824 3 16 3zm0 8.5c-2.488 0-4.5 2.012-4.5 4.5s2.012 4.5 4.5 4.5 4.5-2.012 4.5-4.5-2.012-4.5-4.5-4.5zm0 2c1.384 0 2.5 1.116 2.5 2.5s-1.116 2.5-2.5 2.5-2.5-1.116-2.5-2.5 1.116-2.5 2.5-2.5z" />
            </svg>
            airbnb
          </div>

        </div>
      </div>
    </section>
  );
}
