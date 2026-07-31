import React, { useEffect, useState } from 'react';
import { Settings, Save, ShieldCheck, Database, Info } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../../lib/supabase';
import { ClubSettings } from '../../types';
import { initialClubSettings } from '../../lib/mockData';
import { Toast, ToastMessage } from '../../components/ui/Toast';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<ClubSettings>(initialClubSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) return;

    try {
      const { data } = await supabase.from('club_settings').select('*').single();
      if (data) setSettings(data);
    } catch (err) {
      console.warn("Using initial settings fallback", err);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const { isConfigured } = getSupabaseCredentials();

    try {
      if (isConfigured) {
        const { error } = await supabase
          .from('club_settings')
          .upsert([settings]);
        if (error) throw error;
      }

      setToast({
        id: Date.now().toString(),
        type: 'success',
        title: 'Settings Saved',
        message: 'Club configuration and impact metrics updated successfully.',
      });
    } catch (err: any) {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Save Failed',
        message: err.message || 'Error updating settings record.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-amber-600" /> Club Settings & Configuration
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure club name, faculty supervisor, school identity, and public impact metrics.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="bg-white rounded-xl border border-slate-200 p-6 shadow-2xs space-y-6">
        {/* Core Info */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Institutional Identity
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Club Name *
              </label>
              <input
                type="text"
                required
                value={settings.club_name}
                onChange={(e) => setSettings({ ...settings, club_name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                School Name *
              </label>
              <input
                type="text"
                required
                value={settings.school_name}
                onChange={(e) => setSettings({ ...settings, school_name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Teacher In-Charge Name
              </label>
              <input
                type="text"
                value={settings.teacher_incharge_name || ''}
                onChange={(e) => setSettings({ ...settings, teacher_incharge_name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Current Academic Session
              </label>
              <input
                type="text"
                value={settings.current_session}
                onChange={(e) => setSettings({ ...settings, current_session: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                President Name (Stored in DB)
              </label>
              <input
                type="text"
                value={settings.president_name || ''}
                onChange={(e) => setSettings({ ...settings, president_name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Secretary Name (Stored in DB)
              </label>
              <input
                type="text"
                value={settings.secretary_name || ''}
                onChange={(e) => setSettings({ ...settings, secretary_name: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900 flex items-center gap-2">
            <Info className="w-4 h-4 text-blue-700 shrink-0" />
            <span>Note: President and Secretary names stored here are kept hidden from public view until teacher approval.</span>
          </div>
        </div>

        {/* Contact Links */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Contact & Social Links
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Official Contact Email
              </label>
              <input
                type="email"
                value={settings.contact_email || ''}
                onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Instagram Page URL
              </label>
              <input
                type="url"
                value={settings.instagram_url || ''}
                onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Public Homepage Impact Metrics */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Homepage Public Impact Metrics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Total Projects
              </label>
              <input
                type="number"
                value={settings.total_projects}
                onChange={(e) => setSettings({ ...settings, total_projects: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Active Members
              </label>
              <input
                type="number"
                value={settings.active_members}
                onChange={(e) => setSettings({ ...settings, active_members: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Volunteer Hours
              </label>
              <input
                type="number"
                value={settings.volunteer_hours}
                onChange={(e) => setSettings({ ...settings, volunteer_hours: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                People Impacted
              </label>
              <input
                type="number"
                value={settings.people_impacted}
                onChange={(e) => setSettings({ ...settings, people_impacted: Number(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving Settings...' : 'Save Settings Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};
