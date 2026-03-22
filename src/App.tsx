import { Instagram, MapPin, Mail, Globe } from "lucide-react";
import Hero from "./components/Hero";
import MeetArtist from "./components/MeetArtist";
import OnTheBoard from "./components/OnTheBoard";
import Timeline from "./components/Timeline";
import FAQ from "./components/FAQ";
import Contact from "./components/Contact";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";

function MainLayout() {
  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      {/* Navigation Header */}
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <a href="#" className="text-xl md:text-2xl font-serif font-bold tracking-widest uppercase">
          Tattoo Studio
        </a>
        <nav className="flex items-center gap-6 text-sm uppercase tracking-widest text-muted">
          <a href="#artist" className="hover:text-primary transition-colors">{t('nav.artist')}</a>
          <a href="#gallery" className="hover:text-primary transition-colors">{t('nav.portfolio')}</a>
          <a href="#booking" className="hover:text-primary transition-colors">{t('nav.booking')}</a>
          
          {/* Language Toggle */}
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 hover:bg-white/5 transition-all text-[10px] font-bold text-white/60 hover:text-white"
          >
            <Globe className="w-3 h-3" />
            <span>{language.toUpperCase()}</span>
          </button>
        </nav>
        <button className="px-6 py-2 rounded-full border border-border hover:bg-primary hover:text-background transition-all uppercase text-xs tracking-widest">
          {t('nav.button')}
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Hero />
        <MeetArtist />
        <OnTheBoard />
        <Timeline />
        <FAQ />
        <Contact />
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-20">
        <div className="container mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-serif mb-2">Tattoo Studio</h2>
            <p className="text-muted text-sm max-w-md">
              {t('footer.desc')}
            </p>
          </div>
          <div className="flex gap-4">
            <a href="#" className="p-3 bg-surface rounded-full hover:bg-border transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" className="p-3 bg-surface rounded-full hover:bg-border transition-colors">
              <Mail className="w-5 h-5" />
            </a>
            <a href="#" className="p-3 bg-surface rounded-full hover:bg-border transition-colors">
              <MapPin className="w-5 h-5" />
            </a>
          </div>
        </div>
        
        <div className="py-6 border-t border-border flex justify-between px-6 text-xs text-muted uppercase tracking-wider">
          <p>{t('footer.rights')}</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary">{t('footer.privacy')}</a>
            <a href="#" className="hover:text-primary">{t('footer.terms')}</a>
          </div>
        </div>
        
        {/* Massive Footer Text like in the design */}
        <div className="overflow-hidden w-full flex justify-center py-8">
          <h1 className="text-[10vw] font-serif leading-none tracking-tighter opacity-10 uppercase whitespace-nowrap">
            ROWAN BLACK
          </h1>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <MainLayout />
    </LanguageProvider>
  );
}

export default App;
