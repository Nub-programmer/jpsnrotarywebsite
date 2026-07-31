import React, { useEffect, useState } from 'react';
import { Users, Plus, Edit, Trash2, Eye, EyeOff, ShieldCheck, Search, Filter } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../../lib/supabase';
import { Member } from '../../types';
import { sampleMembers } from '../../lib/mockData';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Toast, ToastMessage } from '../../components/ui/Toast';

export const AdminMembers: React.FC = () => {
  const [members, setMembers] = useState<Member[]>(sampleMembers);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [classSection, setClassSection] = useState('');
  const [role, setRole] = useState('Member');
  const [committee, setCommittee] = useState('General');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [yearSession, setYearSession] = useState('2025 - 2026');
  const [isPublic, setIsPublic] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Delete State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setMembers(data);
      }
    } catch (err) {
      console.warn("Using sample members fallback", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setEditingMember(null);
    setFullName('');
    setClassSection('');
    setRole('Member');
    setCommittee('General');
    setEmail('');
    setPhone('');
    setYearSession('2025 - 2026');
    setIsPublic(false);
    setIsActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (mem: Member) => {
    setEditingMember(mem);
    setFullName(mem.full_name);
    setClassSection(mem.class_section || '');
    setRole(mem.role);
    setCommittee(mem.committee || '');
    setEmail(mem.email || '');
    setPhone(mem.phone || '');
    setYearSession(mem.year_session || '2025 - 2026');
    setIsPublic(mem.is_public);
    setIsActive(mem.is_active);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      full_name: fullName.trim(),
      class_section: classSection.trim(),
      role: role.trim(),
      committee: committee.trim(),
      email: email.trim(),
      phone: phone.trim(),
      year_session: yearSession.trim(),
      is_public: isPublic,
      is_active: isActive,
    };

    const { isConfigured } = getSupabaseCredentials();

    try {
      if (editingMember) {
        if (isConfigured) {
          await supabase.from('members').update(payload).eq('id', editingMember.id);
        }
        setMembers(members.map((m) => m.id === editingMember.id ? { ...m, ...payload } as Member : m));
        setToast({ id: Date.now().toString(), type: 'success', title: 'Member Saved', message: 'Member details updated.' });
      } else {
        const newMem: Member = { id: `mem-${Date.now()}`, ...payload, created_at: new Date().toISOString() };
        if (isConfigured) {
          const { data } = await supabase.from('members').insert([payload]).select('*').single();
          if (data) newMem.id = data.id;
        }
        setMembers([newMem, ...members]);
        setToast({ id: Date.now().toString(), type: 'success', title: 'Member Added', message: 'New member record created.' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setToast({ id: Date.now().toString(), type: 'error', title: 'Save Failed', message: err.message });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);

    const { isConfigured } = getSupabaseCredentials();
    if (isConfigured) {
      try {
        await supabase.from('members').delete().eq('id', deleteTargetId);
      } catch (e) {}
    }

    setMembers(members.filter((m) => m.id !== deleteTargetId));
    setIsDeleting(false);
    setDeleteTargetId(null);
    setToast({ id: Date.now().toString(), type: 'success', title: 'Member Deleted', message: 'Record removed from roster.' });
  };

  const filteredMembers = members.filter((m) =>
    m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (m.committee && m.committee.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-600" /> Members Directory & Roster
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage student interactors, office bearer appointments, and privacy settings.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Add Member
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search by name, role, or committee..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-xs border border-slate-300 rounded-lg bg-white"
        />
      </div>

      {/* Members Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-4">Member Name</th>
                <th className="py-3 px-4">Class</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Committee</th>
                <th className="py-3 px-4">Public Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400">
                    No member records found.
                  </td>
                </tr>
              ) : (
                filteredMembers.map((mem) => (
                  <tr key={mem.id} className="hover:bg-slate-50/50 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{mem.full_name}</td>
                    <td className="py-3 px-4 text-slate-600">{mem.class_section || '-'}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {mem.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{mem.committee || 'General'}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                        mem.is_public ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {mem.is_public ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {mem.is_public ? 'Public Visible' : 'Hidden / Private'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button onClick={() => handleOpenEdit(mem)} className="p-1.5 hover:bg-slate-100 rounded text-slate-600"><Edit className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTargetId(mem.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">{editingMember ? 'Edit Member' : 'Add New Member'}</h3>
            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name *</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Class & Section</label>
                  <input type="text" placeholder="e.g. 11-A" value={classSection} onChange={(e) => setClassSection(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Role *</label>
                  <input type="text" required value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Committee</label>
                <input type="text" placeholder="e.g. Environment / Media" value={committee} onChange={(e) => setCommittee(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email (Admin View Only)</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Phone (Admin View Only)</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 text-xs border rounded-lg" />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} className="rounded text-blue-800" />
                  <span>Show publicly in directory</span>
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-3 py-1.5 text-xs font-medium bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-1.5 text-xs font-bold bg-blue-800 text-white rounded-lg">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Member?"
        message="Are you sure you want to remove this member record?"
        confirmLabel="Delete Member"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
