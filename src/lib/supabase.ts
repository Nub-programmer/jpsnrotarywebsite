import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment or localStorage overrides
export const getSupabaseCredentials = () => {
  const metaEnv = (import.meta as any).env || {};
  const envUrl = metaEnv.VITE_SUPABASE_URL || '';
  const envKey = metaEnv.VITE_SUPABASE_ANON_KEY || '';

  const localUrl = typeof localStorage !== 'undefined' ? localStorage.getItem('supabase_url') || '' : '';
  const localKey = typeof localStorage !== 'undefined' ? localStorage.getItem('supabase_anon_key') || '' : '';

  const url = envUrl || localUrl;
  const key = envKey || localKey;

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

export interface AdminAccessResult {
  hasAccess: boolean;
  user: any | null;
  profile: any | null;
  error?: string;
}

export const checkAdminAccess = async (): Promise<AdminAccessResult> => {
  const { url, key, isConfigured } = getSupabaseCredentials();

  if (import.meta.env.DEV) {
    console.log('[DEBUG] Supabase URL exists:', Boolean(url));
    console.log('[DEBUG] Supabase Key exists:', Boolean(key));
  }

  if (!isConfigured) {
    return {
      hasAccess: false,
      user: null,
      profile: null,
      error: 'Unable to connect to authentication service. Please check environment variables.',
    };
  }

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (import.meta.env.DEV) {
      console.log('[DEBUG] Auth user ID:', user?.id, 'Error:', authError?.message);
    }

    if (authError || !user) {
      return {
        hasAccess: false,
        user: null,
        profile: null,
        error: 'Not authenticated',
      };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('auth_user_id', user.id)
      .eq('role', 'teacher_super_admin')
      .eq('is_active', true)
      .single();

    if (import.meta.env.DEV) {
      console.log('[DEBUG] Profile query result:', profile, 'Error:', profileError?.message);
    }

    if (profileError || !profile) {
      return {
        hasAccess: false,
        user,
        profile: null,
        error: 'Access denied. This account is not approved for admin access.',
      };
    }

    return {
      hasAccess: true,
      user,
      profile,
    };
  } catch (err: any) {
    if (import.meta.env.DEV) {
      console.log('[DEBUG] checkAdminAccess exception:', err);
    }
    return {
      hasAccess: false,
      user: null,
      profile: null,
      error: 'Unable to connect to authentication service. Please check environment variables.',
    };
  }
};
