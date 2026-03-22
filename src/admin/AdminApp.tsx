import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import HeroSlidesPage from './pages/HeroSlidesPage';
import ArtistPage from './pages/ArtistPage';
import PortfolioPage from './pages/PortfolioPage';
import FaqsPage from './pages/FaqsPage';
import ContactPage from './pages/ContactPage';

export default function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route
        path="*"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Routes>
                <Route index element={<DashboardPage />} />
                <Route path="hero" element={<HeroSlidesPage />} />
                <Route path="artist" element={<ArtistPage />} />
                <Route path="portfolio" element={<PortfolioPage />} />
                <Route path="faqs" element={<FaqsPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="*" element={<Navigate to="/admin" replace />} />
              </Routes>
            </AdminLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
