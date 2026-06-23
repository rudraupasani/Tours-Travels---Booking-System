"use client";

import { useState } from "react";
import { Send } from "lucide-react";

export default function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    alert(`Thank you for subscribing! We will send updates to: ${email}`);
    setEmail("");
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Wrapper */}
        <div className="relative bg-brand-navy-light rounded-[2.5rem] p-8 md:p-16 overflow-hidden shadow-xl">
          {/* Decorative Background Dotted Trail & Paper Plane SVG */}
          <div className="absolute top-1/2 right-12 md:right-24 transform -translate-y-1/2 opacity-15 pointer-events-none hidden md:block">
            <svg
              width="240"
              height="200"
              viewBox="0 0 240 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white animate-pulse"
            >
              <path
                d="M10 180 C 40 100, 100 120, 150 50 C 180 10, 200 40, 220 20"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray="8 8"
                fill="none"
              />
              <path
                d="M218 20 L 222 36 L 206 30 Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Header Text */}
            <div className="text-center lg:text-left text-white max-w-lg">
              <span className="text-xs font-extrabold text-brand-orange uppercase tracking-widest block mb-2">
                Newsletter
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-black mb-4 leading-tight">
                Subscribe To Get Special Offers
              </h2>
              <p className="text-sm md:text-base text-white/80 font-medium">
                Get exclusive travel deals and updates straight to your inbox.
              </p>
            </div>

            {/* Email Form */}
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md bg-white p-2 rounded-2xl md:rounded-full flex flex-col sm:flex-row items-center gap-2 shadow-lg border border-white/10"
            >
              <div className="flex items-center gap-2 flex-1 w-full pl-3">
                <Send className="w-4 h-4 text-brand-orange shrink-0" />
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-brand-navy font-semibold text-sm focus:outline-none placeholder-gray-400 py-3"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange-hover text-white font-bold text-sm px-8 py-3.5 rounded-xl sm:rounded-full transition-colors shadow-sm duration-200 whitespace-nowrap"
              >
                Subscribe Now
              </button>
            </form>
          </div>
          
        </div>
      </div>
    </section>
  );
}
