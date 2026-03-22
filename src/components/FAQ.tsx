import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../lib/supabaseClient";
import { usePreview } from "../context/PreviewContext";
import type { FaqItem } from "../lib/supabaseClient";

export default function FAQ() {
  const { t, language } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [faqs, setFaqs] = useState<FaqItem[]>([]);
  const { isPreviewMode, previewData } = usePreview();

  useEffect(() => {
    supabase.from("faqs").select("*").eq("active", true).order("order")
      .then(({ data }) => { setFaqs(data ?? []); });
  }, []);

  // Pick bilingual content based on active language.
  const sourceFaqs = isPreviewMode && previewData.faqs.length > 0
    ? previewData.faqs.filter(f => f.active)
    : faqs;

  const displayFaqs = sourceFaqs.length > 0
    ? sourceFaqs.map(f => ({
        question: language === 'es' ? f.question_es : f.question_en,
        answer: language === 'es' ? f.answer_es : f.answer_en,
      }))
    : t('faq.questions');

  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto z-10 relative">
      <div className="flex flex-col md:flex-row gap-16 lg:gap-32">
        {/* Left: Title */}
        <div className="w-full md:w-1/3">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-white leading-tight tracking-tight sticky top-40"
          >
            {t('faq.title_part1')}<br/>
            {t('faq.title_part2')}
          </motion.h2>
        </div>

        {/* Right: Accordion */}
        <div className="w-full md:w-2/3 flex flex-col gap-6">
          {displayFaqs.map((faq: any, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="border-b border-white/10 pb-6"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex justify-between items-center text-left py-4 group"
                >
                  <span className={`text-lg md:text-xl font-serif tracking-wide transition-colors duration-300 ${isOpen ? 'text-white' : 'text-muted group-hover:text-primary'}`}>
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full border transition-all duration-300 ${isOpen ? 'bg-primary border-primary text-background rotate-180 shadow-[0_0_15px_rgba(255,255,255,0.3)]' : 'border-white/20 text-muted group-hover:border-primary group-hover:text-primary'}`}>
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                      className="overflow-hidden"
                    >
                      <p className="text-muted text-sm leading-relaxed max-w-2xl py-2">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
