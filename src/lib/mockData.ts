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
import specialImage from '../../assets/special.jpg';
import verdantImage from '../../assets/verdant.jpg';
import verdantDetailImage from '../../assets/verdant1.jpg';

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
    title: "Project Verdant",
    slug: "project-verdant",
    category: "Environment",
    status: "Completed",
    date: "11 July 2026",
    location: "Jagran Public School, Noida",
    cover_image_url: verdantImage,
    short_description: "The Interact Club of Jagran Public School, Noida participated in Project Verdant, the flagship environmental initiative of Interact District 3012 for Rotary Year 2026–27, under the theme “Plant 10. Nurture 10.”",
    full_report: "The Interact Club of Jagran Public School, Noida proudly participated in Project Verdant, the flagship environmental initiative of Interact District 3012 for Rotary Year 2026–27. Guided by the theme “Plant 10. Nurture 10.”, the club organized a plantation drive on the school campus to promote environmental awareness and encourage students to take responsibility for protecting nature.\n\nMembers enthusiastically planted saplings and pledged to nurture them through regular care, reinforcing the idea that true environmental impact comes not only from planting trees but from ensuring they continue to grow and thrive.\n\nThe plantation drive brought together students and teachers with a shared vision of creating a cleaner and greener environment. Through this activity, participants gained a deeper understanding of nature conservation, sustainable practices, and the importance of preserving biodiversity. The event also fostered teamwork, leadership, and civic responsibility among the Interactors.\n\nThe club has pledged to regularly monitor and care for the planted saplings, strengthening its commitment to protecting nature beyond a single event. The club extends heartfelt gratitude to Senior Coordinator Mrs. Sangeeta Bishnoi for her constant encouragement, guidance, and support throughout the project.",
    objective: "To promote environmental awareness, encourage tree plantation, and inspire students to nurture saplings as a long-term responsibility.",
    impact_summary: "Students and teachers came together to support sustainability, plant saplings, and promote eco-friendly habits within the school community.",
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
    id: "evt-student-leadership",
    title: "Inspiring Change Through Student Leadership",
    date: "7 August 2026",
    time: "",
    venue: "Jagran Public School, Noida",
    category: "Assembly / Awareness / Sustainability",
    cover_image_url: specialImage,
    status: "Completed",
    description: "A student-led special assembly highlighting wellness, national pride, environmental action, and community health.",
    full_description: "On 7 August 2026, Jagran Public School, Noida witnessed a series of impactful student-led initiatives promoting wellness, national pride, environmental action, and community health.\n\nStudents of Class XI organized a No-Tobacco awareness session and Nukkad Natak dedicated to the well-being of the school’s hardworking housekeeping and support staff. Students of Class V celebrated Independence Day with enthusiasm, paying tribute to freedom fighters through inspiring speeches and poems.\n\nThe Interact Club also launched a school-wide sustainability drive, encouraging students to adopt eco-friendly habits under the guidance of Senior Coordinator Mrs. Sangeeta Bishnoi.\n\nThe school Principal, Dr. D. K. Sinha, commended the young leaders and faculty mentors for organizing meaningful initiatives that strengthened school values and community bonds.",
    created_at: new Date().toISOString()
  },
  {
    id: "evt-dila",
    title: "DILA",
    date: "To Be Announced",
    time: "",
    venue: "Amity University",
    status: "Upcoming",
    description: "DILA is an upcoming Interact leadership and training event where club members and office bearers will learn about leadership, service, and club responsibilities.",
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
    title: "Project Verdant",
    description: "Photos from Project Verdant, the tree plantation drive conducted by the Interact Club of Jagran Public School, Noida under the theme “Plant 10. Nurture 10.”",
    cover_image_url: verdantImage,
    is_public: true,
    image_count: 2,
    created_at: "2026-07-11T10:00:00Z"
  },
  {
    id: "album-student-leadership",
    title: "Inspiring Change Through Student Leadership",
    description: "A student-led special assembly and sustainability initiative promoting wellness, national pride, environmental action, and community health.",
    cover_image_url: specialImage,
    is_public: true,
    image_count: 1,
    created_at: "2026-08-07T10:00:00Z"
  }
];

export const sampleGalleryImages: GalleryImage[] = [
  {
    id: "img-1",
    album_id: "album-1",
    image_url: verdantImage,
    caption: "Group photo from Project Verdant plantation drive at Jagran Public School, Noida.",
    is_public: true
  },
  {
    id: "img-2",
    album_id: "album-1",
    image_url: verdantDetailImage,
    caption: "Interact Club members planting saplings as part of Project Verdant.",
    is_public: true
  },
  {
    id: "img-student-leadership",
    album_id: "album-student-leadership",
    image_url: specialImage,
    caption: "Student-led initiatives and sustainability drive at Jagran Public School, Noida.",
    is_public: true
  }
];

export const sampleVolunteerSubmissions: VolunteerSubmission[] = [];
