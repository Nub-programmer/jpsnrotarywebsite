import React, { useEffect, useState } from 'react';
import { Users, Trash2, Mail, Phone, Lock, Eye, Calendar, RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { supabase, getSupabaseCredentials, checkAdminAccess } from '../../lib/supabase';
import { VolunteerSubmission, VolunteerStatus } from '../../types';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Toast, ToastMessage } from '../../components/ui/Toast';
import { sendApplicantStatusEmail } from '../../lib/emailService';

export const AdminVolunteers: React.FC = () => {
  const [submissions, setSubmissions] = useState<VolunteerSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<VolunteerSubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // Delete modal state
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    setErrorMessage('');

    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) {
      setErrorMessage('Supabase is not configured. Please check environment variables.');
      setLoading(false);
      return;
    }

    try {
      // Verify admin access
      const accessResult = await checkAdminAccess();
      if (!accessResult.hasAccess) {
        setErrorMessage(accessResult.error || 'Access denied. This account is not approved for admin access.');
        setLoading(false);
        return;
      }

      // Query volunteer_submissions ordered by submitted_at descending
      const { data, error } = await supabase
        .from('volunteer_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        if (import.meta.env.DEV) {
          console.error('[DEV] Error fetching volunteer submissions:', error);
        }
        setErrorMessage(error.message || 'Failed to load volunteer submissions.');
        setSubmissions([]);
      } else {
        setSubmissions(data || []);
      }
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('[DEV] Exception in fetchSubmissions:', err);
      }
      setErrorMessage('Unable to connect to database service.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: VolunteerStatus) => {
    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) return;

    const currentSub = submissions.find((s) => s.id === id);
    if (!currentSub) return;

    // Do not send duplicate emails if status hasn't changed
    const statusChanged = currentSub.status !== newStatus;

    try {
      const { error } = await supabase
        .from('volunteer_submissions')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('[DEV] Error updating volunteer status:', error);
        }
        setToast({
          id: Date.now().toString(),
          type: 'error',
          title: 'Update Failed',
          message: error.message || 'Failed to update status.',
        });
        return;
      }

      // Update local state
      setSubmissions((prev) =>
        prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
      );

      if (selectedSubmission && selectedSubmission.id === id) {
        setSelectedSubmission({ ...selectedSubmission, status: newStatus });
      }

      // Send email if status changed and newStatus is accepted, contacted, or rejected
      if (statusChanged && (newStatus === 'accepted' || newStatus === 'contacted' || newStatus === 'rejected')) {
        const emailRes = await sendApplicantStatusEmail(
          currentSub.email,
          currentSub.full_name,
          newStatus
        );

        if (emailRes.success) {
          setToast({
            id: Date.now().toString(),
            type: 'success',
            title: 'Status Updated',
            message: 'Status updated and email notification sent.',
          });
        } else {
          setToast({
            id: Date.now().toString(),
            type: 'warning',
            title: 'Status Updated',
            message: 'Status updated, but email notification could not be sent.',
          });
        }
      } else {
        setToast({
          id: Date.now().toString(),
          type: 'success',
          title: 'Status Updated',
          message: `Submission marked as ${newStatus}.`,
        });
      }
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('[DEV] Exception updating status:', err);
      }
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Update Failed',
        message: 'An unexpected error occurred while updating status.',
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase
        .from('volunteer_submissions')
        .delete()
        .eq('id', deleteTargetId);

      if (error) {
        if (import.meta.env.DEV) {
          console.error('[DEV] Error deleting volunteer submission:', error);
        }
        setToast({
          id: Date.now().toString(),
          type: 'error',
          title: 'Delete Failed',
          message: error.message || 'Failed to delete submission.',
        });
      } else {
        setSubmissions((prev) => prev.filter((s) => s.id !== deleteTargetId));
        if (selectedSubmission?.id === deleteTargetId) {
          setSelectedSubmission(null);
        }

        setToast({
          id: Date.now().toString(),
          type: 'success',
          title: 'Submission Deleted',
          message: 'Student submission deleted from administrative log.',
        });
      }
    } catch (err: any) {
      if (import.meta.env.DEV) {
        console.error('[DEV] Exception deleting submission:', err);
      }
    } finally {
      setIsDeleting(false);
      setDeleteTargetId(null);
    }
  };

  const formatInterests = (interestsData: string | string[] | undefined): string[] => {
    if (!interestsData) return [];
    if (Array.isArray(interestsData)) return interestsData;
    return interestsData.split(',').map((i) => i.trim()).filter(Boolean);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Privacy Guard Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-3 text-xs text-amber-900">
        <div className="flex items-center gap-3">
          <Lock className="w-5 h-5 text-amber-600 shrink-0" />
          <div>
            <span className="font-bold block">Strict Privacy Guard Active</span>
            Student phone numbers, email addresses, and application reasons are kept strictly confidential inside this teacher-controlled portal and never exposed on the public website.
          </div>
        </div>
        <button
          onClick={fetchSubmissions}
          disabled={loading}
          className="p-2 hover:bg-amber-100 rounded-lg text-amber-800 transition flex items-center gap-1 font-semibold text-xs shrink-0 cursor-pointer"
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      <div className="flex justify-between items-center bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-700" /> Volunteer Submissions
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review incoming student applications, contact candidates, and assign club status.
          </p>
        </div>
        <div className="text-xs font-bold bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
          Total: {submissions.length}
        </div>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-600 font-medium text-sm flex items-center justify-center gap-2 shadow-2xs">
          <Loader2 className="w-5 h-5 text-blue-800 animate-spin" />
          <span>Loading volunteer submissions…</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table / List */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase border-b border-slate-200">
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-400 font-medium">
                        No volunteer submissions yet.
                      </td>
                    </tr>
                  ) : (
                    submissions.map((sub) => {
                      const displayDate = sub.submitted_at || sub.created_at;
                      return (
                        <tr
                          key={sub.id}
                          className={`hover:bg-slate-50 transition cursor-pointer ${
                            selectedSubmission?.id === sub.id ? 'bg-blue-50/60' : ''
                          }`}
                          onClick={() => setSelectedSubmission(sub)}
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {sub.full_name}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 font-medium">
                            {sub.class_section}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-[11px]">
                            {formatDate(displayDate)}
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              sub.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                              sub.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                              sub.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {sub.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                              <button
                                onClick={() => setSelectedSubmission(sub)}
                                className="p-1 hover:bg-slate-200 rounded text-slate-700 cursor-pointer"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteTargetId(sub.id)}
                                className="p-1 hover:bg-red-100 rounded text-red-600 cursor-pointer"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
                  <span className="font-bold text-slate-900 text-base block">{selectedSubmission.full_name}</span>
                  <span className="text-slate-600 font-medium">{selectedSubmission.class_section}</span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Submitted: {formatDate(selectedSubmission.submitted_at || selectedSubmission.created_at)}</span>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center gap-2 text-slate-700">
                    <Mail className="w-3.5 h-3.5 text-blue-800 shrink-0" />
                    <a href={`mailto:${selectedSubmission.email}`} className="hover:underline font-medium break-all">
                      {selectedSubmission.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <Phone className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <a href={`tel:${selectedSubmission.phone}`} className="hover:underline font-medium">
                      {selectedSubmission.phone}
                    </a>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Interests</span>
                  <div className="flex flex-wrap gap-1">
                    {formatInterests(selectedSubmission.interests).length > 0 ? (
                      formatInterests(selectedSubmission.interests).map((interest, idx) => (
                        <span key={idx} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium text-[10px]">
                          {interest}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 italic">None specified</span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Reason to Join</span>
                  <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {selectedSubmission.reason_to_join || 'N/A'}
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
                      className={`py-1.5 px-2 rounded font-bold text-[11px] cursor-pointer transition ${
                        selectedSubmission.status === 'contacted'
                          ? 'bg-blue-800 text-white'
                          : 'bg-blue-50 text-blue-900 hover:bg-blue-100'
                      }`}
                    >
                      Mark Contacted
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedSubmission.id, 'accepted')}
                      className={`py-1.5 px-2 rounded font-bold text-[11px] cursor-pointer transition ${
                        selectedSubmission.status === 'accepted'
                          ? 'bg-emerald-800 text-white'
                          : 'bg-emerald-50 text-emerald-900 hover:bg-emerald-100'
                      }`}
                    >
                      Mark Accepted
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedSubmission.id, 'rejected')}
                      className={`py-1.5 px-2 rounded font-bold text-[11px] cursor-pointer transition ${
                        selectedSubmission.status === 'rejected'
                          ? 'bg-red-800 text-white'
                          : 'bg-red-50 text-red-900 hover:bg-red-100'
                      }`}
                    >
                      Mark Rejected
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedSubmission.id, 'pending')}
                      className={`py-1.5 px-2 rounded font-bold text-[11px] cursor-pointer transition ${
                        selectedSubmission.status === 'pending'
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Reset Pending
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Submission?"
        message="Are you sure you want to delete this volunteer submission? This action cannot be undone."
        confirmLabel="Delete Record"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
