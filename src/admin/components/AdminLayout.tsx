import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { usePreview } from '../../context/PreviewContext';
import {
  LayoutDashboard,
  Image,
  User,
  Grid3X3,
  HelpCircle,
  Phone,
  LogOut,
  Scissors,
  Menu,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/hero', label: 'Hero Slides', icon: Image },
  { to: '/admin/artist', label: 'Artista', icon: User },
  { to: '/admin/portfolio', label: 'Portafolio', icon: Grid3X3 },
  { to: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { to: '/admin/contact', label: 'Contacto', icon: Phone },
];

interface Props {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const { isPreviewMode, setPreviewMode, clearPreview } = usePreview();

  const handleLogout = async () => {
    if (isPreviewMode) {
      clearPreview();
      setPreviewMode(false);
    } else {
      await supabase.auth.signOut();
    }
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      {/* Banner de Modo Demo */}
      {isPreviewMode && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 py-2 px-6 flex items-center justify-between z-[60]">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-amber-500 text-[10px] uppercase tracking-[0.2em] font-bold">Modo Demo / Sandbox</span>
            <span className="text-amber-500/60 text-[10px] hidden md:inline ml-2">— Los cambios son temporales y solo visibles para ti</span>
          </div>
          <button 
            onClick={handleLogout}
            className="text-amber-500 hover:text-amber-400 text-[10px] uppercase tracking-widest font-bold transition-colors"
          >
            Salir del Modo Demo
          </button>
        </div>
      )}

      <div className="flex flex-1">
        {/* Sidebar — desktop */}
        <aside className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#111] border-r border-white/5 flex flex-col transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:flex
        `}>
          {/* Brand */}
          <div className="flex items-center gap-3 px-6 py-6 border-b border-white/5">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Scissors className="w-4 h-4 text-white/60" />
            </div>
            <div>
              <p className="text-white text-sm font-medium tracking-wider">Tattoo Studio</p>
              <p className="text-white/30 text-xs">Panel Admin</p>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-white/30 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navItems.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                    isActive
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-3 border-t border-white/5">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all text-left"
            >
              <LogOut className="w-4 h-4" />
              {isPreviewMode ? 'Salir Modo Demo' : 'Cerrar sesión'}
            </button>
          </div>
        </aside>

        {/* Overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile topbar */}
          <header className="lg:hidden flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-[#111]">
            <button onClick={() => setSidebarOpen(true)} className="text-white/40 hover:text-white">
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-white text-sm font-medium tracking-wider">Tattoo Studio Admin</span>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
