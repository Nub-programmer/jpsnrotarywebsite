import React from 'react';
import { ShieldCheck, Users, Award, Clock } from 'lucide-react';

export const Members: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 bg-white text-slate-800">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
          Student Directory
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Members & Office Bearers
        </h1>
        <p className="text-xs md:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
          The official directory of student leaders, committee heads, and active Interactors of Jagran Public School, Noida.
        </p>
      </div>

      {/* Main Notice Banner */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 text-center space-y-2">
        <div className="w-10 h-10 mx-auto rounded-md bg-blue-100 text-blue-900 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-blue-900" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Directory Pending Approval</h2>
        <p className="text-xs text-slate-600 max-w-lg mx-auto">
          The member directory and office bearer appointments will be updated here after formal teacher approval for the 2025-2026 academic session.
        </p>
      </div>

      {/* Placeholder Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Office Bearers */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded bg-slate-100 text-slate-700 flex items-center justify-center">
            <Award className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Office Bearers</h3>
            <p className="text-xs text-slate-500 mt-1">President, Vice President, Secretary & Treasurer</p>
          </div>
          <span className="inline-block bg-slate-100 text-slate-700 font-medium text-xs px-2.5 py-0.5 rounded border border-slate-200">
            Coming Soon
          </span>
        </div>

        {/* Card 2: Core Team */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded bg-slate-100 text-slate-700 flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-900" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Core Team Leads</h3>
            <p className="text-xs text-slate-500 mt-1">Project heads, media leads, and event coordinators</p>
          </div>
          <span className="inline-block bg-slate-100 text-slate-700 font-medium text-xs px-2.5 py-0.5 rounded border border-slate-200">
            Coming Soon
          </span>
        </div>

        {/* Card 3: Volunteers */}
        <div className="bg-white p-6 rounded-lg border border-slate-200 text-center space-y-3">
          <div className="w-10 h-10 mx-auto rounded bg-slate-100 text-slate-700 flex items-center justify-center">
            <Clock className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">General Interactors</h3>
            <p className="text-xs text-slate-500 mt-1">Registered student volunteers from Grades 8 to 12</p>
          </div>
          <span className="inline-block bg-slate-100 text-slate-700 font-medium text-xs px-2.5 py-0.5 rounded border border-slate-200">
            Coming Soon
          </span>
        </div>
      </div>

      <div className="text-center text-xs text-slate-500">
        To express interest in joining as a student volunteer, please complete the <a href="/volunteer" className="text-blue-900 font-semibold underline">Volunteer Form</a>.
      </div>
    </div>
  );
};
