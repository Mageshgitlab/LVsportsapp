import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default project URL from user's dashboard link: cqkhfskjxeghcmknvibs
export const DEFAULT_SUPABASE_URL = 'https://cqkhfskjxeghcmknvibs.supabase.co';

// Key storage key for convenience if provided via Admin Settings UI
const STORAGE_ANON_KEY = 'lv_carnival_supabase_anon_key';
const STORAGE_URL_KEY = 'lv_carnival_supabase_url';

export function getSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(STORAGE_URL_KEY);
    if (custom && custom.trim()) return custom.trim();
  }
  return import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
}

export function getSupabaseAnonKey(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(STORAGE_ANON_KEY);
    if (custom && custom.trim()) return custom.trim();
  }
  return import.meta.env.VITE_SUPABASE_ANON_KEY || '';
}

export function setSupabaseConfig(url: string, anonKey: string): void {
  if (typeof window !== 'undefined') {
    if (url) localStorage.setItem(STORAGE_URL_KEY, url.trim());
    if (anonKey) localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
    // reset cached client
    cachedClient = null;
  }
}

export function isSupabaseConfigured(): boolean {
  const key = getSupabaseAnonKey();
  return Boolean(key && key.trim().length > 10 && key !== 'your-anon-public-key-here');
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }

  if (!cachedClient) {
    const url = getSupabaseUrl();
    const key = getSupabaseAnonKey();
    try {
      cachedClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return cachedClient;
}
