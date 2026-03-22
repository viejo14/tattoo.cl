import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Instagram, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import type { ContactSettings } from "../lib/supabaseClient";

export default function Contact() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<ContactSettings | null>(null);

  useEffect(() => {
    supabase.from("contact_settings").select("*").limit(1).single()
      .then(({ data }) => { if (data) setSettings(data); });
  }, []);

  const address = settings?.address ?? "Santiago, Chile";
  const instagram = settings?.instagram ?? "@rowanblack_tattoo";
  const email = settings?.email ?? "hello@tattoostudio.cl";

  return (
    <section id="booking" className="py-32 px-6 md:px-12 max-w-7xl mx-auto relative z-10">
      <div className="flex flex-col lg:flex-row gap-24 lg:gap-32">
        {/* Left: Contact Info */}
        <div className="w-full lg:w-2/5 flex flex-col gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-tight tracking-tight">
              {t('contact.title_part1')}<br/>
              <span className="italic opacity-80">{t('contact.title_part2')}</span>
            </h2>
            <p className="text-muted text-sm leading-relaxed max-w-sm">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="p-8 bg-surface border border-white/5 rounded-2xl flex items-center gap-6 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="p-4 bg-background rounded-full group-hover:bg-primary group-hover:text-background transition-colors duration-500">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted mb-1">{t('contact.cards.location')}</p>
                <p className="text-white text-lg font-medium">{address}</p>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.3 }}
               className="p-8 bg-surface border border-white/5 rounded-2xl flex items-center gap-6 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="p-4 bg-background rounded-full group-hover:bg-primary group-hover:text-background transition-colors duration-500">
                <Instagram className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted mb-1">{t('contact.cards.portfolio')}</p>
                <p className="text-white text-lg font-medium">{instagram}</p>
              </div>
            </motion.div>

            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.4 }}
               className="p-8 bg-surface border border-white/5 rounded-2xl flex items-center gap-6 hover:border-primary/30 transition-all cursor-pointer group"
            >
              <div className="p-4 bg-background rounded-full group-hover:bg-primary group-hover:text-background transition-colors duration-500">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted mb-1">{t('contact.cards.direct')}</p>
                <p className="text-white text-lg font-medium">{email}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right: Contact Form */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="w-full lg:w-3/5 bg-surface border border-white/5 p-8 md:p-12 rounded-[2rem] shadow-2xl"
        >
          <form className="flex flex-col gap-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-muted ml-2">{t('contact.form.name')}</label>
                <input 
                  type="text" 
                  placeholder={t('contact.form.name_placeholder')}
                  className="bg-background border border-white/5 rounded-full px-8 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[10px] uppercase tracking-[0.3em] text-muted ml-2">{t('contact.form.email')}</label>
                <input 
                  type="email" 
                  placeholder={t('contact.form.email_placeholder')}
                  className="bg-background border border-white/5 rounded-full px-8 py-4 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30"
                />
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <label className="text-[10px] uppercase tracking-[0.3em] text-muted ml-2">{t('contact.form.message')}</label>
              <textarea 
                rows={4}
                placeholder={t('contact.form.message_placeholder')}
                className="bg-background border border-white/5 rounded-[2rem] px-8 py-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-muted/30 resize-none"
              />
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full py-5 rounded-full bg-white text-black font-bold uppercase text-xs tracking-[0.2em] shadow-[0_10px_30px_rgba(255,255,255,0.1)] hover:shadow-white/20 transition-all border border-transparent"
            >
              {t('contact.form.submit')}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
