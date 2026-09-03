import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Edit, Trash2, Clock, MapPin, ExternalLink, X } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../../lib/supabase';
import { EventItem } from '../../types';
import { sampleEvents } from '../../lib/mockData';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Toast, ToastMessage } from '../../components/ui/Toast';

export const AdminEvents: React.FC = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00 AM - 01:00 PM');
  const [venue, setVenue] = useState('Main School Auditorium, Jagran Public School, Noida');
  const [description, setDescription] = useState('');
  const [registrationLink, setRegistrationLink] = useState('');
  const [status, setStatus] = useState<'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled'>('Upcoming');

  // Delete
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) return;

    try {
      const { data } = await supabase.from('events').select('*').order('created_at', { ascending: false });
      if (data) setEvents(data);
    } catch (err) {
      console.warn("Using sample events fallback", err);
    }
  };

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setTitle('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('10:00 AM - 01:00 PM');
    setVenue('Main School Auditorium, Jagran Public School, Noida');
    setDescription('');
    setRegistrationLink('');
    setStatus('Upcoming');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (evt: EventItem) => {
    setEditingEvent(evt);
    setTitle(evt.title);
    setDate(evt.date);
    setTime(evt.time || '');
    setVenue(evt.venue || '');
    setDescription(evt.description);
    setRegistrationLink(evt.registration_link || '');
    setStatus(evt.status);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Partial<EventItem> = {
      title: title.trim(),
      date,
      time: time.trim(),
      venue: venue.trim(),
      description: description.trim(),
      registration_link: registrationLink.trim(),
      status,
    };

    const { isConfigured } = getSupabaseCredentials();

    try {
      if (editingEvent) {
        if (isConfigured) {
          await supabase.from('events').update(payload).eq('id', editingEvent.id);
        }
        setEvents(events.map((e) => e.id === editingEvent.id ? { ...e, ...payload } as EventItem : e));
        setToast({ id: Date.now().toString(), type: 'success', title: 'Event Saved', message: 'Event details updated.' });
      } else {
        const newEvt: EventItem = { id: `evt-${Date.now()}`, ...payload, created_at: new Date().toISOString() } as EventItem;
        if (isConfigured) {
          const { data } = await supabase.from('events').insert([payload]).select('*').single();
          if (data) newEvt.id = data.id;
        }
        setEvents([newEvt, ...events]);
        setToast({ id: Date.now().toString(), type: 'success', title: 'Event Created', message: 'New event scheduled.' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setToast({ id: Date.now().toString(), type: 'error', title: 'Error', message: err.message || 'Failed to save event.' });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    const { isConfigured } = getSupabaseCredentials();

    if (isConfigured) {
      try {
        await supabase.from('events').delete().eq('id', deleteTargetId);
      } catch (e) {}
    }

    setEvents(events.filter((e) => e.id !== deleteTargetId));
    setIsDeleting(false);
    setDeleteTargetId(null);
    setToast({ id: Date.now().toString(), type: 'success', title: 'Event Deleted', message: 'Event removed from schedule.' });
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-600" /> Club Events & Calendar Schedule
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Add upcoming youth seminars, plantation drives, orientation sessions, and Rotary events.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((evt) => (
          <div key={evt.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-3 relative">
            <div className="flex justify-between items-start">
              <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded ${
                evt.status === 'Upcoming' ? 'bg-blue-100 text-blue-900' : 'bg-slate-100 text-slate-700'
              }`}>
                {evt.status}
              </span>
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(evt)} className="p-1 hover:bg-slate-100 rounded text-slate-600">
                  <Edit className="w-4 h-4" />
                </button>
                <button onClick={() => setDeleteTargetId(evt.id)} className="p-1 hover:bg-red-50 rounded text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 text-sm">{evt.title}</h3>
            <p className="text-xs text-slate-600 line-clamp-2">{evt.description}</p>

            <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-blue-700" /> {evt.date} ({evt.time})</div>
              {evt.venue && <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-amber-600" /> {evt.venue}</div>}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 overflow-hidden animate-in fade-in">
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-base">{editingEvent ? 'Edit Event' : 'Schedule New Event'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Date *</label>
                  <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status *</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg">
                    <option value="Upcoming">Upcoming</option>
                    <option value="Ongoing">Ongoing</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Time</label>
                  <input type="text" value={time} onChange={(e) => setTime(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Venue</label>
                  <input type="text" value={venue} onChange={(e) => setVenue(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Description *</label>
                <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Registration Link (Optional)</label>
                <input type="url" value={registrationLink} onChange={(e) => setRegistrationLink(e.target.value)} className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg" />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-bold text-white bg-blue-800 rounded-lg">Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Event?"
        message="Are you sure you want to remove this event from the schedule?"
        confirmLabel="Delete Event"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
