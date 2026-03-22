import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";
import { Instagram, Mail, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { usePreview } from "../context/PreviewContext";
import type { ContactSettings } from "../lib/supabaseClient";

export default function Contact() {
  const { t } = useLanguage();
  const [settings, setSettings] = useState<ContactSettings | null>(null);
  const { isPreviewMode, previewData } = usePreview();

  useEffect(() => {
    supabase.from("contact_settings").select("*").limit(1).single()
      .then(({ data }) => { if (data) setSettings(data); });
  }, []);

  const displaySettings = isPreviewMode && previewData.contact_settings 
    ? previewData.contact_settings 
    : settings;

  const instagram = displaySettings?.instagram || "@tattoo.cl";
  const email = displaySettings?.email || "hola@tattoo.cl";
  const address = displaySettings?.address || "Av. Providencia 1234, Santiago";

  const contactItems = [
    { icon: Instagram, label: "Instagram", value: instagram, href: `https://instagram.com/${instagram.replace('@', '')}` },
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    { icon: MapPin, label: "Studio", value: address, href: "#" },
  ];

  return (
    <section id="contact" className="py-24 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-start gap-16 lg:gap-32">
        <div className="max-w-md">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-serif text-white mb-8"
          >
            {t('contact.title')}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted text-lg leading-relaxed mb-12"
          >
            {t('contact.subtitle')}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="grid gap-12 w-full md:w-auto"
        >
          {contactItems.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-2">
              <span className="text-white/30 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <item.icon className="w-3 h-3" />
                {item.label}
              </span>
              <a 
                href={item.href}
                className="text-xl md:text-2xl font-serif text-white hover:text-primary transition-colors duration-300"
              >
                {item.value}
              </a>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
