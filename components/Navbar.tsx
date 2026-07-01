"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Heart, Menu, X, User, BookOpen, Settings, LogOut, ChevronDown, LogIn, UserPlus } from "lucide-react";
import { useWishlist } from "@/components/WishlistProvider";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === "/";
  const { wishlist } = useWishlist();
  const { user, loading, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      if (user) {
        const { data } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single();
        setIsAdmin(!!data?.is_admin);
      } else {
        setIsAdmin(false);
      }
    }
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (!isHomePage) { setIsScrolled(true); return; }
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHomePage]);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setProfileOpen(false);
    await signOut();
    router.push("/");
  };

  const linkClass = `text-sm font-semibold transition-colors hover:text-brand-orange ${isScrolled ? "text-brand-navy" : "text-white"}`;
  const iconClass = `p-2 rounded-full transition-all ${isScrolled ? "text-brand-navy hover:bg-gray-100" : "text-white hover:bg-white/10"}`;

  // Get display name from user metadata or email
  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.charAt(0).toUpperCase();

  return (
    <nav className={`sticky top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="bg-brand-orange text-white p-2 rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 -rotate-45">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </div>
            <span className={`font-serif text-2xl font-black tracking-tight transition-colors duration-300 ${isScrolled ? "text-brand-navy" : "text-white"}`}>
              Travelora
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-7">
            <Link href="/" className={linkClass}>Home</Link>
            <Link href="/tours" className={linkClass}>Tours</Link>
            <Link href="/gallery" className={linkClass}>Gallery</Link>
            <Link href="/about" className={linkClass}>About</Link>
            <Link href="/contact" className={linkClass}>Contact</Link>
          </div>

          {/* Desktop Right Icons */}
          <div className="hidden md:flex items-center gap-1">
            {/* Wishlist */}
            <Link href="/wishlist" aria-label="Wishlist" className={`${iconClass} relative`}>
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Auth section */}
            {!loading && (
              user ? (
                /* Profile Dropdown - logged in */
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all ${isScrolled
                      ? "text-brand-navy hover:bg-gray-100"
                      : "text-white hover:bg-white/10"
                      }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-amber-300 flex items-center justify-center text-white font-black text-sm shadow-sm">
                      {initials}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                      {/* User Header */}
                      <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-brand-navy to-brand-navy/90 text-white">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-brand-orange to-amber-300 flex items-center justify-center font-black text-lg flex-shrink-0">{initials}</div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm truncate">{displayName}</p>
                          <p className="text-white/50 text-xs truncate">{user.email}</p>
                        </div>
                      </div>

                      <div className="p-2">
                        <Link href="/profile" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors">
                          <User className="w-4 h-4" /> My Profile
                        </Link>
                        <Link href="/wishlist" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors">
                          <Heart className="w-4 h-4" />
                          Wishlist
                          {wishlist.length > 0 && <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{wishlist.length}</span>}
                        </Link>
                        <Link href="/profile#bookings" onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors">
                          <BookOpen className="w-4 h-4" /> My Bookings
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 hover:bg-orange-50 hover:text-brand-orange transition-colors">
                            <Settings className="w-4 h-4" /> Admin Panel
                          </Link>
                        )}
                        <div className="border-t border-gray-100 my-2" />
                        <button onClick={handleSignOut}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Sign In / Sign Up buttons - not logged in */
                <div className="flex items-center gap-2 ml-2">
                  <Link href="/login"
                    className={`flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full border transition-all ${
                      isScrolled
                        ? "border-gray-200 text-brand-navy hover:border-brand-orange hover:text-brand-orange"
                        : "border-white/40 text-white hover:border-white hover:bg-white/10"
                    }`}>
                    <LogIn className="w-4 h-4" /> Sign In
                  </Link>
                  <Link href="/register"
                    className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-full bg-brand-orange hover:bg-brand-orange-hover text-white transition-all shadow-md hover:shadow-lg">
                    <UserPlus className="w-4 h-4" /> Sign Up
                  </Link>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href="/wishlist" aria-label="Wishlist" className={`${iconClass} relative`}>
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-gray-300 text-[10px] font-black rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            {!loading && user ? (
              <Link href="/profile" aria-label="Profile" className={iconClass}>
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-orange to-amber-300 flex items-center justify-center text-white font-black text-xs">
                  {initials}
                </div>
              </Link>
            ) : (
              <Link href="/login" aria-label="Sign In" className={iconClass}>
                <User className="w-5 h-5" />
              </Link>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className={`p-2 rounded-md transition-colors ${isScrolled ? "text-brand-navy hover:bg-gray-100" : "text-gray-300 hover:bg-white/10"}`}>
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-200 shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {[
              { href: "/", label: "Home" },
              { href: "/tours", label: "Tours" },
              { href: "/gallery", label: "Gallery" },
              { href: "/about", label: "About Us" },
              { href: "/contact", label: "Contact" },
            ].map(({ href, label }) => (
              <Link key={href} href={href} onClick={() => setIsOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-base font-semibold text-brand-navy hover:bg-gray-50 hover:text-brand-orange transition-colors">
                {label}
              </Link>
            ))}

            <div className="border-t border-gray-100 my-3 pt-3 space-y-1">
              {user ? (
                <>
                  {/* Logged in mobile menu */}
                  <div className="px-3 py-3 bg-gray-50 rounded-xl mb-2">
                    <p className="font-bold text-brand-navy text-sm">{displayName}</p>
                    <p className="text-gray-400 text-xs">{user.email}</p>
                  </div>
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold text-brand-navy hover:bg-gray-50 hover:text-brand-orange">
                    <User className="w-5 h-5 text-brand-orange" /> My Profile
                  </Link>
                  <Link href="/wishlist" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold text-brand-navy hover:bg-gray-50 hover:text-brand-orange">
                    <Heart className="w-5 h-5 text-brand-orange" /> Wishlist {wishlist.length > 0 && <span className="ml-auto bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">{wishlist.length}</span>}
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold text-brand-navy hover:bg-gray-50 hover:text-brand-orange">
                      <Settings className="w-5 h-5 text-brand-orange" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-semibold text-red-500 hover:bg-red-50">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </>
              ) : (
                /* Not logged in mobile */
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link href="/login" onClick={() => setIsOpen(false)} className="border border-gray-200 text-brand-navy hover:bg-gray-50 font-semibold py-2.5 rounded-full text-center text-sm">Sign In</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className="bg-brand-orange hover:bg-brand-orange-hover text-white font-semibold py-2.5 rounded-full text-center text-sm">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
