import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { ArtistInfo } from "../lib/supabaseClient";

const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1542400977-fd08dc75d9e5?q=80&w=600&auto=format&fit=crop";
const FALLBACK_POLAROID = "https://images.unsplash.com/photo-1590246814392-cb8a9d16a8b1?q=80&w=400&auto=format&fit=crop";

export default function MeetArtist() {
  const { t } = useLanguage();
  const [artist, setArtist] = useState<ArtistInfo | null>(null);
  
  const features = t('artist.features');

  useEffect(() => {
    supabase.from("artist_info").select("*").limit(1).single()
      .then(({ data }) => { if (data) setArtist(data); });
  }, []);

  const photoUrl = artist?.photo_url ?? FALLBACK_PHOTO;
  const polaroidUrl = artist?.polaroid_url ?? FALLBACK_POLAROID;

  return (
    <section id="artist" className="py-32 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row gap-20 lg:gap-32 items-center z-20 relative">
      {/* Artist Image with overlapping text */}
      <div className="relative w-full lg:w-1/2 flex justify-center mt-12 lg:mt-0">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="relative w-full max-w-[320px] aspect-[3/4] rounded-2xl overflow-hidden border border-white/5"
        >
          <img 
            src={photoUrl}
            alt="Tattoo Artist" 
            className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-100" />
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="absolute -top-12 md:-top-16 -right-4 md:-right-12 text-6xl md:text-8xl font-serif text-white z-10 text-right leading-[0.85] tracking-tight"
        >
          <span className="block italic text-muted text-4xl md:text-5xl mb-2 font-normal">{t('artist.meet')}</span>
          {t('artist.the_artist')}
        </motion.h2>

        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="absolute -bottom-8 md:-bottom-12 -left-4 md:-left-8 text-[5rem] md:text-[8rem] font-serif font-medium text-white/90 z-10 tracking-tighter mix-blend-difference"
        >
          {artist?.name?.split(' ')[0] ?? 'Rowan'}
        </motion.h3>
      </div>

      {/* Info List */}
      <div className="w-full lg:w-1/2 flex flex-col gap-10 mt-16 md:mt-8">
        {features.map((feature: any, idx: number) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.2 + idx * 0.1 }}
            className="flex gap-6 items-start"
          >
            <div className="mt-1 flex-shrink-0">
              <Star className="w-5 h-5 text-muted fill-muted/30" />
            </div>
            <div>
              <h4 className="text-base font-medium text-primary mb-2 leading-relaxed tracking-wide">{feature.title}</h4>
              <p className="text-sm text-muted leading-relaxed max-w-sm">{feature.desc}</p>
            </div>
          </motion.div>
        ))}

        {/* Small floating polaroid */}
        <motion.div
           initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
           whileInView={{ opacity: 1, scale: 1, rotate: -3 }}
           whileHover={{ scale: 1.05, rotate: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, delay: 0.8 }}
           className="mt-4 self-end mr-4 lg:-mr-12 w-56 md:w-64 aspect-video rounded-xl overflow-hidden border-4 border-white/5 shadow-2xl relative cursor-pointer"
        >
          <img 
            src={polaroidUrl}
            alt="Tattoo studio session" 
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
          />
        </motion.div>
      </div>
    </section>
  );
}

