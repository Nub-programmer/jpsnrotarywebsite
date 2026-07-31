import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SupabaseConfigModal } from './components/ui/SupabaseConfigModal';

// Public Pages
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Members } from './pages/Members';
import { Projects } from './pages/Projects';
import { ProjectDetail } from './pages/ProjectDetail';
import { Events } from './pages/Events';
import { Gallery } from './pages/Gallery';
import { Volunteer } from './pages/Volunteer';
import { Contact } from './pages/Contact';

// Admin Pages
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminEvents } from './pages/admin/AdminEvents';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminMembers } from './pages/admin/AdminMembers';
import { AdminVolunteers } from './pages/admin/AdminVolunteers';
import { AdminAnnouncements } from './pages/admin/AdminAnnouncements';
import { AdminSettings } from './pages/admin/AdminSettings';

// Public Layout Wrapper with sticky Navbar and Footer
const PublicLayout: React.FC<{ onOpenConfig: () => void }> = ({ onOpenConfig }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      <Navbar onOpenConfig={onOpenConfig} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default function App() {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);

  return (
    <BrowserRouter>
      <SupabaseConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />

      <Routes>
        {/* Public Website Routes */}
        <Route element={<PublicLayout onOpenConfig={() => setIsConfigModalOpen(true)} />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/members" element={<Members />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/events" element={<Events />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/volunteer" element={<Volunteer />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Dashboard Protected Routes */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/projects" element={<AdminProjects />} />
          <Route path="/admin/events" element={<AdminEvents />} />
          <Route path="/admin/gallery" element={<AdminGallery />} />
          <Route path="/admin/members" element={<AdminMembers />} />
          <Route path="/admin/volunteers" element={<AdminVolunteers />} />
          <Route path="/admin/announcements" element={<AdminAnnouncements />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* Fallback wildcard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
