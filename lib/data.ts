import { supabase } from "./supabase";

export interface Tour {
  id: string;
  title: string;
  destination?: string;
  destination_id?: string;
  country: string;
  image: string;
  images: string[];
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  duration: string;
  days: number;
  nights: number;
  type: string[];
  groupSize: number;
  highlights: string[];
  itinerary: { day: number; title: string; description: string }[];
  includes: string[];
  badge?: string;
  isPopular?: boolean;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  is_top_destination?: boolean;
  isTopDestination?: boolean;
}

export interface Booking {
  id: string;
  tour_id: string;
  user_id?: string;
  start_date: string;
  end_date: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed";
  amount: number;
  travellers: number;
  tour?: Tour;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  location: string;
  category: string;
}

function mapTour(row: any): Tour {
  return {
    ...row,
    originalPrice: row.original_price ?? row.originalPrice ?? 0,
    groupSize: row.group_size ?? row.groupSize ?? 0,
    isPopular: row.is_popular ?? row.isPopular ?? false,
  };
}

// ─── Tours ────────────────────────────────────────────────────────────────────

export async function getTours(): Promise<Tour[]> {
  const { data, error } = await supabase.from("tours").select("*");
  if (error) { console.error("Error fetching tours:", error); return []; }
  return data.map(mapTour);
}

export async function getTourById(id: string): Promise<Tour | null> {
  const { data, error } = await supabase.from("tours").select("*").eq("id", id).single();
  if (error) { console.error("Error fetching tour:", error); return null; }
  return mapTour(data);
}

export async function getPopularTours(): Promise<Tour[]> {
  const { data, error } = await supabase.from("tours").select("*").eq("is_popular", true).limit(4);
  if (error) { console.error("Error fetching popular tours:", error); return []; }
  return data.map(mapTour);
}

// ─── Destinations ──────────────────────────────────────────────────────────────

export async function getDestinations(): Promise<Destination[]> {
  const { data, error } = await supabase.from("destinations").select("*");
  if (error) { console.error("Error fetching destinations:", error); return []; }
  return data as Destination[];
}

export async function getTopDestinations(): Promise<Destination[]> {
  const { data, error } = await supabase.from("destinations").select("*").eq("is_top_destination", true).limit(5);
  if (error) { console.error("Error fetching top destinations:", error); return []; }
  return data as Destination[];
}

// ─── Gallery ───────────────────────────────────────────────────────────────────

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase.from("gallery_images").select("*").limit(5);
  if (error) { console.error("Error fetching gallery images:", error); return []; }
  return data as GalleryImage[];
}

// ─── Bookings ──────────────────────────────────────────────────────────────────

export async function getBookings(): Promise<Booking[]> {
  const { data, error } = await supabase.from("bookings").select("*, tour:tours(*)");
  if (error) { console.error("Error fetching bookings:", error); return []; }
  return data as Booking[];
}

// ─── Admin Stats (computed from real DB) ──────────────────────────────────────

export async function getAdminStats() {
  const [toursRes, bookingsRes, avgRatingRes] = await Promise.all([
    supabase.from("tours").select("*", { count: "exact", head: true }),
    supabase.from("bookings").select("amount"),
    supabase.from("tours").select("rating"),
  ]);

  const totalRevenue = bookingsRes.data?.reduce((sum, b) => sum + (b.amount || 0), 0) ?? 0;
  const ratings = avgRatingRes.data?.map((r) => r.rating).filter(Boolean) ?? [];
  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "0.0";

  return {
    revenue: totalRevenue,
    totalTours: toursRes.count ?? 0,
    totalBookings: bookingsRes.data?.length ?? 0,
    avgRating,
  };
}

export async function getRevenueByMonth() {
  const { data, error } = await supabase.from("bookings").select("amount, created_at");
  if (error || !data) return [];

  const months: Record<string, number> = {};
  data.forEach((b) => {
    const d = new Date(b.created_at);
    const key = d.toLocaleString("default", { month: "short" });
    months[key] = (months[key] || 0) + b.amount;
  });

  return Object.entries(months).map(([month, value]) => ({ month, value }));
}

export async function getTopBookedDestinations() {
  const { data, error } = await supabase
    .from("bookings")
    .select("tour:tours(destination, country)");
  if (error || !data) return [];

  const counts: Record<string, number> = {};
  data.forEach((b: any) => {
    const name = b.tour?.destination || b.tour?.country || "Unknown";
    counts[name] = (counts[name] || 0) + 1;
  });

  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, bookings]) => ({
      name,
      bookings,
      percentage: Math.round((bookings / total) * 100),
    }));
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) { console.error("Error fetching contact messages:", error); return []; }
  return data as ContactMessage[];
}

export async function createContactMessage(msg: { name: string; email: string; subject: string; message: string }) {
  const { error } = await supabase.from("contact_messages").insert(msg);
  if (error) { console.error("Error creating contact message:", error); return false; }
  return true;
}

export async function markMessageRead(id: string, isRead: boolean) {
  const { error } = await supabase.from("contact_messages").update({ is_read: isRead }).eq("id", id);
  if (error) { console.error("Error updating message:", error); return false; }
  return true;
}

export async function deleteContactMessage(id: string) {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) { console.error("Error deleting message:", error); return false; }
  return true;
}

export async function getUnreadMessageCount(): Promise<number> {
  const { count, error } = await supabase
    .from("contact_messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false);
  if (error) return 0;
  return count ?? 0;
}

// ─── Tour CRUD ────────────────────────────────────────────────────────────────

export async function createTour(tour: Omit<Tour, "id">) {
  const row = {
    title: tour.title,
    destination_id: tour.destination_id || null,
    country: tour.country,
    image: tour.image,
    images: tour.images || [],
    price: tour.price,
    original_price: tour.originalPrice,
    rating: tour.rating || 0,
    reviews: tour.reviews || 0,
    duration: tour.duration,
    days: tour.days,
    nights: tour.nights,
    type: tour.type || [],
    group_size: tour.groupSize,
    badge: tour.badge || null,
    highlights: tour.highlights || [],
    itinerary: tour.itinerary || [],
    includes: tour.includes || [],
    is_popular: tour.isPopular || false,
  };
  const { data, error } = await supabase.from("tours").insert(row).select().single();
  if (error) { console.error("Error creating tour:", error); return null; }
  return mapTour(data);
}

export async function updateTour(id: string, tour: Partial<Tour>) {
  const row: any = {};
  if (tour.title !== undefined) row.title = tour.title;
  if (tour.destination_id !== undefined) row.destination_id = tour.destination_id;
  if (tour.country !== undefined) row.country = tour.country;
  if (tour.image !== undefined) row.image = tour.image;
  if (tour.images !== undefined) row.images = tour.images;
  if (tour.price !== undefined) row.price = tour.price;
  if (tour.originalPrice !== undefined) row.original_price = tour.originalPrice;
  if (tour.rating !== undefined) row.rating = tour.rating;
  if (tour.reviews !== undefined) row.reviews = tour.reviews;
  if (tour.duration !== undefined) row.duration = tour.duration;
  if (tour.days !== undefined) row.days = tour.days;
  if (tour.nights !== undefined) row.nights = tour.nights;
  if (tour.type !== undefined) row.type = tour.type;
  if (tour.groupSize !== undefined) row.group_size = tour.groupSize;
  if (tour.badge !== undefined) row.badge = tour.badge;
  if (tour.highlights !== undefined) row.highlights = tour.highlights;
  if (tour.itinerary !== undefined) row.itinerary = tour.itinerary;
  if (tour.includes !== undefined) row.includes = tour.includes;
  if (tour.isPopular !== undefined) row.is_popular = tour.isPopular;

  const { data, error } = await supabase.from("tours").update(row).eq("id", id).select().single();
  if (error) { console.error("Error updating tour:", error); return null; }
  return mapTour(data);
}

export async function deleteTour(id: string) {
  const { error } = await supabase.from("tours").delete().eq("id", id);
  if (error) { console.error("Error deleting tour:", error); return false; }
  return true;
}

// ─── Destination CRUD ─────────────────────────────────────────────────────────

export async function createDestination(dest: { name: string; country: string; image: string; is_top_destination?: boolean }) {
  const { data, error } = await supabase.from("destinations").insert(dest).select().single();
  if (error) { console.error("Error creating destination:", error); return null; }
  return data as Destination;
}

export async function updateDestination(id: string, dest: Partial<{ name: string; country: string; image: string; is_top_destination: boolean }>) {
  const { data, error } = await supabase.from("destinations").update(dest).eq("id", id).select().single();
  if (error) { console.error("Error updating destination:", error); return null; }
  return data as Destination;
}

export async function deleteDestination(id: string) {
  const { error } = await supabase.from("destinations").delete().eq("id", id);
  if (error) { console.error("Error deleting destination:", error); return false; }
  return true;
}

// ─── Booking CRUD ─────────────────────────────────────────────────────────────

export async function createBooking(booking: {
  tour_id: string;
  start_date: string;
  end_date: string;
  amount: number;
  travellers: number;
  status?: string;
}) {
  const { data, error } = await supabase
    .from("bookings")
    .insert({ ...booking, status: booking.status || "Confirmed" })
    .select()
    .single();
  if (error) { console.error("Error creating booking:", error); return null; }
  return data as Booking;
}

export async function updateBookingStatus(id: string, status: string) {
  const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
  if (error) { console.error("Error updating booking status:", error); return false; }
  return true;
}

export async function deleteBooking(id: string) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) { console.error("Error deleting booking:", error); return false; }
  return true;
}

// ─── Gallery CRUD ─────────────────────────────────────────────────────────────

export async function getGalleryImagesAll(): Promise<GalleryImage[]> {
  const { data, error } = await supabase.from("gallery_images").select("*").order("created_at", { ascending: false });
  if (error) { console.error("Error fetching gallery images:", error); return []; }
  return data as GalleryImage[];
}

export async function createGalleryImage(img: { src: string; alt: string; location: string; category: string }) {
  const { data, error } = await supabase.from("gallery_images").insert(img).select().single();
  if (error) { console.error("Error creating gallery image:", error); return null; }
  return data as GalleryImage;
}

export async function deleteGalleryImage(id: string) {
  const { error } = await supabase.from("gallery_images").delete().eq("id", id);
  if (error) { console.error("Error deleting gallery image:", error); return false; }
  return true;
}

export async function uploadGalleryFile(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from("gallery")
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error("Error uploading file to storage bucket:", error);
    return null;
  }

  const { data: { publicUrl } } = supabase.storage
    .from("gallery")
    .getPublicUrl(filePath);

  return publicUrl;
}


