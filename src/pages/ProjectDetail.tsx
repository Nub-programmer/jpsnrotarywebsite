import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Heart,
  FileText,
  Target,
  Award,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../lib/supabase';
import { Project } from '../types';
import { sampleProjects } from '../lib/mockData';

export const ProjectDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const { isConfigured } = getSupabaseCredentials();

      // Check sample projects first
      const sampleMatch = sampleProjects.find((p) => p.slug === slug || p.id === slug);
      if (sampleMatch) {
        setProject(sampleMatch);
      }

      if (isConfigured) {
        try {
          // Fetch from Supabase by slug or id
          const { data } = await supabase
            .from('projects')
            .select('*')
            .or(`slug.eq.${slug},id.eq.${slug}`)
            .single();

          if (data) {
            setProject(data);
          }
        } catch (err) {
          console.warn("Using sample match fallback", err);
        }
      }
      setLoading(false);
    };

    fetchProject();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-8 h-8 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs font-semibold text-slate-500">Loading official report...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Project Not Found</h2>
        <p className="text-sm text-slate-600">The requested project report could not be located or may be pending approval.</p>
        <Link
          to="/projects"
          className="inline-flex items-center gap-2 bg-blue-800 text-white font-medium text-xs px-4 py-2 rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back Button */}
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-900 transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Projects Portfolio
      </Link>

      {/* Official Impact Report Header Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Cover Photo */}
        {project.cover_image_url && (
          <div className="h-64 sm:h-80 w-full overflow-hidden bg-slate-100 relative">
            <img
              src={project.cover_image_url}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="text-xs bg-blue-900 text-white font-semibold px-3 py-1 rounded shadow-xs">
                {project.category}
              </span>
              <span className="text-xs bg-emerald-600 text-white font-semibold px-3 py-1 rounded shadow-xs">
                {project.status}
              </span>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-2 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-blue-800" /> {project.date || 'To Be Announced'}
              </span>
              {project.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-amber-600" /> {project.location}
                </span>
              )}
              <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                Official Report
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              {project.title}
            </h1>
          </div>

          {/* Key Impact Statistics Banner */}
          <div className="grid grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <div>
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-semibold mb-1">
                <Users className="w-4 h-4 text-blue-800" /> Volunteers
              </div>
              <span className="text-xl md:text-2xl font-extrabold text-slate-900">
                {project.volunteer_count}
              </span>
            </div>
            <div className="border-x border-slate-200">
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-semibold mb-1">
                <Clock className="w-4 h-4 text-amber-600" /> Hours Given
              </div>
              <span className="text-xl md:text-2xl font-extrabold text-slate-900">
                {project.volunteer_hours} hrs
              </span>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1 text-slate-500 text-xs font-semibold mb-1">
                <Heart className="w-4 h-4 text-red-600" /> Beneficiaries
              </div>
              <span className="text-xl md:text-2xl font-extrabold text-slate-900">
                {project.people_impacted}+
              </span>
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Executive Summary
            </h3>
            <p className="text-sm md:text-base text-slate-700 font-medium leading-relaxed bg-blue-50/50 p-4 rounded-lg border border-blue-100">
              {project.short_description}
            </p>
          </div>

          {/* Objective */}
          {project.objective && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-amber-600" /> Key Objective
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                {project.objective}
              </p>
            </div>
          )}

          {/* Full Report */}
          {project.full_report && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-800" /> Detailed Activity Log & Report
              </h3>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-5 rounded-lg border border-slate-200">
                {project.full_report}
              </div>
            </div>
          )}

          {/* Impact Summary */}
          {project.impact_summary && (
            <div className="space-y-2 pt-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Award className="w-4 h-4 text-emerald-600" /> Measurable Outcome & Community Impact
              </h3>
              <div className="text-sm text-slate-800 font-medium leading-relaxed bg-emerald-50/60 p-4 rounded-lg border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{project.impact_summary}</span>
              </div>
            </div>
          )}

          {/* Report Footer */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
            <div>
              <span>Official Document of Interact Club of JPS Noida</span>
            </div>
            <Link
              to="/volunteer"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg transition"
            >
              Participate in Future Drives &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
