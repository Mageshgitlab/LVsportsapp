import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default project URL from user's dashboard link: cqkhfskjxeghcmknvibs
export const DEFAULT_SUPABASE_URL = 'https://cqkhfskjxeghcmknvibs.supabase.co';

// Key storage keys
const STORAGE_ANON_KEY = 'lv_carnival_supabase_anon_key';
const STORAGE_URL_KEY = 'lv_carnival_supabase_url';

export function cleanSupabaseUrl(rawUrl: string): string {
  if (!rawUrl) return DEFAULT_SUPABASE_URL;
  let url = rawUrl.trim();
  // Strip trailing /rest/v1 or /rest/v1/
  url = url.replace(/\/rest\/v1\/?$/, '');
  // Strip trailing slashes
  url = url.replace(/\/+$/, '');
  // Ensure https:// if missing protocol
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }
  return url;
}

export function isSecretServiceRoleKey(key: string): boolean {
  if (!key) return false;
  try {
    const parts = key.trim().split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      return payload.role === 'service_role';
    }
  } catch {
    // not a standard JWT or cannot parse
  }
  return false;
}

export function getSupabaseUrl(): string {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(STORAGE_URL_KEY);
    if (custom && custom.trim()) return cleanSupabaseUrl(custom);
  }
  return cleanSupabaseUrl(import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL);
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
    const cleanedUrl = cleanSupabaseUrl(url);
    localStorage.setItem(STORAGE_URL_KEY, cleanedUrl);
    if (anonKey) localStorage.setItem(STORAGE_ANON_KEY, anonKey.trim());
    // reset cached client
    cachedClient = null;
  }
}

export function isSupabaseConfigured(): boolean {
  const key = getSupabaseAnonKey();
  return Boolean(key && key.trim().length > 10 && key !== 'your-anon-public-key-here' && !isSecretServiceRoleKey(key));
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
