import {
  ClubSettings,
  Project,
  EventItem,
  GalleryAlbum,
  GalleryImage,
  Announcement,
  VolunteerSubmission,
  Member
} from '../types';

export const initialClubSettings: ClubSettings = {
  club_name: "Interact Club of Jagran Public School, Noida",
  school_name: "Jagran Public School, Noida",
  teacher_incharge_name: "Teacher In-Charge",
  president_name: "Coming Soon",
  secretary_name: "Student Leadership Team",
  current_session: "2025 - 2026",
  logo_url: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=300&q=80",
  instagram_url: "",
  contact_email: "interact@jpsnoida.edu.in",
  total_projects: 0,
  active_members: 0,
  volunteer_hours: 0,
  people_impacted: 0,
};

export const sampleProjects: Project[] = [
  {
    id: "p-verdant",
    title: "Verdant",
    slug: "verdant",
    category: "Environment",
    status: "Completed",
    date: "",
    location: "Jagran Public School, Noida",
    cover_image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    short_description: "Verdant was a tree plantation drive project by the Interact Club of Jagran Public School, Noida, focused on promoting environmental responsibility and student participation in community service.",
    full_report: "Verdant was a tree plantation drive project by the Interact Club of Jagran Public School, Noida, focused on promoting environmental responsibility and student participation in community service.",
    objective: "To encourage students to take action for the environment through a tree plantation initiative.",
    impact_summary: "Students participated in a meaningful environmental activity and helped promote awareness about sustainability and green spaces.",
    volunteer_count: 0,
    volunteer_hours: 0,
    people_impacted: 0,
    approval_status: "published",
    published: true,
    created_at: new Date().toISOString()
  }
];

export const sampleEvents: EventItem[] = [
  {
    id: "evt-dila",
    title: "DILA",
    date: "To Be Announced",
    time: "",
    venue: "Amity University",
    status: "Upcoming",
    description: "DILA is an upcoming Interact leadership and training event where club members and office bearers will learn about leadership, service, and club responsibilities.",
    created_at: new Date().toISOString()
  },
  {
    id: "evt-outreach",
    title: "Outreach Assembly",
    date: "To Be Announced",
    time: "",
    venue: "Jagran Public School, Noida",
    status: "Upcoming",
    description: "An outreach assembly planned to introduce students to Interact Club activities, service goals, and upcoming opportunities for participation.",
    created_at: new Date().toISOString()
  }
];

export const sampleAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Welcome to the Digital Hub of Interact Club JPS Noida",
    content: "This digital hub was created by the Club Secretary to centralize service records, volunteer registrations, and club notices for Jagran Public School, Noida.",
    status: "published",
    is_pinned: true,
    publish_date: "2026-04-01",
    created_at: new Date().toISOString()
  }
];

export const sampleMembers: Member[] = [
  {
    id: "mem-1",
    full_name: "Teacher In-Charge",
    class_section: "Faculty",
    role: "Teacher Coordinator",
    committee: "Faculty Oversight",
    year_session: "2025 - 2026",
    is_public: false,
    is_active: true
  },
  {
    id: "mem-2",
    full_name: "Club Secretary",
    class_section: "Class 11",
    role: "Secretary",
    committee: "Executive Board",
    year_session: "2025 - 2026",
    is_public: false,
    is_active: true
  }
];

export const sampleGalleryAlbums: GalleryAlbum[] = [
  {
    id: "album-1",
    title: "Tree Plantation Drive",
    description: "Glimpses of students planting saplings in and around the campus.",
    cover_image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    is_public: true,
    image_count: 2,
    created_at: "2026-03-16T10:00:00Z"
  }
];

export const sampleGalleryImages: GalleryImage[] = [
  {
    id: "img-1",
    album_id: "album-1",
    image_url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    caption: "Interactors preparing soil for sapling planting",
    is_public: true
  },
  {
    id: "img-2",
    album_id: "album-1",
    image_url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
    caption: "Group photo with teacher-in-charge and student team",
    is_public: true
  }
];

export const sampleVolunteerSubmissions: VolunteerSubmission[] = [];
