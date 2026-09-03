import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, FolderKanban, ArrowRight } from 'lucide-react';
import { supabase, getSupabaseCredentials } from '../lib/supabase';
import { Project } from '../types';
import { mergeById, sampleProjects } from '../lib/mockData';

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    const fetchProjects = async () => {
      const { isConfigured } = getSupabaseCredentials();
      if (!isConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('projects')
          .select('*')
          .eq('published', true)
          .eq('approval_status', 'published')
          .order('created_at', { ascending: false });

        setProjects(mergeById(sampleProjects, data || []));
      } catch (err) {
        console.warn("Error fetching projects from Supabase:", err);
        setProjects(sampleProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ['All', 'Community Service', 'Environment', 'Awareness Drives', 'Youth Leadership'];
  const statuses = ['All', 'Completed', 'In Progress', 'Upcoming', 'Ongoing'];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.short_description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || project.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || project.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-blue-800 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Impact Portfolio
        </span>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
          Club Service Projects
        </h1>
        <p className="text-sm md:text-base text-slate-600">
          Explore approved service projects, environmental drives, and community initiatives organized by the Interact Club of Jagran Public School, Noida.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search projects by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:outline-none"
          />
        </div>

        {/* Category Dropdown */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-xs font-bold text-slate-600">
            <Filter className="w-3.5 h-3.5" /> Category:
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs font-medium border border-slate-300 rounded-lg px-3 py-2 bg-slate-50 focus:outline-none"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>Status: {st}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400 text-xs font-medium">Loading projects...</div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-12 text-center space-y-3">
          <FolderKanban className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="font-bold text-slate-700 text-base">No projects found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Starter content can be initialized from the admin dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              {/* Cover Image & Category Badges */}
              <div>
                <div className="h-52 bg-slate-100 relative overflow-hidden">
                  <img
                    src={project.cover_image_url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    <span className="text-[11px] bg-blue-900 text-white font-semibold px-2.5 py-0.5 rounded shadow-2xs">
                      {project.category}
                    </span>
                    <span className="text-[11px] bg-emerald-600 text-white font-semibold px-2 py-0.5 rounded shadow-2xs">
                      {project.status}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-700" /> {project.date || 'To Be Announced'}
                    </span>
                    {project.location && (
                      <span className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPin className="w-3.5 h-3.5 text-amber-600 shrink-0" /> {project.location}
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 text-base leading-snug hover:text-blue-900 transition">
                    {project.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {project.short_description}
                  </p>
                </div>
              </div>

              {/* Stats & Detail Link Footer */}
              <div className="p-5 pt-0">
                <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-slate-50 rounded-lg text-center text-[11px] text-slate-600 font-medium mb-4">
                  <div>
                    <span className="block font-bold text-slate-900">{project.volunteer_count || 0}</span>
                    <span>Volunteers</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">{project.volunteer_hours || 0}h</span>
                    <span>Hours</span>
                  </div>
                  <div>
                    <span className="block font-bold text-slate-900">{project.people_impacted || 0}</span>
                    <span>Impacted</span>
                  </div>
                </div>

                <Link
                  to={`/projects/${project.slug || project.id}`}
                  className="w-full bg-blue-800 hover:bg-blue-900 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-1.5 shadow-2xs"
                >
                  View Full Impact Report <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
