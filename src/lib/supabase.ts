import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment or localStorage overrides
export const getSupabaseCredentials = () => {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('supabase_url') || '' : '';
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('supabase_anon_key') || '' : '';

  const url = localUrl || envUrl;
  const key = localKey || envKey;

  return { url, key, isConfigured: Boolean(url && key) };
};

const { url, key, isConfigured } = getSupabaseCredentials();

// Default fallback client or live client
export const supabase: SupabaseClient = isConfigured
  ? createClient(url, key)
  : createClient(
      url || 'https://placeholder-project.supabase.co',
      key || 'placeholder-anon-key'
    );

export const saveSupabaseCredentials = (supabaseUrl: string, supabaseAnonKey: string) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem('supabase_url', supabaseUrl.trim());
    localStorage.setItem('supabase_anon_key', supabaseAnonKey.trim());
    window.location.reload();
  }
};

export const clearSupabaseCredentials = () => {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('supabase_url');
    localStorage.removeItem('supabase_anon_key');
    window.location.reload();
  }
};
