import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    detectSessionInUrl: true
  }
});

export const TABLES = {
  PROFILES: 'profiles',
  LISTINGS: 'listings',
  DONATIONS: 'donation_history'
};

export const STORAGE_BUCKETS = {
  LISTING_PHOTOS: 'listing-photos'
};
