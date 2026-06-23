"use client";

import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

// Inline SVG brand icons (lucide-react dropped these in newer versions)
const FacebookIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const YoutubeIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-brand-navy-bg text-white pt-20 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 pb-16">

          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 group w-max">
              <div className="bg-brand-orange text-white p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 -rotate-45"
                >
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </div>
              <span className="font-serif text-2xl font-black tracking-tight text-white">
                Travelora
              </span>
            </Link>

            <p className="text-sm font-medium text-white/60 leading-relaxed">
              Discover amazing places at exclusive deals and make your journey memorable.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-brand-orange hover:border-brand-orange flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-brand-orange hover:border-brand-orange flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-brand-orange hover:border-brand-orange flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
                aria-label="Twitter / X"
              >
                <TwitterIcon className="w-4 h-4" />
              </Link>
              <Link
                href="#"
                className="w-9 h-9 rounded-full bg-white/5 border border-white/10 hover:bg-brand-orange hover:border-brand-orange flex items-center justify-center text-white/80 hover:text-white transition-all duration-300"
                aria-label="YouTube"
              >
                <YoutubeIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-serif font-black text-lg mb-6 border-l-4 border-brand-orange pl-3">
              Quick Links
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm font-medium text-white/60">
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Home</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Tours</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Destinations</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Top Destinations */}
          <div>
            <h4 className="font-serif font-black text-lg mb-6 border-l-4 border-brand-orange pl-3">
              Top Destinations
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm font-medium text-white/60">
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Kerala</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Kashmir</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Rajasthan</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Goa</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Ladakh</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div>
            <h4 className="font-serif font-black text-lg mb-6 border-l-4 border-brand-orange pl-3">
              Support
            </h4>
            <ul className="flex flex-col gap-3.5 text-sm font-medium text-white/60">
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">FAQs</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Cancellation Policy</Link>
              </li>
              <li>
                <Link href="#" className="hover:text-brand-orange transition-colors">Travel Insurance</Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Us */}
          <div className="flex flex-col gap-6">
            <h4 className="font-serif font-black text-lg border-l-4 border-brand-orange pl-3">
              Contact Us
            </h4>

            <div className="flex flex-col gap-4 text-sm font-medium text-white/60">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <a href="tel:+911145678900" className="hover:text-brand-orange transition-colors">
                  +91 11 4567 8900
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <a href="mailto:info@travelora.com" className="hover:text-brand-orange transition-colors">
                  info@travelora.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
                <span>Connaught Place, New Delhi, India - 110001</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-white/40">
          <div>
            &copy; 2026 Travelora. All Rights Reserved.
          </div>
          <div>
            Designed with <span className="text-red-500">❤️</span> by Optiyex Technologies
          </div>
        </div>

      </div>
    </footer>
  );
}
