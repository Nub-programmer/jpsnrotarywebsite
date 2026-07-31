import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../../lib/supabase';

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
      setErrorMessage("Supabase is not configured. Please verify project credentials.");
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim(),
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Invalid login credentials.');
      }

      localStorage.setItem('admin_logged_in', 'true');
      navigate('/admin/dashboard');
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMessage('Invalid login credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-slate-100">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden space-y-6">
        {/* Header */}
        <div className="bg-slate-900 text-white p-6 text-center space-y-2 border-b border-slate-800">
          <div className="w-12 h-12 bg-blue-800 text-white rounded-xl flex items-center justify-center mx-auto border border-amber-400">
            <Shield className="w-6 h-6 text-amber-400" />
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
            className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm py-3 px-4 rounded-lg shadow-xs transition disabled:opacity-50"
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
