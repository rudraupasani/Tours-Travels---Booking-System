import { createClient } from "@supabase/supabase-js";

// Provide fallback values for local development before env vars are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ndacnndnujeajlcqkgla.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_uHwW3UXKmJVnuE0IyiLOjA_-UQ3fNXJ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
