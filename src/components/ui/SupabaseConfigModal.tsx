import React, { useState } from 'react';
import { Key, Database, Check, X, ShieldAlert, RefreshCw } from 'lucide-react';
import { getSupabaseCredentials, saveSupabaseCredentials, clearSupabaseCredentials } from '../../lib/supabase';

interface SupabaseConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseConfigModal: React.FC<SupabaseConfigModalProps> = ({ isOpen, onClose }) => {
  const { url, key, isConfigured } = getSupabaseCredentials();
  const [supabaseUrl, setSupabaseUrl] = useState(url);
  const [supabaseAnonKey, setSupabaseAnonKey] = useState(key);
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseAnonKey) return;
    saveSupabaseCredentials(supabaseUrl, supabaseAnonKey);
    setIsSaved(true);
  };

  const handleClear = () => {
    clearSupabaseCredentials();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in">
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">Supabase Connection Configuration</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 leading-relaxed">
            <p className="font-semibold mb-1 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-blue-700" /> Safe Publishable Key Usage
            </p>
            You can enter your Supabase Project URL and Anon Key here to test live database connection during evaluation. Your inputs are stored safely in local browser memory and never ask for a service role key.
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Supabase Project URL
            </label>
            <input
              type="text"
              required
              placeholder="https://xyzcompany.supabase.co"
              value={supabaseUrl}
              onChange={(e) => setSupabaseUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Supabase Anon / Publishable Key
            </label>
            <textarea
              required
              rows={3}
              placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
              value={supabaseAnonKey}
              onChange={(e) => setSupabaseAnonKey(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
            {isConfigured ? (
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-red-600 hover:text-red-700 font-medium underline flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Reset Credentials
              </button>
            ) : (
              <span className="text-xs text-slate-500 italic">Showing fallback sample mode</span>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-medium text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition flex items-center gap-1.5"
              >
                {isSaved ? <Check className="w-4 h-4" /> : <Database className="w-4 h-4" />}
                Save & Reload
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
