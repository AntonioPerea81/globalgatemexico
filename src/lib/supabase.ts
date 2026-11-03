import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const isServerBuild = typeof window === 'undefined';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[Supabase] Missing environment variables: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY');
}

// Prerendering never calls Supabase. Placeholders let the server renderer import
// pages safely when local build credentials are intentionally unavailable.
export const supabase = createClient(
  supabaseUrl || (isServerBuild ? 'https://prerender.invalid.supabase.co' : ''),
  supabaseAnonKey || (isServerBuild ? 'prerender-anon-key' : ''),
);
