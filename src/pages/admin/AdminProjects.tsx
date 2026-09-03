import React, { useEffect, useState } from 'react';
import {
  FolderKanban,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Upload,
  Calendar,
  MapPin,
  X
} from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../../lib/supabase';
import { Project, ApprovalStatus } from '../../types';
import { sampleProjects } from '../../lib/mockData';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Toast, ToastMessage } from '../../components/ui/Toast';

export const AdminProjects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Community Service');
  const [status, setStatus] = useState<'Upcoming' | 'In Progress' | 'Completed' | 'Ongoing'>('Completed');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [fullReport, setFullReport] = useState('');
  const [objective, setObjective] = useState('');
  const [impactSummary, setImpactSummary] = useState('');
  const [volunteerCount, setVolunteerCount] = useState(25);
  const [volunteerHours, setVolunteerHours] = useState(75);
  const [peopleImpacted, setPeopleImpacted] = useState(300);
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>('published');
  const [published, setPublished] = useState(true);

  // Delete Confirm State
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const { isConfigured } = getSupabaseCredentials();
    if (!isConfigured) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setProjects(data);
      }
    } catch (err) {
      console.warn("Using sample projects fallback", err);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setTitle('');
    setCategory('Community Service');
    setStatus('Completed');
    setDate(new Date().toISOString().split('T')[0]);
    setLocation('Jagran Public School, Noida');
    setCoverImageUrl('');
    setShortDescription('');
    setFullReport('');
    setObjective('');
    setImpactSummary('');
    setVolunteerCount(25);
    setVolunteerHours(75);
    setPeopleImpacted(300);
    setApprovalStatus('published');
    setPublished(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj: Project) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setCategory(proj.category);
    setStatus(proj.status);
    setDate(proj.date);
    setLocation(proj.location || '');
    setCoverImageUrl(proj.cover_image_url || '');
    setShortDescription(proj.short_description);
    setFullReport(proj.full_report || '');
    setObjective(proj.objective || '');
    setImpactSummary(proj.impact_summary || '');
    setVolunteerCount(proj.volunteer_count || 0);
    setVolunteerHours(proj.volunteer_hours || 0);
    setPeopleImpacted(proj.people_impacted || 0);
    setApprovalStatus(proj.approval_status);
    setPublished(proj.published);
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image format
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setToast({
        id: Date.now().toString(),
        type: 'error',
        title: 'Invalid File Format',
        message: 'Please upload a JPEG, PNG, or WebP image.'
      });
      return;
    }

    setIsUploading(true);
    const { isConfigured } = getSupabaseCredentials();

    if (isConfigured) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `proj_${Date.now()}.${fileExt}`;
        const { data, error } = await supabase.storage
          .from('project-images')
          .upload(fileName, file);

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from('project-images')
          .getPublicUrl(fileName);

        if (publicUrlData?.publicUrl) {
          setCoverImageUrl(publicUrlData.publicUrl);
          setToast({
            id: Date.now().toString(),
            type: 'success',
            title: 'Image Uploaded',
            message: 'Cover image uploaded to project-images bucket successfully.'
          });
        }
      } catch (err: any) {
        console.warn("Upload fallback error:", err);
        // Fallback placeholder
        setCoverImageUrl(URL.createObjectURL(file));
      } finally {
        setIsUploading(false);
      }
    } else {
      setCoverImageUrl(URL.createObjectURL(file));
      setIsUploading(false);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const projectPayload: Partial<Project> = {
      title: title.trim(),
      slug: slug || `project-${Date.now()}`,
      category,
      status,
      date,
      location: location.trim(),
      cover_image_url: coverImageUrl,
      short_description: shortDescription.trim(),
      full_report: fullReport.trim(),
      objective: objective.trim(),
      impact_summary: impactSummary.trim(),
      volunteer_count: Number(volunteerCount),
      volunteer_hours: Number(volunteerHours),
      people_impacted: Number(peopleImpacted),
      approval_status: approvalStatus,
      published,
    };

    const { isConfigured } = getSupabaseCredentials();

    try {
      if (editingProject) {
        // Edit existing project
        if (isConfigured) {
          const { error } = await supabase
            .from('projects')
            .update(projectPayload)
            .eq('id', editingProject.id);
          if (error) throw error;
        }

        setProjects(projects.map((p) => (p.id === editingProject.id ? { ...p, ...projectPayload } as Project : p)));
        setToast({ id: Date.now().toString(), type: 'success', title: 'Project Updated', message: 'Project changes saved successfully.' });
      } else {
        // Create new project
        const newProj: Project = {
          id: `proj-${Date.now()}`,
          ...projectPayload,
          created_at: new Date().toISOString(),
        } as Project;

        if (isConfigured) {
          const { data, error } = await supabase
            .from('projects')
            .insert([{ ...projectPayload, created_at: new Date().toISOString() }])
            .select('*')
            .single();

          if (error) throw error;
          if (data) newProj.id = data.id;
        }

        setProjects([newProj, ...projects]);
        setToast({ id: Date.now().toString(), type: 'success', title: 'Project Created', message: 'New project created successfully.' });
      }
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Save error:", err);
      setToast({ id: Date.now().toString(), type: 'error', title: 'Save Failed', message: err.message || 'Error saving project record.' });
    }
  };

  const handleTogglePublish = async (proj: Project) => {
    const updatedStatus = !proj.published;
    const { isConfigured } = getSupabaseCredentials();

    if (isConfigured) {
      try {
        await supabase
          .from('projects')
          .update({ published: updatedStatus })
          .eq('id', proj.id);
      } catch (e) {}
    }

    setProjects(projects.map((p) => p.id === proj.id ? { ...p, published: updatedStatus } : p));
    setToast({
      id: Date.now().toString(),
      type: 'info',
      title: updatedStatus ? 'Project Published' : 'Project Unpublished',
      message: `Project visibility updated.`
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    setIsDeleting(true);
    const { isConfigured } = getSupabaseCredentials();

    if (isConfigured) {
      try {
        await supabase
          .from('projects')
          .delete()
          .eq('id', deleteTargetId);
      } catch (e) {}
    }

    setProjects(projects.filter((p) => p.id !== deleteTargetId));
    setIsDeleting(false);
    setDeleteTargetId(null);
    setToast({
      id: Date.now().toString(),
      type: 'success',
      title: 'Project Deleted',
      message: 'Project record deleted successfully.'
    });
  };

  return (
    <div className="space-y-6">
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-800" /> Service Projects Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Create, update reports, publish to website, and upload cover images to project-images bucket.
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="bg-blue-800 hover:bg-blue-900 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition flex items-center gap-1.5 shadow-xs"
        >
          <Plus className="w-4 h-4" /> Create New Project
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-4">Cover & Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Metrics</th>
                <th className="py-3 px-4">Approval & Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No projects found. Click "Create New Project" to add one.
                  </td>
                </tr>
              ) : (
                projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-semibold text-slate-900 max-w-xs">
                      <div className="flex items-center gap-3">
                        {proj.cover_image_url && (
                          <img
                            src={proj.cover_image_url}
                            alt=""
                            className="w-10 h-10 rounded object-cover border shrink-0"
                            onError={(event) => event.currentTarget.remove()}
                          />
                        )}
                        <div>
                          <span className="block truncate font-bold text-slate-900">{proj.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">{proj.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-600">
                      <span className="bg-slate-100 px-2 py-0.5 rounded font-semibold text-[11px]">
                        {proj.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-medium">
                      {proj.date}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div>{proj.volunteer_count} vols &bull; {proj.volunteer_hours} hrs</div>
                      <div className="text-[10px] text-slate-400">{proj.people_impacted} impacted</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          proj.approval_status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {proj.approval_status}
                        </span>
                        <button
                          onClick={() => handleTogglePublish(proj)}
                          className={`text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                            proj.published ? 'text-emerald-700 hover:underline' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          {proj.published ? <Eye className="w-3 h-3 text-emerald-600" /> : <EyeOff className="w-3 h-3" />}
                          {proj.published ? 'Live on Site' : 'Hidden'}
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(proj)}
                          className="p-1.5 rounded hover:bg-slate-200 text-slate-700 transition"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTargetId(proj.id)}
                          className="p-1.5 rounded hover:bg-red-100 text-red-600 transition"
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

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in">
            <div className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center border-b border-slate-800">
              <h3 className="font-bold text-base">
                {editingProject ? 'Edit Service Project' : 'Create New Service Project'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tree Plantation Drive 2026"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  >
                    <option value="Community Service">Community Service</option>
                    <option value="Environmental Action">Environmental Action</option>
                    <option value="Awareness Drives">Awareness Drives</option>
                    <option value="Youth Leadership">Youth Leadership</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Project Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Jagran Public School, Noida"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                </div>
              </div>

              {/* Cover Image URL / Storage Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cover Image URL or Bucket Upload
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    placeholder="Optional local or approved image path"
                    value={coverImageUrl}
                    onChange={(e) => setCoverImageUrl(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                  />
                  <label className="bg-slate-800 hover:bg-slate-900 text-white px-3 py-2 rounded-lg text-xs font-medium cursor-pointer flex items-center gap-1 shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    {isUploading ? 'Uploading...' : 'Upload File'}
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {coverImageUrl && (
                  <img src={coverImageUrl} alt="Preview" className="h-20 w-32 object-cover rounded border" onError={(event) => event.currentTarget.remove()} />
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Short Description *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Brief summary shown on homepage & projects grid..."
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Key Objective
                </label>
                <input
                  type="text"
                  placeholder="e.g. Increasing green cover and environmental responsibility"
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Activity Report
                </label>
                <textarea
                  rows={4}
                  placeholder="Detailed report of execution, student participation, and timeline..."
                  value={fullReport}
                  onChange={(e) => setFullReport(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Impact Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Planted 150+ trees and engaged 35 active volunteers"
                  value={impactSummary}
                  onChange={(e) => setImpactSummary(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Volunteers Count
                  </label>
                  <input
                    type="number"
                    value={volunteerCount}
                    onChange={(e) => setVolunteerCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Volunteer Hours
                  </label>
                  <input
                    type="number"
                    value={volunteerHours}
                    onChange={(e) => setVolunteerHours(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    People Impacted
                  </label>
                  <input
                    type="number"
                    value={peopleImpacted}
                    onChange={(e) => setPeopleImpacted(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Approval Status
                  </label>
                  <select
                    value={approvalStatus}
                    onChange={(e) => setApprovalStatus(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg"
                  >
                    <option value="published">Published</option>
                    <option value="pending_approval">Pending Approval</option>
                    <option value="draft">Draft</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="rounded text-blue-800 focus:ring-blue-800 w-4 h-4"
                    />
                    <span>Publish live on public website immediately</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-800 hover:bg-blue-900 rounded-lg transition"
                >
                  Save Project Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        title="Delete Project Record?"
        message="Are you sure you want to delete this project? This operation cannot be undone."
        confirmLabel="Delete Project"
        isDanger={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTargetId(null)}
      />
    </div>
  );
};
