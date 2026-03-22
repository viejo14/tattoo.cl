import { Image, User, Grid3X3, HelpCircle, Phone, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const sections = [
  { to: '/admin/hero', label: 'Hero Slides', desc: 'Carrusel de imágenes de la portada', icon: Image, color: 'from-violet-500/20 to-violet-500/5' },
  { to: '/admin/artist', label: 'Artista', desc: 'Foto de perfil y polaroid del estudio', icon: User, color: 'from-sky-500/20 to-sky-500/5' },
  { to: '/admin/portfolio', label: 'Portafolio', desc: 'Diseños "On the Board"', icon: Grid3X3, color: 'from-amber-500/20 to-amber-500/5' },
  { to: '/admin/faqs', label: 'FAQs', desc: 'Preguntas frecuentes (ES/EN)', icon: HelpCircle, color: 'from-emerald-500/20 to-emerald-500/5' },
  { to: '/admin/contact', label: 'Contacto', desc: 'Redes sociales y datos de contacto', icon: Phone, color: 'from-rose-500/20 to-rose-500/5' },
];

export default function DashboardPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-serif text-white tracking-wide mb-1">Dashboard</h1>
        <p className="text-white/30 text-sm">Gestiona el contenido del sitio web</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sections.map(({ to, label, desc, icon: Icon, color }) => (
          <Link
            key={to}
            to={to}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all p-6"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity`} />
            <div className="relative flex items-start gap-4">
              <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex-shrink-0">
                <Icon className="w-5 h-5 text-white/60" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-medium text-sm tracking-wide">{label}</h2>
                <p className="text-white/30 text-xs mt-1 leading-relaxed">{desc}</p>
              </div>
              <ExternalLink className="w-4 h-4 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0 mt-1" />
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <p className="text-white/20 text-xs text-center">
          🌐 <a href="/" target="_blank" rel="noreferrer" className="hover:text-white/50 transition-colors underline underline-offset-2">Ver sitio público →</a>
        </p>
      </div>
    </div>
  );
}
