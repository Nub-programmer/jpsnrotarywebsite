import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Calendar,
  Image as ImageIcon,
  Users,
  HeartHandshake,
  Megaphone,
  Settings,
  LogOut,
  ShieldCheck,
  Globe,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      // ignore
    }
    localStorage.removeItem('admin_logged_in');
    navigate('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Service Projects', path: '/admin/projects', icon: FolderKanban },
    { name: 'Events Calendar', path: '/admin/events', icon: Calendar },
    { name: 'Gallery Manager', path: '/admin/gallery', icon: ImageIcon },
    { name: 'Member Directory', path: '/admin/members', icon: Users },
    { name: 'Volunteer Submissions', path: '/admin/volunteers', icon: HeartHandshake },
    { name: 'Announcements Board', path: '/admin/announcements', icon: Megaphone },
    { name: 'Club Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Admin Top Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-1.5 rounded bg-slate-800 text-slate-300"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-800 flex items-center justify-center font-bold border border-amber-400">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <span className="font-bold text-sm tracking-tight block text-white leading-none">
                  Admin Portal &bull; JPS Noida
                </span>
                <span className="text-[10px] text-amber-400 font-medium">Teacher Super Admin Active</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              target="_blank"
              className="text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 px-3 py-1.5 rounded border border-slate-700 transition flex items-center gap-1.5"
            >
              <Globe className="w-3.5 h-3.5 text-blue-400" /> View Live Website
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-red-300 hover:text-red-200 bg-red-950/60 border border-red-900 px-3 py-1.5 rounded transition flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Admin Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-20 w-64 bg-white border-r border-slate-200 transform lg:transform-none transition-transform duration-200 ease-in-out flex flex-col justify-between pt-16 lg:pt-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-4 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Management Modules
            </div>
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                    isActive(item.path)
                      ? 'bg-blue-800 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive(item.path) ? 'text-amber-400' : 'text-slate-500'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-slate-200 bg-slate-50 text-center">
            <p className="text-[11px] font-bold text-slate-700">Interact Club of JPS Noida</p>
            <p className="text-[10px] text-slate-400">Teacher Control Panel v1.0 MVP</p>
          </div>
        </aside>

        {/* Main Content View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
