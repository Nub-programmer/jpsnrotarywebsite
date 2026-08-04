import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../../lib/supabase';
import { InteractLogo } from '../../components/ui/InteractLogo';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();
  const { isConfigured } = getSupabaseCredentials();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!isConfigured) {
      setErrorMessage("Unable to connect to authentication service. Please check environment variables.");
      setLoading(false);
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (authError) {
        if (import.meta.env.DEV) {
          console.log('[DEBUG] Auth signIn error:', authError);
        }
        if (
          authError.message?.toLowerCase().includes('fetch') ||
          authError.message?.toLowerCase().includes('network') ||
          authError.status === 0
        ) {
          setErrorMessage("Unable to connect to authentication service. Please check environment variables.");
        } else {
          setErrorMessage("Invalid login credentials.");
        }
        setLoading(false);
        return;
      }

      if (!data?.user) {
        setErrorMessage("Invalid login credentials.");
        setLoading(false);
        return;
      }

      if (import.meta.env.DEV) {
        console.log('[DEBUG] Auth user ID after login:', data.user.id);
      }

      // Query profiles table for role and active status
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', data.user.id)
        .eq('role', 'teacher_super_admin')
        .eq('is_active', true)
        .single();

      if (import.meta.env.DEV) {
        console.log('[DEBUG] Profile query result:', profile);
        console.log('[DEBUG] Profile query error:', profileError);
      }

      if (profileError || !profile) {
        await supabase.auth.signOut();
        setErrorMessage("Access denied. This account is not approved for admin access.");
        setLoading(false);
        return;
      }

      // Success! Profile check passed
      navigate('/admin/dashboard', { replace: true });
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.log('[DEBUG] Login exception:', err);
      }
      setErrorMessage("Unable to connect to authentication service. Please check environment variables.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-100">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden space-y-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 text-center space-y-2 border-b border-slate-800">
          <div className="flex justify-center">
            <InteractLogo size="lg" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight">Faculty & Admin Portal</h1>
          <p className="text-xs text-slate-400">
            Interact Club of JPS Noida &bull; Secure Access
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Website
          </Link>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@jpsnoida.edu.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm py-3 px-4 rounded-lg shadow-xs transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Authenticating Admin...' : 'Sign In'}
          </button>

          <div className="pt-2 text-[11px] text-slate-400 text-center leading-relaxed">
            Access is restricted to approved club administrators.
          </div>
        </form>
      </div>
    </div>
  );
};
