"use client";

import { useState, useEffect, use, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getTourById, Tour, Review, getReviewsByTourId, createReview } from "@/lib/data";
import {
  Star, Clock, Users, MapPin, Heart, ArrowRight,
  ChevronLeft, ChevronRight, Check, ChevronDown,
  Wifi, Car, Utensils, Camera, Calendar,
} from "lucide-react";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function TourDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Overview");
  const [openDay, setOpenDay] = useState<number | null>(1);
  const [guests, setGuests] = useState(1);
  const [date, setDate] = useState("");
  const [wishlisted, setWishlisted] = useState(false);

  // Reviews states
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // Submit Review states
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewText, setNewReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState("");
  const [reviewError, setReviewError] = useState("");

  useEffect(() => {
    async function load() {
      const data = await getTourById(id);
      setTour(data);
      if (data) {
        const revs = await getReviewsByTourId(id);
        setReviews(revs);
      }
      setLoading(false);
      setLoadingReviews(false);
    }
    load();
  }, [id]);

  const totalReviewsCount = reviews.length;

  const reviewBreakdown = useMemo(() => {
    if (totalReviewsCount === 0) {
      return [
        { label: "Excellent", pct: 0 },
        { label: "Good", pct: 0 },
        { label: "Average", pct: 0 },
        { label: "Poor", pct: 0 },
      ];
    }
    let excellent = 0;
    let good = 0;
    let average = 0;
    let poor = 0;

    reviews.forEach((r) => {
      if (r.rating === 5) excellent++;
      else if (r.rating === 4) good++;
      else if (r.rating === 3 || r.rating === 2) average++;
      else poor++;
    });

    return [
      { label: "Excellent", pct: Math.round((excellent / totalReviewsCount) * 100) },
      { label: "Good", pct: Math.round((good / totalReviewsCount) * 100) },
      { label: "Average", pct: Math.round((average / totalReviewsCount) * 100) },
      { label: "Poor", pct: Math.round((poor / totalReviewsCount) * 100) },
    ];
  }, [reviews, totalReviewsCount]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewText.trim()) {
      setReviewError("Please fill in all fields.");
      return;
    }
    setSubmittingReview(true);
    setReviewError("");
    setReviewSuccess("");

    try {
      const added = await createReview({
        tour_id: id,
        user_name: newReviewName,
        rating: newReviewRating,
        text: newReviewText,
      });

      if (added) {
        setReviewSuccess("Review submitted successfully!");
        setNewReviewName("");
        setNewReviewText("");
        setNewReviewRating(5);

        // Reload reviews and tour metadata
        const updatedTour = await getTourById(id);
        if (updatedTour) setTour(updatedTour);

        const revs = await getReviewsByTourId(id);
        setReviews(revs);
      } else {
        setReviewError("Failed to submit review. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setReviewError("An error occurred. Please try again.");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!tour) notFound();

  const tabs = ["Overview", "Highlights", "Itinerary", "Reviews"];
  const discount = Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100);

  // Fallback to the main tour image if there are no images in the array
  const tourImages = (tour.images && tour.images.length > 0) ? tour.images : [tour.image];

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navbar />

      {/* Breadcrumb */}
      <div className="bg-brand-navy/5 border-b border-gray-100 pt-5 pb-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
            <span>/</span>
            <Link href="/tours" className="hover:text-brand-orange transition-colors">Tours</Link>
            <span>/</span>
            <span className="text-brand-navy font-semibold">{tour.title}</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── Left Column ── */}
          <div className="flex-1 min-w-0">

            {/* Image Gallery */}
            <div className="relative rounded-3xl overflow-hidden mb-3 h-72 sm:h-96 shadow-lg bg-gray-100">
              {tourImages[activeImage] && (
                <Image src={tourImages[activeImage]} alt={tour.title} fill sizes="(max-width: 1024px) 100vw, 700px" className="object-cover transition-opacity duration-300" priority />
              )}
              {tour.badge && (
                <span className="absolute top-4 left-4 bg-brand-orange text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-md">{tour.badge}</span>
              )}
              <span className="absolute top-4 right-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{discount}% OFF</span>
              {tourImages.length > 1 && (
                <>
                  <button onClick={() => setActiveImage((p) => (p - 1 + tourImages.length) % tourImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronLeft className="w-5 h-5 text-brand-navy" />
                  </button>
                  <button onClick={() => setActiveImage((p) => (p + 1) % tourImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow hover:bg-white transition-colors">
                    <ChevronRight className="w-5 h-5 text-brand-navy" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail strip */}
            {tourImages.length > 1 && (
              <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
                {tourImages.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={`relative flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === activeImage ? "border-brand-orange scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}>
                    <Image src={img} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Meta */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-brand-orange" />
                  <span className="text-sm font-semibold text-brand-orange">{tour?.destination}, {tour?.country}</span>
                </div>
                <h1 className="font-serif font-black text-3xl text-brand-navy leading-tight">{tour.title}</h1>
              </div>
              <button onClick={() => setWishlisted(!wishlisted)}
                className={`flex-shrink-0 flex items-center gap-2 border rounded-full px-4 py-2 text-sm font-semibold transition-all ${wishlisted ? "border-red-400 text-red-500 bg-red-50" : "border-gray-200 text-gray-600 hover:border-red-400 hover:text-red-500"}`}>
                <Heart className={`w-4 h-4 ${wishlisted ? "fill-red-500" : ""}`} /> {wishlisted ? "Wishlisted" : "Wishlist"}
              </button>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Star, label: "Rating", value: `${tour.rating} (${tour.reviews} reviews)`, color: "text-amber-500" },
                { icon: Clock, label: "Duration", value: tour.duration, color: "text-blue-500" },
                { icon: Users, label: "Group Size", value: `Max ${tour.groupSize} people`, color: "text-purple-500" },
                { icon: MapPin, label: "Destination", value: `${tour.destination}, ${tour.country}`, color: "text-brand-orange" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                  <Icon className={`w-5 h-5 mb-2 ${color}`} />
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-brand-navy leading-snug">{value}</p>
                </div>
              ))}
            </div>

            {/* Tour Dates Banner — shown only if admin has set start/end date */}
            {(tour.tourStartDate || tour.tourEndDate) && (
              <div className="flex items-center gap-4 bg-gradient-to-r from-brand-navy to-blue-900 rounded-2xl p-5 mb-8 text-white">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-6 h-6 text-brand-orange" />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-black uppercase tracking-widest text-white/50 mb-1">Tour Availability</p>
                  <div className="flex flex-wrap items-center gap-3">
                    {tour.tourStartDate && (
                      <div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Starts</span>
                        <span className="font-black text-white text-base">
                          {new Date(tour.tourStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                    )}
                    {tour.tourStartDate && tour.tourEndDate && (
                      <div className="w-8 h-0.5 bg-brand-orange rounded hidden sm:block" />
                    )}
                    {tour.tourEndDate && (
                      <div>
                        <span className="text-[10px] font-bold text-white/40 uppercase tracking-wider block">Ends</span>
                        <span className="font-black text-white text-base">
                          {new Date(tour.tourEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border-b border-gray-200 mb-8">
              <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`pb-3 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${activeTab === tab ? "border-brand-orange text-brand-orange" : "border-transparent text-gray-500 hover:text-brand-navy"}`}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {activeTab === "Overview" && (
              <div className="space-y-6">
                <p className="text-gray-600 leading-relaxed font-medium">
                  Experience the beauty of {tour.destination} with our expertly crafted {tour.duration} tour package.
                  Visit iconic landmarks, immerse yourself in local culture, and create memories that will last a lifetime.
                  With a small group of up to {tour.groupSize} travellers, enjoy a truly personalised experience.
                </p>
                <div>
                  <h3 className="font-serif font-black text-xl text-brand-navy mb-4">What's Included</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {tour.includes.map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-green-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "Highlights" && (
              <ul className="space-y-4">
                {tour.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-4 p-4 bg-gradient-to-r from-orange-50 to-transparent rounded-2xl border-l-4 border-brand-orange">
                    <span className="w-7 h-7 bg-brand-orange text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{i + 1}</span>
                    <span className="text-sm font-semibold text-gray-700 leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "Itinerary" && (
              <div className="space-y-3">
                {tour.itinerary.map((day) => (
                  <div key={day.day} className="border border-gray-200 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setOpenDay(openDay === day.day ? null : day.day)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className="w-10 h-10 bg-brand-orange text-white rounded-full flex items-center justify-center text-sm font-black flex-shrink-0">D{day.day}</span>
                        <span className="font-bold text-brand-navy">{day.title}</span>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openDay === day.day ? "rotate-180" : ""}`} />
                    </button>
                    {openDay === day.day && (
                      <div className="px-5 pb-5 border-t border-gray-100">
                        <p className="text-sm text-gray-600 leading-relaxed font-medium pt-4">{day.description}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "Reviews" && (
              <div className="space-y-5">
                <div className="flex items-center gap-6 p-6 bg-brand-navy rounded-2xl text-white">
                  <div className="text-center">
                    <p className="text-6xl font-black font-serif">{tour.rating}</p>
                    <div className="flex items-center justify-center gap-0.5 my-1">
                      {[1, 2, 3, 4, 5].map((s) => <Star key={s} className={`w-4 h-4 ${s <= Math.round(tour.rating) ? "fill-amber-400 text-amber-400" : "text-white/30"}`} />)}
                    </div>
                    <p className="text-white/60 text-xs font-semibold">{tour.reviews} Reviews</p>
                  </div>
                  <div className="flex-1 space-y-2">
                    {reviewBreakdown.map(({ label, pct }) => (
                      <div key={label} className="flex items-center gap-3 text-sm">
                        <span className="w-16 text-white/60 font-medium text-xs">{label}</span>
                        <div className="flex-1 h-2 bg-white/20 rounded-full overflow-hidden">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-white/60 text-xs w-8">{pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* List of Reviews */}
                {loadingReviews ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto" />
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-8 bg-gray-50 border border-gray-100/50 rounded-2xl">
                    <p className="text-gray-400 font-semibold text-sm">No reviews yet. Be the first to share your experience!</p>
                  </div>
                ) : (
                  reviews.map((r) => (
                    <div key={r.id} className="p-5 border border-gray-100 rounded-2xl">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-brand-orange to-amber-300 rounded-full flex items-center justify-center text-white font-black text-sm">
                          {r.user_name ? r.user_name[0].toUpperCase() : "A"}
                        </div>
                        <div>
                          <p className="font-bold text-brand-navy text-sm">{r.user_name}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(r.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <div className="ml-auto flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 font-medium leading-relaxed">{r.text}</p>
                    </div>
                  ))
                )}

                {/* Write a Review Form */}
                <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 mt-8">
                  <h3 className="font-serif font-black text-xl text-brand-navy mb-4">Write a Review</h3>

                  {reviewSuccess && (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm font-semibold mb-4">
                      {reviewSuccess}
                    </div>
                  )}
                  {reviewError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-semibold mb-4">
                      {reviewError}
                    </div>
                  )}

                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Name</label>
                      <input
                        type="text"
                        value={newReviewName}
                        onChange={(e) => setNewReviewName(e.target.value)}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange"
                        placeholder="e.g. Rudra Upasani"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rating</label>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setNewReviewRating(star)}
                            className="text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`w-6 h-6 ${star <= newReviewRating ? "fill-amber-400 text-amber-400" : "text-gray-300"
                                }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Review Comment</label>
                      <textarea
                        value={newReviewText}
                        onChange={(e) => setNewReviewText(e.target.value)}
                        rows={4}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-semibold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-orange/30 focus:border-brand-orange resize-none"
                        placeholder="Share your experience with this tour..."
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingReview}
                      className="bg-brand-orange hover:bg-brand-orange-hover disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all shadow hover:shadow-lg text-sm flex items-center gap-2 cursor-pointer"
                    >
                      {submittingReview ? "Submitting..." : "Submit Review"}
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>

          {/* ── Sticky Booking Sidebar ── */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-24 bg-white rounded-3xl  border border-gray-100 overflow-hidden">
              <div className="bg-brand-navy p-6 text-white">
                <p className="text-white/60 text-sm font-medium mb-1">Starting from</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-black font-serif">{formatINR(tour.price)}</span>
                  <span className="text-white/50 line-through text-lg mb-1">{formatINR(tour.originalPrice)}</span>
                </div>
                <p className="text-white/60 text-xs mt-1">per person · all inclusive</p>
                <span className="inline-block mt-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">Save {formatINR(tour.originalPrice - tour.price)}</span>
              </div>
              <div className="p-6 space-y-4">
                {/* Tour dates display */}
                {(tour.tourStartDate || tour.tourEndDate) ? (
                  <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Calendar className="w-4 h-4 text-brand-orange" />
                      <span className="text-xs font-black text-brand-orange uppercase tracking-wider">Tour Dates</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Start Date</p>
                        <p className="font-black text-brand-navy text-sm">
                          {tour.tourStartDate
                            ? new Date(tour.tourStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">End Date</p>
                        <p className="font-black text-brand-navy text-sm">
                          {tour.tourEndDate
                            ? new Date(tour.tourEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                    <Calendar className="w-5 h-5 text-gray-300 mx-auto mb-1" />
                    <p className="text-xs text-gray-400 font-semibold">Dates to be announced</p>
                  </div>
                )}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Guests</label>
                  <div className="flex items-center gap-3">
                    <button onClick={() => setGuests(Math.max(1, guests - 1))} className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-colors font-bold text-lg">−</button>
                    <span className="font-black text-brand-navy text-lg w-8 text-center">{guests}</span>
                    <button onClick={() => setGuests(Math.min(tour.groupSize, guests + 1))} className="w-9 h-9 border border-gray-200 rounded-full flex items-center justify-center hover:border-brand-orange hover:text-brand-orange transition-colors font-bold text-lg">+</button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between text-gray-600 font-medium"><span>{formatINR(tour.price)} × {guests} guests</span><span>{formatINR(tour.price * guests)}</span></div>
                  <div className="flex justify-between text-gray-600 font-medium"><span>Taxes & fees</span><span>{formatINR(Math.round(tour.price * guests * 0.1))}</span></div>
                  <div className="flex justify-between font-black text-brand-navy border-t border-gray-200 pt-2 mt-2">
                    <span>Total</span><span>{formatINR(tour.price * guests + Math.round(tour.price * guests * 0.1))}</span>
                  </div>
                </div>
                <Link href="/booking" className="w-full bg-brand-orange hover:bg-brand-orange-hover text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg">
                  Book Now <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-xs text-gray-400 font-medium">Free cancellation up to 7 days before departure</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
