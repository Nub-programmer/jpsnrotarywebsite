import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, Shield, Mail, School, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-blue-900 text-white flex items-center justify-center font-bold text-base border border-blue-700">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Interact Club of Jagran Public School, Noida
                </h3>
                <p className="text-xs text-blue-300 font-medium">
                  Service Above Self &bull; Student Leadership Platform
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Student-led digital initiative for organizing approved club updates and service records for Jagran Public School, Noida.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 border-b border-slate-800 pb-1.5">
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>
                <Link to="/" className="hover:text-white transition">Home</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About Interact</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition">Service Projects</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition">Club Events</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition">Photo Gallery</Link>
              </li>
              <li>
                <Link to="/members" className="hover:text-white transition">Members & Office Bearers</Link>
              </li>
              <li>
                <Link to="/volunteer" className="hover:text-white transition">Join / Volunteer</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact</Link>
              </li>
            </ul>
          </div>

          {/* Contact & Admin */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-3 border-b border-slate-800 pb-1.5">
              School Contact
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <School className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                <span>Jagran Public School, Noida</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>Sector 47, Noida, Uttar Pradesh</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>interact@jpsnoida.edu.in</span>
              </li>
            </ul>

            <div className="mt-5 pt-3 border-t border-slate-800">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 px-2.5 py-1 rounded transition border border-slate-700"
              >
                <Shield className="w-3 h-3 text-blue-400" /> Admin Portal
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-[11px] text-slate-500 gap-2">
          <p>&copy; {new Date().getFullYear()} Interact Club of Jagran Public School, Noida.</p>
          <p>Official School Digital Record Hub</p>
        </div>
      </div>
    </footer>
  );
};
