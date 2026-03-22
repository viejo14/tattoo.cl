import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { PortfolioItem } from "../lib/supabaseClient";

const FALLBACK_ITEMS = [
  { image_url: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?q=80&w=400", title: "Skull", status: "sold" as const, rotate: -4, x: -10, y: 0 },
  { image_url: "https://images.unsplash.com/photo-1621008210350-02aeb7d94cf1?q=80&w=400", title: "Snake", status: "" as const, rotate: 3, x: 20, y: 40 },
  { image_url: "https://images.unsplash.com/photo-1568515045052-f9a854d70bfd?q=80&w=400", title: "Rose", status: "available" as const, rotate: -2, x: 0, y: 20 },
  { image_url: "https://images.unsplash.com/photo-1590246814883-578aeef044f5?q=80&w=400", title: "Geometric", status: "" as const, rotate: 5, x: -20, y: 30 },
  { image_url: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?q=80&w=400", title: "Raven", status: "reserved" as const, rotate: -3, x: -10, y: 60 },
  { image_url: "https://images.unsplash.com/photo-1542400977-fd08dc75d9e5?q=80&w=400", title: "Abstract", status: "new" as const, rotate: 2, x: 10, y: 10 },
];

const ROTATIONS = [-4, 3, -2, 5, -3, 2, -1, 4, -5, 3];
const OFFSETS_X = [-10, 20, 0, -20, -10, 10, 5, -5, 15, -15];
const OFFSETS_Y = [0, 40, 20, 30, 60, 10, 50, 25, 45, 35];

export default function OnTheBoard() {
  const { t } = useLanguage();
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("portfolio_items")
      .select("*")
      .eq("active", true)
      .order("order")
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  // Use live data if available, else fallback
  const displayItems = !loading && items.length > 0
    ? items.map((item, idx) => ({
        ...item,
        rotate: ROTATIONS[idx % ROTATIONS.length],
        x: OFFSETS_X[idx % OFFSETS_X.length],
        y: OFFSETS_Y[idx % OFFSETS_Y.length],
        noteKey: item.status,
      }))
    : FALLBACK_ITEMS.map(item => ({ ...item, id: item.title, noteKey: item.status, active: true, order: 0, created_at: '' }));

  return (
    <section id="gallery" className="py-24 px-6 max-w-7xl mx-auto relative">
      <div className="text-center mb-24 md:mb-32">
        <h2 className="text-5xl md:text-7xl lg:text-[6rem] font-serif text-white tracking-custom leading-[0.9]">
          {t('gallery.title')}<br/>
          <span className="italic text-white/90">{t('gallery.board')}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-x-12 md:gap-y-24 pt-4 pb-20 px-4 md:px-12">
        {displayItems.map((item, idx) => (
          <motion.div
            key={item.id ?? idx}
            initial={{ opacity: 0, y: 50, rotate: item.rotate - 10 }}
            whileInView={{ opacity: 1, y: 0, rotate: item.rotate }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.8, delay: idx * 0.1, type: "spring", stiffness: 80 }}
            className="flex justify-center"
          >
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 30 }}
              className="relative p-3 pb-12 bg-[#ecece9] rounded-sm shadow-2xl transition-all duration-300 cursor-pointer"
              style={{ transform: `translate(${item.x}px, ${item.y}px)` }}
            >
              {/* Tape */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-8 bg-white/50 backdrop-blur-sm opacity-70 rotate-3 z-20 border border-white/20 shadow-sm" />
              
              <div className="w-56 h-64 overflow-hidden border border-black/10 bg-black">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700" />
              </div>
              
              <div className="absolute bottom-4 left-4 md:left-5 text-black/80">
                <p className="font-serif text-lg leading-none">{item.title}</p>
                <div className="w-8 h-px bg-black/20 mt-2" />
              </div>
              
              {/* Sticky Note */}
              {item.noteKey && (
                <div className="absolute -bottom-6 -right-5 bg-[#fef08a] text-yellow-900 px-4 py-2 font-handwriting text-sm shadow-md rotate-[12deg] border border-yellow-300/50 z-20">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-3 bg-white/30 -mt-1 rotate-1" />
                  {t(`gallery.notes.${item.noteKey}`)}
                </div>
              )}
            </motion.div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
