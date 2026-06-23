"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, Map, CalendarDays, ImageIcon, MessageSquare, LogOut } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/tours", label: "Manage Tours", icon: Compass },
    { href: "/admin/destinations", label: "Destinations", icon: Map },
    { href: "/admin/bookings", label: "Bookings", icon: CalendarDays },
    { href: "/admin/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-brand-navy text-white flex flex-col flex-shrink-0">
        <div className="p-6">
          <Link href="/admin" className="text-2xl font-serif font-black tracking-tight flex items-center gap-2">
            <span className="text-brand-orange">Travelora</span> Admin
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-semibold ${
                  isActive
                    ? "bg-brand-orange text-white"
                    : "hover:bg-white/10 text-gray-300 hover:text-white"
                }`}
              >
                <Icon className="w-5 h-5" /> {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 mt-auto">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition-colors text-sm font-semibold text-gray-400 hover:text-white">
            <LogOut className="w-5 h-5" /> Back to Website
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}

