import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import PopularPackages from "@/components/PopularPackages";
import TopDestinations from "@/components/TopDestinations";
import WhyChooseUs from "@/components/WhyChooseUs";
import TestimonialsAndOffers from "@/components/TestimonialsAndOffers";
import TravelGallery from "@/components/TravelGallery";
import Brands from "@/components/Brands";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation bar overlay */}
      <Navbar />

      {/* Top Banner and Search filters */}
      <Hero />

      {/* Main sections layout */}
      <main className="flex-1">
        <PopularPackages />
        <TopDestinations />
        <WhyChooseUs />
        <TestimonialsAndOffers />
        <TravelGallery />
        <Newsletter />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
