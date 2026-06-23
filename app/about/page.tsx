import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Map, HeadphonesIcon, Sparkles, Globe, Users, Star, Heart } from "lucide-react";

const PILLARS = [
  { icon: ShieldCheck, title: "Best Price Guarantee", desc: "We promise the lowest price on all our tour packages. Find it cheaper? We'll match it." },
  { icon: Map, title: "Expert Tour Guides", desc: "Our certified local guides bring destinations to life with insider knowledge and passion." },
  { icon: HeadphonesIcon, title: "24/7 Customer Support", desc: "Round-the-clock assistance before, during, and after your trip — we're always here." },
  { icon: Sparkles, title: "Safe & Secure Travel", desc: "Your safety is our top priority. Vetted partners, insured trips, and trusted operations." },
];

const STATS = [
  { value: "10+", label: "Years Experience" },
  { value: "500+", label: "Destinations" },
  { value: "50K+", label: "Happy Travellers" },
  { value: "99%", label: "Satisfaction Rate" },
];

const TEAM = [
  { name: "Elena Rossi", role: "Founder & CEO", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop" },
  { name: "Marcus Chen", role: "Head of Operations", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=300&auto=format&fit=crop" },
  { name: "Aisha Patel", role: "Lead Tour Specialist", img: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?q=80&w=300&auto=format&fit=crop" },
  { name: "David Park", role: "Customer Experience", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop" },
];

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <div className="relative h-[60vh] min-h-[420px] flex items-end -mt-0">
        <Image
          src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1800&auto=format&fit=crop"
          alt="About Travelora hero"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 via-brand-navy/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-navy/50 to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 pt-32 w-full">
          <div className="flex items-center gap-2 text-white/60 text-sm mb-3">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">About Us</span>
          </div>
          <h1 className="font-serif font-black text-4xl sm:text-5xl text-white mb-3">About Travelora</h1>
          <p className="text-white/70 text-lg font-medium max-w-xl">Your trusted travel partner since 2015</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-brand-orange py-10">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map(({ value, label }) => (
            <div key={label}>
              <p className="text-4xl font-serif font-black text-white">{value}</p>
              <p className="text-white/80 text-sm font-semibold mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 space-y-24">

        {/* Who We Are */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Who We Are</span>
            <h2 className="font-serif font-black text-4xl text-brand-navy mt-2 mb-5 leading-snug">Crafting Unforgettable Travel Experiences</h2>
            <p className="text-gray-600 font-medium leading-relaxed mb-4">
              Travelora is a leading travel company that specialises in planning unforgettable travel experiences. We believe in creating journeys that go beyond the ordinary — immersive, personalised, and transformative.
            </p>
            <p className="text-gray-600 font-medium leading-relaxed mb-8">
              Founded in 2015, we've grown from a small team of passionate travellers to a globally recognised brand trusted by over 50,000 happy travellers across 500+ destinations worldwide.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/tours" className="bg-brand-orange hover:bg-brand-orange-hover text-white font-bold px-6 py-3 rounded-full shadow-md transition-all">
                Explore Tours
              </Link>
              <Link href="/contact" className="border border-gray-200 text-brand-navy hover:border-brand-orange hover:text-brand-orange font-bold px-6 py-3 rounded-full transition-all">
                Get in Touch
              </Link>
            </div>
          </div>
          <div className="relative h-80 lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl">
            <Image src="https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=800&auto=format&fit=crop" alt="Travellers exploring a destination" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            <div className="absolute bottom-5 left-5 right-5 bg-white/90 backdrop-blur-sm rounded-2xl p-4 flex items-center gap-3 shadow-lg">
              <div className="flex -space-x-3">
                {["F", "M", "A"].map((l, i) => (
                  <div key={i} className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-orange to-amber-300 border-2 border-white flex items-center justify-center text-white text-xs font-black">{l}</div>
                ))}
              </div>
              <div>
                <p className="font-black text-brand-navy text-sm">50,000+ Travellers</p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />)}
                  <span className="text-xs text-gray-500 font-semibold ml-1">4.9 avg rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Why Choose Us */}
        <div>
          <div className="text-center mb-12">
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="font-serif font-black text-4xl text-brand-navy mt-2">What Makes Us Different</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PILLARS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-center">
                <div className="w-14 h-14 bg-orange-50 group-hover:bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-4 transition-colors duration-300">
                  <Icon className="w-7 h-7 text-brand-orange group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-serif font-black text-brand-navy text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="relative h-72 lg:h-[400px] rounded-3xl overflow-hidden shadow-2xl order-2 lg:order-1">
            <Image src="https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=800&auto=format&fit=crop" alt="Our mission" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div className="order-1 lg:order-2">
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Our Mission</span>
            <h2 className="font-serif font-black text-4xl text-brand-navy mt-2 mb-5 leading-snug">To Inspire People to Explore the World</h2>
            <p className="text-gray-600 font-medium leading-relaxed mb-4">
              We believe travel has the power to transform lives. Our mission is to make world-class travel accessible to everyone — with carefully crafted itineraries, expert guidance, and unbeatable value.
            </p>
            <div className="space-y-3">
              {["Sustainable & responsible tourism practices", "Authentic local cultural experiences", "Transparent, no-hidden-fees pricing", "Supporting local communities worldwide"].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-2.5 h-2.5 text-green-600" />
                  </div>
                  <span className="text-sm font-semibold text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-12">
            <span className="text-brand-orange font-bold text-sm uppercase tracking-widest">Our Team</span>
            <h2 className="font-serif font-black text-4xl text-brand-navy mt-2">The People Behind Travelora</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map(({ name, role, img }) => (
              <div key={name} className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-center">
                <div className="relative h-52 overflow-hidden">
                  <Image src={img} alt={name} fill sizes="300px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <p className="font-serif font-black text-brand-navy text-lg">{name}</p>
                  <p className="text-brand-orange text-sm font-semibold">{role}</p>
                  <div className="flex justify-center gap-3 mt-3">
                    {[Globe, Users].map((Icon, i) => (
                      <button key={i} className="w-8 h-8 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:border-brand-orange hover:text-brand-orange transition-colors">
                        <Icon className="w-3.5 h-3.5" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
