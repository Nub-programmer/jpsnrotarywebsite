import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronRight } from 'lucide-react';
import { InteractLogo } from '../ui/InteractLogo';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Events', path: '/events' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Members', path: '/members' },
    { name: 'Join', path: '/volunteer' },
    { name: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
      {/* Top Banner - Official School Header */}
      <div className="bg-slate-900 text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2 font-medium tracking-wide">
            <span className="inline-block w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Jagran Public School, Noida &bull; Official Student Club Hub</span>
          </div>
          <div className="text-slate-300 text-[11px] font-medium hidden sm:block">
            Motto: Service Above Self
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Brand & Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <InteractLogo size="md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-base md:text-lg tracking-tight group-hover:text-blue-900 transition">
                  Interact Club
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase bg-blue-50 text-blue-900 px-2 py-0.5 rounded border border-blue-200">
                  JPS Noida
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Jagran Public School, Noida
              </p>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                  isActive(link.path)
                    ? 'bg-blue-50 text-blue-900 font-semibold border-b-2 border-blue-900'
                    : 'text-slate-700 hover:text-blue-900 hover:bg-slate-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Join CTA Desktop */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/volunteer"
              className="bg-blue-900 hover:bg-blue-950 text-white text-sm font-medium px-4 py-2 rounded-md shadow-2xs transition flex items-center gap-1.5"
            >
              Join Club <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive(link.path)
                  ? 'bg-blue-50 text-blue-900 font-semibold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-3 border-t border-slate-100">
            <Link
              to="/volunteer"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center bg-blue-900 hover:bg-blue-950 text-white text-sm font-medium py-2.5 rounded-md shadow-2xs"
            >
              Join Club
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
