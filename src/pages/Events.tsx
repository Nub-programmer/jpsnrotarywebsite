import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, Info } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../lib/supabase';
import { EventItem } from '../types';
import { mergeById, sampleEvents } from '../lib/mockData';

export const Events: React.FC = () => {
  const [eventsList, setEventsList] = useState<EventItem[]>(sampleEvents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { isConfigured } = getSupabaseCredentials();
      if (!isConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('events')
          .select('*')
          .order('created_at', { ascending: false });

        setEventsList(mergeById(sampleEvents, data || []));
      } catch (err) {
        console.warn("Error fetching events from Supabase:", err);
        setEventsList(sampleEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-white text-slate-800">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-900 uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-md border border-blue-200">
          Club Schedule
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
          Events & Activity Notices
        </h1>
        <p className="text-xs md:text-sm text-slate-600">
          Scheduled meetings, awareness drives, and student initiatives for Jagran Public School, Noida.
        </p>
      </div>

      {/* Upcoming Events Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-200 pb-2">
          <Calendar className="w-4 h-4 text-blue-900" /> Planned Club Events
        </h2>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-xs font-medium">Loading events...</div>
        ) : eventsList.length === 0 ? (
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center space-y-3">
            <Calendar className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-700 text-base">No upcoming events scheduled</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Starter content can be initialized from the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventsList.map((evt) => (
              <article
                key={evt.id}
                className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden flex flex-col justify-between"
              >
                {evt.cover_image_url && (
                  <div className="h-48 bg-slate-100 overflow-hidden">
                    <img src={evt.cover_image_url} alt={evt.title} className="block w-full h-full object-cover" onError={(event) => event.currentTarget.parentElement?.remove()} />
                  </div>
                )}
                <div className="p-6 space-y-3">
                <div className="space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-xs font-semibold text-blue-900 bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded">
                      {evt.status || 'Upcoming'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-900" /> {evt.date ? evt.date : 'To Be Announced'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{evt.title}</h3>

                  <p className="text-xs text-slate-600 leading-relaxed">{evt.description}</p>
                  {evt.full_description && (
                    <details className="pt-1">
                      <summary className="cursor-pointer text-xs font-semibold text-blue-900">Read full update</summary>
                      <p className="mt-3 text-xs text-slate-600 leading-relaxed whitespace-pre-line">{evt.full_description}</p>
                    </details>
                  )}
                </div>

                <div className="space-y-1 pt-3 border-t border-slate-200 text-xs text-slate-600">
                  {evt.time && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{evt.time}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-900" />
                    <span>Venue: {evt.venue || 'Jagran Public School, Noida'}</span>
                  </div>
                </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Notice box */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-blue-900 shrink-0" />
        <span>
          Event dates and venue schedules are subject to teacher-in-charge confirmation and school timetable approvals.
        </span>
      </div>
    </div>
  );
};
