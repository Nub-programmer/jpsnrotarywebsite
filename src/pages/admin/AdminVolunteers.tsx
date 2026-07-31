import React, { useEffect, useState } from 'react';
import { Users, CheckCircle2, XCircle, Clock, Trash2, Mail, Phone, Lock, Eye } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../../lib/supabase';
import { VolunteerSubmission, VolunteerStatus } from '../../types';
import { sampleVolunteerSubmissions } from '../../lib/mockData';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Toast, ToastMessage } from '../../components/ui/Toast';

export const AdminVolunteers: React.FC = () => {
  const [submissions, setSubmissions] = useState<VolunteerSubmission[]>(sampleVolunteerSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<VolunteerSubmission | null>(null);

  // Delete
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) return;

    try {
      const { data } = await supabase
        .from('volunteer_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setSubmissions(data);
      }
    } catch (err) {
      console.warn("Using sample submissions fallback", err);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: VolunteerStatus) => {
    const { isConfigured } = getSupabaseCredentials();

    if (isConfigured) {
      try {
        await supabase
          .from('volunteer_submissions')
          .update({ status: newStatus })
          .eq('id', id);
      } catch (e) {}
    }

    setSubmissions(
      submissions.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );

    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission({ ...selectedSubmission, status: newStatus });
    }

    setToast({
      id: Date.now().toString(),
      type: 'info',
      title: 'Status Updated',
      message: `Submission marked as ${newStatus}.`,
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    const { isConfigured } = getSupabaseCredentials();
    if (isConfigured) {
      try {
        await supabase.from('volunteer_submissions').delete().eq('id', deleteTargetId);
      } catch (e) {}
    }

    setSubmissions(submissions.filter((s) => s.id !== deleteTargetId));
    if (selectedSubmission?.id === deleteTargetId) setSelectedSubmission(null);

    setIsDeleting(false);
    setDeleteTargetId(null);
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: 'Submission Deleted',
      message: 'Student submission deleted from administrative log.',
    });
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Privacy Guard Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 text-xs text-amber-900">
        <Lock className="w-5 h-5 text-amber-600 shrink-0" />
        <div>
          <span className="font-bold block">Strict Privacy Guard Active</span>
          Student phone numbers, email addresses, and application reasons are kept strictly confidential inside this teacher-controlled portal and never exposed on the public website.
        </div>
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-700" /> Student Volunteer Submissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review incoming student applications, contact candidates, and assign club status.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table / List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200">
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                {submissions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400">
                      No volunteer submissions received yet.
                    </td>
                  </tr>
                ) : (
                  submissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className={`hover:bg-slate-50 transition cursor-pointer ${
                        selectedSubmission?.id === sub.id ? 'bg-blue-50/60' : ''
                      }`}
                      onClick={() => setSelectedSubmission(sub)}
                    >
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {sub.full_name}
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">
                        {sub.class_section}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sub.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                          sub.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                          sub.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedSubmission(sub)}
                            className="p-1 hover:bg-slate-200 rounded text-slate-700"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteTargetId(sub.id)}
                            className="p-1 hover:bg-red-100 rounded text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Details View */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs space-y-4">
          <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-2">
            Application Detail View
          </h3>

          {!selectedSubmission ? (
            <p className="text-xs text-slate-400 italic py-8 text-center">
              Select a student row from the list to inspect full details.
            </p>
          ) : (
            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Student Name & Class</span>
                <span className="font-bold text-slate-900 text-base">{selectedSubmission.full_name}</span>
                <span className="block text-slate-500 font-medium">{selectedSubmission.class_section}</span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                  <a href={`mailto:${selectedSubmission.email}`} className="hover:underline font-medium">
                    {selectedSubmission.email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span className="font-medium">{selectedSubmission.phone}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Interests</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSubmission.interests?.map((i) => (
                    <span key={i} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[10px]">
                      {i}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reason to Join</span>
                <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed">
                  {selectedSubmission.reason_to_join}
                </p>
              </div>

              {selectedSubmission.availability && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Availability</span>
                  <span className="text-slate-700 font-medium">{selectedSubmission.availability}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Update Application Status</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'contacted')}
                    className="py-1.5 px-2 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded font-bold text-[11px]"
                  >
                    Mark Contacted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'accepted')}
                    className="py-1.5 px-2 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 rounded font-bold text-[11px]"
                  >
                    Mark Accepted
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'rejected')}
                    className="py-1.5 px-2 bg-red-50 text-red-900 hover:bg-red-100 rounded font-bold text-[11px]"
                  >
                    Mark Rejected
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedSubmission.id, 'pending')}
                    className="py-1.5 px-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded font-bold text-[11px]"
                  >
                    Reset Pending
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Submission?"
        message="Are you sure you want to delete this volunteer submission?"
        confirmLabel="Delete Record"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
