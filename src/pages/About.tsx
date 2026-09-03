import React from 'react';
import { Award, HeartHandshake, CheckCircle, Target, Eye, Sparkles } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 bg-white text-slate-800">
      {/* Header */}
      <div className="text-center space-y-3 border-b border-slate-200 pb-8">
        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
          About Our Club
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Interact Club of Jagran Public School, Noida
        </h1>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto">
          Empowering student leaders at Jagran Public School, Noida to take service initiatives, foster empathy, and contribute meaningfully to our community.
        </p>
      </div>

      {/* What is Interact & About JPS Chapter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded bg-blue-100 text-blue-900 flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">What is Interact?</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Interact is a student service organization for young people aged 12 to 18. Sponsored by Rotary International, Interact clubs give students opportunities to participate in meaningful service projects while developing leadership skills, teamwork, and social responsibility.
          </p>
        </div>

        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 space-y-3">
          <div className="w-10 h-10 rounded bg-blue-100 text-blue-900 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5 text-blue-900" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">About Jagran Public School, Noida Chapter</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            The Interact Club of Jagran Public School, Noida operates under faculty guidance. Students from Grades 8 to 12 actively plan and execute projects benefiting our school campus, local community, and environmental conservation.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-lg border border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-blue-300 font-bold text-base">
            <Target className="w-5 h-5" /> Mission
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            To instill a commitment to voluntary service, social responsibility, and ethical leadership in students through structured community development and environmental projects.
          </p>
        </div>

        <div className="bg-blue-900 text-white p-6 rounded-lg border border-blue-800 space-y-3">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-base">
            <Eye className="w-5 h-5" /> Vision
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            To build a vibrant student leadership culture at Jagran Public School, Noida where every student recognizes their potential to create positive, disciplined community impact.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-900 text-center">Core Values</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { title: "Service", desc: "Putting community welfare first." },
            { title: "Leadership", desc: "Initiating action with responsibility." },
            { title: "Teamwork", desc: "Collaborating with peers & mentors." },
            { title: "Integrity", desc: "Upholding ethical school values." },
            { title: "Discipline", desc: "Focusing on structured outcomes." },
          ].map((val, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg border border-slate-200 text-center space-y-1">
              <CheckCircle className="w-4 h-4 text-blue-900 mx-auto mb-1" />
              <h3 className="font-bold text-slate-900 text-xs">{val.title}</h3>
              <p className="text-[11px] text-slate-500">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Role of Secretary & Digital Platform */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 space-y-3">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
          <Sparkles className="w-4 h-4 text-blue-900" />
          <span>Secretary's Digital Record Hub Initiative</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          This platform was created by the Club Secretary to maintain clean, organized digital records for Jagran Public School, Noida. It streamlines volunteer sign-ups, activity archives, and photo management for teacher approval.
        </p>
      </div>

      {/* Teacher Approval Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-md p-3 text-center text-xs text-slate-500 font-medium">
        Note: Complete office bearer details and student council appointments will be updated here following formal teacher approval for the 2025-2026 session.
      </div>
    </div>
  );
};
