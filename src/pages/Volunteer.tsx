import React, { useState } from 'react';
import { HeartHandshake, CheckCircle2, Send, ShieldAlert, Sparkles } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../lib/supabase';
import { sendAdminNewVolunteerNotification } from '../lib/emailService';

export const Volunteer: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [classSection, setClassSection] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [reasonToJoin, setReasonToJoin] = useState('');
  const [availability, setAvailability] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const interestOptions = [
    'Community Service & Drives',
    'Tree Plantation & Environment',
    'Cleanliness & Recycling',
    'Event Management & Logistics',
    'Media, Photography & Design',
    'Tech & Digital Admin'
  ];

  const handleInterestToggle = (option: string) => {
    if (interests.includes(option)) {
      setInterests(interests.filter((i) => i !== option));
    } else {
      setInterests([...interests, option]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    const formattedInterests = Array.isArray(interests) ? interests.join(', ') : (interests || '');

    const payload = {
      full_name: fullName.trim(),
      class_section: classSection.trim(),
      email: email.trim(),
      phone: phone.trim(),
      interests: formattedInterests,
      reason_to_join: reasonToJoin.trim(),
      availability: availability.trim(),
      status: 'pending',
      submitted_at: new Date().toISOString()
    };

    try {
      const { isConfigured } = getSupabaseCredentials();
      if (!isConfigured) {
        throw new Error('Unable to connect to authentication service. Please check environment variables.');
      }

      const { error } = await supabase
        .from('volunteer_submissions')
        .insert([payload]);

      if (error) {
        if (import.meta.env.DEV) {
          console.error("Volunteer submission RLS or DB error:", error);
        }
        throw error;
      }

      // Notify admin atharvnegi26@gmail.com
      sendAdminNewVolunteerNotification(payload).catch((e) => {
        if (import.meta.env.DEV) {
          console.warn('[DEV] Admin notification email dispatch error:', e);
        }
      });

      setIsSubmitted(true);
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error("Error submitting volunteer form:", err);
      }
      setErrorMessage(
        err?.message || 'Failed to submit application. Please check your network connection and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Student Recruitment
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Join as a Volunteer / Interactor
        </h1>
        <p className="text-sm md:text-base text-slate-600">
          Be a part of Jagran Public School’s student service community. Contribute your ideas, skills, and effort to create positive impact.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-8 text-center space-y-4 shadow-sm animate-in fade-in">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-950">
            Thank you! Your volunteer interest has been submitted.
          </h2>
          <p className="text-sm text-emerald-800 max-w-md mx-auto">
            Your details have been logged into the club administrative portal. The teacher-in-charge and student leads will review applications and contact you for upcoming orientation meetings.
          </p>
          <button
            onClick={() => {
              setIsSubmitted(false);
              setFullName('');
              setClassSection('');
              setEmail('');
              setPhone('');
              setInterests([]);
              setReasonToJoin('');
              setAvailability('');
            }}
            className="mt-4 inline-block bg-blue-800 text-white font-semibold text-xs px-5 py-2.5 rounded-lg hover:bg-blue-900 transition"
          >
            Submit Another Interest Form
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4 text-blue-900 font-bold text-lg">
            <HeartHandshake className="w-5 h-5 text-amber-500" />
            <span>Volunteer Application Form</span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
              {errorMessage}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="Atharv Singh Negi"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Class & Section *
              </label>
              <input
                type="text"
                required
                placeholder="Class 11th A"
                value={classSection}
                onChange={(e) => setClassSection(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Student Email ID *
              </label>
              <input
                type="email"
                required
                placeholder="atharvnegi26@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Phone / WhatsApp Number *
              </label>
              <input
                type="tel"
                required
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Areas of Interest (Select all that apply)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {interestOptions.map((option) => (
                <label
                  key={option}
                  onClick={() => handleInterestToggle(option)}
                  className={`p-3 rounded-lg border text-xs font-semibold cursor-pointer transition flex items-center gap-2.5 ${
                    interests.includes(option)
                      ? 'bg-blue-50 border-blue-800 text-blue-900'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={interests.includes(option)}
                    onChange={() => {}}
                    className="rounded text-blue-800 focus:ring-blue-800"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Why would you like to join the Interact Club? *
            </label>
            <textarea
              required
              rows={3}
              placeholder="I want to contribute to service projects, leadership activities, and help organize Interact Club initiatives."
              value={reasonToJoin}
              onChange={(e) => setReasonToJoin(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Availability (e.g. Weekends, Zero Periods, Post-School)
            </label>
            <input
              type="text"
              placeholder="Weekends, zero periods, or after-school hours"
              value={availability}
              onChange={(e) => setAvailability(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-800 hover:bg-blue-900 text-white font-bold text-sm py-3 px-6 rounded-lg shadow-xs transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                'Submitting Application...'
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Volunteer Interest
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center">
            Your details remain strictly confidential and accessible only to school faculty administrators.
          </p>
        </form>
      )}
    </div>
  );
};
