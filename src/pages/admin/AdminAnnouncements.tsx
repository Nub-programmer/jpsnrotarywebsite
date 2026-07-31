import React, { useEffect, useState } from 'react';
import { Megaphone, Plus, Edit, Trash2, Pin, Eye, X } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../../lib/supabase';
import { Announcement, AnnouncementStatus } from '../../types';
import { sampleAnnouncements } from '../../lib/mockData';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Toast, ToastMessage } from '../../components/ui/Toast';

export const AdminAnnouncements: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>(sampleAnnouncements);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);

  // Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<AnnouncementStatus>('published');
  const [isPinned, setIsPinned] = useState(false);
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]);

  // Delete
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) return;

    try {
      const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) setAnnouncements(data);
    } catch (err) {
      console.warn("Using sample announcements fallback", err);
    }
  };

  const handleOpenCreate = () => {
    setEditingAnn(null);
    setTitle('');
    setContent('');
    setStatus('published');
    setIsPinned(false);
    setPublishDate(new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ann: Announcement) => {
    setEditingAnn(ann);
    setTitle(ann.title);
    setContent(ann.content);
    setStatus(ann.status);
    setIsPinned(ann.is_pinned);
    setPublishDate(ann.publish_date || new Date().toISOString().split('T')[0]);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      content: content.trim(),
      status,
      is_pinned: isPinned,
      publish_date: publishDate,
    };

    const { isConfigured } = getSupabaseCredentials();

    try {
      if (editingAnn) {
        if (isConfigured) {
          await supabase.from('announcements').update(payload).eq('id', editingAnn.id);
        }
        setAnnouncements(announcements.map((a) => a.id === editingAnn.id ? { ...a, ...payload } as Announcement : a));
        setToast({ id: Date.now().toString(), type: 'success', title: 'Announcement Saved', message: 'Notice updated.' });
      } else {
        const newAnn: Announcement = { id: `ann-${Date.now()}`, ...payload, created_at: new Date().toISOString() };
        if (isConfigured) {
          const { data } = await supabase.from('announcements').insert([payload]).select('*').single();
          if (data) newAnn.id = data.id;
        }
        setAnnouncements([newAnn, ...announcements]);
        setToast({ id: Date.now().toString(), type: 'success', title: 'Announcement Created', message: 'New notice posted.' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setToast({ id: Date.now().toString(), type: 'error', title: 'Error', message: err.message });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    const { isConfigured } = getSupabaseCredentials();
    if (isConfigured) {
      try {
        await supabase.from('announcements').delete().eq('id', deleteTargetId);
      } catch (e) {}
    }

    setAnnouncements(announcements.filter((a) => a.id !== deleteTargetId));
    setIsDeleting(false);
    setDeleteTargetId(null);
    setToast({ id: Date.now().toString(), type: 'success', title: 'Announcement Deleted', message: 'Notice deleted.' });
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-purple-600" /> Announcements & Notice Board
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Post official club notices, orientation reminders, and pin key updates on homepage.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Post Notice
        </button>
      </div>

      <div className="space-y-4">
        {announcements.map((ann) => (
          <div key={ann.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-2xs space-y-2 relative">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {ann.is_pinned && <Pin className="w-4 h-4 text-amber-500 fill-amber-500" />}
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                  ann.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                }`}>
                  {ann.status}
                </span>
                <span className="text-xs text-slate-400">{ann.publish_date}</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => handleOpenEdit(ann)} className="p-1 hover:bg-slate-100 rounded text-slate-600"><Edit className="w-4 h-4" /></button>
                <button onClick={() => setDeleteTargetId(ann.id)} className="p-1 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>

            <h3 className="font-bold text-slate-900 text-sm">{ann.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{ann.content}</p>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">{editingAnn ? 'Edit Notice' : 'Post New Notice'}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Content *</label>
                <textarea required rows={4} value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="w-full px-3 py-2 text-sm border rounded-lg">
                    <option value="published">Published</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Publish Date</label>
                  <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" />
                </div>
              </div>
              <div className="flex items-center pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="rounded text-blue-800" />
                  <span>Pin announcement on homepage top bar</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-medium bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-blue-800 text-white rounded-lg">Save Notice</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Notice?"
        message="Are you sure you want to remove this announcement?"
        confirmLabel="Delete Notice"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
