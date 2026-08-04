import React from 'react';
import { Link } from 'react-router-dom';
import {
  Award,
  HeartHandshake,
  FolderKanban,
  Image as ImageIcon,
  CheckCircle2,
  Trees,
  Megaphone,
  BookOpen,
  Info,
  Users,
  ShieldCheck,
  FileText
} from 'lucide-react';
import { InteractLogo } from '../components/ui/InteractLogo';

export const Home: React.FC = () => {
  return (
    <div className="space-y-12 pb-16 bg-white text-slate-800">
      {/* Official Hero Section - Clean White & Official Header */}
      <section className="bg-slate-50 border-b border-slate-200 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="flex justify-center mb-2">
            <InteractLogo size="xl" />
          </div>

          <div className="inline-flex items-center gap-2 bg-blue-100 border border-blue-200 text-blue-900 text-xs font-semibold px-3.5 py-1 rounded-full uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-blue-800" /> Official Student Club Hub
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
            Interact Club of Jagran Public School, Noida
          </h1>

          <p className="text-sm sm:text-base font-semibold text-blue-900 uppercase tracking-wide">
            Service Above Self &bull; Youth Leadership &bull; Community Impact
          </p>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A student-led digital hub to document service initiatives, share approved updates, and showcase the positive impact created by the Interact Club of Jagran Public School, Noida.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <Link
              to="/projects"
              className="bg-blue-900 hover:bg-blue-950 text-white font-medium text-xs sm:text-sm px-5 py-2.5 rounded-md shadow-2xs transition flex items-center gap-2"
            >
              <FolderKanban className="w-4 h-4" /> View Projects
            </Link>
            <Link
              to="/volunteer"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-md shadow-2xs transition flex items-center gap-2"
            >
              <HeartHandshake className="w-4 h-4 text-slate-950" /> Join as Volunteer
            </Link>
            <Link
              to="/gallery"
              className="bg-white hover:bg-slate-100 text-slate-800 font-medium text-xs sm:text-sm px-5 py-2.5 rounded-md border border-slate-300 shadow-2xs transition flex items-center gap-2"
            >
              <ImageIcon className="w-4 h-4 text-blue-800" /> View Gallery
            </Link>
          </div>
        </div>
      </section>

      {/* Subtle Impact Note (No Fake Stats) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-3 text-xs text-slate-600">
          <Info className="w-4 h-4 text-blue-800 shrink-0" />
          <span>
            <strong>Impact Dashboard Notice:</strong> Coming Soon: Impact dashboard after teacher approval.
          </span>
        </div>
      </section>

      {/* Purpose of this Digital Hub Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900">Purpose of this Digital Hub</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Designed by the Club Secretary for transparent record-keeping and student participation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-900 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-900" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Document Service Activities</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Maintain detailed reports, objective summaries, and verified outcomes for all school and community drives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-900 flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-amber-600" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Share Approved Club Updates</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Publish upcoming event notices, orientation schedules, and official circulars following teacher supervision.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded bg-blue-50 text-blue-900 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Build a Professional Club Archive</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Create an institutional archive for Jagran Public School, Noida to preserve leadership records year after year.
            </p>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-xl font-bold text-slate-900">What We Do</h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Key areas of action undertaken by student Interactors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Community Service</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Clothes drives, book collections, and community outreach supporting local primary schools and shelters.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
              <Trees className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Environmental Action</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tree plantation drives, campus cleanliness campaigns, and e-waste management initiatives.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded bg-amber-50 text-amber-800 flex items-center justify-center font-bold">
              <Megaphone className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Awareness Drives</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Student assemblies on health, road safety, ethics, and environmental conservation awareness.
            </p>
          </div>

          <div className="bg-white p-5 rounded-lg border border-slate-200 space-y-2">
            <div className="w-8 h-8 rounded bg-indigo-50 text-indigo-900 flex items-center justify-center font-bold">
              <Users className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Youth Leadership</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Leadership training workshops, meeting management skills, and student project coordination.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action for Students */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 md:p-8 text-center space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Get Involved with Interact JPS Noida</h2>
          <p className="text-xs md:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
            Students from Grades 8 to 12 are invited to express interest in joining our service projects, volunteering for events, and building leadership skills.
          </p>
          <div className="pt-2">
            <Link
              to="/volunteer"
              className="inline-flex items-center gap-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-6 py-3 rounded-lg shadow-2xs transition"
            >
              Fill Volunteer Interest Form &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
