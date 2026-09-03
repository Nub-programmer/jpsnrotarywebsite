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
import dilaImage from '../../assets/dila.png';
import donationDriveImage from '../../assets/donationdriveandumbrella.png';
import saplingsImage from '../../assets/implantationof50.png';
import outreachImage from '../../assets/outreachinitiative.png';
import projectBinImage from '../../assets/projectbin.png';
import projectBinDetailImage from '../../assets/projectbin2.png';
import umbrellaDriveImage from '../../assets/umbrelladonationdrive.png';

export const mergeById = <T extends { id: string }>(localItems: T[], remoteItems: T[]) => {
  const normalize = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const getKeys = (item: T) => {
    const record = item as T & { slug?: string; title?: string };
    const titleKey = record.title ? normalize(record.title) : '';
    return [record.slug && normalize(record.slug), titleKey, titleKey.replace(/^project-/, '')].filter(Boolean);
  };
  const merged: T[] = [];

  localItems.forEach((item) => merged.push(item));
  remoteItems.forEach((item) => {
    const keys = getKeys(item);
    const matchIndex = merged.findIndex((existingItem) => {
      const existingKeys = getKeys(existingItem);
      return keys.some((key) => existingKeys.includes(key));
    });
    if (matchIndex === -1) {
      merged.push(item);
      return;
    }

    const existing = merged[matchIndex];
    const existingRecord = existing as T & { slug?: string };
    const remoteRecord = item as T & { slug?: string };
    const remoteIsCanonicalVerdant = remoteRecord.slug?.toLowerCase() === 'project-verdant';
    const existingIsCanonicalVerdant = existingRecord.slug?.toLowerCase() === 'project-verdant';
    if (remoteIsCanonicalVerdant || !existingIsCanonicalVerdant) {
      merged[matchIndex] = item;
    }
  });

  return merged;
};

export const initialClubSettings: ClubSettings = {
  club_name: "Interact Club of Jagran Public School, Noida",
  school_name: "Jagran Public School, Noida",
  teacher_incharge_name: "Teacher In-Charge",
  president_name: "Coming Soon",
  secretary_name: "Student Leadership Team",
  current_session: "2025 - 2026",
  logo_url: "",
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
  },
  {
    id: "p-stationery-donation-drive",
    title: "Stationery Donation Drive",
    slug: "stationery-donation-drive",
    category: "Community Support",
    status: "Upcoming",
    date: "18 August 2026",
    location: "Sai Kripa NGO",
    cover_image_url: donationDriveImage,
    short_description: "A student-led stationery donation drive to support learning for children from underserved communities through Sai Kripa NGO.",
    full_report: "The Stationery Donation Drive is a student-led initiative focused on collecting and donating stationery items that directly support children’s learning needs. The drive reflects the club’s commitment to education support, community outreach, and compassionate service. Students are scheduled to visit Sai Kripa NGO on 18 August 2026.",
    volunteer_count: 0,
    volunteer_hours: 0,
    people_impacted: 0,
    approval_status: "published",
    published: true,
    created_at: new Date().toISOString()
  },
  {
    id: "p-international-environmental-collaboration",
    title: "International Environmental Collaboration",
    slug: "international-environmental-collaboration",
    category: "Global Awareness",
    status: "Ongoing",
    date: "",
    location: "Jagran Public School, Noida",
    cover_image_url: outreachImage,
    short_description: "A student-led outreach initiative promoting environmental awareness, sustainability, and global citizenship.",
    full_report: "This collaboration reflects a student-led environmental outreach initiative focused on sustainability, awareness, and global citizenship. It encourages responsible action through education, visual campaigns, and active student participation while promoting teamwork, leadership, and a commitment to positive change.",
    volunteer_count: 0,
    volunteer_hours: 0,
    people_impacted: 0,
    approval_status: "published",
    published: true,
    created_at: new Date().toISOString()
  },
  {
    id: "p-project-drop-plastic-bin",
    title: "Project D.R.O.P. Plastic Bin",
    slug: "project-drop-plastic-bin",
    category: "Plastic Waste Management",
    status: "Completed",
    date: "",
    location: "Jagran Public School, Noida",
    cover_image_url: projectBinImage,
    short_description: "Launch of Project D.R.O.P., a plastic waste collection initiative supported by IPCA and Kia India CSR.",
    full_report: "Project D.R.O.P. stands for Develop Responsible Outlook for Plastic. It serves as a dedicated collection point for school plastic waste and promotes segregation, collection, recycling, and responsible reuse. The initiative reinforces the importance of sustainability and visible daily action toward circularity.",
    volunteer_count: 0,
    volunteer_hours: 0,
    people_impacted: 0,
    approval_status: "published",
    published: true,
    created_at: new Date().toISOString()
  },
  {
    id: "p-website-launch",
    title: "Interact Club Website Launch",
    slug: "website-launch",
    category: "Digital Leadership",
    status: "Completed",
    date: "",
    location: "Jagran Public School, Noida",
    short_description: "Launch of the Interact Club website to document projects, activities, gallery updates, and community engagement.",
    full_report: "The Interact Club website was built and presented by Atharv, Class XI A, as a student-led digital initiative to document club projects, share updates, display event galleries, and maintain a professional online identity for the club community.",
    volunteer_count: 0,
    volunteer_hours: 0,
    people_impacted: 0,
    approval_status: "published",
    published: true,
    created_at: new Date().toISOString()
  },
  {
    id: "p-umbrella-donation-drive",
    title: "Umbrella Donation Drive",
    slug: "umbrella-donation-drive",
    category: "Community Care",
    status: "Completed",
    date: "",
    location: "Jagran Public School, Noida",
    cover_image_url: umbrellaDriveImage,
    short_description: "A practical community service initiative to support underprivileged individuals during harsh weather conditions.",
    full_report: "The Umbrella Donation Drive reflects Interact’s commitment to dignity, care, and practical service. It is designed to help underprivileged community members facing sun and rain while also encouraging empathy-driven student service.",
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
    title: "DILA – District Interact Leadership Assembly",
    date: "19 August 2026",
    time: "",
    venue: "Amity University",
    category: "Leadership / Interact / Student Development",
    cover_image_url: dilaImage,
    status: "Completed",
    description: "An inspiring day at DILA, Amity University, filled with insightful speeches, impactful performances, and valuable lessons on environmental awareness and leadership.",
    full_description: "The Interact Club of Jagran Public School, Noida participated in DILA – District Interact Leadership Assembly at Amity University. The event was an inspiring day filled with insightful speeches, impactful performances, and valuable lessons on leadership, service, and environmental awareness. It offered students a meaningful opportunity to learn, connect, and grow as young leaders under the Rotary Year 2026–27 theme, “Create Lasting Impact.”",
    created_at: new Date().toISOString()
  }
];

export const sampleAnnouncements: Announcement[] = [
  {
    id: "ann-1",
    title: "Welcome to the Digital Hub of Interact Club of Jagran Public School, Noida",
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
    image_count: 3,
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
  },
  {
    id: "album-dila",
    title: "DILA – District Interact Leadership Assembly",
    description: "An inspiring day of leadership, service, environmental awareness, and student development at Amity University.",
    cover_image_url: dilaImage,
    is_public: true,
    image_count: 1,
    created_at: "2026-08-19T10:00:00Z"
  },
  {
    id: "album-project-drop",
    title: "Project D.R.O.P.",
    description: "Plastic waste collection and responsible recycling through Project D.R.O.P.",
    cover_image_url: projectBinImage,
    is_public: true,
    image_count: 2,
    created_at: "2026-08-20T10:00:00Z"
  },
  {
    id: "album-environmental-collaboration",
    title: "International Environmental Collaboration",
    description: "Student-led environmental outreach promoting sustainability and global citizenship.",
    cover_image_url: outreachImage,
    is_public: true,
    image_count: 1,
    created_at: "2026-08-21T10:00:00Z"
  },
  {
    id: "album-donation-drives",
    title: "Stationery / Umbrella Donation Drives",
    description: "Community support and practical care through student-led donation drives.",
    cover_image_url: donationDriveImage,
    is_public: true,
    image_count: 2,
    created_at: "2026-08-22T10:00:00Z"
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
  },
  {
    id: "img-verdant-saplings",
    album_id: "album-1",
    image_url: saplingsImage,
    caption: "Plantation activity under the 50 Saplings environmental initiative.",
    is_public: true
  },
  {
    id: "img-dila",
    album_id: "album-dila",
    image_url: dilaImage,
    caption: "Interact Club students at DILA, Amity University.",
    is_public: true
  },
  {
    id: "img-project-drop-1",
    album_id: "album-project-drop",
    image_url: projectBinImage,
    caption: "Project D.R.O.P. plastic waste collection initiative.",
    is_public: true
  },
  {
    id: "img-project-drop-2",
    album_id: "album-project-drop",
    image_url: projectBinDetailImage,
    caption: "Responsible plastic collection through Project D.R.O.P.",
    is_public: true
  },
  {
    id: "img-environmental-collaboration",
    album_id: "album-environmental-collaboration",
    image_url: outreachImage,
    caption: "International environmental collaboration and student outreach.",
    is_public: true
  },
  {
    id: "img-donation-drive",
    album_id: "album-donation-drives",
    image_url: donationDriveImage,
    caption: "Student-led stationery donation drive.",
    is_public: true
  },
  {
    id: "img-umbrella-drive",
    album_id: "album-donation-drives",
    image_url: umbrellaDriveImage,
    caption: "Umbrella Donation Drive supporting community care.",
    is_public: true
  }
];

export const sampleVolunteerSubmissions: VolunteerSubmission[] = [];
