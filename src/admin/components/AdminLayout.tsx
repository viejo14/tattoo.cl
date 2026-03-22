import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
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
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/40 hover:text-white/70 hover:bg-white/5 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
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
  );
}
