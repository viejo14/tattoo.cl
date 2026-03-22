import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { HeroSlide } from "../lib/supabaseClient";

// Fallback images shown while slides are loading from Supabase
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1590246814883-578aeef044f5?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=400&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621008210350-02aeb7d94cf1?q=80&w=400&auto=format&fit=crop",
];

import { usePreview } from "../context/PreviewContext";

export default function Hero() {
  const { t } = useLanguage();
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const { isPreviewMode, previewData } = usePreview();

  useEffect(() => {
    supabase
      .from("hero_slides")
      .select("*")
      .eq("active", true)
      .order("order")
      .then(({ data }) => {
        setSlides(data ?? []);
      });
  }, []);

  // Use Preview data if in Sandbox mode and not empty, 
  // otherwise fallback to Supabase data, then to static FALLBACKS.
  const displaySlides = isPreviewMode && previewData.hero_slides.length > 0
    ? previewData.hero_slides.filter(s => s.active)
    : slides.length > 0 ? slides : [];

  const images = displaySlides.length > 0
    ? displaySlides.slice(0, 5).map((s) => s.image_url)
    : FALLBACK_IMAGES;

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 overflow-hidden z-10">
      {/* Background radial gradient simulating smoke/spotlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-white/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center max-w-5xl mx-auto mt-12"
      >
        <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-serif text-white mb-6 leading-[0.95] tracking-tight">
          {t('hero.title_part1')}<br/>
          <span className="italic text-white/80">{t('hero.title_italic')}</span>
        </h1>
        
        <div className="flex items-center justify-center gap-3 text-muted text-xs md:text-sm tracking-[0.2em] uppercase my-12">
          <Sparkles className="w-4 h-4" />
          <p>{t('hero.subtitle')}</p>
        </div>
      </motion.div>

      {/* Gallery Carousel (Overlapping style from design) */}
      <div className="w-full max-w-6xl mx-auto relative h-[250px] md:h-[400px] flex justify-center items-center my-4">
        {images.map((src, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 50, scale: 0.9, rotate: (idx - 2) * 5 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: (idx - 2) * 4 }}
            transition={{ duration: 0.8, delay: 0.4 + idx * 0.1, type: "spring", stiffness: 100 }}
            className="absolute rounded-2xl overflow-hidden shadow-2xl border-4 border-white/5 bg-surface cursor-pointer"
            style={{
              width: "20%",
              aspectRatio: "3/4",
              left: `${10 + idx * 15}%`,
              zIndex: 10 - Math.abs(2 - idx),
            }}
            whileHover={{ 
              scale: 1.05, 
              zIndex: 20,
              rotate: 0,
              transition: { duration: 0.3 }
            }}
          >
            <img src={src} alt="Tattoo sample" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-black/40 hover:bg-transparent transition-colors duration-500 pointer-events-none" />
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="flex flex-col sm:flex-row gap-6 mt-16"
      >
        <button className="px-8 py-3 rounded-full bg-white text-black font-medium text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors">
          {t('hero.btn_work')}
        </button>
        <button className="px-8 py-3 rounded-full border border-white/30 text-white font-medium text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
          {t('hero.btn_book')}
        </button>
      </motion.div>
    </section>
  );
}
