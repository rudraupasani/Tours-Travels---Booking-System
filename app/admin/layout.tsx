"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, Map, CalendarDays, ImageIcon, MessageSquare, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navSections = [
    {
      title: "Overview",
      items: [
        { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    {
      title: "Management",
      items: [
        { href: "/admin/tours", label: "Manage Tours", icon: Compass },
        { href: "/admin/destinations", label: "Destinations", icon: Map },
        { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
        { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
      ],
    },
    {
      title: "Inbox",
      items: [
        { href: "/admin/messages", label: "Messages", icon: MessageSquare },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50/50">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 border-r border-slate-800 text-white flex flex-col flex-shrink-0 shadow-xl">
        {/* Brand / Logo */}
        <div className="p-6 border-b border-slate-800/60">
          <Link href="/admin" className="text-2xl font-serif font-black tracking-tight flex items-center gap-2 group">
            <span className="text-brand-orange group-hover:scale-110 transition-transform duration-300">★</span>
            <span className="bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              Travelora <span className="text-brand-orange text-sm font-sans font-extrabold tracking-widest uppercase ml-1 block text-left">Admin</span>
            </span>
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-4 py-6 space-y-7 overflow-y-auto">
          {navSections.map((section, idx) => (
            <div key={idx} className="space-y-2">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 block">
                {section.title}
              </span>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-xs font-bold hover:translate-x-0.5 ${
                        isActive
                          ? "bg-gradient-to-r from-brand-orange to-amber-500 text-white shadow-md shadow-brand-orange/20 scale-[1.02]"
                          : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                      }`}
                    >
                      <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 mt-auto bg-slate-950/20">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-slate-800/60 transition-colors text-xs font-bold text-slate-400 hover:text-white"
          >
            <LogOut className="w-4 h-4 text-slate-500" /> Back to Website
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-100 flex items-center justify-between px-8 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Database Connected</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-extrabold text-brand-orange hover:text-brand-orange-hover bg-orange-50 hover:bg-orange-100/60 px-4.5 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5" /> Visit Site
            </Link>
            <div className="h-5 w-[1.5px] bg-slate-100" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-slate-900 border border-slate-800 text-white font-serif font-black text-sm rounded-xl flex items-center justify-center shadow-md">
                T
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-extrabold text-slate-800 leading-tight">Travelora Team</p>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic page content container */}
        <div className="flex-1 overflow-auto bg-slate-50/20">
          {children}
        </div>
      </div>
    </div>
  );
}

