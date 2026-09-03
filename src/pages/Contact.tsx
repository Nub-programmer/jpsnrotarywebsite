import React from 'react';
import { School, MapPin, Mail, Instagram, ShieldCheck, Info } from 'lucide-react';

export const Contact: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white text-slate-800">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
          Official Communication
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Contact & School Channels
        </h1>
        <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto">
          Contact the Interact Club supervision team at Jagran Public School, Noida.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* School & Location Info */}
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="w-10 h-10 rounded bg-blue-900 text-white flex items-center justify-center font-bold">
              <School className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Interact Club of Jagran Public School, Noida</h2>
              <p className="text-xs text-slate-500 font-medium">Jagran Public School, Noida</p>
            </div>
          </div>

          <ul className="space-y-4 text-xs text-slate-700">
            <li className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900 text-[11px] uppercase tracking-wider">Address</span>
                <span>Jagran Public School, Sector 47, Noida, Uttar Pradesh 201301</span>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-blue-900 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900 text-[11px] uppercase tracking-wider">Official Email</span>
                <a href="mailto:interact@jpsnoida.edu.in" className="text-blue-900 font-semibold hover:underline">
                  interact@jpsnoida.edu.in
                </a>
              </div>
            </li>

            <li className="flex items-start gap-3">
              <Instagram className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-slate-900 text-[11px] uppercase tracking-wider">Social Media</span>
                <a
                  href="https://www.instagram.com/interactjps/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-900 font-semibold hover:underline"
                >
                  @interactjps
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Supervision & Official Note */}
        <div className="bg-slate-900 text-white rounded-lg p-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-base border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5" /> Faculty Supervision
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              The Interact Club operates directly under the guidance of Jagran Public School administration and faculty coordinators.
            </p>

            <div className="p-4 bg-slate-800 rounded-md border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
                <Info className="w-4 h-4 text-amber-400" /> Communication Policy
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                For official project approvals, event details, and student volunteering, please refer to official school circulars and verified channels.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 text-center">
            Student Privacy Policy: Personal contact numbers of student members are strictly protected.
          </div>
        </div>
      </div>
    </div>
  );
};
