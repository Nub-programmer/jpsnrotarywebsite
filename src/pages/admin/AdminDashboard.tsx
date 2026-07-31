import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Image as ImageIcon,
  ShieldCheck,
  CheckCircle2,
  Folder,
  ArrowRight,
  FolderKanban,
  Calendar,
  Sparkles,
  Plus,
  AlertCircle
} from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    galleryImages: 0,
    albumsCount: 0,
    projectsCount: 0,
    eventsCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initSuccess, setInitSuccess] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    try {
      const { count: imgCount } = await supabase.from('gallery_images').select('*', { count: 'exact', head: true });
      const { count: albCount } = await supabase.from('gallery_albums').select('*', { count: 'exact', head: true });
      const { count: projCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      const { count: evtCount } = await supabase.from('events').select('*', { count: 'exact', head: true });

      setStats({
        galleryImages: imgCount || 0,
        albumsCount: albCount || 0,
        projectsCount: projCount || 0,
        eventsCount: evtCount || 0,
      });
    } catch (err) {
      console.warn("Error fetching dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeStarterContent = async () => {
    setIsInitializing(true);
    setInitError(null);

    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) {
      setInitError("Supabase connection is not configured.");
      setIsInitializing(false);
      return;
    }

    try {
      // Starter Project: Verdant
      const starterProject = {
        title: "Verdant",
        slug: "verdant",
        category: "Environment",
        status: "Completed",
        location: "Jagran Public School, Noida",
        short_description: "Verdant was a tree plantation drive project by the Interact Club of Jagran Public School, Noida, focused on promoting environmental responsibility and student participation in community service.",
        full_report: "Verdant was a tree plantation drive project by the Interact Club of Jagran Public School, Noida, focused on promoting environmental responsibility and student participation in community service.",
        objective: "To encourage students to take action for the environment through a tree plantation initiative.",
        impact_summary: "Students participated in a meaningful environmental activity and helped promote awareness about sustainability and green spaces.",
        volunteer_count: 0,
        volunteer_hours: 0,
        people_impacted: 0,
        approval_status: "published",
        published: true,
        cover_image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80"
      };

      const { error: projErr } = await supabase.from('projects').insert([starterProject]);
      if (projErr) throw projErr;

      // Starter Events: DILA & Outreach Assembly
      const starterEvents = [
        {
          title: "DILA",
          status: "Upcoming",
          venue: "Amity University",
          date: null,
          time: null,
          description: "DILA is an upcoming Interact leadership and training event where club members and office bearers will learn about leadership, service, and club responsibilities."
        },
        {
          title: "Outreach Assembly",
          status: "Upcoming",
          venue: "Jagran Public School, Noida",
          date: null,
          time: null,
          description: "An outreach assembly planned to introduce students to Interact Club activities, service goals, and upcoming opportunities for participation."
        }
      ];

      const { error: evtErr } = await supabase.from('events').insert(starterEvents);
      if (evtErr) throw evtErr;

      setInitSuccess(true);
      await fetchDashboardStats();
    } catch (err: any) {
      console.error("Starter initialization error:", err);
      setInitError(err.message || "Could not initialize starter content into Supabase.");
    } finally {
      setIsInitializing(false);
    }
  };

  return (
    <div className="space-y-8 bg-slate-100 text-slate-800">
      {/* Top Banner */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            Teacher Oversight Portal
          </span>
          <span className="text-xs font-semibold text-slate-500">
            Jagran Public School, Noida
          </span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Secretary & Admin Control Dashboard</h1>
        <p className="text-xs text-slate-600">
          Digital record management hub for the Interact Club of Jagran Public School, Noida.
        </p>
      </div>

      {/* Starter Setup Section */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4 shadow-2xs">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-base font-bold text-slate-900">Starter Setup</h2>
        </div>

        {initSuccess ? (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3.5 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">Starter content has been added and can now be edited from Projects and Events.</span>
          </div>
        ) : stats.projectsCount > 0 || stats.eventsCount > 0 ? (
          <div className="bg-slate-50 border border-slate-200 text-slate-700 text-xs p-3.5 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0" />
              <span>Projects ({stats.projectsCount}) and Events ({stats.eventsCount}) exist in your Supabase database. Starter content can be managed or edited anytime.</span>
            </div>
            <button
              onClick={handleInitializeStarterContent}
              disabled={isInitializing}
              className="text-[11px] font-bold text-blue-800 hover:underline shrink-0 ml-2"
            >
              Add Starter Records Again
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-slate-600 leading-relaxed">
              Add starter project and event content for the first demo.
            </p>
            {initError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{initError}</span>
              </div>
            )}
            <div>
              <button
                onClick={handleInitializeStarterContent}
                disabled={isInitializing}
                className="inline-flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-xs transition disabled:opacity-50"
              >
                {isInitializing ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Initialize Starter Content
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Service Projects</span>
            <FolderKanban className="w-5 h-5 text-blue-900" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.projectsCount}</div>
          <p className="text-xs text-slate-500">Active and completed club projects</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Club Events</span>
            <Calendar className="w-5 h-5 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.eventsCount}</div>
          <p className="text-xs text-slate-500">Scheduled events & assemblies</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Photo Gallery Images</span>
            <ImageIcon className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.galleryImages}</div>
          <p className="text-xs text-slate-500">Uploaded project photos</p>
        </div>

        <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
          <div className="flex justify-between items-center text-slate-500">
            <span className="text-xs font-bold uppercase tracking-wider">Gallery Albums</span>
            <Folder className="w-5 h-5 text-indigo-700" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.albumsCount}</div>
          <p className="text-xs text-slate-500">Categorized event albums</p>
        </div>
      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">Projects & Events Management</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Create, edit, publish, or delete service projects and upcoming event schedules in real-time.
          </p>
          <div className="flex gap-3">
            <Link
              to="/admin/projects"
              className="inline-flex items-center gap-1.5 bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs px-3.5 py-2 rounded transition"
            >
              Manage Projects <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              to="/admin/events"
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3.5 py-2 rounded transition"
            >
              Manage Events <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">Gallery & Storage Management</h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Manage event photos, upload activity images, and set public visibility directly using Supabase storage.
          </p>
          <div>
            <Link
              to="/admin/gallery"
              className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs px-4 py-2 rounded transition"
            >
              Open Gallery Manager <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

