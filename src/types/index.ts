export type ApprovalStatus = 'draft' | 'pending_approval' | 'published' | 'rejected';
export type AnnouncementStatus = 'draft' | 'pending_approval' | 'published' | 'archived';
export type VolunteerStatus = 'pending' | 'contacted' | 'accepted' | 'rejected';
export type UserRole = 'teacher_super_admin' | 'club_officer' | 'member';

export interface Profile {
  id: string;
  auth_user_id: string;
  full_name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at?: string;
}

export interface ClubSettings {
  id?: string;
  club_name: string;
  school_name: string;
  teacher_incharge_name?: string;
  president_name?: string;
  secretary_name?: string;
  current_session: string;
  logo_url?: string;
  instagram_url?: string;
  contact_email?: string;
  total_projects: number;
  active_members: number;
  volunteer_hours: number;
  people_impacted: number;
  updated_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Ongoing';
  date: string;
  location?: string;
  cover_image_url?: string;
  short_description: string;
  full_report?: string;
  objective?: string;
  impact_summary?: string;
  volunteer_count: number;
  volunteer_hours: number;
  people_impacted: number;
  approval_status: ApprovalStatus;
  published: boolean;
  created_at?: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  description: string;
  registration_link?: string;
  status: 'Upcoming' | 'Ongoing' | 'Completed' | 'Cancelled';
  linked_project_id?: string;
  created_at?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description?: string;
  cover_image_url?: string;
  is_public: boolean;
  created_at?: string;
  image_count?: number;
}

export interface GalleryImage {
  id: string;
  album_id: string;
  image_url: string;
  caption?: string;
  is_public: boolean;
  created_at?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  status: AnnouncementStatus;
  is_pinned: boolean;
  publish_date: string;
  created_at?: string;
}

export interface VolunteerSubmission {
  id: string;
  full_name: string;
  class_section: string;
  email: string;
  phone: string;
  interests: string | string[];
  reason_to_join: string;
  availability?: string;
  status: VolunteerStatus;
  submitted_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Member {
  id: string;
  full_name: string;
  class_section?: string;
  role: string;
  committee?: string;
  email?: string;
  phone?: string;
  year_session?: string;
  participation_count?: number;
  is_public: boolean;
  is_active: boolean;
  created_at?: string;
}
