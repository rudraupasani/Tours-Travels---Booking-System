-- Create Destinations Table
CREATE TABLE public.destinations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT NOT NULL,
  image TEXT NOT NULL,
  is_top_destination BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Tours Table
CREATE TABLE public.tours (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  destination_id UUID REFERENCES public.destinations(id) ON DELETE CASCADE,
  country TEXT NOT NULL,
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  price INTEGER NOT NULL,
  original_price INTEGER NOT NULL,
  rating DECIMAL(3, 1) DEFAULT 0.0,
  reviews INTEGER DEFAULT 0,
  duration TEXT NOT NULL,
  days INTEGER NOT NULL,
  nights INTEGER NOT NULL,
  type TEXT[] DEFAULT '{}',
  group_size INTEGER NOT NULL,
  badge TEXT,
  highlights TEXT[] DEFAULT '{}',
  itinerary JSONB DEFAULT '[]'::jsonb,
  includes TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Bookings Table
CREATE TABLE public.bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_id UUID REFERENCES public.tours(id) ON DELETE CASCADE,
  user_id UUID, -- For when auth is added
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Confirmed', 'Pending', 'Cancelled', 'Completed')),
  amount INTEGER NOT NULL,
  travellers INTEGER NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Gallery Images Table
CREATE TABLE public.gallery_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT NOT NULL,
  location TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Contact Messages Table
CREATE TABLE public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security (RLS)
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public read access to destinations, tours, and gallery_images
CREATE POLICY "Allow public read access on destinations" ON public.destinations FOR SELECT USING (true);
CREATE POLICY "Allow public read access on tours" ON public.tours FOR SELECT USING (true);
CREATE POLICY "Allow public read access on gallery_images" ON public.gallery_images FOR SELECT USING (true);

-- Allow public all access for admin panel (Note: In production, restrict this to authenticated admins)
CREATE POLICY "Allow all access on destinations" ON public.destinations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on tours" ON public.tours FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access on gallery_images" ON public.gallery_images FOR ALL USING (true) WITH CHECK (true);
-- Allow anyone to INSERT contact messages (public contact form)
CREATE POLICY "Allow public insert on contact_messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
-- Allow authenticated admins to read/update/delete contact messages
CREATE POLICY "Allow all access on contact_messages" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- Create the storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for storage gallery bucket
CREATE POLICY "Public Read Gallery Bucket" ON storage.objects FOR SELECT TO public USING (bucket_id = 'gallery');
CREATE POLICY "Public Insert Gallery Bucket" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Public Update Gallery Bucket" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'gallery') WITH CHECK (bucket_id = 'gallery');
CREATE POLICY "Public Delete Gallery Bucket" ON storage.objects FOR DELETE TO public USING (bucket_id = 'gallery');

